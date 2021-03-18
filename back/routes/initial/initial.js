var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
  getColors,
  getColorEx,
  lastDate,
  allDates
} = require('./help');

router.post('/', checkUser, async function(req, res, next) {
   let color = await getColors();
   let colorEx = await getColorEx();
   let maxDate = await lastDate();
  res.json({user:req.user, colorMain: color, colorEx: colorEx, date: maxDate});
});

router.post('/alldates', checkUser, async function(req, res, next) {
  let result = await allDates();
 res.json(result);
});


module.exports = router;