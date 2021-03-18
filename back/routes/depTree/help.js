const db = require('../../db');
const { v4: uuidv4 } = require('uuid');


//поиск города

async function getCity(id){
    let res = await db.query(`
    select addr_city, count(*) c from sap.r_units
    where dep_id = '${id}'
    group by addr_city
    order by c
    desc limit 1
     `)
     if(res.rows.length > 0){
        console.log(res.rows)
         return res.rows[0].addr_city
     }else{
        let vill =  await db.query(`
        select addr_punct, count(*) c from sap.r_units
        where dep_id = '${id}'
        group by addr_punct
        order by c
        desc limit 1
         `)
         if(vill.rows.length > 0){
            return vill.rows[0].addr_punct
        }else{
            return 'не найден'
        }
     }
}

async function getDev(id) {
    let dev_count = await db.query(`
    select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = '${id}'
    group by sap.id
    `);

    if (dev_count.rows.length === 1) {
        return dev_count.rows[0].dev_count > 0
    }
    else {
        return false
    }
}

async function getDevChild(id) {
    let dev_child_count = await db.query(`
    select sum(t.dev_count) as dev_child_count
    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id in (WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = 'a0f8e3cd-144b-4fd5-8fcd-98248c5846bb'
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id) and sap.id != 'a0f8e3cd-144b-4fd5-8fcd-98248c5846bb'
    group by sap.id) t`);

    if (dev_child_count.rows.length === 1) {
        return dev_child_count.rows[0].dev_child_count > 0
    }
    else {
        return false
    }
}

async function getChild(id, date){
    let res = await db.query(`
        WiTH RECURSIVE r AS (
            SELECT depname, id, parent, 1 AS level, connectedto as connect
            FROM sap.deps
            WHERE id = '${id}'
            AND date = '${date}'
        UNION ALL
        SELECT 
            sap.deps.depname,
            sap.deps.id,
            sap.deps.parent,
            r.level + 1 AS level,
            sap.deps.connectedto as connect
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id
    `);
    return res.rows
}

async function getCount(arrDeps){
    let arr = arrDeps.map(i => i.id)
    let res = await db.query(`
    select SUM(state_count) AS statecount, SUM(actual_count) AS stavkacount, COUNT(vacancy_date) AS vacancy
    from sap.r_units
    where
    dep_id = ANY(($1::uuid[]))
    `,[arr])
    return res.rows[0]
}

async function getUnits(id){
    try{
        let res = await db.query(`
        select 
            sap.a_units.state_name as position,
            SUM(actual_count) AS statecount, SUM(state_count) AS statecount,
            SUM(actual_count) AS stavkacount,
            vacancy_date::text as vacancy,
            urm,
            addr_city as city
            from sap.r_units
            join sap.a_units on sap.a_units.id = sap.r_units.unit_id
            where
            sap.r_units.dep_id = '${id}'
            GROUP BY position, urm, addr_city, r_units.vacancy_date
            ORDER BY  urm
    `);
    return res.rows
    }catch(e){
        console.log(e)
        return []
    }
}

async function depInfo(id, date){
    let all = await getChild(id, date);
    let res = [];

    for(let i of all){
        let depid = i.id;
        let arr = await getChild(depid, date);
        i['count'] = await getCount(arr);
        i['units'] = await getUnits(depid);
        i['city'] = await getCity(depid);
        i.dev = await getDev(depid);
    }
   return all 
}

async function fill_parents(id) {
    let parent = await db.query(`select depname, parent, type from sap.deps where id = ${id === null ? 'null' : `'${id}'`}`);
    if (parent.rows.length === 1) {
        return {
            id,
            parent: await fill_parents(parent.rows[0].parent),
            type: parent.rows[0].type,
            depname: parent.rows[0].depname,
        }
    }
    else {
        return {
            id,
            parent: null,
        }
    }
}

module.exports = {
    getChild,
    depInfo,
    fill_parents
};