var express = require('express');
var router = express.Router();
const {
    checkUser,
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getAll,
    addNote,
    dellNote,
    updateNote
} = require('./help');

router.post('/', checkUser, actionLogger, async function (req, res, next) {
    let foots = await getAll();

    res.json(foots);
});

router.post('/add', checkUser, actionLogger, async function (req, res, next) {
    await addNote(+req.body.num, req.body.text);
    res.json([]);
});

router.post('/del', checkUser, actionLogger, async function (req, res, next) {
    await dellNote(req.body.id);
    res.json([]);
});

router.post('/update', checkUser, actionLogger, async function (req, res, next) {
    await updateNote(req.body.id, req.body.num, req.body.text);
    res.json([]);
});
module.exports = router;
