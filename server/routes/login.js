var express = require('express');
var router = express.Router();
var template = require('art-template');
/* GET login . */
router.get('/', function(req, res, next) {
    var html = template('login', {title:"eCollect®临床试验电子数据采集管理系统"});
	res.send(html);
});

module.exports = router;
