let express = require('express');
const db = require('../../db');
let router = express.Router();
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {matchConnectTag} = require('../../middleware/logTags');
const {save_match} = require('./help/sap');
const {checkUser} = require('../../middleware');
const {mass_matching} = require('./help/sap');
//

async function unmatch_sap(id_array, req) {
    let before_update = await db.query(`select connectedto, id from sap.deps WHERE id = ANY($1)`, [id_array]);
    let update_match = await db.query(`UPDATE sap.deps SET connectedto = NULL WHERE id = ANY($1) returning connectedto, id`, [id_array]);

    if (update_match.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.deps`, before_update.rows, update_match.rows, 2)
    }

    let before_update_unit = await db.query(`select connectedto, id from sap.a_units WHERE dep_id = ANY($1) `, [id_array]);
    let update_match_unit = await db.query(`update sap.a_units set connectedto = NULL where dep_id = ANY($1) returning connectedto, id`, [id_array]);

    if (update_match_unit.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.a_units`, before_update_unit.rows, update_match_unit.rows, 2)
    }

    save_match(id_array).then(() => {})
}

router.post('/change_connected', matchConnectTag, checkUser, actionLogger, async function(req, res, next) {
    const chosen_id = req.body.chosen_id;
    let bestMatchesChecked = req.body.bestMatchesChecked;
    let sapChecked = req.body.sapChecked;
    const mass = req.body.mass;

    if (mass) {
        let new_sap = [];
        sapChecked.map(item => new_sap.push(...item.deps.map(dep => dep.id)));
        sapChecked = new_sap;

        let new_best = [];
        bestMatchesChecked.map(item => new_best.push(...item.deps.map(dep => dep.id)));
        bestMatchesChecked = new_best
    }

    let before_update_best_matches = await db.query(`select connectedto, id from sap.deps WHERE id = ANY($1)`, [bestMatchesChecked]);
    let update_best_matches = await db.query(`UPDATE sap.deps SET connectedto = '${chosen_id}' WHERE id = ANY($1) returning connectedto, id`, [bestMatchesChecked]);

    if (update_best_matches.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.deps`, before_update_best_matches.rows, update_best_matches.rows, 2)
    }

    let before_update_sap = await db.query(`select connectedto, id from sap.deps WHERE id = ANY($1)`, [sapChecked]);
    let update_sap = await db.query(`UPDATE sap.deps SET connectedto = '${chosen_id}' WHERE id = ANY($1) returning connectedto, id`, [sapChecked]);

    if (update_sap.rows.length > 0) {
        await saveToTrash(req.log_id_promise, `sap.deps`, before_update_sap.rows, update_sap.rows, 2)
    }

    let connected = await db.query(`SELECT * FROM sap.deps WHERE connectedto = '${chosen_id}' ORDER BY id`);

    connected = connected.rows;

    if (mass) {
        connected = mass_matching(connected);
    }

    res.status(200).json({connected});

    save_match([...bestMatchesChecked, ...sapChecked]).then(() => {})
});
//
router.post('/remove_connected', matchConnectTag, checkUser, actionLogger, async function(req, res, next) {
    const chosen_id = req.body.chosen_id;
    let connectedChecked = req.body.connectedChecked;
    const mass = req.body.mass;

    if (mass) {
        let new_sap = [];
        connectedChecked.map(item => new_sap.push(...item.deps.map(dep => dep.id)));
        connectedChecked = new_sap;
    }

    await unmatch_sap(connectedChecked, req);

    let connected = await db.query(`SELECT * FROM sap.deps WHERE connectedto = '${chosen_id}' ORDER BY id`);

    connected = connected.rows;

    if (mass) {
        connected = mass_matching(connected);
    }

    res.status(200).json({connected});
});
//
router.post('/unmatch_elem', matchConnectTag, checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    await unmatch_sap([id], req);

    res.status(200).json({});
});

module.exports = router;