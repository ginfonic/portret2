const db = require('../../../db/index');

const {
    save,
    dep_parse,
    recursive_children_fill,
    dep_parse_no_units,
    save_no_units,
    dep_kic_check,
    kic_check
} = require('./help');

async function no_units_parse(array, file, type, bank_field, deplvl) {
    let kic_tb_lvl3 = array.filter(item => dep_kic_check(item[`_${deplvl + 3}`]) &&
        (type === 'kic_tb' ? item._7 === 'Аппарат банка' : item._7 === 'Отделения на правах филиалов'));

    let unic_names = new Set();
    for (let item of kic_tb_lvl3) {
        unic_names.add(item[`_${deplvl + 3}`])
    }

    unic_names = [...unic_names];
    for (let name of unic_names) {
        let not_blank = kic_tb_lvl3.filter(item => item[`_${deplvl + 3}`] === name &&
            item[`_${deplvl + 4}`] === 'Не присвоено');
        if (not_blank.length === 0) {
            let blank = kic_tb_lvl3.filter(item => item[`_${deplvl + 3}`] === name &&
                item[`_${deplvl + 4}`] !== 'Не присвоено');

            let final_lvl3_tb_no_units = {};
            for (let dep of blank) {
                await dep_parse_no_units(final_lvl3_tb_no_units, dep, 3, type, bank_field, deplvl)
            }

            for (let dep_key in final_lvl3_tb_no_units) {
                await save_no_units(final_lvl3_tb_no_units[dep_key], file)
            }
        }
    }
}

async function kic_tb(json, file) {
    let kic_tb_broken = json.filter(item => dep_kic_check(item._10) && item._7 === 'Аппарат банка');
    let kic_tb = json.filter(item => kic_check(item._8) && item._7 === 'Аппарат банка');

    await no_units_parse(json, file, 'kic_tb', '_6', 6);
    await no_units_parse(json, file, 'kic_tb', '_6', 7);

    //-----kic tb broken----------------------------
    let kic_tb_broken_lvl3 = kic_tb_broken.filter(item => item._11 === 'Не присвоено' && item._10 !== 'Не присвоено');

    let final_lvl3_tb_broken = {};
    for (let dep of kic_tb_broken_lvl3) {
        await dep_parse(final_lvl3_tb_broken, dep, 3, 'kic_tb', '_6',7)
    }

    for (let dep_key in final_lvl3_tb_broken) {
        await save(final_lvl3_tb_broken[dep_key], file)
    }

    let lvl3_tb_broken = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'kic_tb' and fileid = '${file.id}'`);
    for (let dep of lvl3_tb_broken.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, kic_tb_broken, file, 'kic_tb', '_6',7)
    }
    //---------------------------------
    //--------kic tb------------------
    let kic_tb_lvl3 = kic_tb.filter(item => item._10 === 'Не присвоено' && item._9 !== 'Не присвоено');

    let final_lvl3_tb = {};
    for (let dep of kic_tb_lvl3) {
        await dep_parse(final_lvl3_tb, dep, 3, 'kic_tb', '_6',6)
    }

    for (let dep_key in final_lvl3_tb) {
        await save(final_lvl3_tb[dep_key], file)
    }

    let lvl3_tb = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'kic_tb' and fileid = '${file.id}'`);
    for (let dep of lvl3_tb.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, kic_tb, file, 'kic_tb', '_6',6)
    }
}

async function kic_gosb(json, file) {
    let kic_gosb = json.filter(item => kic_check(item._9) && item._7 === 'Отделения на правах филиалов');

    await no_units_parse(json, file, 'kic_gosb', '_8', 7);

    let kic_gosb_lvl3 = kic_gosb.filter(item => item._11 === 'Не присвоено' && item._10 !== 'Не присвоено');

    let final_lvl3_gosb = {};
    for (let dep of kic_gosb_lvl3) {
        await dep_parse(final_lvl3_gosb, dep, 3, 'kic_gosb', '_8',7)
    }

    for (let dep_key in final_lvl3_gosb) {
        await save(final_lvl3_gosb[dep_key], file)
    }

    let lvl3 = await db.query(`select depname, funcblock, lvl, bank, id from sap.deps where lvl = 3 and type = 'kic_gosb' and fileid = '${file.id}'`);
    for (let dep of lvl3.rows) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, kic_gosb, file, 'kic_gosb', '_8',7)
    }
}

module.exports = {
    kic_tb,
    kic_gosb,
};