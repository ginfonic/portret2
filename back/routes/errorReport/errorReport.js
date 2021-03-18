var express = require('express');
var router = express.Router();
const db = require('../../db');
const uuid = require('uuid');
const {
    checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

router.post('/save', checkUser, actionLogger, async function(req, res, next) {
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const currentUser = req.body.currentUser;
    let user;
    if (currentUser) {
        user = {...req.user.user};
    }
    else {
        user = {
            name: req.body.name,
            role: req.body.role,
        }
    }

    await db.query(`
    insert into logs.error_reports (id, title, description, type, user_obj, time) values (
    '${uuid.v4()}',
    '${title}',
    '${description}',
    '${type}',
    '${JSON.stringify(user)}',
    NOW()
    )`);

    res.status(200).json({})
});

router.get('/table', checkUser, actionLogger, async function(req, res, next) {
    let table = await db.query(`select * from logs.error_reports order by time`);
    for (let row of table.rows) {
        row.user_obj = JSON.stringify(row.user_obj, undefined, 4);
    }

    res.status(200).json({table: table.rows})
});

router.post('/change_solved', checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    let row = await db.query(`update logs.error_reports set solved = not solved where id = '${id}' returning *`);
    if (row.rows.length === 1) {
        row.rows[0].user_obj = JSON.stringify(row.rows[0].user_obj, undefined, 4);
        res.status(200).json({row: row.rows[0]})
    }
    else {
        res.status(200).json({row: {}})
    }
});

module.exports = router;