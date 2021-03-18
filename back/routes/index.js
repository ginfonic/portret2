var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../middleware')

/* GET home page. */
router.post('/test', checkUser, function(req, res, next) {
  res.json({});
});

module.exports = router;
