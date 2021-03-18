const db = require('../../../../db');

async function approvedGraphData(parameter) {
    let query = null;

    if (parameter === 'tb') {
        query = await db.query(`
        select distinct t.bank as name, count(t.dev_id) over(partition by bank)::int as value
        from (select distinct con.dev_id, sap.bank
        from sap.deps as sap
        inner join deviations.approved_deps as con on con.dep_id = sap.id
        where sap.type = 'tb') t`);
    }
    else if (parameter === 'gosb') {
        query = await db.query(`
        select distinct t.bank as name, count(t.dev_id) over(partition by bank)::int as value
        from (select distinct con.dev_id, sap.bank
        from sap.deps as sap
        inner join deviations.approved_deps as con on con.dep_id = sap.id
        where sap.type = 'gosb') t`);
    }
    else if (parameter === 'time') {
        query = await db.query(`select distinct (answer_send_date::timestamp - req_date::timestamp) as wst, 
        (answer_send_date::timestamp - req_date::timestamp)::text as name,
        count(*) over(partition by answer_send_date::timestamp - req_date::timestamp)::int as value
        from deviations.approved
        order by wst`)
    }
    else if (parameter === 'tag') {
        query = await db.query(`select distinct tags.tag as name, count(*) over(partition by tags.tag)::int as value
        from deviations.approved as dev
        left join deviations.approved_tags_connections as tag_con on tag_con.dev_id = dev.id
        left join deviations.approved_tags as tags on tags.id = tag_con.tag_id`);

        if (query.rows.length > 0) {
            for (let row of query.rows) {
                if (row.name === null) {
                    row.name = 'Нет тега'
                }
            }
        }
    }

    return query ? query.rows : query
}


module.exports = approvedGraphData;
