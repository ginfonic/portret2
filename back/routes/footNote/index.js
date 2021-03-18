var express = require('express');
var router = express.Router();
const {
  checkUser
} = require('../middleware')

/* GET home page. */
router.post('/', checkUser, function(req, res, next) {
  console.log('----->>', req.user)
  res.json({});
});

module.exports = router;
