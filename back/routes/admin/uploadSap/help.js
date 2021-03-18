const db = require('../../../db/index');
const uuid = require('uuid');

let kic_array = [
    'Подразделение инкассации и перевозки ценностей',
    'Подразделение кассовых операций / операционной работы / кассовых операций и операционной работы',
    'Операционный офис-Кассово-инкассаторский центр (КИЦ)',
    'Административное подразделение',
    'Подразделение кассовых операций/операционной работы/ кассовых операций и операционной работы',
    'ОО Кассово-инкассаторский центр',
    'Операционный офис Кассово-инкас.центр',
    'Операционный офис Кассово-инкас центр',
    'Опер. офис кассово-инкассаторский центр',
    'Операционный офис-кассово-инкасс центр',
    'Операционный офис-кассово-инкассат центр',
    'Операционный офис - кассовый центр'
    //'Упраздненные подразделения/должности',
];

let kic_check = (name) => {
    let regex = RegExp(".*киц.*", "i");
    let regex2 = RegExp(".*касс.*инкас.*центр", "i");
    return kic_array.indexOf(name) !== -1 || regex.test(name) || regex2.test(name)
};

let dep_kic_check = (name) => {
    let regex = RegExp(".*киц.*", "i");
    let regex2 = RegExp(".*кас.*инкас.*центр", "i");
    return regex.test(name) || regex2.test(name)
};

let upr_check = (name) => {
    let regex = RegExp(".*руковод.*", "i");
    return regex.test(name)
};

function real_unit_obj(dep) {
    return {
        urm: dep['УРМ'] === 'X',
        addr_city_code: dep['Адрес: город'],
        addr_city: dep._28,
        addr_punct_code: dep['Адрес: насел. пункт'],
        addr_punct: dep._29,
        outstate: dep['Заштатный сотрудник'] !== '#',
        state_count: dep['Штатная численность'] || 0,
        taken_wage_rate: dep['Занятая ставка'] || 0,
        vacancy: dep['Вакансии'] || 0,
        actual_count: dep['Фактическая численность'] || 0,
        state_upr_count: dep['Штатная численность руководителей'] || 0,
        state_specialist_count: dep['Штатная численность специалистов'] || 0,
        upr_norm: dep['Норма управляемости'] || 0,
        vacancy_date: dep['Дата возникновения вакансии'] !== '#' ? new Date(dep['Дата возникновения вакансии'].replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1')).toDateString() : null,
    }
}

async function save_units(units_obj, dep_id) {
    for (let key in units_obj) {
        if (units_obj.hasOwnProperty(key)) {
            let unit_id = uuid.v4();
            await db.query(`insert into sap.a_units (id, dep_id, state_name, unit_name, type_state_unit) values (
                '${unit_id}',
                '${dep_id}',
                '${units_obj[key].state_name}',
                '${units_obj[key].unit_name}',
                '${units_obj[key].type_state_unit}'
                )`);
            for (let real_unit of units_obj[key].real_units) {
                await db.query(`insert into sap.r_units (
                    id,
                     unit_id,
                      urm,
                       addr_city_code,
                        addr_city,
                         addr_punct_code,
                          addr_punct,
                           outstate,
                            state_count,
                             taken_wage_rate,
                              vacancy,
                               actual_count,
                                state_upr_count,
                                 state_specialist_count,
                                  upr_norm,
                                   vacancy_date,
                                    dep_id
                                   )
                    values (
                    '${uuid.v4()}',
                    '${unit_id}',
                    ${real_unit.urm},
                    '${real_unit.addr_city_code}',
                    '${real_unit.addr_city}',
                    '${real_unit.addr_punct_code}',
                    '${real_unit.addr_punct}',
                    ${real_unit.outstate},
                    ${real_unit.state_count},
                    ${real_unit.taken_wage_rate},
                    ${real_unit.vacancy},
                    ${real_unit.actual_count},
                    ${real_unit.state_upr_count},
                    ${real_unit.state_specialist_count},
                    ${real_unit.upr_norm},
                    ${real_unit.vacancy_date === null ? 'null' : `'${real_unit.vacancy_date}'`},
                    '${dep_id}'
                    )`).catch(err => {
                        console.log(err);
                        console.log(`insert into sap.r_units (
                    id,
                     unit_id,
                      urm,
                       addr_city_code,
                        addr_city,
                         addr_punct_code,
                          addr_punct,
                           outstate,
                            state_count,
                             taken_wage_rate,
                              vacancy,
                               actual_count,
                                state_upr_count,
                                 state_specialist_count,
                                  upr_norm,
                                   vacancy_date
                                   )
                    values (
                    '${uuid.v4()}',
                    '${unit_id}',
                    ${real_unit.urm},
                    '${real_unit.addr_city_code}',
                    '${real_unit.addr_city}',
                    '${real_unit.addr_punct_code}',
                    '${real_unit.addr_punct}',
                    ${real_unit.outstate},
                    ${real_unit.state_count},
                    ${real_unit.taken_wage_rate},
                    ${real_unit.vacancy},
                    ${real_unit.actual_count},
                    ${real_unit.state_upr_count},
                    ${real_unit.state_specialist_count},
                    ${real_unit.upr_norm},
                    ${real_unit.vacancy_date === null ? 'null' : `'${real_unit.vacancy_date}'`}
                    )`)
                })
            }
        }
    }
}

async function save(array_to_save, file) {
    for (let dep of array_to_save) {
        const dep_id = uuid.v4();
        await db.query(`insert into sap.deps (id, depname, funcblock, lvl, typedep, date, fileid, type, bank) values (
            '${dep_id}',
            '${dep.depname}',
            '${dep.funcblock}',
            ${dep.lvl},
            '${dep.typedep}',
            '${file.date}',
            '${file.id}',
            '${dep.type}',
            '${dep.bank}'
            )`);
        await save_units(dep.abstract_units, dep_id)
    }
}

async function blockChecker(block, name){
    let res = await db.query(`
            SELECT newblock FROM dictionaries.move
            WHERE name = '${name}'
        `);
    if(res.rows.length > 0){
        return res.rows[0].newblock
    }else{
        return block
    }
}

function parse_units(final, dep, dep_field, bank_field) {
    for (let func_dep of final[dep[dep_field]]) {
        if (func_dep.oldblock === dep._19 && dep[bank_field] === func_dep.bank) {
            if (!func_dep.abstract_units) {
                func_dep.abstract_units = []
            }
            if (!func_dep.abstract_units[dep._2]) {
                func_dep.abstract_units[dep._2] = {
                    state_name: dep._1,
                    unit_name: dep._2,
                    type_state_unit: dep._3,
                    real_units: [real_unit_obj(dep)]
                }
            }
            else {
                func_dep.abstract_units[dep._2].real_units.push(real_unit_obj(dep))
            }
        }
    }
}

let zam_check = (name) => {
    let regex = RegExp(".*зам.*", "i");
    return regex.test(name) || name === 'Региональный директор'
};

async function upr_parse(final, upr, type, bank_field) {
    if (!final[upr._2]) {
        final[upr._2] = [];
    }
    if (final[upr._2].filter(item => item.oldblock === upr._19 && upr[bank_field] === item.bank).length === 0) {
        final[upr._2].push({
            depname: upr._2,
            funcblock: await blockChecker(upr._19, upr._2),
            lvl: upr._19 === 'Руководство ТБ' && !zam_check(upr._2) ? 1 : 2,
            typedep: upr._27,
            bank: upr[bank_field],
            type: type,
            oldblock: upr._19,
        })
    }
    parse_units(final, upr, '_2', bank_field)
}

async function dep_parse(final, dep, lvl, type, bank_field, deplvl) {
    if (!(type === 'kic_tb' || type === 'kic_gosb') && dep_kic_check(dep[`_${deplvl + lvl}`])) {
        return
    }

    try {
        if (!final[dep[`_${deplvl + lvl}`]]) {
            final[dep[`_${deplvl + lvl}`]] = [];
        }
    }
    catch (err) {
        console.log(dep);
        return
    }
    if (final[dep[`_${deplvl + lvl}`]].filter(item => item.oldblock === dep._19 && dep[bank_field] === item.bank).length === 0) {
        final[dep[`_${deplvl + lvl}`]].push({
            depname: dep[`_${deplvl + lvl}`],
            funcblock: await blockChecker(dep._19, dep[`_${deplvl + lvl}`]),
            lvl: lvl,
            typedep: dep._27,
            bank: dep[bank_field],
            type: type,
            oldblock: dep._19,
        })
    }
    parse_units(final, dep, `_${deplvl + lvl}`, bank_field)
}

async function save_no_units(array_to_save, file) {
    for (let dep of array_to_save) {
        const dep_id = uuid.v4();
        await db.query(`insert into sap.deps (id, depname, funcblock, lvl, typedep, date, fileid, type, bank) values (
            '${dep_id}',
            '${dep.depname}',
            '${dep.funcblock}',
            ${dep.lvl},
            '${dep.typedep}',
            '${file.date}',
            '${file.id}',
            '${dep.type}',
            '${dep.bank}'
            )`);
    }
}

async function dep_parse_no_units(final, dep, lvl, type, bank_field, deplvl) {
    try {
        if (!final[dep[`_${deplvl + lvl}`]]) {
            final[dep[`_${deplvl + lvl}`]] = [];
        }
    }
    catch (err) {
        console.log(dep);
        return
    }
    if (final[dep[`_${deplvl + lvl}`]].filter(item => item.oldblock === dep._19 && dep[bank_field] === item.bank).length === 0) {
        final[dep[`_${deplvl + lvl}`]].push({
            depname: dep[`_${deplvl + lvl}`],
            funcblock: await blockChecker(dep._19, dep[`_${deplvl + lvl}`]),
            lvl: lvl,
            typedep: dep._27,
            bank: dep[bank_field],
            type: type,
            oldblock: dep._19,
        })
    }
}

async function recursive_children_fill(depname, lvl, funcblock, bank, id, json, file, type, bank_field, deplvl) {
    let tb_array = json.filter(item => item[`_${deplvl + 2 + lvl}`] === 'Не присвоено' &&
        item[`_${deplvl + lvl}`] === depname &&
        item[`_${deplvl + 1 + lvl}`] !== 'Не присвоено' &&
        item[bank_field] === bank);

    if (tb_array.length === 0) {
        return
    }

    let final_lvl = {};
    for (let dep of tb_array) {
        await dep_parse(final_lvl, dep, lvl + 1, type, bank_field,deplvl)
    }

    let new_lvls = [];
    for (let dep_key in final_lvl) {
        for (let dep of final_lvl[dep_key]) {
            const new_id = uuid.v4();
            let new_lvls_rows = await db.query(`insert into sap.deps (id, depname, funcblock, lvl, typedep, parent, date, fileid, type, bank) values (
            '${new_id}',
            '${dep.depname}',
            '${dep.funcblock}',
            ${dep.lvl},
            '${dep.typedep}',
            '${id}',
            '${file.date}',
            '${file.id}',
            '${dep.type}',
            '${dep.bank}'
            ) returning *`);

            await save_units(dep.abstract_units, new_id);

            new_lvls = [...new_lvls, ...new_lvls_rows.rows]
        }
    }

    for (let dep of new_lvls) {
        await recursive_children_fill(dep.depname, dep.lvl, dep.funcblock, dep.bank, dep.id, json, file, type, bank_field, deplvl)
    }
}

async function lvl2_connect(type, file_id) {
    let lvl1_id_query = await db.query(`select id, bank from sap.deps 
    where lvl = 1 and fileid = '${file_id}' and type = '${type}'`);
    for (let upr of lvl1_id_query.rows) {
        let lvl2_ids = await db.query(`select id from sap.deps 
        where lvl = 2 and fileid = '${file_id}' and type = '${type}' and bank = '${upr.bank}'`);
        await db.query(`update sap.deps set parent = '${upr.id}' where id = ANY($1)`, [lvl2_ids.rows.map(item => item.id)])
    }
}

async function lvl3_connect(type, file_id) {
    let lvl2 = await db.query(`select id, funcblock, bank from sap.deps 
    where lvl = 2 and type = '${type}' and fileid = '${file_id}'`);
    for (let upr of lvl2.rows) {
        let lvl2_funcblock_slaves = await db.query(`select id from sap.deps 
        where lvl = 3 and type = '${type}' and funcblock in 
        (select sap from dictionaries.sap_etalon_funcblocks where etalon in 
        (select etalon from dictionaries.sap_etalon_funcblocks where sap = '${upr.funcblock}'))
        and bank = '${upr.bank}' and fileid = '${file_id}'`);
        await db.query(`update sap.deps set parent = '${upr.id}' where id = ANY($1)`,
            [lvl2_funcblock_slaves.rows.map(item => item.id)])
    }
}

module.exports = {
    save,
    upr_parse,
    dep_parse,
    recursive_children_fill,
    lvl2_connect,
    lvl3_connect,
    dep_parse_no_units,
    save_no_units,
    kic_check,
    dep_kic_check,
    upr_check
};