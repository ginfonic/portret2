var express = require('express');
var router = express.Router();
const {actionLogger} = require('../../../middleware/actionsLogging');
const {deviationCountUrmUpdateTag, footnoteUrmCountDeviationsTag} = require('../../../middleware/logTags');
const {checkUser} = require('../../../middleware');
const {
    getDeviations,
    getFootCount,
    setFootCount,
    getFootUrm,
    setFootUrm,
    getFootSameDep,
    setFootSameDep,
    count_update,
    urm_update,
    filter_list,
    same_dep_update
} = require('./help');

router.post('/count_update', checkUser, deviationCountUrmUpdateTag, actionLogger, async function(req, res, next) {
    await count_update(req.body.otdelValue, req.body.sectorValue);
    let result=[];
    res.json(result);
});

router.get('/urm_update', checkUser, deviationCountUrmUpdateTag, actionLogger, async function(req, res, next) {
    await urm_update();
    let result=[];
    res.json(result);
});

router.get('/same_dep_update', checkUser, deviationCountUrmUpdateTag, actionLogger, async function(req, res, next) {
    await same_dep_update();
    let result=[];
    res.json(result);
});

router.post('/count', checkUser, actionLogger, async function(req, res, next) {
    let result = await getDeviations('count', req.body.type, req.body.filter);
    res.json(result);
});

router.post('/urm', checkUser, actionLogger, async function(req, res, next) {
    let result = await getDeviations('urm', req.body.type, req.body.filter);
    res.json(result);
});

router.post('/samedep', checkUser, actionLogger, async function(req, res, next) {
    let result = await getDeviations('samedep', req.body.type, req.body.filter);
    res.json(result);
});

router.get('/getfootcount', checkUser, actionLogger, async function(req, res, next) {
    let result = await getFootCount();
    res.json(result);
});

router.post('/setfootcount', checkUser, footnoteUrmCountDeviationsTag, actionLogger, async function(req, res, next) {
    await setFootCount(req.body.id, req.log_id_promise);
    let result = await getFootCount();
    res.json(result);
});

router.get('/getfooturm', checkUser, actionLogger, async function(req, res, next) {
    let result = await getFootUrm();
    res.json(result);
});

router.post('/setfooturm', checkUser, footnoteUrmCountDeviationsTag, actionLogger, async function(req, res, next) {
    await setFootUrm(req.body.id, req.log_id_promise);
    let result = await getFootUrm();
    res.json(result);
});

router.get('/getfootsamedep', checkUser, actionLogger, async function(req, res, next) {
    let result = await getFootSameDep();
    res.json(result);
});

router.post('/setfootsamedep', checkUser, footnoteUrmCountDeviationsTag, actionLogger, async function(req, res, next) {
    await setFootSameDep(req.body.id, req.log_id_promise);
    let result = await getFootSameDep();
    res.json(result);
});

router.post('/filter_list',checkUser, actionLogger, async function(req, res, next) {
    const select_structure = req.body.select_structure;
    const dev_type = req.body.dev_type;

    res.status(200).json({filter_list: await filter_list(select_structure, dev_type)});
});

module.exports = router;