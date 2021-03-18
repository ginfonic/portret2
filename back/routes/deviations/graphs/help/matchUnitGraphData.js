const db = require('../../../../db');

async function matchUnitGraphData(tb_gosb, parameter) {
    let query = null;

    if (parameter === 'lvl') {
        query = await db.query(`
        select distinct sap.lvl as name, count(*) over(partition by lvl)::int as value
        from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where unit.id in (select unit_id from sap.unit_errors_connections)
    and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'funcblock') {
        query = await db.query(`
        select distinct sap.funcblock as name, count(*) over(partition by funcblock)::int as value
        from sap.deps as sap
        inner join sap.a_units as unit on unit.dep_id = sap.id
        where unit.id in (select unit_id from sap.unit_errors_connections)
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'etalon') {
        query = await db.query(`
        select distinct etalon.name as name, count(*) over(partition by etalon.name)::int as value
        from sap.deps as sap
        inner join etalon.deps as etalon on etalon.id = sap.connectedto
        inner join sap.a_units as unit on unit.dep_id = sap.id
        where unit.id in (select unit_id from sap.unit_errors_connections)
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);

        if (query.rows.length > 0) {
            for (let row of query.rows) {
                if (row.name === null) {
                    row.name = 'Не привязано'
                }
            }
        }
    }
    else if (parameter === 'error') {
        query = await db.query(`
        select distinct error.name as name, count(unit_errors.*) over(partition by error.name)::int as value
        from sap.unit_errors_connections as unit_errors
        inner join sap.a_units as unit on unit_errors.unit_id = unit.id
        inner join sap.deps as sap on unit.dep_id = sap.id
        inner join sap.unit_errors as error on error.id = unit_errors.error_id`);
    }

    return query ? query.rows : query
}


module.exports = matchUnitGraphData;
