var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getDeps,
    getUpr,
    getZam,
    getAll,
    getAssistant,
    changeDeps
} = require('./help');

router.post('/getdeps', checkUser, actionLogger,  async function(req, res, next) {
    let deps = await getDeps();
  res.json(deps);
});

router.post('/data', checkUser, async function(req, res, next) {
  let obj = {1:'',2:'',3:'', 4:'', 5:'', 6:''};
  obj['upr'] = await getUpr(req.body.dep, req.body.date);
  obj[1] = await getZam(1, req.body.dep, req.body.date);
  obj[2] = await getZam(2, req.body.dep, req.body.date);
  obj[3] = await getZam(3, req.body.dep, req.body.date);
  obj[4] = await getZam(4, req.body.dep, req.body.date);
  obj[6] = await getZam(6, req.body.dep, req.body.date);
  if(obj[3] === null){
    obj[3] = await getZam(5, req.body.dep, req.body.date);
  }
  obj['all'] = await getAll(req.body.dep, req.body.date);
  obj['assistant'] = await getAssistant(req.body.dep, req.body.date);
 res.json(obj);
});

router.post('/changedeps', checkUser, actionLogger,  async function(req, res, next) {
  await changeDeps(req.body.id, req.body.selected, req.body.depname);

res.json([]);
});
module.exports = router;