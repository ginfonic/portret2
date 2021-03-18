const db = require('../../db');

async function getColors(main){
    let color_data = await db.query(`select * from colors.color_${main ? 'main' : 'ex'} order by id`);
    return color_data.rows
}

async function redactColor(color, unit, if_redact, main){
    if (if_redact) {
        await db.query(`UPDATE colors.color_${main ? 'main' : 'ex'} SET color = '${color}', unit = '${unit}' WHERE id = ${if_redact.id}`);
        let color_data = await db.query(`select * from colors.color_${main ? 'main' : 'ex'} order by id`);
        return color_data.rows
    }
}

async function addColor(color, unit, if_redact, main){

    if (if_redact) {
        await db.query(`UPDATE colors.color_${main ? 'main' : 'ex'} SET color = '${color}', unit = '${unit}' WHERE id = ${if_redact.id}`);
        let color_data = await db.query(`select * from colors.color_${main ? 'main' : 'ex'} order by id`);
        return color_data.rows
    }else{
        await db.query(`INSERT INTO colors.color_${main ? 'main' : 'ex'} (color, unit) VALUES ('${color}', '${unit}')`);
        let color_data = await db.query(`select * from colors.color_${main ? 'main' : 'ex'} order by id`);
        return color_data.rows;
    }
}

async function delColor(id, main){
    if (id) {
        await db.query(`DELETE FROM colors.color_${main ? 'main' : 'ex'} WHERE id = ${id}`);
        let color_data = await db.query(`select * from colors.color_${main ? 'main' : 'ex'} order by id`);
        return color_data.rows;
    }
}

module.exports = {
    getColors,
    redactColor,
    addColor,
    delColor
}