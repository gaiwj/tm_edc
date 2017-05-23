/**
 * Created by sky.cai on 2017/5/10.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var redis = require("./redis");
/* POST login . */
router.get('/GetPower', function(req, res, next) {
    config.request({
        req: req,
        callback: function (result) {
            var permissionArray = transferPower(result.Body.MenuItems)
            //req.session.permission = permissionArray;
            res.cookie('permission',JSON.stringify(permissionArray) , {
                path:'/', maxAge:3600*1000
            });
            res.json(result);
        }
    });
});

//根据获取到的权限数据MenuItems，转换成权限数字数组[2,3,4]
function transferPower(data,bool){
    if(!bool) {
        permission = [];
    }
    for(var i=0,len=data.length;i<len;i++) {
        var item = data[i];
        if(permission.indexOf(item.Value) < 0 && item.IsChecked) {
            permission.push(item.Value);
        }
        if(item.Children && item.Children.length > 0) {
            arguments.callee.call(this,item.Children,true);
        }
    }
    return permission;
}

module.exports = router;