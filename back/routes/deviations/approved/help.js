const db = require('../../../db');

function mass_deps(sap_filtered) {
    let mass_sap = {};
    for (let dep of sap_filtered) {
        if (!mass_sap.hasOwnProperty(dep.depname)) {
            mass_sap[dep.depname] = {};
            mass_sap[dep.depname][dep.funcblock] ={};
            mass_sap[dep.depname][dep.funcblock][dep.lvl] = [];
            mass_sap[dep.depname][dep.funcblock][dep.lvl].push(dep);
        }
        else {
            if (!mass_sap[dep.depname].hasOwnProperty(dep.funcblock)) {
                mass_sap[dep.depname][dep.funcblock] = {};
                mass_sap[dep.depname][dep.funcblock][dep.lvl] = [];
                mass_sap[dep.depname][dep.funcblock][dep.lvl].push(dep);
            }
            else {
                if (!mass_sap[dep.depname][dep.funcblock].hasOwnProperty(dep.lvl)) {
                    mass_sap[dep.depname][dep.funcblock][dep.lvl] = [];
                    mass_sap[dep.depname][dep.funcblock][dep.lvl].push(dep);
                }
                else {
                    mass_sap[dep.depname][dep.funcblock][dep.lvl].push(dep);
                }
            }
        }
        console.log(dep);
        console.log(mass_sap[dep.depname][dep.funcblock][dep.lvl])
    }

    let filtered = [];

    for (let depname in mass_sap) {
        if (mass_sap.hasOwnProperty(depname)) {
            for (let funcblock in mass_sap[depname]) {
                if (mass_sap[depname].hasOwnProperty(funcblock)) {
                    for (let lvl in mass_sap[depname][funcblock]) {
                        if (mass_sap[depname][funcblock].hasOwnProperty(lvl)) {
                            filtered.push({
                                depname,
                                funcblock,
                                lvl,
                                deps: [...mass_sap[depname][funcblock][lvl]],
                            });
                        }
                    }
                }
            }
        }
    }

    return filtered;
}

async function update_approved_deps() {
    let deps_data = await db.query(`
    select distinct dep.depname, dep.lvl, dep.funcblock, dep.bank, dev.dev_id as dev
    from sap.deps as dep
    inner join deviations.approved_deps as dev on dev.dep_id = dep.id`);

    for (let dep of deps_data.rows) {
        let new_ids = await db.query(`
        select id from sap.deps
        where lvl = ${dep.lvl}
        and funcblock = '${dep.funcblock}'
        and bank = '${dep.bank}'
        and depname = '${dep.depname}'
        `);
        let already_data = await db.query(`select dep_id from deviations.approved_deps where dev_id = '${dep.dev}'`);
        let already = already_data.rows.map(item => item.dep_id);
        for (let id of new_ids.rows.map(item => item.id)) {
            if (already.indexOf(id) === -1) {
                await db.query(`
                insert into deviations.approved_deps (dev_id, dep_id) values (
                '${dep.dev}',
                '${id}'
                ) returning *`);
            }
        }
    }
}


module.exports = {
    mass_deps,
    update_approved_deps
};
