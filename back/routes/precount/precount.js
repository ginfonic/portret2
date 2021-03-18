var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    precountDepsUpdate,
    precountUnitsUpdate,
    getdepCount,
    getAlldeps,
} = require('./help');

router.post('/', checkUser, actionLogger, async function(req, res, next) {
    req.socket.setTimeout(0);
    console.log('begin');
    await precountDepsUpdate();
    await precountUnitsUpdate();
    console.log('done');
  //  await getAlldeps()
  res.json([]);
});

router.post('/deps', checkUser, actionLogger, async function(req, res, next) {
  console.log(req.body);
  let result =  await getdepCount(req.body.type, req.body.deps);
res.json(result);
});

module.exports = router;