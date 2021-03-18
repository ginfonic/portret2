let express = require('express');
const db = require('../../db');
let router = express.Router();
const { checkUser } = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');
const {downloadDeviationTableTag} = require('../../middleware/logTags');
const {sameDep, approved, getCount, errors, unitErrors} = require('./help');
const {lastDate} = require('../initial/help');

router.post('/sap_elem', checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    let deviations = {
        samedep: null,
        count: null,
        urm: null,
        approved: null,
        match_err: null,
        match_unit_err: null,
    };

    let dev = await db.query(`
    select count(approved.dev_id) as approved, count(count.*) as count, count(urm.*) as urm,
        count(samedep.*) as samedep, count(match_err.*) as match_err, count(match_unit_err.*) as match_unit_err
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as count on count.dep_id = sap.id and count.type = 'count'
    left join deviations.dev as urm on urm.dep_id = sap.id and urm.type = 'urm'
    left join deviations.dev as samedep on samedep.dep_id = sap.id and samedep.type = 'samedep'
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = '${id}'
    group by sap.id
    `);

    if (dev.rows.length === 1) {
        let dev_count = dev.rows[0];
        if (dev_count.approved > 0) {
            deviations.approved = await approved(id);
        }
        if (dev_count.samedep > 0) {
            deviations.samedep = await sameDep(id);
        }
        if (dev_count.count > 0) {
            deviations.count = await getCount(id)
        }
        if (dev_count.urm > 0) {
            deviations.urm = true
        }
        if (dev_count.match_err > 0) {
            deviations.match_err = await errors(id)
        }
        if (dev_count.match_unit_err > 0) {
            deviations.match_unit_err = await unitErrors(id);
        }
    }

    res.status(200).json({deviations});
});

router.post('/downloadXLSX',checkUser, downloadDeviationTableTag, actionLogger, async function(req, res, next) {
    const tab = req.body.tab;
    const tb_gosb = req.body.tb_gosb;

    let table = [];

    //Согласованные
    if (tab === 0) {
        let table_data = await db.query(`select main.req_num as "Номер запроса",
            main.req_date as "Дата запроса", 
            main.text as "Текст запроса", 
            main.answer_num as "Номер ответа",
            main.answer_send_date as "Дата отправки ответа в ТБ", 
            main.in_charge_of as "Ответственный", 
            main.agreement_done as "Рассмотренно", 
            main.refused_or_approved as "Статус согласования", 
            main.final_decision_comments as "Комментарий к согласованию", 
            array_agg(tags.tag) as tags, array_agg(dep_con.dep_id) as deps,
            array_agg(bank_con.bank_id) as banks
            from deviations.approved as main

            left join deviations.approved_tags_connections as tag_con on tag_con.dev_id = main.id
            left join deviations.approved_deps as dep_con on dep_con.dev_id = main.id
            left join deviations.approved_banks as bank_con on bank_con.dev_id = main.id

            left join deviations.approved_tags as tags on tags.id = tag_con.tag_id

            group by main.req_num, main.req_date, main.text, main.answer_num,
            main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved, 
            main.final_decision_comments, main.id
            order by main.req_num`);
        table = table_data.rows;

        for (let row of table) {
            const deps = await db.query(`
            select distinct depname, bank
            from sap.deps
            where id = ANY($1)
            group by depname, lvl, funcblock, bank, type, id
            having date = MAX(date)`, [row.deps]);
            row['Подразделения'] = JSON.stringify(deps.rows.map(dep => `${dep.depname} - ${dep.bank}`));

            const banks = await db.query(`
            select distinct child.name, (select name from dictionaries.deps where id = child.parent) as parent
            from dictionaries.deps as child
            where id = ANY($1)`, [row.banks]);
            row['Банки'] = JSON.stringify(banks.rows.map(bank =>
                `${bank.name}${bank.parent !== null ? ' - ' + bank.parent : ``}`));

            if (row.tags.length > 0 && row.tags[0] === null) {
                row['Тег'] = '-';
            }
            else if (row.tags.length > 0) {
                row['Тег'] = JSON.stringify(row.tags);
            }
        }
        //in order
        table = JSON.parse(JSON.stringify(table, [
            'Банки',
            'Подразделения',
            'Текст запроса',
            'Тег',
            'Номер запроса',
            'Дата запроса',
            'Номер ответа',
            'Дата отправки ответа в ТБ',
            'Ответственный',
            'Рассмотренно',
            'Статус согласования',
            'Комментарий к согласованию']))
    }

    //count
    else if (tab === 1) {
        let table_data = await db.query(`
        select distinct sap.depname as "Подразделение", sap.funcblock as "Функциональный блок",
            sap.lvl as "Уровень", sap.bank as "Банк", etalon.name as "Эталонное подразделение",
            sum(u.state_count) as "Численность"
        from sap.deps as sap
        inner join deviations.dev as dev on dev.dep_id = sap.id
        inner join sap.r_units as u on u.dep_id = sap.id
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        where dev.type = 'count'
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name
        order by etalon.name, sap.bank`);
        table = table_data.rows;
    }

    //urm
    else if (tab === 2) {
        let table_data = await db.query(`
        select distinct sap.depname as "Подразделение", sap.funcblock as "Функциональный блок",
            sap.lvl as "Уровень", sap.bank as "Банк", etalon.name as "Эталонное подразделение",
            sum(u.state_count) as "Численность"
        from sap.deps as sap
        inner join deviations.dev as dev on dev.dep_id = sap.id
        inner join sap.r_units as u on u.dep_id = sap.id
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        where dev.type = 'urm'
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name
        order by etalon.name, sap.bank`);
        table = table_data.rows;
    }

    //match
    else if (tab === 3) {
        const date = await lastDate();
        const table_data = await db.query(`
        select distinct sap.depname as "Подразделение",
            sap.funcblock as "Функциональный блок",
            sap.lvl as "Уровень", sap.bank as "Банк", etalon.name as "Эталонное подразделение",
            array_agg(jsonb_build_object('name', err.name, 'description', err.description)) as error_list
        from sap.deps as sap
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        inner join sap.errors as err on err.id in (select error_id from sap.errors_connections where sap_id = sap.id)
        where sap.id in (select sap_id from sap.errors_connections)
            and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
            and date = '${date}'
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name
        `);
        table = table_data.rows;

        for (let row of table) {
            row['Ошибки'] = JSON.stringify(row.error_list.map(error => `${error.name}(${error.description})`));
            delete row.error_list
        }
    }

    //match_unit
    else if (tab === 4) {
        const date = await lastDate();
        const table_data = await db.query(`
        select distinct sap.depname as "Подразделение",
            sap.funcblock as "Функциональный блок",
            sap.lvl as "Уровень", sap.bank as "Банк", etalon.name as "Эталонное подразделение",
            array_agg(jsonb_build_object('id', unit.id, 'name', unit.unit_name)) as units
        from sap.deps as sap
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        inner join sap.a_units as unit on unit.dep_id = sap.id
        where unit.id in (select unit_id from sap.unit_errors_connections)
            and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
            and date = '${date}'
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name
        `);
        table = table_data.rows;
        for (let row of table) {
            for (let unit of row.units) {
                let unit_errors_data = await db.query(`
                select distinct error.name, error.description
                from sap.unit_errors as error
                inner join sap.unit_errors_connections as unit_errors on unit_errors.error_id = error.id
                where unit_errors.unit_id = '${unit.id}'
                `);
                unit.errors = unit_errors_data.rows.map(error => `${error.name}(${error.description})`);
            }
            row['Должности + ошибки'] = JSON.stringify(row.units.map(unit => `${unit.name} - ${unit.errors}`));
            delete row.units;
        }
    }
    //Same dep
    else if (tab === 5) {
        let table_data = await db.query(`
        select distinct sap.depname as "Подразделение", sap.funcblock as "Функциональный блок",
            sap.lvl as "Уровень", sap.bank as "Банк", etalon.name as "Эталонное подразделение",
            sum(u.state_count) as "Численность"
        from sap.deps as sap
        inner join deviations.dev as dev on dev.dep_id = sap.id
        inner join sap.r_units as u on u.dep_id = sap.id
        left join etalon.deps as etalon on etalon.id = sap.connectedto
        where dev.type = 'samedep'
        and ${tb_gosb === 'tb' ? `sap.type = 'tb'` : `(sap.type = 'gosb' or sap.type = 'head')`}
        group by sap.depname, sap.funcblock, sap.lvl, sap.bank, sap.id, etalon.name
        order by etalon.name, sap.bank`);
        table = table_data.rows;
    }

    res.status(200).json({table});
});

module.exports = router;
