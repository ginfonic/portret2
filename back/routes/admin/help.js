const db = require('../../db/index');
const wuzzy = require('wuzzy');

let regex = RegExp(".*урм.*", "i");
const {kic_check} = require('./uploadSap/help');

async function file_fields_json(json, bank) {
    let file_fields_change = await db.query(`select * from sap.file_fields_change where bank = '${bank}'`);
    for (let change of file_fields_change.rows) {
        if (change.type === 1) {
            json = json.map((item) => {
                if (item[change.index] === change.name) {
                    item[change.index] = change.change_to;
                }
                return item
            });
        }
        else if (change.type === 2) {
            json = json.map((item) => {
                if (item[change.index] === change.name) {
                    item._20 = 'ВСП';
                }
                return item
            });
        }
    }
    return json
}

async function fieldsParse(json, bank) {
    const errors = [];

    json = json.filter(item => item._20 !== 'ВСП');

    let _7 = [
        'Руководство территориального банка',
        'Аппарат банка',
        'Отделения на правах филиалов',
        'Отделения МБ (на правах управлений)'
    ];

    let _8 = [
        'ТОЕ РСЦ',
        'Подразделения аппарата банка',
        'Головные отделения',
        'Отделения',
        'Подразделения МБ',
        'КИЦ',
        'Не присвоено',
        'Руководство территориального банка'
    ];

    let _9 = [
        'Аппарат отделения',
        'Руководство',
        'Отделения на правах подразделений',
        'КИЦ',
    ];

    let _10 = [
        'ТОЕ РСЦ',
        'Руководство',
        'Аппарат отделения',
        'Не присвоено'
    ];

    let banks = await db.query(`select distinct name, type from dictionaries.deps`);
    let tbs = banks.rows.filter(item => item.type === 'tb').map(item => item.name);
    let gosbs = banks.rows.filter(item => item.type === 'gosb').map(item => item.name);
    let heads = banks.rows.filter(item => item.type === 'head').map(item => item.name);

    const all_6 = new Set(json.map(item => item._6));

    for (let item of all_6) {
        if (tbs.indexOf(item) === -1) {
            errors.push({
                name: item,
                index: '_6',
                variants: [bank]
            })
        }
    }

    const all_7 = new Set(json.map(item => item._7));

    for (let item of all_7) {
        if (_7.indexOf(item) === -1) {
            errors.push({
                name: item,
                index: '_7',
                variants: [..._7]
            })
        }
    }

    const all_8 = new Set(json.map(item => item._8));

    for (let item of all_8) {
        if (_8.indexOf(item) === -1 &&
            gosbs.indexOf(item) === -1 &&
            !kic_check(item) &&
            !regex.test(item)) {
            errors.push({
                name: item,
                index: '_8',
                variants: [..._8, ...gosbs]
            })
        }
    }

    const gosb_9 = new Set(json.filter(item => item._7 === 'Отделения на правах филиалов').map(item => item._9));

    for (let item of gosb_9) {
        if (_9.indexOf(item) === -1 && !kic_check(item)) {
            errors.push({
                name: item,
                index: '_9',
                variants: [..._9]
            })
        }
    }

    const head_json = json.filter(item => item._8 === 'Головные отделения' || item._8 === 'Отделения');

    const head_9 = new Set(head_json.map(item => item._9));

    for (let item of head_9) {
        if (heads.indexOf(item) === -1 && !kic_check(item)) {
            errors.push({
                name: item,
                index: '_9',
                variants: [...heads],
            })
        }
    }

    const head_10 = new Set(head_json.map(item => item._10));

    for (let item of head_10) {
        if (_10.indexOf(item) === -1 && !regex.test(item)) {
            errors.push({
                name: item,
                index: '_10',
                variants: [..._10],
            })
        }
    }

    return errors
}

function pre_load_urm_fill(cutDeps, obj, type) {
    let a = 0;
    while (a + obj.startDeps <= 18) {
        let obj_index = `_${obj.startDeps + a}`;

        for (let item of obj[obj_index]) {
            if (regex.test(item)) {
                if (cutDeps[type][obj_index].indexOf(item) === -1) {
                    cutDeps[type][obj_index].push(item);
                }
            }
        }
        a +=1;
    }

    return cutDeps
}

function pre_load_helpers(helpers, obj, json, type) {
    let a = 0;
    while (a + obj.startDeps <= 18) {
        let obj_index = `_${obj.startDeps + a}`;

        for (let item of obj[obj_index]) {
            let filtered_json = json.filter(json_item => json_item[obj_index] === item);
            let filtered_normal = filtered_json.filter(json_item =>
                json_item[`_${obj.startDeps + a + 1}`] === 'Не присвоено' ||
                regex.test(json_item[`_${obj.startDeps + a + 1}`]));
            if (filtered_normal.length === 0 && helpers[type][obj_index].indexOf(item) === -1) {
                let filtered_3 = filtered_json.filter(json_item =>
                    json_item[`_${obj.startDeps + a + 2}`] !== 'Не присвоено' ||
                    !regex.test(json_item[`_${obj.startDeps + a + 2}`]));
                if (filtered_3.length !== 0) {
                    helpers[type][obj_index].push(
                        {
                            name: item,
                            label: `${filtered_3[0][obj_index]} - ${filtered_3[0][`_${obj.startDeps + a + 1}`]} - ${filtered_3[0][`_${obj.startDeps + a + 2}`]}`
                        });
                }
                else {
                    helpers[type][obj_index].push(
                        {
                            name: item,
                            label: `${filtered_json[0][obj_index]} - ${filtered_json[0][`_${obj.startDeps + a + 1}`]}`
                        });
                }
            }
        }

        a +=1;
    }

    return helpers
}

async function best_matches() {
    await db.query(`delete from match.best_matches`);

    //tb
    let sap_tb = await db.query(`select distinct sap.deps.* 
        from sap.deps
        inner join sap.r_units on sap.r_units.outstate = false and sap.r_units.dep_id = sap.deps.id
        where type = 'tb'`);

    for (let sap_dep of sap_tb.rows) {
        let etalon = await db.query(`select name, id from etalon.deps 
        inner join dictionaries.sap_etalon_funcblocks as f on f.etalon = etalon.deps.funcblock
        where type = 'tb' and f.sap = '${sap_dep.funcblock}'`);

        let best = {
            match_rate: 0,
            levenstein: 0,
            ngram: 0,
            id: null,
        };
        for (let etalon_dep of etalon.rows) {
            let new_levenstein = wuzzy.levenshtein(sap_dep.depname, etalon_dep.name);
            let new_ngram = wuzzy.ngram(sap_dep.depname, etalon_dep.name);
            let new_match_rate = (new_levenstein + new_ngram) / 2;

            if (new_match_rate > best.match_rate) {
                best.match_rate = new_match_rate;
                best.levenstein = new_levenstein;
                best.ngram = new_ngram;
                best.id = etalon_dep.id;
            }
        }
        if (best.id !== null && best.match_rate > 0.4) {
            await db.query(`insert into match.best_matches
            (sap_id, etalon_id, match_rate, levenstein, ngram) values (
            '${sap_dep.id}',
            '${best.id}',
            ${Math.round(best.match_rate * 100)},
            ${Math.round(best.levenstein * 100)},
            ${Math.round(best.ngram * 100)}
            )`);
        }
    }

    //gosb head
    let sap_gosb = await db.query(`select distinct sap.deps.* 
        from sap.deps
        inner join sap.r_units on sap.r_units.outstate = false and sap.r_units.dep_id = sap.deps.id
        where type = 'gosb' or type = 'head'`);

    for (let sap_dep of sap_gosb.rows) {
        let etalon = await db.query(`select name, id from etalon.deps 
        inner join dictionaries.sap_etalon_funcblocks as f on f.etalon = etalon.deps.funcblock
        where type = 'gosb' and f.sap = '${sap_dep.funcblock}'`);

        let best = {
            match_rate: 0,
            levenstein: 0,
            ngram: 0,
            id: null,
        };
        for (let etalon_dep of etalon.rows) {
            let new_levenstein = wuzzy.levenshtein(sap_dep.depname, etalon_dep.name);
            let new_ngram = wuzzy.ngram(sap_dep.depname, etalon_dep.name);
            let new_match_rate = (new_levenstein + new_ngram) / 2;

            if (new_match_rate > best.match_rate) {
                best.match_rate = new_match_rate;
                best.levenstein = new_levenstein;
                best.ngram = new_ngram;
                best.id = etalon_dep.id;
            }
        }
        if (best.id !== null && best.match_rate > 0.4) {
            await db.query(`insert into match.best_matches
            (sap_id, etalon_id, match_rate, levenstein, ngram) values (
            '${sap_dep.id}',
            '${best.id}',
            ${Math.round(((best.match_rate - 40) / 60) * 100)},
            ${Math.round(best.levenstein * 100)},
            ${Math.round(best.ngram * 100)}
            )`);
        }
    }
}

async function sap_matching_update(id) {
    let saved = await db.query(`select * from match.saved`);
    let file_deps = await db.query(`select * from sap.deps where fileid = '${id}'`);
    let all_errors_data = await db.query(`select id from sap.errors`);
    let all_errors = all_errors_data.rows.map(item => item.id);
    let all_errors_unit_data = await db.query(`select id from sap.unit_errors`);
    let all_errors_unit = all_errors_unit_data.rows.map(item => item.id);

    for (let dep of file_deps.rows) {
        //filter to know if saved item === match item
        let match_items = saved.rows.filter(item =>
            item.depname === dep.depname &&
            item.lvl === dep.lvl &&
            item.funcblock === dep.funcblock &&
            item.bank === dep.bank);
        // if there are some saved items
        if (match_items.length > 0) {
            //update connectedto and return later
            await db.query(`update sap.deps set connectedto = ${match_items[0].connectedto === null ?
                                 'null': `'${match_items[0].connectedto}'`}, 
                                 return_later = ${match_items[0].return_later} where id = '${dep.id}'`);
            //check if saved errors still exist
            let errors = await db.query(`select error_id from match.saved_errors 
                                              where saved_id = '${match_items[0].id}'`);
            for (let error of errors.rows) {
                if (all_errors.indexOf(error.error_id) !== -1) {
                    //if error exist, set error
                    await db.query(`insert into sap.errors_connections (error_id, sap_id) values (
                                         '${error.error_id}',
                                         '${dep.id}'
                                         )`);
                }
                else {
                    //if not, delete error from saved
                    await db.query(`delete from match.saved_errors where error_id = '${error.error_id}'`)
                }
            }

            //now start to check units --------------------------------------------------------------------------------
            let units = await db.query(`select * from sap.a_units where dep_id = '${dep.id}'`);
            let saved_units = await db.query(`select * from match.saved_units 
                                                   where saved_id = '${match_items[0].id}'`);
            for (let unit of units.rows) {
                //do the same things as we did to deps, but now for units
                let unit_items = saved_units.rows.filter(item => item.unit_name === unit.unit_name);
                if (unit_items.length > 0) {
                    //update connectedto, color, color_ex and return later in units
                    await db.query(`update sap.a_units set connectedto = ${unit_items[0].connectedto === null ?
                                         'null': `'${unit_items[0].connectedto}'`}, 
                                         return_later = ${unit_items[0].return_later}, color = ${unit_items[0].color},
                                         color_ex = ${unit_items[0].color_ex} where id = '${unit.id}'`);
                    //check if saved unit errors still exist
                    let unit_errors = await db.query(`select unit_error_id from match.saved_unit_errors 
                                                           where saved_unit_id = '${unit_items[0].id}'`);
                    for (let unit_error of unit_errors.rows) {
                        if (all_errors_unit.indexOf(unit_error.unit_error_id) !== -1) {
                            //if error exist, set error
                            await db.query(`insert into sap.unit_errors_connections (error_id, unit_id) values (
                                                 '${unit_error.unit_error_id}',
                                                 '${unit.id}'
                                                 )`);
                        }
                        else {
                            //if not, delete error from saved
                            await db.query(`delete from match.saved_unit_errors 
                                                 where unit_error_id = '${unit_error.unit_error_id}'`)
                        }
                    }

                    //if there are duplicate in saved units we need to get rid of them,
                    // just simply deleted all others except one first
                    if (unit_items.length > 1) {
                        let index = 1;
                        while (index <= unit_items.length) {
                            await db.query(`delete from match.saved_units where id = '${unit_items[index].id}'`);
                            index += 1;
                        }
                    }
                }
            }
            //units check---------------------------------------------------------------------------------------------

            if (match_items.length > 1) {
                //if there are duplicate in saved items we need to get rid of them,
                // just simply deleted all others except one first
                let index = 1;
                while (index <= match_items.length) {
                    await db.query(`delete from match.saved where id = '${match_items[index].id}'`);
                    index += 1;
                }
            }
        }
    }

    await db.query(`update sap.files set last_matching_update = NOW() where id = '${id}'`);
}

module.exports = {
    pre_load_urm_fill,
    best_matches,
    sap_matching_update,
    pre_load_helpers,
    fieldsParse,
    file_fields_json
};