var express = require('express');
var router = express.Router();
const db = require('../../db/index');
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getChild,
    depInfo,
    fill_parents
} = require('./help');

router.post('/', checkUser, actionLogger, async function(req, res, next) {
   let deps = await depInfo(req.body.depId, req.body.date);
  res.json(deps);
});

router.post('/bread_parent', checkUser, async function(req, res, next) {
    const depId = req.body.depId;

    let parents = {id: null, parent: null, type: 'tb', depname: ''};

    let parent = await db.query(`select type, depname, parent from sap.deps where id = ${depId === null ? 'null' : `'${depId}'`}`);
    if (parent.rows.length === 1) {
        parents = {
            id: depId,
            parent: await fill_parents(parent.rows[0].parent),
            type: parent.rows[0].type,
            depname: parent.rows[0].depname
        };
    }

    res.json({parents});
});

module.exports = router;