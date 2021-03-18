const db = require('../../db');

async function getDeps(){
    let deps = {};
    let res = await db.query(`select * from dictionaries.deps group by type, deps.id order by name`);
    deps['tb'] = res.rows.filter(i => i.type === 'tb');
    deps['gosb'] = res.rows.filter(i => i.type === 'gosb');
    deps['head'] = res.rows.filter(i => i.type === 'head');
    return deps;
}

async function getAllDeps(type){
    if(type === 'gosb'){
        let arr = [];
        let res = await db.query(`select id, name from dictionaries.deps where type = 'tb' and name != 'Московский банк'`);
        for(let i of res.rows){
            let gosbs = await db.query(`select array_agg(name) as gosb from dictionaries.deps where parent = '${i.id}'`);
            arr.push({tb:i.name, gosb:gosbs.rows[0].gosb})
        }
        return arr
    }else{
        let tbs = await db.query(`select array_agg(name) as tb from dictionaries.deps where type = 'tb'`);
        return tbs.rows[0].tb
    }
}

async function getGosb(tb){
    let res = await db.query(`select array_agg(distinct name) as gosbs from dictionaries.deps where parent = (select id from dictionaries.deps where name = '${tb}')`)
    if(res.rows[0].gosbs){
        return res.rows[0].gosbs
    }else{
        return []
    }
}
module.exports = {
    getDeps,
    getAllDeps,
    getGosb
}