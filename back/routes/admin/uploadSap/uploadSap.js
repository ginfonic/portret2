const db = require('../../../db/index');
const {tb} = require('./tb');
const {gosb} = require('./gosb');
const {head} = require('./headdep');
const {msk} = require('./msk');
const {vsp_head, vsp_msk, vsp_gosb} = require('./vsp');
const {kic_gosb, kic_tb} = require('./kic');
const {update_approved_deps} = require('../../deviations/approved/help');
const {file_fields_json} = require('../help');

async function file_progress(id, value) {
    await db.query(`update sap.files set load_progress = ${value} where id = '${id}'`)
}

function json_parse_cut_deps(json, cutDeps) {
    let startDep = 9;
    let a = 18;
    while (a >= startDep) {
        for (let item of json) {
            if (cutDeps[`_${a}`].indexOf(item[`_${a}`]) !== -1) {
                if (a === 18) {
                    item[`_${a}`] = 'Не присвоено'
                }
                else {
                    let i = 18;
                    let old = item[`_18`];
                    while (a - i <= 0) {
                        if (i === 18) {
                            item[`_18`] = 'Не присвоено';
                        }
                        else {
                            let neww = old;
                            old = item[`_${i}`];
                            item[`_${i}`] = neww;
                        }
                        i -= 1;
                    }
                }
            }
        }
        a -= 1;
    }
    return json
}

async function uploadSap(json, file, cutDeps) {
    if (!file.in_load) {
        await db.query(`update sap.files set in_load = true where id = '${file.id}'`)
    }
    else {
        return
    }

    json = await file_fields_json(json, file.bank);

    let newCutDeps = {
        tb: {},
        gosb: {},
        head: {},
        vsp_gosb: {},
        vsp_head: {},
        vsp_msk: {},
        kic_tb: {},
        kic_gosb: {},
    };
    for (let index in newCutDeps) {
        newCutDeps[index] = {
            _9: [],
            _10: [],
            _11: [],
            _12: [],
            _13: [],
            _14: [],
            _15: [],
            _16: [],
            _17: [],
            _18: [],
        };
    }
    cutDeps = cutDeps === null ? newCutDeps: cutDeps;

    let db_cutdeps = await db.query(`select index, name, type from sap.cut_deps where bank = '${file.bank}'`);
    for (let item of db_cutdeps.rows) {
        cutDeps[item.type][item.index].push(item.name);
    }

    await msk(json_parse_cut_deps(json, cutDeps['tb']), file);
    file_progress(file.id, 10).then(() => {});
    await tb(json_parse_cut_deps(json, cutDeps['tb']), file);
    file_progress(file.id, 20).then(() => {});
    await gosb(json_parse_cut_deps(json, cutDeps['gosb']), file);
    file_progress(file.id, 30).then(() => {});
    await head(json_parse_cut_deps(json, cutDeps['head']), file);
    file_progress(file.id, 40).then(() => {});
    //vsp
    await vsp_msk(json_parse_cut_deps(json, cutDeps['vsp_msk']), file);
    file_progress(file.id, 50).then(() => {});
    await vsp_gosb(json_parse_cut_deps(json, cutDeps['vsp_gosb']), file);
    file_progress(file.id, 60).then(() => {});
    await vsp_head(json_parse_cut_deps(json, cutDeps['vsp_head']), file);
    file_progress(file.id, 70).then(() => {});
    //kic
    await kic_tb(json_parse_cut_deps(json, cutDeps['kic_tb']), file);
    file_progress(file.id, 80).then(() => {});
    await kic_gosb(json_parse_cut_deps(json, cutDeps['kic_gosb']), file);
    file_progress(file.id, 90).then(() => {});
    // other func
    await update_approved_deps();
    file_progress(file.id, 100).then(() => {});
}

module.exports = {
    uploadSap,
};