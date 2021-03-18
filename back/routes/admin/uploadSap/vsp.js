const db = require('../../../db/index');

const {
    save,
    dep_parse,
    recursive_children_fill
} = require('./help');

async function vsp_msk(json, file) {
    let vsp_msk = json.filter(item => item._20 === 'ВСП' && (item._7 === 'Аппарат банка' ||
        item._7 === 'Отделения МБ (на правах управлений)') && item._6 === 'Московский банк');

    let vsp_lvl3_msk = vsp_msk.filter(item => item._11 === 'Не присвоено' && item._10 !== 'Не присвоено');

    let final_lvl3_msk = {};
    for (let dep of vsp_lvl3_msk) {
        await dep_parse(final_lvl3_msk, dep, 3, 'vsp_msk', '_6',7)
    }

    for (let dep_key in final_lvl3_msk) {
        await save(final_lvl3_msk[dep_key], file)
    }

    let lvl3_msk = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'vsp_msk' and fileid = '${file.id}'`);
    for (let dep of lvl3_msk.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, vsp_msk, file, 'vsp_msk', '_6', 7)
    }
}

async function vsp_head(json, file) {
    let vsp_head = json.filter(item => item._20 === 'ВСП' && item._7 === 'Аппарат банка');

    let vsp_lvl3_head = vsp_head.filter(item => item._12 === 'Не присвоено' && item._11 !== 'Не присвоено');

    let final_lvl3_head  = {};
    for (let dep of vsp_lvl3_head ) {
        await dep_parse(final_lvl3_head, dep, 3, 'vsp_head', '_9',8)
    }

    for (let dep_key in final_lvl3_head ) {
        await save(final_lvl3_head[dep_key], file)
    }

    let lvl3_head  = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'vsp_head' and fileid = '${file.id}'`);
    for (let dep of lvl3_head .rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, vsp_head, file, 'vsp_head', '_9',8)
    }
}

async function vsp_gosb(json, file) {
    let vsp_gosb = json.filter(item => item._20 === 'ВСП' && item._7 === 'Отделения на правах филиалов');

    let vsp_lvl3_gosb = vsp_gosb.filter(item => item._11 === 'Не присвоено' && item._10 !== 'Не присвоено');

    let final_lvl3_gosb = {};
    for (let dep of vsp_lvl3_gosb) {
        await dep_parse(final_lvl3_gosb, dep, 3, 'vsp_gosb', '_8',7)
    }

    for (let dep_key in final_lvl3_gosb) {
        await save(final_lvl3_gosb[dep_key], file)
    }

    let lvl3_gosb = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'vsp_gosb' and fileid = '${file.id}'`);
    for (let dep of lvl3_gosb.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, vsp_gosb, file, 'vsp_gosb', '_8', 7)
    }
}

module.exports = {
    vsp_gosb,
    vsp_head,
    vsp_msk
};