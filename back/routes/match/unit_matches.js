let express = require('express');
const db = require('../../db');
const wuzzy = require('wuzzy');
let router = express.Router();
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {checkUser} = require('../../middleware');
const {save_match} = require('./help/sap');
//
router.post('/etalon_units', checkUser, actionLogger, async function(req, res, next) {
    const chosen = req.body.chosen;

    let units_data = await db.query(`select e.id, e.name, e.etalonid, c.color, c.unit, c_ex.color as color_ex, c_ex.unit as unit_ex from etalon.units as e
    join colors.color_main as c on c.id = e.color
    join colors.color_ex as c_ex on c_ex.id = e.color_ex
    where e.etalonid = '${chosen.id}'`);
    let units = units_data.rows;

    res.status(200).json({units});
});
//
router.post('/sap_units', checkUser, actionLogger, async function(req, res, next) {
    const sapChecked = req.body.sapChecked;

    let units_data = await db.query(`select distinct sap.a_units.id, sap.a_units.dep_id, unit_name as name
    from sap.a_units
    inner join sap.r_units on sap.r_units.outstate = false and sap.r_units.unit_id = sap.a_units.id
    where sap.a_units.dep_id = ANY($1) and connectedto IS NULL order by name`, [sapChecked]);
    let units = units_data.rows;

    let unique_units = {};

    for (let unit of units) {
        if (!Boolean(unique_units[unit.name])) {
            unique_units[unit.name] = [{...unit}]
        }
        else {
            unique_units[unit.name].push({...unit});
        }
    }

    res.status(200).json({units: unique_units});
});
//
router.post('/units_matched', checkUser, actionLogger, async function(req, res, next) {
    const chosen = req.body.chosen;
    const sap_id = req.body.sap_id;
    const value = req.body.value;

    if (!value && !Boolean(sap_id))
    {
        res.status(200).json({matched: []});
        return
    }

    let chosen_units_data = await db.query(`select id from etalon.units where etalonid = '${chosen.id}'`);
    let chosen_units = chosen_units_data.rows;

    chosen_units = chosen_units.map((item) => item.id);

    let sap_units_data = await db.query(`select distinct ch.id, ch.unit_name as name, ch.connectedto, par.depname as sap_name 
    from sap.a_units as ch 
    inner join sap.deps as par on ch.dep_id = par.id
    inner join sap.r_units on sap.r_units.outstate = false and sap.r_units.unit_id = ch.id
    where ch.connectedto = ANY($1) ${Boolean(sap_id) ? `and ch.dep_id = '${sap_id}'` : ``}`, [chosen_units]);
    let sap_matched = sap_units_data.rows;

    let matched = [];

    for (let elem of sap_matched) {
        let etalon_unit_data = await db.query(`select * from etalon.units where id = '${elem.connectedto}'`);
        let etalon_unit = etalon_unit_data.rows[0];

        matched.push({etalon: etalon_unit, sap: elem})
    }

    res.status(200).json({matched});
});
//
router.post('/match_units', checkUser, actionLogger, async function(req, res, next) {
    const selectedSapUnits = req.body.selectedSapUnits;
    const selectedEtalonUnit = req.body.selectedEtalonUnit;

    let sapUnits = [];
    selectedSapUnits.map(item => sapUnits.push(...item.units));

    let color_data = await db.query(`select color, color_ex from etalon.units where id = '${selectedEtalonUnit[0]}'`);
    const colors = color_data.rows[0];

    let before = await db.query(`select connectedto, id, color, color_ex from sap.a_units where id = ANY($1)`, [sapUnits.map(item => item.id)]);
    let after = await db.query(`update sap.a_units SET connectedto = '${selectedEtalonUnit[0]}', color = '${colors.color}', color_ex = '${colors.color_ex}'
     where id = ANY($1) returning connectedto, color, color_ex, id`, [sapUnits.map(item => item.id)]);

    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.a_units`, before.rows, after.rows, 2)
    }

    save_match([sapUnits.map(item => item.dep_id)]).then(() => {});

    res.status(200).json({message: 'ok'});
});
//
router.post('/unmatch_units', checkUser, actionLogger, async function(req, res, next) {
    const matched_elem = req.body.matched_elem;
    const matched = req.body.matched;
    const sort = req.body.sort;

    if (!sort) {
        let before = await db.query(`select connectedto, id, color, color_ex from sap.a_units where id = '${matched_elem.sap.id}'`);
        let after = await db.query(`update sap.a_units SET connectedto = null, color = null, 
        color_ex = null where id = '${matched_elem.sap.id}' returning connectedto, id, color, color_ex`);

        if (after.rows.length > 0) {
            await saveToTrash(req.log_id_promise, `sap.a_units`, before.rows, after.rows, 2)
        }

        res.status(200).json({message: 'ok'});

        let deps = await db.query(`select dep_id from sap.a_units where id = ANY($1)`, [[matched_elem.sap.id]]);
        save_match([deps.rows.map(item => item.dep_id)]).then(() => {});
        return
    }

    let selected_data = await db.query(`select unit_name as name from sap.a_units where id = '${matched_elem.sap.id}'`);
    let selected = selected_data.rows[0];

    let needed_to_match = matched.filter((item) => item.sap.name === selected.name).map((item) => item.sap.id);

    let before = await db.query(`select connectedto, id, color, color_ex from sap.a_units where id = ANY($1)`, [needed_to_match]);
    let after = await db.query(`update sap.a_units SET connectedto = null, color = null, 
    color_ex = null where id = ANY($1) returning connectedto, id, color, color_ex`, [needed_to_match]);

    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.a_units`, before.rows, after.rows, 2)
    }

    res.status(200).json({message: 'ok'});

    let deps = await db.query(`select dep_id from sap.a_units where id = ANY($1)`, [needed_to_match]);
    save_match([deps.rows.map(item => item.dep_id)]).then(() => {});
});
//
router.post('/unit_info', checkUser, actionLogger, async function(req, res, next) {
    const item = req.body.item;

    let id = item.units[0].id;

    let item_info_data = await db.query(`select *, unit_name as name from sap.a_units where id = '${id}'`);
    let unit_info = item_info_data.rows[0];

    let errors_data = await db.query(`select * from sap.unit_errors where id in (select error_id as id from sap.unit_errors_connections where unit_id = '${id}')`);
    let unit_errors = errors_data.rows;

    let deps = await db.query(`select id, depname, bank from sap.deps where id = ANY($1)`, [item.units.map(un => un.dep_id)]);

    res.status(200).json({unit_info, unit_errors, deps: deps.rows});
});

router.post('/units_return_later', checkUser, actionLogger, async function(req, res, next) {
    const item = req.body.item;

    let sapUnits = item.units;

    let before = await db.query(`select return_later, id from sap.a_units where id = ANY($1)`, [sapUnits.map(item => item.id)]);
    let after = await db.query(`update sap.a_units SET return_later = NOT return_later where id = ANY($1) returning return_later, id`, [sapUnits.map(item => item.id)]);

    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.a_units`, before.rows, after.rows, 2)
    }

    let item_info_data = await db.query(`select *, unit_name as name from sap.a_units where id = '${sapUnits[0].id}'`);
    let unit_info = item_info_data.rows[0];

    res.status(200).json({unit_info});
});

router.post('/auto_units_matching', checkUser, actionLogger, async function(req, res, next) {
    let connected = req.body.connected.map(item => item.id);

    for (let id of connected) {
        let units = await db.query(`select * from sap.a_units where dep_id = '${id}' and connectedto is null`);
        let etalon = await db.query(`select * from etalon.units where etalonid in (select connectedto from sap.deps where id = '${id}')`);
        for (let unit of units.rows) {
            for (let et_unit of etalon.rows) {
                if (wuzzy.levenshtein(et_unit.name, unit.unit_name) > 0.8) {
                    let color_data = await db.query(`select color, color_ex from etalon.units where id = '${et_unit.id}'`);
                    const colors = color_data.rows[0];

                    let before = await db.query(`select connectedto, id, color, color_ex from sap.a_units where id = '${unit.id}'`);
                    let after = await db.query(`update sap.a_units SET connectedto = '${et_unit.id}', color = '${colors.color}', color_ex = '${colors.color_ex}'
                    where id = '${unit.id}' returning connectedto, color, color_ex, id`);

                    if (after.rows.length > 0) {
                        await saveToTrash(req.log_id_promise, `sap.a_units`, before.rows, after.rows, 2)
                    }
                }
            }
        }
    }

    res.status(200).json({message: 'ok'});

    save_match([connected]).then(() => {});
});

module.exports = router;