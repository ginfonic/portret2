const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

async function addOrder(num, date, name, text, id){
    try{
        await db.query(`
        insert into etalon.orders (id, name, date, text, num, depid)
        values ('${uuidv4()}', '${name}', '${date}', '${text}','${num}','${id}')
        `)
    }catch(e){
        console.log(e)
    }
}

async function delOrder(id){
    try{
        await db.query(`delete from etalon.orders where id = '${id}'`)
    }catch(e){
        console.log(e)
    }
}

async function updateOrder(num, date, name, text, id){
    try{
        await db.query(`update etalon.orders set num = '${num}', date = '${date}', name = '${name}', text = '${text}' where id = '${id}' `)
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    addOrder,
    delOrder,
    updateOrder
}