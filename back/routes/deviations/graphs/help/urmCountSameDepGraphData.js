const db = require('../../../../db/index');

async function urmCountSameDepGraphData(tb_gosb, parameter, dev_type) {
    let query = null;

    if (parameter === 'tb_gosb') {
        query = await db.query(`select distinct sap.bank as name, count(*) over(partition by bank)::int as value
        from sap.deps as sap
        where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        `);
    }
    else if (parameter === 'lvl') {
        query = await db.query(`select distinct sap.lvl as name, count(*) over(partition by lvl)::int as value
        from sap.deps as sap
        where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'etalon') {
        query = await db.query(`select distinct etalon.name as name, count(*) over(partition by name)::int as value
        from sap.deps as sap
        inner join etalon.deps as etalon on etalon.id = sap.connectedto
        where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }
    else if (parameter === 'funcblock') {
        query = await db.query(`select distinct sap.funcblock as name, count(*) over(partition by funcblock)::int as value
        from sap.deps as sap
        where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    }

    return query ? query.rows : query
}


module.exports = urmCountSameDepGraphData;
