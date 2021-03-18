const db = require('../../db');


async function getColors(){
    try{
        let obj = {}
        let colors = await db.query(`select * from colors.color_main order by id`);
        for(let i of colors.rows){
            obj[i.id] = {color:i.color, name:i.unit, num:i.id}
        }
        return obj

    }catch(e){
        console.log(e)
    }
}

async function getColorEx(){
    try{
        let obj = {}
        let colors = await db.query(`select * from colors.color_ex order by id`);
        for(let i of colors.rows){
            obj[i.id] = {color:i.color, name:i.unit, num:i.id}
        }
        return obj

    }catch(e){
        console.log(e)
    }
}

async function lastDate(){
    try{
        let res = await db.query(`select max(date)::text from sap.deps`);
        if(res.rows[0].max){
            return res.rows[0].max
        }else{
            return '2020-11-01'
        }
        
    }catch(e){
        console.log(e)
        return '2020-01-01'
    }
}

async function allDates(){
    let res = await db.query(` select array_agg(distinct date) as date from sap.deps`);
    if(res.rows[0].date != null){
        return res.rows[0].date
    }else{
        return []
    }
}
module.exports = {
    getColors,
    getColorEx,
    lastDate,
    allDates
}