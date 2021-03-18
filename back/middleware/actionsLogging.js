const db = require('../db');
const uuid = require('uuid');
const setting = require('../serverConfig');

function actionLogger(req, res, next){
    let user = req.user.user;
    const url = req.originalUrl;
    const params = JSON.stringify(req.body);
    const log_tag = req.log_tag ? req.log_tag : 0;
    const id = uuid.v1();
    let ip;
    if (setting.dev) {
        ip = req._remoteAddress;
    }
    else {
        ip = req.headers['iv-remote-address'];
    }
    req.log_id_promise = db.query(`insert into logs.user_action_logs (id, time, url, login, user_id, user_role, params, tag, ip) 
    values ('${id}', NOW(), '${url}', '${user.name}', '${user.id}', '${user.role.desc}', '${params}', ${log_tag}, '${ip}') returning id`);
    next();
}

//example: await saveToTrash(req.log_id_promise, `test.test`, null, {test: 'test'}, 1);
async function saveToTrash(log_id_promise, schema_table, before, after, operation_tag) {
    // 0 - delete, 1 - add, 2 - change
    const log_id_data = await log_id_promise;
    const log_id = log_id_data.rows[0].id;

    if ((before || after)) {
        db.query(`insert into logs.trash (log_id,${before ? ' before, ' : ''} ${after ? ' after, ': ''} schema_table, operation_tag) 
        values ('${log_id}', ${before ? ` '${JSON.stringify(before)}', ` : ``} ${after ? ` '${JSON.stringify(after)}', ` : ``} '${schema_table}', ${operation_tag})`);
    }
}

module.exports = {
    actionLogger,
    saveToTrash
};