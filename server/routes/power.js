var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls=require('../public/assets/js/modules/urls');
var navName='权限配置';
router.get('/', function(req, res, next) {
    var html = template('power/queryClass',{title:'eCollect®临床试验电子数据采集管理系统',navName:navName});
    res.send(html);
});
router.get('/enterpriseRole', function(req, res, next) {
    var html = template('power/enterpriseRole',{title:'eCollect®临床试验电子数据采集管理系统',navName:navName});
    res.send(html);
});
router.get('/subjectRole', function(req, res, next) {
    var html = template('power/subjectRole',{title:'eCollect®临床试验电子数据采集管理系统',navName:navName});
    res.send(html);
});
router.get('/user', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[
            {
            originalUrl:urls.option.getSysTypes,
            body:{
                SystemType: 16,
                IsNormalDataType: false,
                GlobalValue: 2,
                Action: 2
                }
        },
        {
            originalUrl:urls.role.getRole,
            body:{
                FType:1,
                IsEnable : true
            }
        },
        {
            method:"GET",
            originalUrl:urls.user.getProjects
        },
        {
            originalUrl:urls.crf.getEnvironment
        },
        {
            originalUrl:urls.role.getRole,
            body:{
                FType:2,
                IsEnable : true
            }
        }],
        callback:function (data) {
            var _data1=data[0];
            var _data2=data[1];
            var _data3=data[2];
            var _data4=data[3];
            var _data5=data[4];
            var html = template('power/user',{
                title:'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                DefaultLanguage:_data1.BaseTypes,
                RoleItems:_data2.RoleItems,
                Projects:_data3.Projects,
                EnvironmentItems:_data4.EnvironmentItems,
                RoleItems2:_data5.RoleItems
            });
            res.send(html);
        }
    })

});
router.get('/sign', function(req, res, next) {
    config.syncRequest({
        req:req,
        originalUrl:urls.user.getSignature,
        callback:function (data) {
            var html = template('power/sign',{
                title:'eCollect®临床试验电子数据采集管理系统',
                signatures:data.Signatures,
                navName:navName
            });
            res.send(html);
        }
    });

});
module.exports = router;