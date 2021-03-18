var express = require('express');
var router = express.Router();
const {
  checkUser,
  
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getAll,
    updateBlock
} = require('./help');

router.post('/', checkUser, actionLogger, async function(req, res, next) {
    let blocks = await getAll();
  res.json(blocks);
});

router.post('/change', checkUser, actionLogger, async function(req, res, next) {
    await updateBlock(req.body.id, req.body.block);
    let blocks = await getAll();
  res.json(blocks);
});



module.exports = router;