/**
 * Created by robert.wu on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var navName = 'CRF构建';

function paramConfig(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 22, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var subjectInitStatusOptions = data[0]["BaseTypes"] || [];
            var html = template('crf/paramConfig',{
                title:'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                SubjectInitStatusOptions: subjectInitStatusOptions
            });
            res.send(html);
        }
    });
}
router.get('/', paramConfig);
router.get('/paramConfig', paramConfig);

router.get('/unitDictionary', function(req, res, next) {
    var html = template('crf/unitDictionary',{
        title:'eCollect®临床试验电子数据采集管理系统',
        navName:navName
    });
    res.send(html);
});

router.get('/unitGroupDictionary', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.lab.getUnit,
            body:{ IsPaged: false, IsLab: false }
        }],
        callback:function (data) {
            var UnitOptions = data[0]["UnitItems"] || [];
            var html = template('crf/unitGroupDictionary',{
                title:'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                UnitOptions: UnitOptions
            });
            res.send(html);
        }
    });

});

router.get('/crfDraft', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req: req,
        urls: [
            {
                method: "GET",
                originalUrl: urls.user.getProjects
            },
            {
                originalUrl: urls.crf.getEnvironment,
                body:{ IsPaged: false, IsEnable: true, IsProc: false }
            },
            {
                originalUrl: urls.crf.getEnvironment,
                body:{ IsPaged: false, IsEnable: true, IsProc: true }
            }
        ],
        callback: function (data) {
            var ProjectOptions = data[0]["Projects"] || [];
            var EnvironmentOptions = data[1]["EnvironmentItems"] || [];
            var ProcEnvironmentId = (data[2] && data[2]["EnvironmentItems"] && data[2]["EnvironmentItems"].length > 0) ? data[2]["EnvironmentItems"][0]["Id"] : "";
            var html = template('crf/crfDraft', {
                title:'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                ProjectOptions: ProjectOptions,
                EnvironmentOptions: EnvironmentOptions,
                ProcEnvironmentId: ProcEnvironmentId
            });
            res.send(html);
        }
    });
});

router.get('/hospitalCRFVersion', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req: req,
        urls: [{
            originalUrl: urls.crf.getEnvironment,
            body:{ IsPaged: false }
        }],
        callback: function (data) {
            var EnvironmentOptions = data[0]["EnvironmentItems"] || [];
            var html = template('crf/hospitalCRFVersion', {
                title: 'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                EnvironmentOptions: EnvironmentOptions
            });
            res.send(html);
        }
    });
});

router.get('/versionTransfer', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req: req,
        urls: [{
            method:"GET",
            originalUrl: urls.user.getProjects
        },{
            originalUrl: urls.crf.getEnvironment,
            body: { IsPaged: false }
        },{
            originalUrl: urls.dropDown.getDropDownCRFVersion
        }],

        callback: function (data) {
            var Projects = data[0]["Projects"] || [];
            var EnvironmentItems = data[1]["EnvironmentItems"] || [];
            var CRFVersionItems = data[2]["CRFVersionItems"] || [];

            var html = template('crf/versionTransfer',{
                title: 'eCollect®临床试验电子数据采集管理系统',
                navName:navName,
                Projects: Projects,
                EnvironmentItems: EnvironmentItems,
                CRFVersionItems: CRFVersionItems
            });
            res.send(html);
        }
    });
});


module.exports = router;