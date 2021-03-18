const db = require('../../../db');
const {lastDate} = require('../../initial/help');

let zam_variants = [
    'Зам.председателя–руководитель РСЦ',
    'Зам.управляющего-руководитель РСЦ',
    'Заместитель председателя',
    'Заместитель управляющего',
    'Заместитель председателя банка',
    'Заместитель председателя банка',
    'HR директор'
];

let sovet_check = (name) => {
    let regex = RegExp(".*совет.*", "i");
    return regex.test(name)
};

let zam_check = (name) => {
    let regex = RegExp(".*зам.*", "i");
    return zam_variants.indexOf(name) !== -1 || regex.test(name)
};

let helper_check = (name) => {
    let regex = RegExp(".*помощ.*", "i");
    return regex.test(name)
};

function dict_generator(array, newindex) {
    let obj = {};
    obj['Банк'] = newindex;
    for (let name of array) {
        obj[name] = 0;
    }
    return obj
}

async function gosb_upr() {
    let table = [];

    let date = await lastDate();
    let tbs = (
        await db.query(`select name from dictionaries.deps where type = 'gosb' or type = 'head' order by parent`)
    ).rows.map(item => item.name);

    let count = await db.query(`
    select main_sap.*, 
    (select SUM(state_count)::int as count
    from sap.r_units
    where
    dep_id = main_sap.id)

    from sap.deps as main_sap
        where main_sap.date = '${date}'
         and main_sap.lvl < 3
        and (type = 'gosb' or type = 'head')
    `);

    let uprRow = dict_generator(tbs, 'Управляющий');
    for (let index in uprRow) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (row.lvl === 1) {
                    uprRow[index] += row.count;
                }
            }
        }
    }
    table.push(uprRow);

    let zam = dict_generator(tbs, 'Зам председателя');
    for (let index in zam) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (zam_check(row.depname)) {
                    zam[index] += row.count;
                }
            }
        }
    }
    table.push(zam);

    let sovet = dict_generator(tbs, 'Советник');
    for (let index in sovet) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (sovet_check(row.depname)) {
                    sovet[index] += row.count;
                }
            }
        }
    }
    table.push(sovet);

    let helper = dict_generator(tbs, 'Помощник');
    for (let index in helper) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (helper_check(row.depname)) {
                    helper[index] += row.count;
                }
            }
        }
    }
    table.push(helper);

    let others = dict_generator(tbs, 'Прочие');
    for (let index in others) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (!sovet_check(row.depname) && !helper_check(row.depname) &&
                    !zam_check(row.depname) && row.lvl !== 1) {
                    others[index] += row.count;
                }
            }
        }
    }
    table.push(others);
    return table
}

async function tb_upr() {
    let table = [];

    let date = await lastDate();
    let tbs = (
        await db.query(`select name from dictionaries.deps where type = 'tb'`)
    ).rows.map(item => item.name);

    let count = await db.query(`
    select main_sap.*, 
    (select SUM(state_count)::int as count
    from sap.r_units
    where
    dep_id = main_sap.id)

    from sap.deps as main_sap
        where
        main_sap.date = '${date}'
        and main_sap.lvl < 3
        and type = 'tb'
    `);

    let uprRow = dict_generator(tbs, 'Председатель');
    for (let index in uprRow) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (row.lvl === 1) {
                    uprRow[index] += row.count;
                }
            }
        }
    }
    table.push(uprRow);

    let zam = dict_generator(tbs, 'Зам председателя');
    for (let index in zam) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (zam_check(row.depname)) {
                    zam[index] += row.count;
                }
            }
        }
    }
    table.push(zam);

    let sovet = dict_generator(tbs, 'Советник');
    for (let index in sovet) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (sovet_check(row.depname)) {
                    sovet[index] += row.count;
                }
            }
        }
    }
    table.push(sovet);

    let helper = dict_generator(tbs, 'Помощник');
    for (let index in helper) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (helper_check(row.depname)) {
                    helper[index] += row.count;
                }
            }
        }
    }
    table.push(helper);

    let others = dict_generator(tbs, 'Прочие');
    for (let index in others) {
        if (index !== 'Банк') {
            let rows = count.rows.filter(item => item.bank === index);
            for (let row of rows) {
                if (!sovet_check(row.depname) && !helper_check(row.depname) &&
                    !zam_check(row.depname) && row.lvl !== 1) {
                    others[index] += row.count;
                }
            }
        }
    }
    table.push(others);

    return table
}

module.exports = {
    gosb_upr,
    tb_upr
};