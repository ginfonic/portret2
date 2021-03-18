let express = require('express');
const db = require('../../db');
const uuid = require('uuid');
let router = express.Router();
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {matchErrorFlagTag, matchErrorTag, matchUnitErrorTag} = require('../../middleware/logTags');
const {save_match} = require('./help/sap');
const {checkUser} = require('../../middleware');
//
router.post('/error_list', checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    let error_data = await db.query(`SELECT * from sap.errors order by id`);
    let error_list = error_data.rows;

    let item_connected_errors_data = await db.query(`SELECT * from sap.errors_connections where sap_id = '${id}'`);
    let item_connected_errors = item_connected_errors_data.rows;

    item_connected_errors = item_connected_errors.map(item_error => item_error.error_id);

    let item_errors_data = await db.query(`select * from sap.errors where id in (select error_id as id from sap.errors_connections where sap_id = '${id}')`);
    let item_errors = item_errors_data.rows;

    res.status(200).json({error_list, item_connected_errors, item_errors});
});
//
router.post('/error_list_add', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const newErrorName = req.body.newErrorName;
    const newErrorDescription = req.body.newErrorDescription;

    let id = uuid.v4();

    let added = await db.query(`INSERT INTO sap.errors (id, name, description) VALUES ('${id}', '${newErrorName}', '${newErrorDescription}') returning *`);
    if (added.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.errors`, null, added.rows, 1);
    }

    let error_data = await db.query(`SELECT * from sap.errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_to_redact', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const redact = req.body.redact;

    let to_redact = await db.query(`SELECT * from sap.errors where id = '${redact}'`);

    if (to_redact.rows.length === 1) {
        res.status(200).json({name: to_redact.rows[0].name, description: to_redact.rows[0].description});
    }
});
//
router.post('/error_redact', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const newErrorName = req.body.newErrorName;
    const newErrorDescription = req.body.newErrorDescription;
    const redact = req.body.redact;

    let before = await db.query(`SELECT * from sap.errors where id = '${redact}'`);
    let after = await db.query(`update sap.errors set name = '${newErrorName}', description = '${newErrorDescription}' where id = '${redact}' returning *`);
    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.errors`, before.rows, after.rows, 2);
    }

    let error_data = await db.query(`SELECT * from sap.errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_delete', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const redact = req.body.redact;

    let deleted = await db.query(`delete from sap.errors where id = '${redact}' returning *`);
    if (deleted.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.errors`, deleted.rows, null, 0);
    }

    let deleted_connections = await db.query(`DELETE FROM sap.errors_connections where error_id = '${redact}' returning *`);
    if (deleted_connections.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.errors_connections`, deleted_connections.rows, null, 0);
    }

    let error_data = await db.query(`SELECT * from sap.errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_list_connect', matchErrorFlagTag, checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;
    const item = req.body.item;

    let current_data = await db.query(`SELECT * FROM sap.errors_connections where sap_id = '${id}' and error_id = '${item.id}'`);
    let current = current_data.rows;

    if (current.length !== 0)
    {
        let deleted = await db.query(`DELETE FROM sap.errors_connections where sap_id = '${id}' and error_id = '${item.id}' returning *`);
        if (deleted.rows.length > 0) {
            await saveToTrash(req.log_id_promise, `sap.errors_connections`, deleted.rows, null, 0);
        }

        let item_connected_errors_data = await db.query(`SELECT * from sap.errors_connections where sap_id = '${id}'`);
        let item_connected_errors = item_connected_errors_data.rows;

        item_connected_errors = item_connected_errors.map(item_error => item_error.error_id);

        let item_errors_data = await db.query(`select * from sap.errors where id in (select error_id as id from sap.errors_connections where sap_id = '${id}')`);
        let item_errors = item_errors_data.rows;

        res.status(200).json({item_connected_errors, item_errors});

        save_match([id]).then(() => {});
        return
    }

    let added = await db.query(`INSERT INTO sap.errors_connections (sap_id, error_id) VALUES ('${id}', '${item.id}') returning *`);
    if (added.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.errors_connections`, null, added.rows, 1);
    }

    let item_connected_errors_data = await db.query(`SELECT * from sap.errors_connections where sap_id = '${id}'`);
    let item_connected_errors = item_connected_errors_data.rows;

    item_connected_errors = item_connected_errors.map(item_error => item_error.error_id);

    let item_errors_data = await db.query(`select * from sap.errors where id in (select error_id as id from sap.errors_connections where sap_id = '${id}')`);
    let item_errors = item_errors_data.rows;

    res.status(200).json({item_connected_errors, item_errors});

    save_match([id]).then(() => {})
});
//
router.post('/error_unit_list', checkUser, actionLogger, async function(req, res, next) {
    const item = req.body.item;

    let id = item.units[0].id;

    let error_data = await db.query(`SELECT * from sap.unit_errors order by id`);
    let error_list = error_data.rows;

    let item_errors_data = await db.query(`SELECT * from sap.unit_errors_connections where unit_id = '${id}'`);
    let item_errors = item_errors_data.rows;

    item_errors = item_errors.map(item_error => item_error.error_id);

    res.status(200).json({error_list, item_errors});
});
//
router.post('/error_unit_list_add', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const newErrorName = req.body.newErrorName;
    const newErrorDescription = req.body.newErrorDescription;

    let id = uuid.v4();

    let added = await db.query(`INSERT INTO sap.unit_errors (id, name, description) VALUES ('${id}', '${newErrorName}', '${newErrorDescription}') returning *`);
    if (added.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.unit_errors`, null, added.rows, 1);
    }

    let error_data = await db.query(`SELECT * from sap.unit_errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_unit_to_redact', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const redact = req.body.redact;

    let to_redact = await db.query(`SELECT * from sap.unit_errors where id = '${redact}'`);

    if (to_redact.rows.length === 1) {
        res.status(200).json({name: to_redact.rows[0].name, description: to_redact.rows[0].description});
    }
});
//
router.post('/error_unit_redact', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const newErrorName = req.body.newErrorName;
    const newErrorDescription = req.body.newErrorDescription;
    const redact = req.body.redact;

    let before = await db.query(`SELECT * from sap.unit_errors where id = '${redact}'`);
    let after = await db.query(`update sap.unit_errors set name = '${newErrorName}', description = '${newErrorDescription}' where id = '${redact}' returning *`);
    if (after.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.unit_errors`, before.rows, after.rows, 2);
    }

    let error_data = await db.query(`SELECT * from sap.unit_errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_unit_delete', matchErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const redact = req.body.redact;

    let deleted = await db.query(`delete from sap.unit_errors where id = '${redact}' returning *`);
    if (deleted.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.unit_errors`, deleted.rows, null, 0);
    }

    let deleted_connections = await db.query(`DELETE FROM sap.unit_errors_connections where error_id = '${redact}' returning *`);
    if (deleted_connections.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.unit_errors_connections`, deleted_connections.rows, null, 0);
    }

    let error_data = await db.query(`SELECT * from sap.unit_errors order by id`);
    let error_list = error_data.rows;

    res.status(200).json({error_list});
});
//
router.post('/error_unit_list_connect', matchUnitErrorTag, checkUser, actionLogger, async function(req, res, next) {
    const unitItem = req.body.unitItem;
    const item = req.body.item;

    for (let unit of unitItem.units) {
        let current_data = await db.query(`SELECT * FROM sap.unit_errors_connections where unit_id = '${unit.id}' and error_id = '${item.id}'`);
        let current = current_data.rows;

        if (current.length !== 0) {
            let deleted = await db.query(`DELETE FROM sap.unit_errors_connections where unit_id = '${unit.id}' and error_id = '${item.id}' returning *`);
            if (deleted.rows.length > 0) {
                await saveToTrash(req.log_id_promise, `sap.unit_errors_connections`, deleted.rows, null, 0);
            }
        }
        else {
            let added = await db.query(`INSERT INTO sap.unit_errors_connections (unit_id, error_id) VALUES ('${unit.id}', '${item.id}') returning *`);
            if (added.rows.length > 0) {
                await saveToTrash(req.log_id_promise, `match.sap.unit_errors_connections`, null, added.rows, 1);
            }
        }
    }

    let item_errors_data = await db.query(`SELECT * from sap.unit_errors_connections where unit_id = '${unitItem.units[0].id}'`);
    let item_errors = item_errors_data.rows;

    item_errors = item_errors.map(item_error => item_error.error_id);

    let errors_data = await db.query(`select * from sap.unit_errors where id in 
    (select error_id as id from sap.unit_errors_connections where unit_id = '${unitItem.units[0].id}')`);
    let unit_errors = errors_data.rows;

    res.status(200).json({item_errors, unit_errors});

    save_match([unitItem.units.map(item => item.dep_id)]).then(() => {});
});

module.exports = router;