/**
 * Created by snowden.xu on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var title = 'eCollect®临床试验电子数据采集管理系统';
var navName = 'ODM导出';

// ODM导出
function exports(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl: urls.dropDown.getDropDownDataRange,
            body: {Id: ""}
        },{
            method:"GET",
            originalUrl:urls.user.getProjects
        },{
            originalUrl:urls.dropDown.getDropDownOID
        },{
            originalUrl:urls.dropDown.getDropDownCRFVersion
        },{
            originalUrl:urls.dropDown.getDropDownRefOID
        }],

        callback:function (data) {
            var _data1=data[0];
            var _data2=data[1];
            var _data3=data[2];
            var _data4=data[3];
            var _data5=data[4];

            var html = template('odm/exports',{
                title:title,
                navName:navName,
                getDropDownDataRange: _data1.DataRangeItems,
                Projects:_data2.Projects,
                getDropDownOID:_data3.DataRangeItems,
                getDropDownCRFVersion:_data4.CRFVersionItems,
                getDropDownRefOID:_data5.DataRangeItems
            });
            res.send(html);
        }
    });
}
router.get('/', exports);
router.get('/exports', exports);

// 导出日志
function exportLog(req, res, next) {
    var html = template('odm/exportLog',{
        title:title,
        navName:navName
    });
    res.send(html);
}
router.get('/', exportLog);
router.get('/exportLog', exportLog);

// 导出配置
function exportConfig(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.dropDown.getDropDownDataRange,
            body:{ Id:""}
        },{
            originalUrl:urls.role.getRole,
            body:{ IsPaged:false, FType:2}
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 16, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var getDropDownDataRange = data[0]['DataRangeItems'] || [];
            var getRole = data[1]['RoleItems'] || [];
            var getSysTypes = data[2]["BaseTypes"] || [];
            var html = template('odm/exportConfig',{
                title:title,
                navName:navName,
                getDropDownDataRange:getDropDownDataRange,
                getRole:getRole,
                getSysTypes:getSysTypes
            });
            res.send(html);
        }
    });
}
router.get('/exportConfig', exportConfig);

module.exports = router;

