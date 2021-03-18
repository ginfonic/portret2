const db = require('../../../db');
const uuid = require('uuid');

async function save_match(ids) {
    let sap = await db.query(`select * from sap.deps where id = ANY($1)`, [ids]);

    for (let item of sap.rows) {
        //dep
        let new_id = uuid.v4();
        await db.query(`delete from match.saved
        where depname = '${item.depname}' and funcblock = '${item.funcblock}' 
        and lvl = ${item.lvl} and bank = '${item.bank}'
        and type = '${item.type}'
        `);
        await db.query(`insert into match.saved 
           (depname, lvl, funcblock, type, bank, return_later, connectedto, id) values (
           '${item.depname}',
           ${item.lvl},
           '${item.funcblock}',
           '${item.type}',
           '${item.bank}',
           ${item.return_later},
           ${item.connectedto !== null ? `'${item.connectedto}'` : 'null'},
           '${new_id}'
           )`);
        //erros
        let errors = await db.query(`select error_id from sap.errors_connections where sap_id = '${item.id}'`);
        for (let error_id of errors.rows.map(err => err.error_id)) {
            await db.query(`insert into match.saved_errors (saved_id, error_id) values ('${new_id}', '${error_id}')`);
        }
        //units
        let units = await db.query(`select * from sap.a_units where dep_id = '${item.id}'`);
        for (let unit of units.rows) {
            const unit_id = uuid.v4();
            await db.query(`insert into match.saved_units (id, unit_name, saved_id, return_later, color, color_ex, connectedto) values (
                '${unit_id}',
                '${unit.unit_name}',
                '${new_id}',
                ${unit.return_later},
                ${unit.color},
                ${unit.color_ex},
                ${unit.connectedto !== null ? `'${unit.connectedto}'` : 'null'}
                )`);
            //unit errors
            let errors = await db.query(`select error_id from sap.unit_errors_connections where unit_id = '${unit.id}'`);
            for (let error_id of errors.rows.map(err => err.error_id)) {
                await db.query(`insert into match.saved_unit_errors (saved_unit_id, unit_error_id) values ('${unit_id}', '${error_id}')`)
            }
        }
    }
}

function mass_matching(sap_filtered) {
    let mass_sap = {};
    for (let dep of sap_filtered) {
        if (!mass_sap.hasOwnProperty(dep.depname)) {
            mass_sap[dep.depname] = {};
            mass_sap[dep.depname][dep.funcblock] ={};
            mass_sap[dep.depname][dep.funcblock][dep.lvl] = {
                yes: [],
                no: [],
            };
            if (dep.connectedto === null) {
                mass_sap[dep.depname][dep.funcblock][dep.lvl].no.push(dep);
            }
            else {
                mass_sap[dep.depname][dep.funcblock][dep.lvl].yes.push(dep);
            }
        }
        else {
            if (!mass_sap[dep.depname].hasOwnProperty(dep.funcblock)) {
                mass_sap[dep.depname][dep.funcblock] = {};
                mass_sap[dep.depname][dep.funcblock][dep.lvl] = {
                    yes: [],
                    no: [],
                };
                if (dep.connectedto === null) {
                    mass_sap[dep.depname][dep.funcblock][dep.lvl].no.push(dep);
                }
                else {
                    mass_sap[dep.depname][dep.funcblock][dep.lvl].yes.push(dep);
                }
            }
            else {
                if (!mass_sap[dep.depname][dep.funcblock].hasOwnProperty(dep.lvl)) {
                    mass_sap[dep.depname][dep.funcblock][dep.lvl] = {
                        yes: [],
                        no: [],
                    };
                    if (dep.connectedto === null) {
                        mass_sap[dep.depname][dep.funcblock][dep.lvl].no.push(dep);
                    }
                    else {
                        mass_sap[dep.depname][dep.funcblock][dep.lvl].yes.push(dep);
                    }
                }
                else {
                    if (dep.connectedto === null) {
                        mass_sap[dep.depname][dep.funcblock][dep.lvl].no.push(dep);
                    }
                    else {
                        mass_sap[dep.depname][dep.funcblock][dep.lvl].yes.push(dep);
                    }
                }
            }
        }
    }

    let filtered = [];

    for (let depname in mass_sap) {
        if (mass_sap.hasOwnProperty(depname)) {
            for (let funcblock in mass_sap[depname]) {
                if (mass_sap[depname].hasOwnProperty(funcblock)) {
                    for (let lvl in mass_sap[depname][funcblock]) {
                        if (mass_sap[depname][funcblock].hasOwnProperty(lvl)) {
                            if (mass_sap[depname][funcblock][lvl].no.length > 0) {
                                filtered.push({
                                    depname,
                                    funcblock,
                                    lvl,
                                    deps: [...mass_sap[depname][funcblock][lvl].no],
                                    connectedto: false
                                })
                            }
                            if (mass_sap[depname][funcblock][lvl].yes.length > 0) {
                                filtered.push({
                                    depname,
                                    funcblock,
                                    lvl,
                                    deps: [...mass_sap[depname][funcblock][lvl].yes],
                                    connectedto: true
                                })
                            }
                        }
                    }
                }
            }
        }
    }

    return filtered;
}

module.exports = {
    save_match,
    mass_matching
};
