const {recursive_fill_final} = require('./help/etalon');
let express = require('express');
const db = require('../../db');
let router = express.Router();
const {actionLogger} = require('../../middleware/actionsLogging');
const {checkUser} = require('../../middleware');
const {lastDate} = require('../initial/help');

router.post('/etalon_data', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const funcblockFilter = req.body.funcblockFilter;
    const searchFilter = req.body.searchFilter;
    const lvlFilter = req.body.lvlFilter;
    const connections = req.body.connections;
    const select_structure = req.body.select_structure;

    let etalon_list = await db.query('SELECT e.id, e.funcblock, e.name, e.parentid, e.lvl, COUNT(s.id) as connections\n' +
        `FROM etalon.deps as e\n` +
        `left join sap.deps as s on s.connectedto = e.id and s.date = '${date}'\n
        WHERE e.show = true
        and e.type = '${select_structure}'` +
        'GROUP BY e.id, e.funcblock, e.name, e.parentid\n' +
        'ORDER BY lvl');

    etalon_list = etalon_list.rows;

    const filtered = etalon_list.filter((item) => funcblockFilter.length > 0 ? funcblockFilter.indexOf(item.funcblock) !== -1 : item)
        .filter((item) => item.name.includes(searchFilter))
        .filter((item) => lvlFilter.length > 0 ? lvlFilter.indexOf(item.lvl) !== -1 : item)
        .filter((item) => {
            return (connections.indexOf("Отсутствуют") !== -1 ? Number(item.connections) === 0 : false) ||
                (connections.indexOf("Есть") !== -1 ? Number(item.connections) > 0 : false) ||
                (connections.indexOf("Больше 10") !== -1 ? Number(item.connections) >= 10 : false) ||
                (connections.length === 0)
        });

    let final = [];

    //filtered.map((elem, index) => {
    //  if (Boolean(elem.parentid)) {
    //    filtered[index].parentid = filtered.find((element) => element.id === elem.parentid);
    //  }
    //});

    filtered.map((elem, index) => {
        let tmp_final = recursive_fill_final(elem, final);
        if (tmp_final === null) {
            final.push(elem)
        }
        else {
            final = tmp_final
        }
    });

    res.status(200).json({final});
});

router.post('/etalon_funcblocks', checkUser, actionLogger, async function(req, res, next) {
    const select_structure = req.body.select_structure;
    let funcblocks = await db.query(`SELECT distinct funcblock FROM etalon.deps where type = '${select_structure}' ORDER BY funcblock`);

    funcblocks = funcblocks.rows;

    const funcblock_array = funcblocks.map((item) => item.funcblock);

    res.status(200).json({funcblocks: funcblock_array});
});

router.post('/etalon_lvls', checkUser, actionLogger, async function(req, res, next) {
    const select_structure = req.body.select_structure;
    let lvls = await db.query(`SELECT distinct lvl FROM etalon.deps where type = '${select_structure}' ORDER BY lvl`);

    lvls = lvls.rows;

    const lvls_array = lvls.map((item) => item.lvl);

    res.status(200).json({lvls: lvls_array});
});

router.post('/etalon_item', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    const id = req.body.id;

    let item = await db.query('SELECT e.id, e.funcblock, e.name, e.parentid, e.lvl, COUNT(s.id) as connections\n' +
        `FROM etalon.deps as e\n` +
        `left join sap.deps as s on s.connectedto = e.id and s.date = '${date}'\n` +
        `WHERE e.id = '${id}' and e.type = '${select_structure}'` +
        'GROUP BY e.id, e.funcblock, e.name, e.parentid\n' +
        'ORDER BY id, parentid');

    item = item.rows;

    item = item[0];

    if (Boolean(item.parentid)) {
        let parent = await db.query(`SELECT name, id FROM etalon.deps WHERE id = '${item.parentid}' and type = '${select_structure}'`);
        item.parent = parent.rows[0]
    }
    else item.parent = null;

    res.status(200).json({item});
});

router.post('/search_list_etalon_menu', checkUser, actionLogger, async function(req, res, next) {
    const date = await lastDate();
    const select_structure = req.body.select_structure;
    const funcblockFilter = req.body.funcblockFilter;
    const lvlFilter = req.body.lvlFilter;
    const connections = req.body.connections;

    let searchList_data = await db.query('SELECT e.funcblock, e.name, e.lvl, COUNT(s.id) as connections ' +
        `FROM etalon.deps as e ` +
        `left join sap.deps as s on s.connectedto = e.id and s.date = '${date}'
        WHERE e.show = true and e.type = '${select_structure}'` +
        'GROUP BY e.name, e.funcblock, e.lvl\n' +
        'ORDER BY name');

    let searchList = searchList_data.rows;

    if (lvlFilter.length > 0) {
        searchList = searchList.filter((item) => lvlFilter.length > 0 ? lvlFilter.indexOf(item.lvl) !== -1 : item);
    }

    searchList = searchList.filter((item) => funcblockFilter.length > 0 ? funcblockFilter.indexOf(item.funcblock) !== -1 : item)
        .filter((item) => {
            return (connections.indexOf("Отсутствуют") !== -1 ? Number(item.connections) === 0 : false) ||
                (connections.indexOf("Есть") !== -1 ? Number(item.connections) > 0 : false) ||
                (connections.indexOf("Больше 10") !== -1 ? Number(item.connections) >= 10 : false) ||
                (connections.length === 0)
        }).map(item => item.name);

    res.status(200).json({searchList});
});

module.exports = router;