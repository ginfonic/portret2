var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');

const {
    getColors,
    redactColor,
    addColor,
    delColor,
} = require('./help');

router.post('/', checkUser, actionLogger, async function(req, res, next) {

  res.json([]);
});

router.post('/getcolors', checkUser, actionLogger, async function(req, res, next) {
    let color = await getColors(req.body.main);
    res.json(color);
  });

  router.post('/redactcolor', checkUser, actionLogger, async function(req, res, next) {
    const color = req.body.color;
    const unit = req.body.newColorUnit;
    const if_redact = req.body.if_redact;
    const main = req.body.main;
    let result = await redactColor(color, unit, if_redact, main);
    res.json(result);
  });

  router.post('/addcolor', checkUser, actionLogger, async function(req, res, next) {
    const color = req.body.color;
    const unit = req.body.newColorUnit;
    const if_redact = req.body.if_redact;
    const main = req.body.main;
    let result = await addColor(color, unit, if_redact, main);
    res.json(result);
  });

  router.post('/deletecolor', checkUser, actionLogger, async function(req, res, next) {
    const id = req.body.id;
    const main = req.body.main;
    let result = await delColor(id, main);
    res.json(result);
  });

module.exports = router;