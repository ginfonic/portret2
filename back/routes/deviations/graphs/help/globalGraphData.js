const db = require('../../../../db');

async function globalGraphData(parameter) {
    let data = [];

    let approved = {rows: [{approved: 0}]};
    let count = {rows: [{count: 0}]};
    let urm = {rows: [{urm: 0}]};
    let same_dep = {rows: [{same_dep: 0}]};

    if (parameter === 'global') {
        approved = await db.query(`
        select count(dev.*)::int as approved
        from deviations.approved as dev`);
        count = await db.query(`
        select count(*)::int as count
        FROM deviations.dev
        where type = 'count'`);
        urm = await db.query(`
        select count(*)::int as urm
        FROM deviations.dev
        where type = 'urm'`);
        same_dep = await db.query(`
        select count(*)::int as same_dep
        FROM deviations.dev
        where type = 'samedep'`);
        let match_unit = await db.query(`
        select count(unit_errors.*)::int as match_unit
        from sap.unit_errors_connections as unit_errors
        inner join sap.a_units as unit on unit_errors.unit_id = unit.id
        inner join sap.deps as sap on unit.dep_id = sap.id
        `);
        let match = await db.query(`
        select count(err.*)::int as match
        from sap.errors_connections as err
        inner join sap.deps as sap on err.sap_id = sap.id
        `);

        data.push({name: 'Отклонения ошибок метчинга', value: match.rows[0].match});
        data.push({name: 'Отклонения ошибок должностей метчинга', value: match_unit.rows[0].match_unit})
    }

    data.push({name: 'Согласованные отклонения', value: approved.rows[0].approved});
    data.push({name: 'Отклонения по численности', value: count.rows[0].count});
    data.push({name: 'Отклонения УРМ', value: urm.rows[0].urm});
    data.push({name: 'Отклонения по количеству одинаковых подразделений', value: same_dep.rows[0].same_dep});

    return data
}


module.exports = globalGraphData;
