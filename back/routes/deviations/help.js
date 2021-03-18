const {mass_deps} = require("./approved/help");
const db = require('../../db');

async function sameDep(id){
    let res = await db.query(`
        select sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name as etalon_name,
            CASE
            when parent_bank.name is not null then '/deptree/' || parent_bank.name || '/' || sap.bank || '/' || sap.id
            else '/deptree/' || sap.bank || '/' || sap.id
            END as link
        from sap.deps as sap
        inner join deviations.dev as dev on dev.dep_id = sap.id
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        left join dictionaries.deps as parent_bank on parent_bank.id = (
            select parent from dictionaries.deps where name = sap.bank
        )
        where dev.type = 'samedep'
        and connectedto in (select connectedto from sap.deps where id = '${id}')
        order by etalon.name, bank
    `);
    return res.rows
}

async function approved(id) {
    let table_data = await db.query(`select main.req_num, main.req_date, main.text, main.answer_num,
    main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved,
    main.final_decision_comments, main.id, array_agg(tags.tag) as tags, array_agg(dep_con.dep_id) as deps,
    array_agg(bank_con.bank_id) as banks
    from deviations.approved as main
    
    left join deviations.approved_tags_connections as tag_con on tag_con.dev_id = main.id
    left join deviations.approved_deps as dep_con on dep_con.dev_id = main.id
    left join deviations.approved_banks as bank_con on bank_con.dev_id = main.id
    
    left join deviations.approved_tags as tags on tags.id = tag_con.tag_id
    
    where main.id in (select dev_id from deviations.approved_deps where dep_id = '${id}')
    group by main.req_num, main.req_date, main.text, main.answer_num,
    main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved, 
    main.final_decision_comments, main.id
    order by main.req_num`);
    let table = table_data.rows;

    for (let row of table) {
        const deps = await db.query(`
        select depname, lvl, funcblock, bank, type, id
        from sap.deps
        where id = ANY($1)
        group by depname, lvl, funcblock, bank, type, id
        having date = MAX(date)`, [row.deps]);
        row.deps = mass_deps(deps.rows);

        const banks = await db.query(`
        select distinct child.name, (select name from dictionaries.deps where id = child.parent) as parent
        from dictionaries.deps as child
        where id = ANY($1)`, [row.banks]);
        row.banks = banks.rows;
        for (let bnk of row.banks) {
            bnk.link_to = `/dep/${
                bnk.parent === null ? bnk.name : bnk.parent
            }${
                bnk.parent === null ? '' : `/${bnk.name}`
            }`;
        }

        if (row.tags.length > 0 && row.tags[0] === null) {
            row.tags = [];
        }
    }
    return table
}

async function errors(id) {
    let errors = await db.query(`select array_agg(
            jsonb_build_object('name', err.name, 'description', err.description)
        ) as error_list
    from sap.deps as sap
    inner join sap.errors as err on err.id in (select error_id from sap.errors_connections where sap_id = sap.id)
    where sap.id = '${id}'
    group by sap.id`);

    return errors.rows[0].error_list;
}

async function unitErrors(id) {
    let units_data = await db.query(`select array_agg(
            jsonb_build_object('id', unit.id, 'name', unit.unit_name)
        ) as units
    from sap.deps as sap
    inner join sap.a_units as unit on unit.dep_id = sap.id
    where sap.id = '${id}' and unit.id in (select unit_id from sap.unit_errors_connections)
    group by sap.id`);
    let units = units_data.rows[0].units;

    for (let unit of units) {
        let unit_errors_data = await db.query(`select distinct error.name, error.description
            from sap.unit_errors as error
            inner join sap.unit_errors_connections as unit_errors on unit_errors.error_id = error.id
            where unit_errors.unit_id = '${unit.id}'
            `);
        unit.errors = unit_errors_data.rows;
    }

    return units;
}

async function getCount(id){
    let res = await db.query(`
    select SUM(state_count)::int AS statecount
    from sap.r_units
    where
    dep_id = '${id}'
    `);
    return res.rows[0].statecount
}

module.exports={
    sameDep,
    approved,
    getCount,
    errors,
    unitErrors
};