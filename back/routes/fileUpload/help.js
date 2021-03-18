const db = require('../../db');
const {v4: uuidv4} = require('uuid');

async function tbGet(){
    let res = await db.query(`select * from dictionaries.deps where type = 'tb' order by name`);
    return res.rows;
}

async function typeGet(){
    let res = await db.query(`select * from allfiles.filetype order by type`);
    return res.rows;
}

async function getGosbs(id){
    let gosb = await db.query(`select * from dictionaries.deps where parent = '${id}' and type = 'gosb'`);
    let head = await db.query(`select * from dictionaries.deps where parent = '${id}' and type = 'head'`);

    return [...gosb.rows, ...head.rows];
}

async function getFiles(id){
    let res = await db.query(` select id, username, gosb, file_path, create_date :: text, filename, type, tb, ko_name, begin, done, fio, description from allfiles.allfiles where tb = '${id}'`)
    return res.rows
}

async function sendOnefile(id){
    let res = await db.query(`select * from allfiles.allfiles where id = '${id}'`);
    return res.rows[0]
}
async function addFileInfo(user, gosb, file_path, filename, type, tb, ko, begin, done, fio, description){
    let res = await db.query(`
        insert into allfiles.allfiles (id, username, gosb, file_path, create_date, filename, type, tb, ko_name, begin, done, fio, description)
        values
        ('${uuidv4()}','${user}', '${gosb}', '${file_path}', NOW(), '${filename}', '${type}', '${tb}', '${ko}', '${begin}', '${done}', '${fio}', '${description}');
    `)
}

async function fileDel(id){
    let res = await db.query(`delete from allfiles.allfiles where id = '${id}'`)
}

module.exports = {
    tbGet,
    typeGet,
    getGosbs,
    getFiles,
    addFileInfo,
    sendOnefile,
    fileDel
}