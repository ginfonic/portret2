let express = require('express');
const db = require('../../db');
const uuid = require('uuid');
let router = express.Router();
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {matchErrorFlagTag} = require('../../middleware/logTags');
const {save_match, mass_matching} = require('./help/sap');
const {checkUser} = require('../../middleware');
const {lastDate} = require('../initial/help');

const sap_item = async (select_structure, id) => {
    let item = await db.query(`
    SELECT sap.*,
        CASE
            when parent_bank.name is not null then '/deptree/' || parent_bank.name || '/' || sap.bank || '/' || sap.id
            else '/deptree/' || sap.bank || '/' || sap.id
        END as link
    from sap.deps as sap
    left join dictionaries.deps as parent_bank on parent_bank.id = (
        select parent from dictionaries.deps where name = sap.bank
    )
    WHERE sap.id = '${id}'`);

    item = item.rows[0];

    let best_match_data = await db.query(`SELECT best.etalon_id, etalon.name 
    FROM match.best_matches as best 
    JOIN etalon.deps as etalon
    ON etalon.id = best.etalon_id
    WHERE best.sap_id = '${id}' AND best.match_rate > 60 AND etalon.show = true`);
    let best_match = best_match_data.rows;

    if (best_match.length > 0) item.best_match = best_match;
    else item.best_only_match = null;

    if (Boolean(item.parent)) {
        let parent = await db.query(`SELECT depname, id FROM sap.deps WHERE id = '${item.parent}'`);
        item.parent = parent.rows[0]
    }
    else item.parent = null;

    if (Boolean(item.connectedto)) {
        let connectedto = await db.query(`SELECT name, id, funcblock FROM etalon.deps WHERE id = '${item.connectedto}'`);
        item.connectedto = connectedto.rows[0];
    }

    let units_data = await db.query(`select unit.unit_name, count(errors.error_id) as errors_count from sap.a_units as unit
    left outer join sap.unit_errors_connections as errors on unit.id = errors.unit_id
    where dep_id = '${item.id}' 
    group by unit.unit_name`);
    item.units = units_data.rows;

    let item_errors_data = await db.query(`select * from sap.errors 
    where id in (select error_id as id from sap.errors_connections where sap_id = '${item.id}')`);
    let item_errors = item_errors_data.rows;

    return {item, item_errors}
};
//
router.post('/sap_funcblocks', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    let funcblocks = await db.query(`SELECT distinct funcblock FROM sap.deps 
    where ${select_structure === 'tb' ? `type = 'tb'` : `(type = 'gosb' or type = 'head')`}
    and date = '${date}'
    ORDER BY funcblock`);

    funcblocks = funcblocks.rows;

    const funcblock_array = funcblocks.map((item) => item.funcblock);

    res.status(200).json({funcblocks: funcblock_array});
});
//
router.post('/sap_lvls', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    let lvls = await db.query(`SELECT distinct lvl FROM sap.deps 
    where ${select_structure === 'tb' ? `type = 'tb'` : `(type = 'gosb' or type = 'head')`}
    and date = '${date}'
    ORDER BY lvl`);

    lvls = lvls.rows;

    const lvls_array = lvls.map((item) => item.lvl);

    res.status(200).json({lvls: lvls_array});
});
//
router.post('/sap_banks', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    let banks = await db.query(`SELECT distinct bank FROM sap.deps 
    where ${select_structure === 'tb' ? `type = 'tb'` : `(type = 'gosb' or type = 'head')`}
    and date = '${date}'
    ORDER BY bank`);

    const banks_array = banks.rows.map((item) => item.bank);

    res.status(200).json({banks: banks_array});
});
//
router.post('/sap_data', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    const funcblockFilter = req.body.funcblockFilter;
    const searchFilter = req.body.searchFilter;
    const lvlFilter = req.body.lvlFilter;
    const bankFilter = req.body.bankFilter;
    const connected = req.body.connected;
    const flags = req.body.flags;
    const mass = req.body.mass;

    let connectedto = [];
    if (mass) {
        connected.map(con => connectedto.push(...con.deps.map(dep => dep.connectedto)));
    }
    else {
        let connectedto_data = await db.query(`select connectedto from sap.deps where id = ANY($1)`,
            [connected.map(con => con.id)]);
        connectedto = connectedto_data.rows.map(item => item.connectedto);
    }

    if (connectedto.length === 0) {
        connectedto.push(uuid.NIL);
    }

    let sap_filtered = await db.query(`SELECT s.depname, s.funcblock, s.id, s.lvl, s.connectedto, s.return_later, s.bank, COUNT(e.error_id) as error_flag
    FROM sap.deps as s 
    left join sap.errors_connections as e
    on s.id = e.sap_id
    inner join sap.r_units on sap.r_units.outstate = false and sap.r_units.dep_id = s.id
    where ${select_structure === 'tb' ? `s.type = 'tb'` : `(s.type = 'gosb' or s.type = 'head')`}
    and (s.connectedto != ANY($1) or s.connectedto is null) and date = '${date}'
    group by s.id, s.depname, s.funcblock, s.lvl, s.connectedto, s.return_later, s.bank
    order by s.lvl, s.depname`, [connectedto]);

    sap_filtered = sap_filtered.rows;

    if (funcblockFilter.length > 0) {
        sap_filtered = sap_filtered.filter((item) => funcblockFilter.indexOf(item.funcblock) !== -1);
    }

    if (lvlFilter.length > 0) {
        sap_filtered = sap_filtered.filter((item) => lvlFilter.indexOf(item.lvl) !== -1);
    }

    if (bankFilter.length > 0) {
        sap_filtered = sap_filtered.filter((item) => bankFilter.indexOf(item.bank) !== -1);
    }

    if (Boolean(searchFilter)) {
        sap_filtered = sap_filtered.filter((item) => item.depname.toLowerCase().includes(searchFilter.toLowerCase()));
    }

    if (connected.length > 0) {
        sap_filtered = sap_filtered.filter((item) => mass ?
            connected.filter(ch => ch.depname === item.depname &&
                ch.lvl === item.lvl &&
                ch.funcblock === item.funcblock &&
                ch.connectedto === item.connectedto).length === 0
            :
            connected.filter((elem) => elem.id === item.id).length === 0);
    }

    if (flags) {
        if (flags.return_later) sap_filtered = sap_filtered.filter((item) => item.return_later);
        if (flags.error_flag) sap_filtered = sap_filtered.filter((item) => item.error_flag > 0);
        if (flags.not_matched) sap_filtered = sap_filtered.filter((item) => !Boolean(item.connectedto));
        if (flags.error_unit_flag) {
            let units_with_errors_data = await db.query(`select unit.dep_id, COUNT(err.error_id)
            from sap.a_units as unit left join sap.unit_errors_connections as err on err.unit_id = unit.id 
            group by unit.dep_id
            having COUNT(err.error_id) != 0`);
            let units_with_errors_sap_id = units_with_errors_data.rows.map(item => item.dep_id);

            sap_filtered = sap_filtered.filter(item => {
                return units_with_errors_sap_id.indexOf(item.id) !== -1
            })
        }

        if (flags.units_return_later) {
            let units_return_later_data = await db.query(`select unit.dep_id
            from sap.a_units as unit
            where unit.return_later = true`);
            let units_return_later = units_return_later_data.rows.map(item => item.dep_id);

            sap_filtered = sap_filtered.filter(item => units_return_later.indexOf(item.id) !== -1)
        }
    }

    if (mass) {
        sap_filtered = mass_matching(sap_filtered);
    }

    res.status(200).json({sap_list: sap_filtered});
});

router.post('/etalon_best_matches', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const connected = req.body.connected;
    const mass = req.body.mass;

    let connectedto = [];
    if (mass) {
        connected.map(con => connectedto.push(...con.deps.map(dep => dep.connectedto)));
    }
    else {
        let connectedto_data = await db.query(`select connectedto from sap.deps where id = ANY($1)`,
            [connected.map(con => con.id)]);
        connectedto = connectedto_data.rows.map(item => item.connectedto);
    }

    if (connectedto.length === 0) {
        connectedto.push(uuid.NIL);
    }

    let best_matches_list = await db.query(
        `SELECT distinct * FROM sap.deps
      INNER JOIN match.best_matches
      on match.best_matches.sap_id = sap.deps.id
      WHERE etalon_id = '${req.body.id}' and (connectedto != ANY($1) or connectedto is null)
      and date = '${date}'`, [connectedto]);

    best_matches_list = best_matches_list.rows;

    if (mass) {
        best_matches_list = mass_matching(best_matches_list);
    }

    const best_matches = {
        '70+': best_matches_list.filter((item) => mass ?
            item.deps[0].match_rate >= 70
            :
            item.match_rate >= 70),
        '55-70': best_matches_list.filter((item) => mass ?
            item.deps[0].match_rate >= 55 &&
            item.deps[0].match_rate < 70
            :
            item.match_rate >= 55 &&
            item.match_rate < 70),
        '30-55': best_matches_list.filter((item) => mass ?
            item.deps[0].match_rate >= 30 &&
            item.deps[0].match_rate < 55
            :
            item.match_rate >= 30 &&
            item.match_rate < 55),
        'worst': best_matches_list.filter((item) => mass ?
            item.deps[0].match_rate < 30
            :
            item.match_rate < 30),
    };

    res.status(200).json({best_matches});
});

router.post('/etalon_connected', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const mass = req.body.mass;

    let connected = await db.query(`SELECT * FROM sap.deps WHERE connectedto = '${req.body.id}' 
    and date = '${date}' 
    ORDER BY id`);
    connected = connected.rows;

    if (mass) {
        connected = mass_matching(connected);
    }

    res.status(200).json({connected, connected_count: connected.length});
});

router.post('/sap_item', checkUser, actionLogger, async function(req, res, next) {
    const select_structure = req.body.select_structure;
    const id = req.body.id;

    res.status(200).json(await sap_item(select_structure, id));
});
//
router.post('/sap_flag', matchErrorFlagTag, checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    const id = req.body.id;
    const flag = req.body.flag;

    let before = await db.query(`select id, ${flag} from sap.deps 
    where id = '${id}' and ${select_structure === 'tb' ? `type = 'tb'` : `(type = 'gosb' or type = 'head')`}`);
    let after = await db.query(`UPDATE sap.deps SET ${flag} = NOT ${flag} WHERE id = '${id}' returning id, ${flag}`);

    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.deps`, before.rows, after.rows, 2)
    }

    res.status(200).json(await sap_item(select_structure, id));

    save_match([id]).then(() => {})
});

router.post('/search_list_sap_menu', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    const funcblockFilter = req.body.funcblockFilter;
    const lvlFilter = req.body.lvlFilter;
    const connected = req.body.connected;
    const flags = req.body.flags;
    const mass = req.body.mass;

    let searchList_data = await db.query(`SELECT distinct depname, funcblock, lvl, return_later, connectedto,
    COUNT(e.error_id) as error_flag
    from sap.deps
    left join sap.errors_connections as e on e.sap_id = sap.deps.id
    where ${select_structure === 'tb' ? `type = 'tb'` : `(type = 'gosb' or type = 'head')`}
    and date = '${date}'
    group by depname, funcblock, lvl, connectedto, return_later
    order by depname`);

    let searchList = searchList_data.rows;

    if (funcblockFilter.length > 0) {
        searchList = searchList.filter((item) => funcblockFilter.length > 0 ? funcblockFilter.indexOf(item.funcblock) !== -1 : item);
    }

    if (lvlFilter.length > 0) {
        searchList = searchList.filter((item) => lvlFilter.length > 0 ? lvlFilter.indexOf(item.lvl) !== -1 : item);
    }

    if (connected.length > 0) {
        if (mass) {
            let con_deps = [];
            connected.map(con => con_deps.push(...con.deps));
            searchList = searchList.filter((item) => con_deps.filter((elem) => elem.id === item.id).length === 0);
        }
        else {
            searchList = searchList.filter((item) => connected.filter((elem) => elem.id === item.id).length === 0);
        }
    }

    //deleted filter by error
    if (flags) {
        if (flags.error_flag) searchList = searchList.filter((item) => item.error_flag > 0);
        if (flags.return_later) searchList = searchList.filter((item) => item.return_later);
        if (flags.not_matched) searchList = searchList.filter((item) => !Boolean(item.connectedto));
        if (flags.error_unit_flag) {
            let units_with_errors_data = await db.query(`select sap.deps.depname, COUNT(err.error_id)
            from sap.a_units as unit left join sap.unit_errors_connections as err on err.unit_id = unit.id 
            inner join sap.deps on sap.deps.id = unit.dep_id
            group by sap.deps.depname
            having COUNT(err.error_id) != 0`);
            let units_with_errors_sap_id = units_with_errors_data.rows.map(item => item.depname);

            searchList = searchList.filter(item => {
                return units_with_errors_sap_id.indexOf(item.depname) !== -1
            })
        }
    }

    searchList = searchList.map(item => item.depname);

    res.status(200).json({searchList});
});

module.exports = router;
