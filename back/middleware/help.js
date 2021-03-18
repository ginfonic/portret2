const db = require('../db');
const config = require('../serverConfig');

//определить пренадлежность роли к приложению
async function getRoles(arr){
    const prefx = config.rolePrefix;
    const postfx = config.rolePostfix;
    let data = await db.query(`select * from auth.sudir_roles`);
    let obj = {};
    for(let i of data.rows){
        obj[`${prefx}${i.role_name}${postfx}`] = {name: i.role_name, desc: i.role_desc, id: i.role_id}
    }
    for(let i of arr){
        let check = obj[i]
        if(check != undefined){
            return obj[i]
        }
    }
    return {name: 'guest', desc: 'Гость', id: 0}
}


//log
async function logPart(obj){
    db.query(`
        delete from auth.users where id = '${obj.user.id}';
        insert into auth.users (id, name, tb_id, gosb_id, sudir_roles) values (
        '${obj.user.id}',
        '${obj.user.name}',
        ${obj.user.tb_id},
        ${obj.user.gosb_id},
        '${obj.user.role.desc}'
        )`)
}


module.exports = {
    getRoles,
    logPart
}