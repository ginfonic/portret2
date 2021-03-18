const db = require('../../../db/index');

const {
    save,
    upr_parse,
    dep_parse,
    recursive_children_fill,
    lvl2_connect,
    lvl3_connect,
    upr_check
} = require('./help');

async function head(json, file) {
    let gosb = json.filter(item => (item._8 === 'Головные отделения' || item._8 === 'Отделения') &&
        (item._10 === 'Аппарат отделения' || item._10 === 'Руководство' || item._10 === 'ТОЕ РСЦ' ||
            upr_check(item._27)) && item._20 !== 'ВСП');

    if (gosb.length === 0) {
        return
    }

    let gosb_upr = gosb.filter(item => item._10 === 'Руководство' ||
        (item._10 === 'Не присвоено' && upr_check(item._27)));
    let gosb_lvl3 = gosb.filter(item => item._12 === 'Не присвоено' && item._10 === 'Аппарат отделения' && item._11 !== 'Не присвоено');

    let final_upr_tb = {};
    for (let upr of gosb_upr) {
        await upr_parse(final_upr_tb, upr, 'head', '_9')
    }
    let final_lvl3_tb = {};
    for (let dep of gosb_lvl3) {
        await dep_parse(final_lvl3_tb, dep, 3, 'head', '_9', 8)
    }

    for (let dep_key in final_upr_tb) {
        await save(final_upr_tb[dep_key], file)
    }
    for (let dep_key in final_lvl3_tb) {
        await save(final_lvl3_tb[dep_key], file)
    }

    await lvl2_connect('head', file.id);

    await lvl3_connect('head', file.id);

    let lvl3 = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'head' and fileid = '${file.id}'`);
    for (let dep of lvl3.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, gosb, file, 'head', '_9', 8)
    }
}

module.exports = {
    head
};