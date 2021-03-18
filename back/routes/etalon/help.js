const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

//поиск председателя
async function getMain(type) {
    let res = await db.query(`select * from etalon.deps where parentid is null and type = '${type}'`);
    return res.rows[0].id
}
//достаем все подразделения с учетом иерархии
async function getAll(id) {
    let res = await db.query(`
        WiTH RECURSIVE r AS (
            SELECT
                name,
                id,
                parentid,
                funcblock,
                text,
                lvl,
                flat,
                subpart
            FROM etalon.deps
            WHERE id = '${id}'
            AND show = true

        UNION ALL

        SELECT 
            etalon.deps.name,
            etalon.deps.id,
            etalon.deps.parentid,
            etalon.deps.funcblock,
            etalon.deps.text,
            etalon.deps.lvl,
            etalon.deps.flat,
            etalon.deps.subpart
        FROM  etalon.deps
        JOIN r ON etalon.deps.parentid = r.id
        where show = true
        )
        SELECT * from r
        ORDER BY id
    `);
    
    return res.rows
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
    return res.rows
}

async function getNotes(id){
    try{
        let res = await db.query(`
            SELECT array_agg(footid) AS arr
            FROM  etalon.footnote_deps
            WHERE depid = '${id}'
         `);
         if(res.rows[0].arr === null){
             return([])
         }else{
             return(res.rows[0].arr)
         }
    }catch(e){
        console.log('getNotes', e);
        return([])
    }
}

async function unitCount(id, deps){
    let res = await db.query(`
        select SUM(current_count)::int as count from precount.precountunits
        where
        unit_id in (select id from sap.a_units where connectedto = '${id}')
        and bank = ANY(($1::text[]))
    `,[deps]);
    if(res.rows[0].count){
        return res.rows[0].count
    } else {
        return 0
    }
}

async function getUnits(id, deps){
    let res = await db.query(`
        select * from etalon.units where etalonid = '${id}'
        order by color
    `);
    for(let i of res.rows){
        let arrNote = await db.query(`select array_agg(footid) as id from etalon.footnote_units where unitid = '${i.id}'`);
        i.notes = arrNote.rows[0].id;
        if (deps.length > 0) {
            i.count = await unitCount(i.id, deps);
        }
        else {
            i.count = null;
        }
    }
    return res.rows
}

async function getInfo(id){
    let res = await db.query(`
        select name, text, lvl, flat, subpart from etalon.deps where id = '${id}'
    `);
    let order = await db.query(`select * from etalon.orders where depid = '${id}'`);
    console.log(res.rows[0].lvl);
    return {name:res.rows[0].name, text:res.rows[0].text, orders:order.rows, lvl: +res.rows[0].lvl, flat: res.rows[0].flat,subpart:res.rows[0].subpart }
}

async function notes(id, type){
    if(type === 'dep'){
        try{
            let notes = await db.query(`
                select footid, footnote.footnote.num 
                from etalon.footnote_deps
                join footnote.footnote on footnote.id = footid
                where depid = '${id}'
                `);
            return notes.rows
        }catch(e){
            console.log(e);
            return []
        }
    } else {
        try{
            let notes = await db.query(`
                select footid, footnote.footnote.num 
                from etalon.footnote_units
                join footnote.footnote on footnote.id = footid
                where unitid = '${id}'
                `)
            return notes.rows
        }catch(e){
            console.log(e)
            return []
        }
    }
}


async function unitAdd(id, color, color_ex, name){
    try{
        await db.query(`
            insert into etalon.units (id, name, color, color_ex, etalonid) values
            ('${uuidv4()}', '${name}', ${color}, ${color_ex}, '${id}')
        `)
    }catch(e){
        console.log(e)
    }

}

async function unitUpdate(id, color, color_ex, name){
    try{
        await db.query(`update etalon.units set color = '${color}', name = '${name}', color_ex = '${color_ex}' where id = '${id}'`)
    }catch(e){
        console.log(e)
    }
}

async function dellUser(id){
    try{
        await db.query(`delete from etalon.units where id = '${id}'`)
        await db.query(`delete from etalon.footnote_units where unitid = '${id}'`)
    }catch(e){console.log(e)}
}

async function getDeps(id){
    try{
       let deps =  await db.query(`select * from etalon.deps where parentid = '${id}' and show = true`)
       return deps.rows
    }catch(e){
        console.log(e)
        return []
    }
}

async function depNameUpdate(id, name){
    try{
        await db.query(`update etalon.deps set name = '${name}' where id = '${id}'`)
    }catch(e){
        console.log(e) 
    }
}

async function addDep(id, name){
    try{
        let parent = await db.query(`select * from etalon.deps where id = '${id}'`);
        console.log(parent.rows[0].name, '--->>', name, parent.rows[0].lvl+1)
        await db.query(`
            insert into etalon.deps (id, name, funcblock, parentid, text, type, show, lvl)
            values
            ('${uuidv4()}', '${name}', '${parent.rows[0].funcblock}', '${parent.rows[0].id}', '', '${parent.rows[0].type}', true, ${parent.rows[0].lvl+1})
        `)
    }catch(e){
        console.log(e)
    }
}

async function textUpdate(id, text){
    try{
        await db.query(`update etalon.deps set text = '${text}' where id = '${id}'`)
    }catch(err){
        console.log(err)
    }
}

async function getAllDeps(type){
    try{
        let res = await db.query(`select name, id, lvl, funcblock from etalon.deps where type ='${type}' and show = true`)
        return res.rows
    }catch(e){
        console.log(e)
    }
}

async function changeParent(parentID, depID, type){
    let parent = await db.query(`select * from etalon.deps where id = '${parentID}'`);
    await db.query(`
        update etalon.deps set parentid = '${parentID}', funcblock = '${parent.rows[0].funcblock}' where id = '${depID}'
        `)
    let main = await getMain(type);
    let autolvl = await getAllautoLvl(main)
    let childs = await getAll(depID);
    for(let child of childs){
        let match = autolvl.filter(i => i.id === child.id);
        if(match.length > 0){
            await db.query(`update etalon.deps set funcblock = '${parent.rows[0].funcblock}', lvl = ${match[0].level} where id = '${child.id}'`)
        }
    }
   
}

async function delDep(id){
    try{
        await db.query(`update etalon.deps set show = false where id = '${id}'`)
    }catch(e){
        console.log(e)
    }
}

async function updateFlat(id, flat, type){
    try{
        if(type === 'flat'){
          await db.query(`update etalon.deps set flat = ${flat} where id = '${id}'`)
        }else{
            await db.query(`update etalon.deps set subpart = ${flat} where id = '${id}'`)
        }
    }catch(e){
        consolr.log(e)
    }
}

async function changeNote(noteId, depId, type){
    if(type === 'unit'){
        let check = await db.query(`select * from etalon.footnote_units where unitid = '${depId}' and footid = '${noteId}'`)
        if(check.rows.length > 0){
            await db.query(`delete from etalon.footnote_units where unitid = '${depId}' and footid = '${noteId}'`)
        }else{
            await db.query(`insert into etalon.footnote_units (unitid, footid) values ('${depId}','${noteId}')`)
        }
    }
    if(type === 'dep'){
        let check = await db.query(`select * from etalon.footnote_deps where depid = '${depId}' and footid = '${noteId}'`)
        if(check.rows.length > 0){
            await db.query(`delete from etalon.footnote_deps where depid = '${depId}' and footid = '${noteId}'`)
        }else{
            await db.query(`insert into etalon.footnote_deps (depid, footid) values ('${depId}','${noteId}')`)
        }
    }
}

async function footInfo(name, arr, type){
        let res = await db.query(`select * from footnote.footnote where id = ANY(($1::uuid[]))`, [arr]);
        return res.rows
}

async function getOneDep(id){
    try{
        let res = await db.query(`select * from etalon.deps where id = '${id}' `)
        return res.rows[0]
    }catch(e){
        console.log(e)
        return {name: 'не найден', type: 'gosb'}
    }
}
module.exports = {
    getMain,
    getAll,
    getNotes,
    getUnits,
    getInfo,
    notes,
    unitAdd,
    unitUpdate,
    dellUser,
    getDeps,
    depNameUpdate,
    addDep,
    textUpdate,
    getAllDeps,
    changeParent,
    delDep,
    updateFlat,
    changeNote,
    footInfo,
    getOneDep
}