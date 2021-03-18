const db = require('../../../db');
const {saveToTrash} = require('../../../middleware/actionsLogging');

async function getDeviations(type, bank_type, filter){
    let res = await db.query(`
        select distinct sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name as etalon_name,
            CASE
            when parent_bank.name is not null then '/deptree/' || parent_bank.name || '/' || sap.bank || '/' || sap.id
            else '/deptree/' || sap.bank || '/' || sap.id
            END as link,
            sum(u.state_count) as count
        from sap.deps as sap
        inner join deviations.dev as dev on dev.dep_id = sap.id
        inner join sap.r_units as u on u.dep_id = sap.id
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        left join dictionaries.deps as parent_bank on parent_bank.id = (
            select parent from dictionaries.deps where name = sap.bank
        )
        where dev.type = '${type}'
        and ${bank_type === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name, parent_bank.name
        order by etalon.name, bank
    `);
    return res.rows.filter(item =>
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
}

async function getFootCount(){
    let res = await db.query(`
     select array_agg(id) as id from deviations.footnote_count order by id asc
    `);
    if(res.rows[0].id === null){
        return []
    }else{
        return res.rows[0].id
    }
}

async function setFootCount(id, log_id_promise){
    let search = await db.query(`select id from deviations.footnote_count where id = '${id}'`);
    if(search.rows.length > 0){
        let deleted = await db.query(`delete from deviations.footnote_count where id = '${id}' returning *`);
        if (deleted.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_count', deleted.rows, null, 0);
        }
    }else{
        let added = await db.query(`insert into deviations.footnote_count (id) VALUES ('${id}') returning *`);
        if (added.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_urm', null, added.rows, 1);
        }
    }
}

async function getFootUrm(){
    let res = await db.query(`
     select array_agg(id) as id from deviations.footnote_urm order by id asc
    `);
    if(res.rows[0].id === null){
        return []
    }else{
        return res.rows[0].id
    }
}

async function setFootUrm(id, log_id_promise){
    let search = await db.query(`select id from deviations.footnote_urm where id = '${id}'`);
    if(search.rows.length > 0){
        let deleted = await db.query(`delete from deviations.footnote_urm where id = '${id}' returning *`);
        if (deleted.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_urm', deleted.rows, null, 0);
        }
    }else{
        let added = await db.query(`insert into deviations.footnote_urm (id) VALUES ('${id}') returning *`);
        if (added.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_urm', null, added.rows, 1);
        }
    }
}

async function getFootSameDep(){
    let res = await db.query(`
     select array_agg(id) as id from deviations.footnote_samedep order by id asc
    `);
    if(res.rows[0].id === null){
        return []
    }else{
        return res.rows[0].id
    }
}

async function setFootSameDep(id, log_id_promise){
    let search = await db.query(`select id from deviations.footnote_samedep where id = '${id}'`);
    if(search.rows.length > 0){
        let deleted = await db.query(`delete from deviations.footnote_samedep where id = '${id}' returning *`);
        if (deleted.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_samedep', deleted.rows, null, 0);
        }
    }else{
        let added = await db.query(`insert into deviations.footnote_samedep (id) VALUES ('${id}') returning *`);
        if (added.rows.length > 0) {
            await saveToTrash(log_id_promise, 'deviations.footnote_samedep', null, added.rows, 1);
        }
    }
}

//очистка отклонений
async function deviationsClean(type){
    await db.query(`
        DELETE FROM deviations.dev where type = '${type}'
    `)
}

async function getMaxDate(){
    let res = await db.query(`SELECT MAX(date)::text AS date FROM sap.deps`);
    return res.rows[0].date
}

async function count_update(otdelValue, sectorValue) {
    await deviationsClean('count');
    let date = await getMaxDate();

    await db.query(`
    insert into deviations.dev(dep_id, type)
    select t.id, 'count' as type
    from (
        select distinct d.id,
            CASE
            when d.depname ilike '%сек%' and sum(u.state_count) < ${sectorValue} and d.depname not ilike '%секретар%' 
                and d.lvl > 2 then sum(u.state_count)
            when d.depname ilike '%отд%' and sum(u.state_count) < ${otdelValue} and d.lvl > 2 then sum(u.state_count)
            END as count_case
        from sap.deps as d
        inner join sap.r_units as u on u.dep_id = d.id
        inner join etalon.deps as et on et.id = d.connectedto
        where et.id not in (
                select depid from etalon.footnote_deps where footid in (select id from deviations.footnote_count)
            )
            and d.date = '${date}'
        group by d.id
        order by count_case
    ) t
    where count_case is not null`);
}

async function urm_update() {
    await deviationsClean('urm');
    let date = await getMaxDate();
    await db.query(`
    insert into deviations.dev(dep_id, type)
    select distinct d.id, 'urm' as type
    from sap.deps as d
    inner join sap.r_units as u on u.dep_id = d.id
    inner join etalon.deps as et on et.id = d.connectedto
    where et.id not in (
            select depid from etalon.footnote_deps where footid in (select id from deviations.footnote_urm)
        )
        and et.id not in (
            select dep.id
            from etalon.deps as dep
            inner join etalon.units as unit on unit.etalonid = dep.id
            where unit.id in (
                select unitid from etalon.footnote_units where footid in (select id from deviations.footnote_urm)
                )
            )
        and d.date = '${date}'
    group by d.id, u.urm
    having u.urm = true`);
}

async function same_dep_update() {
    await deviationsClean('samedep');
    let date = await getMaxDate();
    let etalons = await db.query(`
    select * from etalon.deps
    where id in (select connectedto from sap.deps)
    `);

    for (let etalon of etalons.rows) {
        let bank_rows = await db.query(`
        select bank, array_agg(id) as ids
        from sap.deps where connectedto = '${etalon.id}'
        group by bank`);
        for (let bank_row of bank_rows.rows) {
            if (bank_row.ids.length > 1) {
                await db.query(`
                insert into deviations.dev(dep_id, type)
                select distinct d.id, 'samedep' as type
                from sap.deps as d
                inner join etalon.deps as et on et.id = d.connectedto
                where d.id = ANY($1)
                    and et.id not in (
                        select depid from etalon.footnote_deps where footid in (select id from deviations.footnote_samedep)
                    )
                    and d.date = '${date}'
                `, [bank_row.ids]);
            }
        }
    }
}

async function filter_list(select_structure, dev_type) {
    let bank_data = await db.query(`select distinct sap.bank
    from sap.deps as sap
    where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let bank = bank_data.rows.map(item => item.bank);

    let dep_data = await db.query(`select distinct sap.depname as dep 
    from sap.deps as sap
    where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let dep = dep_data.rows.map(item => item.dep);

    let funcblock_data = await db.query(`select distinct sap.funcblock 
    from sap.deps as sap
    where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let funcblock = funcblock_data.rows.map(item => item.funcblock);

    let lvl_data = await db.query(`select distinct sap.lvl 
    from sap.deps as sap
    where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let lvl = lvl_data.rows.map(item => `${item.lvl}`);

    let etalon_data = await db.query(`select distinct etalon.name as etalon_name
    from sap.deps as sap
    inner join etalon.deps as etalon on etalon.id = sap.connectedto
    where sap.id in (select dep_id from deviations.dev where type = '${dev_type}')
    and ${select_structure === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}`);
    let etalon = etalon_data.rows.map(item => item.etalon_name);

    etalon.push('-');

   return {'bank': bank, 'dep': dep, 'funcblock': funcblock, 'lvl': lvl, 'etalon': etalon}
}

module.exports={
    count_update,
    getDeviations,
    getFootCount,
    setFootCount,
    getFootUrm,
    setFootUrm,
    getFootSameDep,
    setFootSameDep,
    urm_update,
    filter_list,
    same_dep_update
};