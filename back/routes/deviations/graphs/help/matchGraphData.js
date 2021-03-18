const db = require('../../../../db');

async function matchGraphData(tb_gosb, parameter) {
    let query = null;

    if (parameter === 'lvl') {
        query = await db.query(`
        select distinct sap.lvl as name, count(*) over(partition by lvl)::int as value
        from sap.deps as sap
        where sap.id in (select sap_id from sap.errors_connections)
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'funcblock') {
        query = await db.query(`
        select distinct sap.funcblock as name, count(*) over(partition by funcblock)::int as value
        from sap.deps as sap
        where sap.id in (select sap_id from sap.errors_connections)
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'etalon') {
        query = await db.query(`
        select distinct etalon.name as name, count(*) over(partition by etalon.name)::int as value
        from sap.deps as sap
        inner join etalon.deps as etalon on etalon.id = sap.connectedto
        where sap.id in (select sap_id from sap.errors_connections)
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
        query = await db.query(`select distinct list.name as name, count(err.*) over(partition by list.name)::int as value
        from sap.errors_connections as err
        inner join sap.deps as sap on err.sap_id = sap.id
        inner join sap.errors as list on list.id = err.error_id`);
    }

    return query ? query.rows : query
}


module.exports = matchGraphData;
