const db = require('../../../db/index');

const {
    save,
    upr_parse,
    dep_parse,
    recursive_children_fill,
    lvl2_connect,
    lvl3_connect
} = require('./help');

async function tb(json, file) {
    let tb = json.filter(item => item._8 === 'Подразделения аппарата банка' ||
        item._8 === 'ТОЕ РСЦ' &&
        item._20 !== 'ВСП');

    if (tb.length === 0) {
        return
    }

    let tb_upr = json.filter(item => item._7 === 'Руководство территориального банка');
    let tb_lvl3 = tb.filter(item => item._10 === 'Не присвоено' &&
        item._7 === 'Аппарат банка' &&
        item._9 !== 'Не присвоено');

    let final_upr_tb = {};
    for (let upr of tb_upr) {
        await upr_parse(final_upr_tb, upr, 'tb', '_6')
    }
    let final_lvl3_tb = {};
    for (let dep of tb_lvl3) {
        await dep_parse(final_lvl3_tb, dep, 3, 'tb', '_6',6)
    }

    for (let dep_key in final_upr_tb) {
        await save(final_upr_tb[dep_key], file)
    }
    for (let dep_key in final_lvl3_tb) {
        await save(final_lvl3_tb[dep_key], file)
    }

    await lvl2_connect('tb', file.id);

    await lvl3_connect('tb', file.id);

    let lvl3 = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'tb' and fileid = '${file.id}'`);
    for (let dep of lvl3.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, tb, file, 'tb', '_6',6)
    }
}

module.exports = {
    tb
};