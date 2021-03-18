const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

async function getChild(id, date, lvl){
    try{
        let res = await db.query(`
            WiTH RECURSIVE r AS (
                SELECT depname, id, type
                FROM sap.deps
                WHERE id = '${id}'
    
            UNION ALL
    
            SELECT 
                sap.deps.depname,
                sap.deps.id,
                sap.deps.type
            FROM  sap.deps
            JOIN r ON sap.deps.parent = r.id
            )
            SELECT * from r
            ORDER BY id
        `);
        return res.rows.map(i => i.id)

    }catch(e){
        console.log('getchild------>>', e)
        return []
    }
}

async function getCount(arr){
    try{
        let res = await db.query(`
        select SUM(state_count)::int AS count
        from sap.r_units
        where
        dep_id = ANY(($1::uuid[]))
        `,[arr])
        return res.rows[0].count

    }catch(e){
        console.log('errooooo',e)
        return 12
    }
}

async function getCountUnit(arr){
    try{
        let res = await db.query(`
        select SUM(state_count)::int AS count
        from sap.r_units
        where
        unit_id = ANY(($1::uuid[]))
        `,[arr]);
        return res.rows[0].count

    }catch(e){
        console.log('errooooo',e);
        return 12
    }
}

async function maxDate(){
    let res = await db.query(`select max(date)::text from sap.deps`);
    return res.rows[0].max
}

async function getAlldeps(){
    let res = await db.query(`select array_agg(distinct name) as deps from dictionaries.deps`);
    return res.rows[0].deps
}

async function getEtalonid(type){
    let res = await db.query(`select array_agg(id) as idarr from etalon.deps where type = '${type}' and show = true`);
    return res.rows[0].idarr
}

async function precountDepsUpdate(){
    await db.query(`delete from precount.precountdeps`);
    let date = await maxDate();
    await db.query(`
    insert into precount.precountdeps (sapid, current_count, bank, fnblock)
    select distinct dep.id as sapid, SUM(r.state_count)::int AS current_count,
    dep.bank, dictionaries.fnblock.type as fnblock
    from sap.deps as dep
    join dictionaries.fnblock ON dictionaries.fnblock.fnblock = dep.funcblock
    inner join sap.r_units as r on r.dep_id = dep.id
    where date = '${date}'
    group by dep.id, dep.bank, dictionaries.fnblock.type
    `);
    console.log('deps done')
}

async function precountUnitsUpdate(){
    await db.query(`delete from precount.precountunits`);
    let date = await maxDate();
    await db.query(`
           insert into precount.precountunits (unit_id, current_count, bank)
           select distinct unit.id, SUM(r.state_count)::int AS current_count, dep.bank
           from sap.a_units as unit
           inner join sap.deps as dep on dep.id = unit.dep_id
           inner join sap.r_units as r on r.unit_id = unit.id
           where dep.date = '${date}'
           group by unit.id, dep.bank
       `);
    console.log('units done')
}

async function depCount(id, deps){
    let res = await db.query(`
        select SUM(current_count)::int as count from precount.precountdeps
        where
        sapid in (select id from sap.deps where connectedto = ANY(($2::uuid[])) and bank = ANY(($1::text[])))
        and bank = ANY(($1::text[]))
    `,[deps, id]);
    if(res.rows[0].count){
        return res.rows[0].count
    }else{
        return 0
    }
}

async function getAllautoLvl(id) {
    let res = await db.query(`
        WiTH RECURSIVE r AS (
            SELECT
                name,
                id,
                funcblock,
                lvl,
                1 AS level
            FROM etalon.deps
            WHERE id = '${id}'
            AND show = true

        UNION ALL

        SELECT 
            etalon.deps.name,
            etalon.deps.id,
            etalon.deps.funcblock,
            etalon.deps.lvl,
            r.level + 1 AS level
        FROM  etalon.deps
        JOIN r ON etalon.deps.parentid = r.id
        where show = true
        )
        SELECT * from r
        ORDER BY id
    `);
    return res.rows.map(i => i.id)
}

async function getdepCount(type, deps){
    let etalonids = await getEtalonid(type);
    let obj = {};
    for(let i of etalonids){
        let ids = await getAllautoLvl(i);
        obj[`${i}`] = await depCount(ids, deps);

    }
    return obj
}

module.exports = {
    precountDepsUpdate,
    maxDate,
    getdepCount,
    getAlldeps,
    precountUnitsUpdate
};