let express = require('express');
const db = require('../../../db');
const uuid = require('uuid');
let router = express.Router();
const { checkUser } = require('../../../middleware');
const {actionLogger, saveToTrash} = require('../../../middleware/actionsLogging');
const {deviationApprovedElementTag, deviationApprovedTagTag} = require('../../../middleware/logTags');
const {mass_deps} = require('./help');

const deviation_table = async (filter) => {
    let table_data = await db.query(`select main.req_num, main.req_date, main.text, main.answer_num,
    main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved,
    main.final_decision_comments, main.id, array_agg(tags.tag) as tags, array_agg(dep_con.dep_id) as deps,
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

    table = table.filter(item =>
        (
            filter['banks'] === null ? true : (
                filter['banks'].length > 0 ?
                    item.banks.filter(bank => bank.name === filter['banks']).length > 0 : true)
        )
        &&
        (
            filter['deps'] === null ? true : (filter['deps'].length > 0 ?
                item.deps.filter(dep => dep.name === filter['deps']).length > 0 : true)
        )
        &&
        (
            filter['tags'] === null ? true : (filter['tags'].length > 0 ? item.tags.indexOf(filter['tags']) !== -1 : true)
        )
    );

    return table;
};

router.post('/table', checkUser, actionLogger, async function(req, res, next) {
    const filter = req.body.filter;

    const table = await deviation_table(filter);

    res.status(200).json({table});
});

router.post('/tags', checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    let tag_data = await db.query(`select * from deviations.approved_tags`);
    let tags = tag_data.rows;

    let connected_data = await db.query(`select tag_id from deviations.approved_tags_connections where dev_id = '${id}'`);
    let connected = connected_data.rows.map(item => item.tag_id);

    res.status(200).json({tags, connected})
});

router.post('/new_tag', checkUser, deviationApprovedTagTag, actionLogger, async function(req, res, next) {
    const newTagName = req.body.newTagName;
    const newTagDescription = req.body.newTagDescription;

    let added = await db.query(`insert into deviations.approved_tags (id, tag, description) values (
    '${uuid.v4()}',
    '${newTagName}',
    '${newTagDescription}'
    ) returning *`);
    if (added.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'deviations.approved_tags', null, added.rows, 1);
    }

    let tag_data = await db.query(`select * from deviations.approved_tags`);
    let tags = tag_data.rows;

    res.status(200).json({tags})
});

router.post('/tag_connect', checkUser, deviationApprovedTagTag, actionLogger, async function(req, res, next) {
    const id = req.body.id;
    const item = req.body.item;

    let current_data = await db.query(`
    select * from deviations.approved_tags_connections
    where tag_id = '${item.id}' and dev_id = '${id}'`);

    if (current_data.rows.length > 0) {
        let deleted = await db.query(`
        delete from deviations.approved_tags_connections
        where tag_id = '${item.id}' and dev_id = '${id}' returning *`);
        if (deleted.rows.length > 0) {
            await saveToTrash(req.log_id_promise, 'deviations.approved_tags_connections', deleted.rows, null, 0);
        }
    }
    else {
        let added = await db.query(`
        insert into deviations.approved_tags_connections (tag_id, dev_id) values (
        '${item.id}',
        '${id}'
        ) returning *`);
        if (added.rows.length > 0) {
            await saveToTrash(req.log_id_promise, 'deviations.approved_tags_connections', null, added.rows, 1);
        }
    }

    let connected_data = await db.query(`
    select tag_id from deviations.approved_tags_connections 
    where dev_id = '${id}'`);
    let connected = connected_data.rows.map(item => item.tag_id);

    let tags_data = await db.query(`
    select tag from deviations.approved_tags 
    where id = ANY($1)`, [connected]);
    let tags = tags_data.rows.map(item => item.tag);

    res.status(200).json({connected, tags})
});

router.post('/tag_delete', checkUser, deviationApprovedTagTag, actionLogger, async function(req, res, next) {
    const id = req.body.id;
    const item = req.body.item;

    let deleted_connections = await db.query(`
    delete from deviations.approved_tags_connections
    where tag_id = '${item.id}' returning *`);
    if (deleted_connections.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'deviations.approved_tags_connections', deleted_connections.rows, null, 0);
    }

    let deleted_tags = await db.query(`delete from deviations.approved_tags where id = '${item.id}' returning *`);
    if (deleted_tags.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'deviations.approved_tags', deleted_tags.rows, null, 0);
    }

    let connected_data = await db.query(`
    select tag_id from deviations.approved_tags_connections
    where dev_id = '${id}'`);
    let connected = connected_data.rows.map(item => item.tag_id);

    let tags_data = await db.query(`
    select tag from deviations.approved_tags
    where id = ANY($1)`, [connected]);
    let row_tags = tags_data.rows.map(item => item.tag);

    let tag_data = await db.query(`select * from deviations.approved_tags`);
    let tags = tag_data.rows;

    res.status(200).json({connected, row_tags, tags})
});

router.post('/delete', checkUser, deviationApprovedElementTag, actionLogger, async function(req, res, next) {
    let selected = req.body.selected;
    const filter = req.body.filter;

    let deleted_dev = await db.query(`
    delete from deviations.approved
    where id = ANY($1) returning *`, [selected]);
    if (deleted_dev.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'deviations.approved', deleted_dev.rows, null, 0);
    }

    const table = await deviation_table(filter);

    res.status(200).json({result: 'ok', table})
});

router.post('/deviation_to_redact', checkUser, actionLogger, async function(req, res, next) {
    let redact = req.body.redact;

    let table_data = await db.query(`select main.req_num, main.req_date, main.text, main.answer_num,
    main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved,
    main.final_decision_comments, main.id, array_agg(dep_con.dep_id) as deps,
    array_agg(bank_con.bank_id) as banks
    from deviations.approved as main
    
    left join deviations.approved_tags_connections as tag_con on tag_con.dev_id = main.id
    left join deviations.approved_deps as dep_con on dep_con.dev_id = main.id
    left join deviations.approved_banks as bank_con on bank_con.dev_id = main.id
    
    left join deviations.approved_tags as tags on tags.id = tag_con.tag_id
    
    where main.id = '${redact}'
    group by main.req_num, main.req_date, main.text, main.answer_num,
    main.answer_send_date, main.in_charge_of, main.agreement_done, main.refused_or_approved, 
    main.final_decision_comments, main.id
    order by main.req_num`);
    let selected = {
        banks: [],
        deps: [],
        req_num: '',
        text: '',
        answer_num: '',
        in_charge_of: '',
        agreement_done: false,
        refused_or_approved: true,
        final_decision_comments: '',
        req_date: new Date().toDateString(),
        answer_send_date: new Date().toDateString(),
    };
    if (table_data.rows.length === 1) {
        selected = table_data.rows[0];
    }

    res.status(200).json({selected})
});

router.post('/save', checkUser, deviationApprovedElementTag, actionLogger, async function(req, res, next) {
    const filter = req.body.filter;
    const selected = req.body.selected;
    const redact = req.body.redact;

    let new_id = uuid.v4();
    if (redact !== null) {
        new_id = redact;
        await db.query(`delete from deviations.approved where id = '${new_id}'`)
    }

    const id_data = await db.query(`
    insert into deviations.approved
    (id, req_num, req_date, text, answer_num, answer_send_date, in_charge_of, agreement_done,
     refused_or_approved, final_decision_comments)
     values (
     '${new_id}',
     '${selected.req_num}', 
     '${selected.req_date}', 
     '${selected.text}', 
     '${selected.answer_num}', 
     '${selected.answer_send_date}', 
     '${selected.in_charge_of}', 
     ${selected.agreement_done}, 
     ${selected.refused_or_approved}, 
     '${selected.final_decision_comments}' 
     ) returning *`);
    if (id_data.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'deviations.approved', null, id_data.rows, 1);
    }

    for (let dep_id of selected.deps) {
        const deps_ids = await db.query(`
        insert into deviations.approved_deps (dev_id, dep_id) values (
        '${new_id}',
        '${dep_id}'
        ) returning *`);
        if (deps_ids.rows.length > 0) {
            await saveToTrash(req.log_id_promise, 'deviations.approved_deps', null, deps_ids.rows, 1);
        }
    }

    for (let bank_id of selected.banks) {
        const bank_ids = await db.query(`
        insert into deviations.approved_banks (dev_id, bank_id) values (
        '${new_id}',
        '${bank_id}'
        ) returning *`);
        if (bank_ids.rows.length > 0) {
            await saveToTrash(req.log_id_promise, 'deviations.approved_banks', null, bank_ids.rows, 1);
        }
    }

    const table = await deviation_table(filter);

    res.status(200).json({status: 'ok', table})
});

router.get('/search_list', checkUser, actionLogger, async function(req, res, next) {
    let banks_data = await db.query(`
    select distinct name from dictionaries.deps
    where id in (select bank_id as id from deviations.approved_banks)`);
    let banks = banks_data.rows.map(item => item.name);

    let deps_data = await db.query(`
    select distinct depname from sap.deps
    where id in (select dep_id as id from deviations.approved_deps)`);
    let deps = deps_data.rows.map(item => item.depname);

    let tags_data = await db.query(`select tag from deviations.approved_tags`);
    let tags = tags_data.rows.map(item => item.tag);

    let search_list = {'banks': banks, 'deps': deps, 'tags': tags};

    res.status(200).json({search_list})
});

router.get('/banks', checkUser, actionLogger, async function(req, res, next) {
    let banks_data = await db.query(`select * from dictionaries.deps`);
    let tbs = banks_data.rows.filter(item => item.parent === null);
    let gosbs = banks_data.rows.filter(item => item.parent !== null);
    let banks = [];

    for (let tb of tbs) {
        tb.childs = [];
        for (let gosb of gosbs) {
            if (gosb.parent === tb.id) {
                tb.childs.push(gosb);
            }
        }
        banks.push(tb);
    }

    res.status(200).json({banks})
});

router.post('/deps', checkUser, actionLogger, async function(req, res, next) {
    const banks = req.body.banks;
    const filter = req.body.filter;

    for (let index in filter) {
        if (filter[index] === null) {
            filter[index] = '';
        }
    }

    let deps_data = await db.query(`
    select distinct dep.depname, dep.funcblock, dep.lvl::text, dep.bank, dep.type, array_agg(dep.id) as ids
    from sap.deps as dep
    inner join dictionaries.deps as bank on bank.name = dep.bank
    where bank.id = ANY($1) and (dep.type = 'head' or dep.type = 'gosb' or dep.type = 'tb')
    group by dep.depname, dep.funcblock, dep.lvl, dep.bank, dep.type
    order by lvl, depname
    `, [banks]);

    let deps = deps_data.rows.filter(item =>
        (
            filter['depname'].length > 0 ? item.depname.toLowerCase() === filter['depname'].toLowerCase() : true
        )
        &&
        (
            filter['funcblock'].length > 0 ? item.funcblock.toLowerCase() === filter['funcblock'].toLowerCase() : true
        )
        &&
        (
            filter['lvl'].length > 0 ? item.lvl.toLowerCase() === filter['lvl'].toLowerCase() : true
        )
        &&
        (
            filter['bank'].length > 0 ? item.bank.toLowerCase() === filter['bank'].toLowerCase() : true
        )
    );

    res.status(200).json({deps})
});

router.post('/deps_filters', checkUser, async function(req, res, next) {
    const id = req.body.id;
    const banks = req.body.banks;

    let options = [];

    if (id === 'depname') {
        let option_data = await db.query(`
        select distinct dep.depname
        from sap.deps as dep
        inner join dictionaries.deps as bank on bank.name = dep.bank
        where bank.id = ANY($1) and (dep.type = 'head' or dep.type = 'gosb' or dep.type = 'tb')
        order by depname
        `, [banks]);
        options = option_data.rows.map(item => item.depname);
    }
    else if (id === 'lvl') {
        let option_data = await db.query(`
        select distinct dep.lvl::text
        from sap.deps as dep
        inner join dictionaries.deps as bank on bank.name = dep.bank
        where bank.id = ANY($1) and (dep.type = 'head' or dep.type = 'gosb' or dep.type = 'tb')
        order by lvl
        `, [banks]);
        options = option_data.rows.map(item => item.lvl);
    }
    else if (id === 'funcblock') {
        let option_data = await db.query(`
        select distinct dep.funcblock
        from sap.deps as dep
        inner join dictionaries.deps as bank on bank.name = dep.bank
        where bank.id = ANY($1) and (dep.type = 'head' or dep.type = 'gosb' or dep.type = 'tb')
        order by funcblock
        `, [banks]);
        options = option_data.rows.map(item => item.funcblock);
    }
    else if (id === 'bank') {
        let option_data = await db.query(`
        select distinct dep.bank
        from sap.deps as dep
        inner join dictionaries.deps as bank on bank.name = dep.bank
        where bank.id = ANY($1) and (dep.type = 'head' or dep.type = 'gosb' or dep.type = 'tb')
        order by bank
        `, [banks]);
        options = option_data.rows.map(item => item.bank);
    }

    res.status(200).json({options});
});

module.exports = router;