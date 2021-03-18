var express = require('express');
const db = require('../../db');
var router = express.Router();
const {checkUser} = require('../../middleware');
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {logsTagsRedactTags} = require('../../middleware/logTags');

const not_def_tag = 'Неопределенный тег';

router.post('/logs', checkUser, actionLogger, async function(req, res, next) {
    let filter = req.body.filter;
    for (let index in filter) {
        if (filter[index] === null) {
            filter[index] = '';
        }
    }
    const date = req.body.date;
    const changeBd = req.body.changeBd;
    let logs = await db.query(`
    select logs.url, logs.time, logs.params, logs.tag, tags.tag as tag_name,
    logs.id, logs.user_id as login, logs.user_role, logs.ip, COUNT(trash.*) as trash
    from logs.user_action_logs as logs
    left join logs.log_tags as tags on tags.id = logs.tag
    left join auth.users as users on users.id = logs.user_id
    left outer join logs.trash as trash on trash.log_id = logs.id
    group by logs.url, logs.time, logs.params, logs.tag, tags.tag, logs.id, users.name, logs.ip, logs.user_role
    order by logs.time DESC`);
    logs.rows = logs.rows.filter(item =>
        (
            filter['url'].length > 0 ? item.url.toLowerCase() === filter['url'].toLowerCase() : true
        )
            &&
        (
            filter['role'].length > 0 ? (item.user_role === null ? false : (item.user_role.indexOf(filter['role']) !== -1)) : true
        )
            &&
        (
            filter['ip'].length > 0 ? (item.ip === null ? false : (item.ip.toLowerCase() === filter['ip'].toLowerCase())) : true
        )
            &&
        (
            filter['login'].length > 0 ? item.login === null ? (filter['login'] === 'Wrong token') : (item.login.toLowerCase() === filter['login'].toLowerCase()) : true
        )
            &&
        (
            filter['tag'].length > 0  ? (
                item.tag_name === null ? (
                    filter['tag'] === not_def_tag
                ) :
                item.tag_name.toLowerCase() === filter['tag'].toLowerCase()
            ) : true
        )
        &&
        (
            changeBd ? item.trash > 0 : true
        )
    );

    logs.rows = logs.rows.filter(item =>
        (date['start'] === null ? true : (
            item.time >= new Date(date['start'])
        ))
        &&
        (date['end'] === null ? true : (
            item.time <= new Date(date['end'])
        ))
    );

    for (let row of logs.rows) {
        row.params = JSON.stringify(row.params, undefined, 4);
        row.time = row.time.toString();
        if (row.login === null) {
            row.login = '-'
        }
        if (row.description === null) {
            row.description = '-'
        }
    }

    res.status(200).json({logs: logs.rows});
});

router.post('/log_trash', checkUser, async function(req, res, next) {
    const log_id = req.body.log_id;

    let trash = await db.query(`select before, after, schema_table, log_id, operation_tag from logs.trash where log_id = '${log_id}'`);

    for (let elem of trash.rows) {
        elem.before = JSON.stringify(elem.before, undefined, 4);
        elem.after = JSON.stringify(elem.after, undefined, 4);
    }

    res.status(200).json({elems: trash.rows});
});

router.post('/logs_filter_options', checkUser, async function(req, res, next) {
    const id = req.body.id;

    let options = [];

    if (id === 'login') {
        let login_options = await db.query(`select distinct login from logs.user_action_logs`);
        options = login_options.rows.map(item => item.login);
    }
    else if (id === 'url') {
        let url_options = await db.query(`select distinct url from logs.user_action_logs`);
        options = url_options.rows.map(item => item.url);
    }
    else if (id === 'tag') {
        let tag_options = await db.query(`select distinct tags.tag
        from logs.user_action_logs as logs 
        left join logs.log_tags as tags on tags.id = logs.tag`);
        options = tag_options.rows.map(item => item.tag === null ? not_def_tag : item.tag);
    }
    else if (id === 'role') {
        let role_options = await db.query(`select array_agg(distinct user_role) as roles from logs.user_action_logs`);
        //let all_roles = new Set();
        //role_options.rows.map(item => item.sudir_roles.map(role => all_roles.add(role)));
        options = role_options.rows[0].roles.filter(item => item !== null);
    }
    else if (id === 'ip') {
        let ip_options = await db.query(`select distinct ip from logs.user_action_logs`);
        options = ip_options.rows.map(item => item.ip);
    }

    res.status(200).json({options});
});

router.post('/logs_tags', checkUser, actionLogger, async function(req, res, next) {
    let tag_data = await db.query(`select * from logs.log_tags order by id`);
    let tags = tag_data.rows;

    res.status(200).json({tags})
});

router.post('/logs_new_tag', checkUser, logsTagsRedactTags, actionLogger, async function(req, res, next) {
    const newTagName = req.body.newTagName;
    const newTagId = req.body.newTagId;

    let added = await db.query(`insert into logs.log_tags (tag, id) values ('${newTagName}', ${newTagId}) returning *`);
    if (added.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'logs.log_tags', null, added.rows, 1);
    }

    let tag_data = await db.query(`select * from logs.log_tags order by id`);
    let tags = tag_data.rows;

    res.status(200).json({tags})
});

router.post('/logs_tag_delete', checkUser, logsTagsRedactTags, actionLogger, async function(req, res, next) {
    const item = req.body.item;

    let deleted_tags = await db.query(`delete from logs.log_tags where id = ${item.id} returning *`);
    if (deleted_tags.rows.length > 0) {
        await saveToTrash(req.log_id_promise, 'logs.log_tags', deleted_tags.rows, null, 0);
    }

    let tag_data = await db.query(`select * from logs.log_tags order by id`);
    let tags = tag_data.rows;

    res.status(200).json({tags})
});

module.exports = router;