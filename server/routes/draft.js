/**
 * Created by snowden.xu on 2017/5/8.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls = require("../public/assets/js/modules/urls");
var title = 'eCollect®临床试验电子数据采集管理系统';
var navName = 'CRF构建';

// 草案设置
function draftConfig(req, res, next) {
    req.method = "get";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.user.getProjects
        }],
        callback:function (data) {
            console.log(data.Projects);
            var html = template('draft/draftConfig',{
                title:title,
                navName:navName,
                Projects:data[0].Projects
            });
            res.send(html);
        }
    });
}
router.get('/', draftConfig);

// 编码字典
function codingDictionary(req, res, next) {
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 8, IsNormalDataType: true, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }
        ],
        callback:function(data){
            var dataTypeOptions = data[0]["BaseTypes"] || [];
            var standardTypeOptions = data[1]["BaseTypes"] || [];
            var html = template('draft/codingDictionary',{
                title:title,
                navName:navName,
                dataTypeOptions:dataTypeOptions,
                standardTypeOptions:standardTypeOptions
            });
            res.send(html);
        }
    })
}
router.get('/codingDictionary', codingDictionary);
router.get('/item', function(req, res, next) {

    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 8, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.lab.getUnitGroup,
            body:{
                IsPaged:false, IsBase:true, IsLab:false
            }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 17, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }
        ],
        callback:function(data){
            var dataTypeOptions = data[0]["BaseTypes"] || [];
            var standardTypeOptions = data[1]["BaseTypes"] || [];
            var unitGroupItems = data[2]["UnitGroupItems"] || [];
            var limitItems = data[3]["BaseTypes"] || [];
            var html = template('draft/item',{
                title:title,
                navName:navName,
                dataTypeOptions:dataTypeOptions,
                standardTypeOptions:standardTypeOptions,
                unitGroupOptions:unitGroupItems,
                limitoptions:limitItems
            });
            res.send(html);
        }
    })
});
router.get('/outerNote', function(req, res, next) {
    var html = template('draft/outerNote',{
        title:title,
        navName:navName
    });
    res.send(html);
});
router.get('/itemGroup', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[
        {
        originalUrl:urls.crfLib.getItems,
        body:{
            IsPaged :false,
            CRFVersionId : uc.CurrentDraftId
        }
        },
        {
            originalUrl:urls.role.getRole,
            body:{
                FType : 2
            }
        },
        {
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl:urls.lab.getDiction,
            body:{
                IsPaged :false,
                CRFVersionId : uc.CurrentDraftId
            }
        },
        {
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType:5,IsNormalDataType: false, GlobalValue: 2, Action: 2}
        },
        {//datatype
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType:8,IsNormalDataType: false, GlobalValue: 2, Action: 2}
        },{//hint
            originalUrl:urls.ecrf.getHint,
            body:{
                IsPaged :false,
                CRFVersionId : uc.CurrentDraftId
            }
        },{//unitgroup
            originalUrl:urls.lab.getUnitGroup,
            body:{
                IsPaged:false, IsBase:true, IsLab:false
            }
        }
        ],
        callback:function(data){
            var itemsItmes = data[0]["ItemsItems"] || [];
            var roleItems = data[1]["RoleItems"] || [];
            var standardTypeOptions = data[2]["BaseTypes"] || [];
            var dictionaryItems = data[3]["DictionaryItems"] || [];
            var controlsTypeItems = data[4]["BaseTypes"] || [];
            var datatypeItems = data[5]["BaseTypes"] || [];
            var hintItems = data[6]["HintItems"] || [];
            var unitgroupItems = data[7]["UnitGroupItems"] || [];

            var html = template('draft/itemGroup',{
                title:title,
                navName:navName,
                itemsOptions:itemsItmes,
                standardTypeOptions:standardTypeOptions,
                roleOptions:roleItems,
                dictionaryOptions:dictionaryItems,
                datatypeOptions:datatypeItems,
                hintOptions:hintItems,
                unitgroupOptions:unitgroupItems,
                controlsTypeOptions:controlsTypeItems
            });
            res.send(html);
        }
    })
});
router.get('/trialProtocol', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[
        {
            originalUrl:urls.draft.getDraftEvent,
            body:{
                IsPaged :false,
                CRFVersionId : uc.CurrentDraftId
            }
        },
        {
        originalUrl:urls.testProcedure.getEventId,
        body:{
            CRFVersionId : uc.CurrentDraftId
        }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 11, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 14, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl:urls.draft.getDraftForm,
            body:{
                IsPaged :false,
                CRFVersionId : uc.CurrentDraftId
            }
        }
        ],
        callback:function(data){
            var eventItems = data[0]["EventItems"] || [];
            var eventSimpleItems = data[1]["eventSimpleItems"] || [];
            var eventTypeItems = data[2]["BaseTypes"] || [];
            var instalmentsTypeItems = data[3]["BaseTypes"] || [];
            var formItemsItems = data[4]["FormItems"] || [];
            var html = template('draft/trialProtocol',{
                title:title,
                navName:navName,
                eventOptions:eventItems,
                eventSimpleOptions:eventSimpleItems,
                eventTypeOptions:eventTypeItems,
                instalmentsTypeOptions:instalmentsTypeItems,
                formItemsOptions:formItemsItems
            });
            res.send(html);
        }
    })
});
router.get('/editCheck', function(req, res, next) {
    var html = template('draft/editCheck',{
        title:title,
        navName:navName
    });
    res.send(html);
});
router.get('/editCheck/editCheckConfig', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[
        {
        originalUrl:urls.dropDown.getDropDownEvent,
        body:{
            CRFVersionId:uc.CurrentDraftId
        }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 13, IsNormalDataType: false, GlobalValue: 2, Action: 1 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 22, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl:urls.draft.getDraftForm,
            body:{
                IsPaged : false,
                CRFVersionId:uc.CurrentDraftId
            }
        },
        {
            originalUrl:urls.dropDown.getDropDownQueryClass,
            body:{
                IsEnable: true
            }
        },
        {
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 4, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 23, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },
        {
            originalUrl: urls.draft.getDraftEvent,
            body: {
                IsPaged: false,
                CRFVersionId: uc.CurrentDraftId
            }
        },
            {
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 13, IsNormalDataType: false, GlobalValue: 2, Action: 0 }
            }
        ],
        callback:function(data){
            var dropDownFormItems = data[0]["DropDownFormItems"] || [];
            var functionItems = data[1]["BaseTypes"] || [];
            var subjectStatusItems = data[2]["BaseTypes"] || [];
            var formItems = data[3]["FormItems"] || [];
            var queryClassItems = data[4]["QueryClassItems"] || [];
            var conditionTypeItems=data[5]["BaseTypes"] || [];
            var valueTypeItems = data[6]["BaseTypes"] || [];
            var eventItems = data[7]["EventItems"] || [];
            var functionsItems = data[8]["BaseTypes"] || [];
            var html = template('draft/editCheckConfig',{
                title:title,
                navName:navName,
                dropDownFormOptions:dropDownFormItems,
                functionOptions:functionItems,
                subjectStatusOptions:subjectStatusItems,
                formOptions:formItems,
                queryClassOptions:queryClassItems,
                conditionTypeOptions:conditionTypeItems,
                valueTypeItemsOptions:valueTypeItems,
                eventOptions:eventItems,
                functionsOptions:functionsItems
            });
            res.send(html);
        }
    })
});

router.get('/formredirect', function(req, res, next) {
    var html = template('draft/formredirect',{
        title:title,
        navName:navName
    });
    res.send(html);
});
router.get('/form', function (req, res, next) {
    req.method = "post";
    var CurrentDraftId = req.query.CurrentDraftId;
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 21, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        },{
            originalUrl:urls.ecrf.getPDFDefine,
            body:{ IsPaged: false, CRFVersionId: CurrentDraftId }
        }],
        callback:function (data) {
            var BaseTypes = data[0]["BaseTypes"] || [];
            var BaseTypes2 = data[1]["BaseTypes"] || [];
            var PDFDefineItems = data[2]["PDFDefineItems"] || [];

            var html = template('draft/form',{
                title:title,
                navName:navName,
                StandardTypeOptions: BaseTypes,
                StandardTypeOptions2: BaseTypes2,
                PDFDefineItems: PDFDefineItems
            });
            res.send(html);
        }
    });
});
router.get('/studySet', function (req, res, next) {
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
            var html = template('draft/studySet',{
                title:title,
                navName:navName,
                DataTypeOptions: dataTypeOptions,
                StandardTypeOptions: standardTypeOptions
            });
            res.send(html);
        }
    });
});
router.get('/PDFSetRidirect', function(req, res, next) {
    var html = template('draft/PDFSetRidirect',{
        title:title,
        navName:navName
    });
    res.send(html);
});
router.get('/PDFSet', function(req, res, next) {
    req.method = "post";
    var CurrentDraftId = req.query.CurrentDraftId;
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.ecrf.getPreview,
            body:{ IsPaged: false, CRFVersionId: CurrentDraftId }
        }],
        callback:function (data) {
            var PreviewOptions = data[0]["PreviewItems"] || [];
            var html = template('draft/PDFSet',{
                title:title,
                navName:navName,
                PreviewOptions: PreviewOptions
            });
            res.send(html);
        }
    });
});
router.get('/viewSet', function(req, res, next) {
    req.method = "post";
    config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.option.getSysTypes,
            body:{ SystemType: 16, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
        }],
        callback:function (data) {
            var LanguageOptions = data[0]["BaseTypes"] || [];
            var html = template('draft/viewSet',{
                title:title,
                navName:navName,
                LanguageOptions: LanguageOptions
            });
            res.send(html);
        }
    });
});

router.get('/formDesign', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[
            {
                originalUrl:urls.crfLib.getItemGroup,
                body:{
                    IsPaged :false,
                    CRFVersionId : uc.CurrentDraftId
                }
            },
            {
                originalUrl: urls.crfLib.getItems,
                body: {
                    IsPaged: false,
                    CRFVersionId: uc.CurrentDraftId
                }
            },
            {
                originalUrl:urls.role.getRole,
                body:{
                    FType : 2
                }
            },
            {
                originalUrl:urls.lab.getDiction,
                body:{
                    IsPaged :false,
                    CRFVersionId : uc.CurrentDraftId
                }
            },
            {
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType:5,IsNormalDataType: false, GlobalValue: 2, Action: 2}
            },
            {//datatype
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType:8,IsNormalDataType: false, GlobalValue: 2, Action: 2}
            },
            {//hint
                originalUrl:urls.ecrf.getHint,
                body:{
                    IsPaged :false,
                    CRFVersionId : uc.CurrentDraftId
                }
            },
            {//unitgroup
                originalUrl:urls.lab.getUnitGroup,
                body:{
                    IsPaged:false, IsBase:true, IsLab:false
                }
            }
        ],
        callback:function(data){
            var itemGroupItems = data[0]["ItemGroupItems"] || [];
            var itemsItmes = data[1]["ItemsItems"] || [];
            var roleItems = data[2]["RoleItems"] || [];
            var dictionaryItems = data[3]["DictionaryItems"] || [];
            var controlsTypeItems = data[4]["BaseTypes"] || [];
            var datatypeItems = data[5]["BaseTypes"] || [];
            var hintItems = data[6]["HintItems"] || [];
            var unitgroupItems = data[7]["UnitGroupItems"] || [];
            var html = template('draft/formDesign',{
                title:title,
                navName:navName,
                itemGroupOptions:itemGroupItems,
                itemsOptions:itemsItmes,
                roleOptions:roleItems,
                dictionaryOptions:dictionaryItems,
                controlsTypeOptions:controlsTypeItems,
                datatypeOptions:datatypeItems,
                hintOptions:hintItems,
                unitgroupOptions:unitgroupItems,
            });
            res.send(html);
        }
    })
});
router.get('/derivation', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    // config.requestPromise({
    //     req:req,
    //     urls:[
    //         {
    //             originalUrl:urls.draft.getDraftEvent,
    //             body:{
    //                 IsPaged :false,
    //                 CRFVersionId : uc.CurrentDraftId
    //             }
    //         }
    //     ],
    //     callback:function(data){
    //         var eventItems = data[0]["EventItems"] || [];
    //         var html = template('draft/derivation',{
    //             title:title,
    //             navName:navName,
    //             eventOptions:eventItems
    //         });
    //         res.send(html);
    //     }
    // })
    config.syncRequest({
        req:req,
        originalUrl:urls.option.getSysTypes,
        body:{ SystemType:6,IsNormalDataType: false, GlobalValue: 2, Action: 2},
        callback:function (data) {
            var countTypeItems = data["BaseTypes"];
            var html = template('draft/derivation',{
                title:title,
                navName:navName,
                countTypeOptions:countTypeItems
            });
            res.send(html);
        }
    })
});
router.get('/derivation/derivationConfig', function(req, res, next) {
    var uc={};
    var usercache=req.cookies.usercache;
    if(req.cookies){
        uc=JSON.parse(usercache);
    }
    req.method = 'post';
    config.requestPromise({
        req:req,
        urls:[
            {
                originalUrl:urls.dropDown.getDropDownEvent,
                body:{
                    CRFVersionId:uc.CurrentDraftId
                }
            },{
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 13, IsNormalDataType: false, GlobalValue: 2, Action: 1 }
            },{
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 22, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
            },
            {
                originalUrl:urls.draft.getDraftForm,
                body:{
                    IsPaged : false,
                    CRFVersionId:uc.CurrentDraftId
                }
            },
            {
                originalUrl:urls.dropDown.getDropDownQueryClass,
                body:{
                    IsEnable: true
                }
            },
            {
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 4, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
            },
            {
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 23, IsNormalDataType: false, GlobalValue: 2, Action: 2 }
            },
            {
                originalUrl: urls.draft.getDraftEvent,
                body: {
                    IsPaged: false,
                    CRFVersionId: uc.CurrentDraftId
                }
            },
            {
                originalUrl:urls.option.getSysTypes,
                body:{ SystemType: 13, IsNormalDataType: false, GlobalValue: 2, Action: 0 }
            }
        ],
        callback:function(data){
            var dropDownFormItems = data[0]["DropDownFormItems"] || [];
            var functionItems = data[1]["BaseTypes"] || [];
            var subjectStatusItems = data[2]["BaseTypes"] || [];
            var formItems = data[3]["FormItems"] || [];
            var queryClassItems = data[4]["QueryClassItems"] || [];
            var conditionTypeItems=data[5]["BaseTypes"] || [];
            var valueTypeItems = data[6]["BaseTypes"] || [];
            var eventItems = data[7]["EventItems"] || [];
            var functionsItems = data[8]["BaseTypes"] || [];
            var html = template('draft/derivationConfig',{
                title:title,
                navName:navName,
                dropDownFormOptions:dropDownFormItems,
                functionOptions:functionItems,
                subjectStatusOptions:subjectStatusItems,
                formOptions:formItems,
                queryClassOptions:queryClassItems,
                conditionTypeOptions:conditionTypeItems,
                valueTypeItemsOptions:valueTypeItems,
                eventOptions:eventItems,
                functionsOptions:functionsItems
            });
            res.send(html);
        }
    })
});
module.exports = router;