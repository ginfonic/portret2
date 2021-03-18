var express = require('express');
var router = express.Router();
const {checkUser} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');
const {
    getDeps,
    getAllDeps,
    getGosb
} = require('./help');

router.post('/', checkUser, actionLogger, async function(req, res, next) {
   let deps =  await getDeps();
  res.json(deps);
});

router.post('/getall', checkUser, async function(req, res, next) {
  let result = await getAllDeps(req.body.type);
  res.json(result);
});

router.post('/getgosb', checkUser, async function(req, res, next) {
  let gosb = await getGosb(req.body.depName)
  res.json(gosb);
});
module.exports = router;
