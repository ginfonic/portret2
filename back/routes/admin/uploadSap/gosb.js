const db = require('../../../db/index');

const {
    save,
    upr_parse,
    dep_parse,
    recursive_children_fill,
    lvl2_connect,
    lvl3_connect,
} = require('./help');

async function gosb(json, file) {
    let gosb = json.filter(item => item._7 === 'Отделения на правах филиалов' &&
        (item._9 === 'Аппарат отделения' || item._9 === 'Руководство' ||
            item._9 === 'Отделения на правах подразделений' || item._10 === 'Руководство') && item._20 !== 'ВСП');

    if (gosb.length === 0) {
        return
    }

    let gosb_upr = gosb.filter(item => item._9 === 'Руководство' ||
        (item._10 === 'Руководство' && item._9 !== 'Отделения на правах подразделений'));
    let gosb_lvl3 = gosb.filter(item => item._11 === 'Не присвоено' &&
        (item._9 === 'Аппарат отделения' || item._9 === 'Отделения на правах подразделений') &&
        item._10 !== 'Не присвоено' && item._10 !== 'Руководство');

    //await wrong_gosb(json, file);

    let final_upr_tb = {};
    for (let upr of gosb_upr) {
        await upr_parse(final_upr_tb, upr, 'gosb', '_8')
    }
    let final_lvl3_tb = {};
    for (let dep of gosb_lvl3) {
        await dep_parse(final_lvl3_tb, dep, 3, 'gosb', '_8',7)
    }

    for (let dep_key in final_upr_tb) {
        await save(final_upr_tb[dep_key], file)
    }
    for (let dep_key in final_lvl3_tb) {
        await save(final_lvl3_tb[dep_key], file)
    }

    await lvl2_connect('gosb', file.id);

    await lvl3_connect('gosb', file.id);

    let lvl3 = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'gosb' and fileid = '${file.id}'`);
    for (let dep of lvl3.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, gosb, file, 'gosb', '_8',7)
    }
}

module.exports = {
    gosb
};