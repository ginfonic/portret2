var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    addOrder,
    delOrder,
    updateOrder,

} = require('./help')


router.post('/add', checkUser, actionLogger, async function(req, res, next) {
    await addOrder(req.body.num, req.body.date, req.body.name, req.body.text, req.body.id)
  res.json([]);
});

router.post('/del', checkUser, actionLogger, async function(req, res, next) {
    await delOrder(req.body.id)
  res.json([]);
});

router.post('/update', checkUser, actionLogger, async function(req, res, next) {
    await updateOrder(req.body.num, req.body.date, req.body.name, req.body.text, req.body.id)
  res.json([]);
});
module.exports = router;