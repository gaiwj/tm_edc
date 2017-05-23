/**
 * Created by snowden.xu on 2017/5/2.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var title = 'eCollect®临床试验电子数据采集管理系统';
var navName = '实验管理';

// 检验项
router.get('/', function(req, res, next) {
    req.method = "post";
    config.syncRequest({
        req:req,
        originalUrl:urls.lab.getUnitGroup,
        body:{
            IsPaged: false,
            IsBase: false,
            IsLab: true
        },
        callback:function (data) {
            var html = template('exp/labItem',{
                title:title,
                navName:navName,
                unitGroupItems: data.UnitGroupItems
            });
            res.send(html);
        }
    });
});

// 实验室
router.get('/laboratory', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 15, IsNormalDataType: false, GlobalValue: 0, Action: 2 }
        },{
            originalUrl:urls.lab.getRangeType,
            body:{ IsPaged: false }
        }],
        callback:function (data) {
            var LabTypeOptions = data[0]["BaseTypes"] || [];
            var LabTypeOptions2 = [];
            for (var i = 0; i < LabTypeOptions.length; i++) {
                if (LabTypeOptions[i].Value == 2) {
                    LabTypeOptions2.push(LabTypeOptions[i]);
                }
            }

            var RangeTypeOptions = data[1]["RangeTypeItems"] || [];
            var html = template('exp/laboratory',{
                title:title,
                navName:navName,
                LabTypeOptions:LabTypeOptions,
                LabTypeOptions2:LabTypeOptions2,
                RangeTypeOptions:RangeTypeOptions
            });
            res.send(html);
        }
    });
});
router.get('/pointHospital', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req: req,
        urls: [{
            method:"GET",
            originalUrl: urls.user.getProjects
        }],
        callback: function (data) {
            var StudyOptions = data[0]["Projects"] || [];
            var html = template('exp/pointHospital', {
                title: title,
                navName: navName,
                StudyOptions: StudyOptions
            });
            res.send(html);
        }
    });
});
router.get('/setRange', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req: req,
        urls: [{
            originalUrl: urls.lab.getLabItems,
            body:{ IsPaged: false }
        }],
        callback: function (data) {
            var LabItemsItems = data[0]["LabItemsItems"] || [];
            var html = template('exp/setRange', {
                title: title,
                navName: navName,
                LabItemsItems: LabItemsItems
            });
            res.send(html);
        }
    });
});


// 全局检验
router.get('/globalCheck', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 15, IsNormalDataType: false, GlobalValue: 1, Action: 2 }
        },{
            originalUrl:urls.lab.getRangeType,
            body:{ IsPaged: false }
        }],
        callback:function (data) {
            var LabTypeOptions = data[0]["BaseTypes"] || [];
            var RangeTypeOptions = data[1]["RangeTypeItems"] || [];
            var html = template('exp/globalCheck',{
                title:title,
                navName:navName,
                LabTypeOptions:LabTypeOptions,
                RangeTypeOptions:RangeTypeOptions
            });
            res.send(html);
        }
    });
});


// 范围类型
function expression(name,req,res){
    req.method = "post";
    config.syncRequest({
        req:req,
        originalUrl:urls.lab.getVariable,
        callback:function (data) {
            var html = template('exp/expression',{
                title:title,
                navName:navName,
                name:name,
                VariableItems: data.VariableItems
            });
            res.send(html);
        }
    });
}

router.get('/rangeType', function(req, res, next) {
    var name = req.query.name;
    if(!name){
        var html = template('exp/rangeType',{
            title:title,
            navName:navName
        });
        res.send(html);
    }else{
        expression(name,req,res);
    }
});

// 单位换算
function convertConfig(oid,req,res){
    req.method = "post";
/*    config.syncRequest({
        req:req,
        originalUrl:urls.lab.getUnit,
        body:{
            IsPaged:false,
            IsLab:true
        },
        callback:function (data) {
            var html = template('exp/convertConfig',{
                title:title,
                navName:navName,
                oid:oid,
                UnitItems: data.UnitItems
            });
            res.send(html);
        }
    });*/
        config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 9, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.lab.getUnit,
            body:{ IsPaged:false, IsLab:true}
        },{
            originalUrl:urls.lab.getLabItems,
            body:{ IsPaged:false}
        }],
        callback:function (data) {
            var dictionTypeOptions = data[0]["BaseTypes"] || [];
            var unitItems = data[1]["UnitItems"] || [];
            var labItemsItems = data[2]["LabItemsItems"] || [];
            var html = template('exp/convertConfig',{
                title:title,
                navName:navName,
                oid:oid,
                dictionTypeOptions:dictionTypeOptions,
                unitItems: unitItems,
                labItemsItems:labItemsItems
            });
            res.send(html);
        }
    });
}

router.get('/convert', function(req, res, next) {
    var oid = req.query.oid;
    if(!oid){
        req.method = "post";
        config.syncRequest({
             req:req,
             originalUrl:urls.option.getSysTypes,
             body:{
                 SystemType: 6,
                 IsNormalDataType: false,
                 GlobalValue: 2,
                 Action: 2
             },
             callback:function (data) {
                 var html = template('exp/convert',{
                     title:title,
                     navName:navName,
                     StandardTypeOptions: data.BaseTypes
                 });
                 res.send(html);
             }
        });
    }else{
        convertConfig(oid,req,res);
    }

});
// 全局单位
router.get('/unitDictionary', function(req, res, next) {
    var html = template('exp/unitDictionary',{
        title:title,
        navName:navName
    });
    res.send(html);
});
// 全局单位组
router.get('/unitGroupDictionary', function(req, res, next) {
    req.method='POST';
    config.syncRequest({
        req:req,
        originalUrl:urls.lab.getUnit,
        body:{
            IsPaged:false,
            IsLab:true
        },
        callback:function (data) {
            var unititem=data.UnitItems;
            var html = template('exp/unitGroupDictionary',{
                title:title,
                navName:navName,
                unitItem:unititem
            });
            res.send(html);
        }
    });
});
// 全局字典
router.get('/globalDictionary', function(req, res, next) {
    req.method='POST';
    config.syncRequest({
        req:req,
        originalUrl:urls.option.getSysTypes,
        body:{
            SystemType: 8,
            IsNormalDataType: true,
            GlobalValue: 2,
            Action: 2
        },
        callback:function (data) {
            var dataTypeOptions=data.BaseTypes;
            var html = template('exp/globalDictionary',{
                title:title,
                navName:navName,
                DataTypeOptions:dataTypeOptions
            });
            res.send(html);
        }
    });
});
// 全局变量
router.get('/globalVariable', function(req, res, next) {
    req.method='POST';
    config.requestPromise({
        req:req,
        urls:[
            {
                originalUrl:urls.option.getSysTypes,
                body:{
                    SystemType: 8,
                    IsNormalDataType: true,
                    GlobalValue: 2,
                    Action: 2
                }
            },
            {
                originalUrl:urls.lab.getDiction,
                body:{
                    IsPaged : false, IsBase: false, IsLab : true
                }
            },
            {
                originalUrl:urls.lab.getUnitGroup,
                body:{
                    IsPaged : false, IsBase: false, IsLab : true
                }
            }
        ],
        callback:function (data) {
            var dataTypeOptions=data[0].BaseTypes;
            var dictionaryItems=data[1].DictionaryItems;
            var unitGroupItems=data[2].UnitGroupItems;
            var html = template('exp/globalVariable',{
                title:title,
                navName:navName,
                DataTypeOptions:dataTypeOptions,
                DictionaryItemsOptions:dictionaryItems,
                UnitGroupItemsOptions:unitGroupItems
            });
            res.send(html);
        }
    })
});
module.exports = router;