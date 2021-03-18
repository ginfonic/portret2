const db = require('../../db');
const { v4: uuidv4 } = require('uuid');


async function getAll(){
    let res = await db.query(`select * from footnote.footnote order by num`);
    return res.rows;
}

async function addNote(num, text){
    try{
        await db.query(`insert into footnote.footnote (id, num, text) values ('${uuidv4()}', ${num}, '${text}')`)
        return true
    }catch(e){
        console.log(e)
    }
}

async function dellNote(id){
    try{
        await db.query(`delete from footnote.footnote where id= '${id}'`);
        await db.query(`delete from etalon.footnote_deps where footid= '${id}'`);
        await db.query(`delete from etalon.footnote_units where footid= '${id}'`)
    }catch(e){
        console.log(e)
    }
}

async function updateNote(id, num, text){
    try{
        await db.query(`update footnote.footnote set num = ${num}, text= '${text}' where id = '${id}'`)
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    getAll,
    addNote,
    dellNote,
    updateNote
}