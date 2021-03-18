var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getUpr,
    getZam,
    getDepsID,
    getOutstate,
    getAssistant,
    getVspCount,
    getVsp,
    getKicCount,
    getKic
} = require('./help');


router.post('/', checkUser, actionLogger, async function(req, res, next) {
  console.time('deps');
  let obj = {
    1:{zam:null,count:null},
    2:{zam:null, count:null},
    3:{zam:null, count:null},
    4:{zam:null, count:null}, 
    5:{zam:null, count:null},
    6:{out:[]}
  };
  let dep = req.body.dep ? req.body.dep : req.body.depName ;
  let upr = await getUpr(dep, req.body.date);
  
  obj.upr = upr.upr;
  obj.uprCount = upr.uprCount;
  let roznSet = await getZam(1, dep, req.body.date);
  console.time('1');
  obj[1].own = await getDepsID(1, req.body.date, dep, 3);
  obj[1].zam = roznSet.zam;
  obj[1].count = roznSet.count;
  obj[1].vsp = await getVspCount(dep, req.body.date);
  console.timeEnd('1');
  let korpInvest = await getZam(2, dep, req.body.date);
  console.time('2');
  obj[2].own = await getDepsID(2, req.body.date, dep, 3);
  obj[2].zam = korpInvest.zam;
  obj[2].count = korpInvest.count;
  console.timeEnd('2');
  let probAct  = await getZam(3, dep, req.body.date);
  console.time('3');
  obj[3].own = await getDepsID(3, req.body.date, dep, 3);
  obj[3].zam = probAct.zam;
  obj[3].count = probAct.count;
  console.timeEnd('3');
  let service = await getZam(4, dep, req.body.date);
  console.time('4');
  obj[4].own = await getDepsID(4, req.body.date, dep, 3);
  obj[4].zam = service.zam;
  obj[4].count = service.count;
  obj[4].kic = await getKicCount(dep, req.body.date);
  console.timeEnd('4');
  let slave = await getZam(5, dep, req.body.date);
  console.time('5');
  obj[5].slave = slave.zam;
  if(obj[5].slave){
    obj[3].zam = slave.zam
  }
  obj[5].count = slave.count;
  obj[5].own = await getDepsID(5, req.body.date, dep, 3);
  console.timeEnd('5');
  let hr = await getZam(6, dep, req.body.date);
  console.time('6');
  obj[6].zam = hr.zam;
  obj[6].count = hr.count;
  obj[6].own = await getDepsID(6, req.body.date, dep, 3);
  console.timeEnd('6');
  obj['out'] = await getOutstate(dep, req.body.date);
  obj['assistant'] = await getAssistant(dep, req.body.date);
  console.timeEnd('deps');
  res.json(obj);
});

router.post('/vsp', checkUser, actionLogger, async function(req, res, next) {
  res.json({vsp: (await getVsp(req.body.bank, req.body.date))});
});

router.post('/kic', checkUser, actionLogger, async function(req, res, next) {
  res.json({kic: (await getKic(req.body.bank, req.body.date))});
});

module.exports = router;