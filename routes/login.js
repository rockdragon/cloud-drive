var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('login', {title: '第三方帐号登录'});
});

module.exports = router;