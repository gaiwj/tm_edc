/**
 * Created by robert.wu on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var title = 'eCollect®临床试验电子数据采集管理系统';
var navName = '数据采集';

// 首页
function paramConfig(req, res, next) {
    // req.method = "post";
    // config.requestPromise({
    //     req:req,
    //     urls:[{
    //         originalUrl:urls.option.getSysTypes,
    //         body:{ SystemType: 22, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
    //     }],
    //     callback:function (data) {
    //         var subjectInitStatusOptions = data[0]["BaseTypes"] || [];
            var html = template('collect/main', {
                title: title,
                navName: navName
            });
            res.send(html);
    //     }
    // });
}
router.get('/', paramConfig);
router.get('/main', paramConfig);

// 医学编码-药物(WHODD)  getDropDownHospital
router.get('/coding', function(req, res, next) {
    var html = template('collect/coding',{
        title:title,
        navName:navName
    });
    res.send(html);
});

// 不良事件(MedDRA)
router.get('/medDra', function(req, res, next) {
    var html = template('collect/medDra',{
        title:title,
        navName:navName
    });
    res.send(html);
});

// 受试者列表
router.get('/patientList', function(req, res, next) {
    var html = template('collect/patientList',{
        title:title,
        navName:navName
    });
    res.send(html);
});

// 受试者新增
router.get('/patientAdd', function(req, res, next) {
    var html = template('collect/patientAdd',{
        title:title,
        navName:navName
    });
    res.send(html);
});

// 受试者页面
router.get('/patientOne', function(req, res, next) {
    var html = template('collect/patientOne',{
        title:title,
        navName:navName
    });
    res.send(html);
});

// 受试者CRF页面
router.get('/patientCRF/', function(req, res, next) {
    var html = template('collect/patientCRF', {
        title:title,
        navName:navName
    });
    res.send(html);
});

router.get('/queryredirect/', function(req, res, next) {
    var html = template('collect/queryredirect', {
        title:title,
        navName:navName
    });
    res.send(html);
});

router.get('/query/', function(req, res, next) {
    req.method = "post";
    var CurrentProjectId = req.query.CurrentProjectId;
    var CurrentEnvironmentId = req.query.CurrentEnvironmentId;
    var CurrentDraftId = req.query.CurrentDraftId;
    console.log("\n");
    console.log("CurrentProjectId=" + CurrentProjectId);
    console.log("CurrentEnvironmentId=" + CurrentEnvironmentId);
    console.log("CurrentDraftId=" + CurrentEnvironmentId);
    console.log("\n");
    config.requestPromise({
        req: req,
        urls:[{
            originalUrl: urls.dropDown.getDropDownSubject,
            body:{ StudyId: CurrentProjectId, EnvironmentId: CurrentEnvironmentId }
        },{
            originalUrl: urls.dropDown.getDropDownQueryClass,
            body:{ IsEnable: true }
        },{
            originalUrl: urls.dropDown.getDropDownHospital,
            body:{ StudyId: CurrentProjectId }
        },{
            originalUrl: urls.draft.getDraftEvent,
            body:{ IsPaged: false, CRFVersionId: "" }
        },{
            originalUrl: urls.draft.getDraftForm,
            body:{ IsPaged: false, CRFVersionId: "" }
        },{
            originalUrl: urls.crfLib.getItemGroup,
            body:{ IsPaged: false, CRFVersionId: "" }
        }],
        callback:function (data) {
            var SubjectOptions = data[0]["SubjectItems"] || [];
            var QueryClassOptions = data[1]["QueryClassItems"] || [];
            var SiteOptions = data[2]["Sites"] || [];
            var EventOptions = data[3]["EventItems"] || [];
            var FormOptions = data[4]["FormItems"] || [];
            var ItemGroupOptions = data[5]["ItemGroupItems"] || [];
            var html = template('collect/query', {
                title: title,
                navName: navName,
                SubjectOptions: SubjectOptions,
                QueryClassOptions: QueryClassOptions,
                SiteOptions: SiteOptions,
                EventOptions: EventOptions,
                FormOptions: FormOptions,
                ItemGroupOptions: ItemGroupOptions
            });
            res.send(html);
        }
    });
});

module.exports = router;