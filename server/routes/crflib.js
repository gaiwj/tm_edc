/**
 * Created by sky.cai on 2017/4/17.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var title = 'eCollect®临床试验电子数据采集管理系统';
var navName = 'CRF通用库';

// 加载编码字典模板
function codeDictionary(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 10, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 3, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 8, IsNormalDataType: true, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var dictionTypeOptions = data[0]["BaseTypes"] || [];
            var codeTypeOptions = data[1]["BaseTypes"] || [];
            var dataTypeOptions = data[2]["BaseTypes"] || [];
            var standardTypeOptions = data[3]["BaseTypes"] || [];
            var html = template('crflib/codeDictionary',{
                title:title,
                navName:navName,
                DictionTypeOptions: dictionTypeOptions,
                CodeTypeOptions: codeTypeOptions,
                DataTypeOptions: dataTypeOptions,
                StandardTypeOptions: standardTypeOptions
            });
            res.send(html);
        }
    });
}
router.get('/', codeDictionary);
router.get('/codeDictionary', codeDictionary);

// Item定义
router.get('/item', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 8, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var dataTypeOptions = data[0]["BaseTypes"] || [];
            var standardTypeOptions = data[1]["BaseTypes"] || [];
            dataTypeOptions.unshift({ Name: "全部" });
            standardTypeOptions.unshift({ Name: "全部" });
            var html = template('crflib/item',{
                title:title,
                navName:navName,
                DataTypeOptions: dataTypeOptions,
                StandardTypeOptions: standardTypeOptions
            });
            res.send(html);
        }
    });
 });



// ItemGroup定义
router.get('/itemGroup', function(req, res, next) {
    req.method = "post";
    config.syncRequest({
         req:req,
         originalUrl:urls.option.getSysTypes,
         body:{
             SystemType: 21,
             IsNormalDataType: false,
             GlobalValue: 2,
             Action: 2
         },
         callback:function (data) {
             data.BaseTypes.unshift({ Name: "全部" });
             var html = template('crflib/itemGroup',{
                 title:title,
                 navName:navName,
                 StandardTypeOptions: data.BaseTypes
             });
             res.send(html);
         }
     });
});

// 表单定义
function form(req, res, next) {
    req.method = "post";
    config.syncRequest({
        req:req,
        originalUrl:urls.option.getSysTypes,
        body:{
            SystemType: 21,
            IsNormalDataType: false,
            GlobalValue: 2,
            Action: 2
        },
        callback:function (data) {
            var html = template('crflib/form',{
                title:title,
                navName:navName,
                StandardTypeOptions: data.BaseTypes
            });
            res.send(html);
        }
    });
}
router.get('/form', form);


// 研究事件定义
function studyEvent(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 11, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var dataTypeOptions = data[0]["BaseTypes"] || [];
            var standardTypeOptions = data[1]["BaseTypes"] || [];
            var html = template('crflib/studyEvent',{
                title:title,
                navName:navName,
                DataTypeOptions: dataTypeOptions,
                StandardTypeOptions: standardTypeOptions
            });
            res.send(html);
        }
    });
}
router.get('/studyEvent', studyEvent);

module.exports = router;