let express = require('express');
const db = require('../../../db');
let router = express.Router();
const { checkUser } = require('../../../middleware');
const {actionLogger} = require('../../../middleware/actionsLogging');
const {lastDate} = require('../../initial/help');

const match_unit_errors_table = async (filter, select_structure) => {
    const date = await lastDate();
    const table_data = await db.query(`
    select distinct sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name as etalon_name,
            CASE
            when parent_bank.name is not null then '/deptree/' || parent_bank.name || '/' || sap.bank || '/' || sap.id
            else '/deptree/' || sap.bank || '/' || sap.id
            END as link,
            array_agg(jsonb_build_object('id', unit.id, 'name', unit.unit_name)) as units
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join etalon.deps as etalon on etalon.id = sap.connectedto
    left join dictionaries.deps as parent_bank on parent_bank.id = (
        select parent from dictionaries.deps where name = sap.bank
    )
    where unit.id in (select unit_id from sap.unit_errors_connections)
        and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        and date = '${date}'
    group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name, parent_bank.name
    `);
    let table = table_data.rows.filter(item =>
        (
            filter['bank'] === null ? true : (filter['bank'].length > 0 ? item.bank.toLowerCase() === filter['bank'].toLowerCase() : true)
        )
        &&
        (
            filter['dep'] === null ? true : (filter['dep'].length > 0 ? item.depname.toLowerCase() === filter['dep'].toLowerCase() : true)
        )
        &&
        (
            filter['funcblock'] === null ? true : (filter['funcblock'].length > 0 ? item.funcblock.toLowerCase() === filter['funcblock'].toLowerCase() : true)
        )
        &&
        (
            filter['lvl'] === null ? true : (filter['lvl'].length > 0 ? item.lvl + '' === filter['lvl'] : true)
        )
        &&
        (
            (filter['etalon'] === null) ? true : ((item.etalon_name === null) ? (!filter['etalon'] || filter['etalon'] === '-')
                : filter['etalon'].length > 0 ? item.etalon_name.toLowerCase() === filter['etalon'].toLowerCase() : true)
        )
        &&
        (
            filter['etalon'] === '-' ? !Boolean(item.etalon_name) : true
        )
    );

    for (let row of table) {
        for (let unit of row.units) {
            let unit_errors_data = await db.query(`select distinct error.name, error.description
            from sap.unit_errors as error
            inner join sap.unit_errors_connections as unit_errors on unit_errors.error_id = error.id
            where unit_errors.unit_id = '${unit.id}'
            `);
            unit.errors = unit_errors_data.rows;
        }
    }

    return table
};

router.post('/table',checkUser, actionLogger, async function(req, res, next) {
    const filter = req.body.filter;
    const select_structure = req.body.select_structure;

    const table = await match_unit_errors_table(filter, select_structure);

    res.status(200).json({table});
});

router.post('/filter_list',checkUser, actionLogger, async function(req, res, next) {
    const select_structure = req.body.select_structure;

    let bank_data = await db.query(`select distinct sap.bank
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let bank = bank_data.rows.map(item => item.bank);

    let dep_data = await db.query(`select distinct sap.depname as dep 
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let dep = dep_data.rows.map(item => item.dep);

    let funcblock_data = await db.query(`select distinct sap.funcblock 
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let funcblock = funcblock_data.rows.map(item => item.funcblock);

    let lvl_data = await db.query(`select distinct sap.lvl 
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let lvl = lvl_data.rows.map(item => `${item.lvl}`);

    let etalon_data = await db.query(`select distinct etalon.name as etalon_name
    from sap.deps as sap
    inner join etalon.deps as etalon on etalon.id = sap.connectedto
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let etalon = etalon_data.rows.map(item => item.etalon_name);

    etalon.push('-');

    res.status(200).json({filter_list: {'bank': bank,'dep': dep,'funcblock': funcblock,'lvl': lvl,'etalon': etalon}});
});

module.exports = router;