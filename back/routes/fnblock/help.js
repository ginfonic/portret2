
const db = require('../../db');

async function getAll(){
    let res = await db.query(`select * from dictionaries.fnblock`);
    let notRes = await db.query(`
    select distinct funcblock as fnblock, 0 as type from sap.deps where funcblock not in (select fnblock from dictionaries.fnblock)`)
    return [...res.rows, ...notRes.rows]
}

async function updateBlock(type, fnblock){
   let search = await db.query(`select * from dictionaries.fnblock where fnblock= '${fnblock}'`)
   if(search.rows.length === 0){
       await db.query(`insert into dictionaries.fnblock (type, fnblock) values (${type}, '${fnblock}')`)
   }else{
       await db.query(`update dictionaries.fnblock set type = ${type} where fnblock= '${fnblock}'`)
   }
}
module.exports = {
    getAll,
    updateBlock
}