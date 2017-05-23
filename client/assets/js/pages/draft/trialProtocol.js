
var $tableStudy=null;
var $tableForm=null;
var _json={ trialProtocolId:"",studyEventId:"",EventId:"",isFristForm:true,isFristStudy:true };
$(function () {
    $('.container-content').height(
        $('#main').height()-52
    );
    $tableStudy=$('#tableStudy').bootstrapTable({
        height:$('.topBlock').height()-49,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getTrialProtocolItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            if(_json.isFristStudy) return false;
            return {
                TrialProtocolId: _json.trialProtocolId,
                CRFVersionId: bp1.CurrentDraftId,
                IsPaged: true,
                PageIndex:params.pageNumber-1,
                PageSize:params.pageSize
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                var _data= body["TrialProtocolItemsItems"];
                res.total = body["RowCount"];
                res.rows=_data;
            });
            if(!res.rows||res.rows.length==0){
                $tableStudy.bootstrapTable('removeAll');
            }
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
            {
                radio:true
            },
            {
                title:'',
                width:100,
                formatter:'actionFormatterStudyMove',
                events:'actionsEventsStudyMove'
            },
            {
                title:'操作',
                formatter:'actionFormatterBtn',
                events:'actionsEventsStudy',
                width:100
            },
            {
                field:'EventOID',
                title:'研究事件OID'
            },
            {
                field:'DisplayName',
                title:'显示名称'
            },
            {
                field:'EarliestValue',
                title:'最早'
            },
            {
                field:'MinusValue',
                title:'-'
            },
            {
                field:'EventWindow',
                title:'窗口期'
            },
            {
                field:'PlusValue',
                title:'+'
            },
            {
                field:'LatestValue',
                title:'最迟'
            },
            {
                field:'IsActive',
                title:'激活状态',
                formatter:"actionIsTrueFalse"
            },
            {
                field:'IsMultireord',
                title:'事件类型',
                formatter:"actionIsMultirecordEvent"
            },
            {
                field:'IsMustExist',
                title:'必须存在',
                formatter:"actionIsTrueFalse"
            },
            {
                field:'EventTypeName',
                title:'类别'
            },
            {
                field:'MaxCount',
                title:'事件发生上限'
            },
            {
                field:'IsAllowAdd',
                title:'允许手动添加',
                formatter:"actionIsTrueFalse"
            },
            {
                field:'EventGroupName',
                title:'研究事件组'
            },
            {
                field:'InstalmentsTypeName',
                title:'研究分期'
            }
            ],
        onClickRow:function (row) {
            _json.EventId=row.EventId;
            _json.isFristForm=false;
            $tableForm.bootstrapTable('refresh');
        }
    });
    $tableForm=$('#tableForm').bootstrapTable({
        height:$('.topBlock').height()-49,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getEventItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            if(_json.isFristForm) return false;
            return {
                EventId: _json.EventId,
                CRFVersionId: bp1.CurrentDraftId,
                IsPaged: true,
                PageIndex:params.pageNumber-1,
                PageSize:params.pageSize
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                var _data= body["EventItemsItems"];
                res.total = body["RowCount"];
                res.rows=_data;
            });
            if(!res.rows||res.rows.length==0){
                $tableForm.bootstrapTable('removeAll');
            }
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
            {
                formatter:'actionFormatterFormMove',
                events:'actionsEventsFormMove'
            },
            {
                title:'操作',
                formatter:'actionFormatterBtn',
                events:'actionsEventsForm'
            },
            {
                field:'FormOID',
                title:'表单OID'
            },
            {
                field:'DisplayName',
                title:'显示名称'
            },
            {
                field:'IsActive',
                title:'激活状态',
                formatter:"actionIsTrueFalse"
            },
            {
                field:'IsMustExist',
                title:'必须存在',
                formatter:"actionIsTrueFalse"
            },
            {
                field:'IsMultirecord',
                title:'表单类型',
                formatter:"actionIsMultirecordForm"
            },
            {
                field:'IsNeedElectronicSignature',
                title:'无需电子签名',
                formatter:"actionIsTrueFalse"
            }
        ]
    });
    updataMenu();
    $('#itemForm').bootstrapValidator({
        fields:{
            Name:{
                validators: {
                    notEmpty: {
                        message:'CRF版本不能为空'
                    }
                }
            },
            Version:{
                validators: {
                    notEmpty: {
                        message:'方案版本不能为空'
                    }
                }
            }

        }
    });
    $('#itemFormLink').bootstrapValidator({
        fields:{
            Event:{
                validators: {
                    notEmpty: {
                        message:'CRF版本不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-form').bootstrapValidator({
        fields:{
            Form:{
                validators: {
                    notEmpty: {
                        message:'表单OID不能为空'
                    }
                }
            }
        }
    })
});
//试验方案相关
{
    function updataMenu() {
        tms.services.getTrialProtocol({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                IsPaged: false
            },
            callback:function (res) {
                if (res["TrialProtocolItems"].length > 0) {
                    var data=res["TrialProtocolItems"];
                    tms.util.menuList($('.menu-list'),data,'actionsEvents',actionFormatter);
                }
                $("[data-toggle='tooltip']").tooltip();
            }
        });
    }
    function actionFormatter() {
        return['<div class="glyphicon-group">',
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
            '<div>'
        ].join('');
    }
    window.actionsEvents={
        'click .glyphicon-edit':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getTrialProtocol({
                requestBody:{
                    IsPaged: false,
                    CRFVersionId: bp1.CurrentDraftId,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["TrialProtocolItems"].length > 0) {
                        var item = res["TrialProtocolItems"][0];
                        $("#input_Name_te").val(item["Name"]);
                        $("#input_Description_te").val(item["Description"]);
                        $("#input_CRFName_te").val(item["CRFName"]);
                    }
                    $('#trialProtocolEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
        },
        'click .glyphicon-cog':function (e, value, row, index) {
            e.stopPropagation();
            _json.trialProtocolId=row.Id;
            _json.isFristStudy=false;
            $tableStudy.bootstrapTable('refresh');
            $tableForm.bootstrapTable('removeAll');

        }
    };
}
//研究事件相关
{
    window.actionsEventsStudy={
        'click .glyphicon-edit':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getTrialProtocolItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["TrialProtocolItemsItems"].length > 0) {
                        var item = res["TrialProtocolItemsItems"][0];
                        $("#input_EventId_tl").val(item["EventId"]).trigger('change');
                        $("#input_IsMustExist_tl").prop('checked',item["IsMustExist"]);
                        $("#input_IsActive_tl").prop('checked',item["IsActive"]);
                        $("#input_IsEventGroup_tl").prop('checked',item["IsEventGroup"]);

                        $("#input_EventGroupId_tl").val(item["EventGroupId"]);

                        $("#input_BaseLineEventId_tl").val(item["BaseLineEventId"]);
                        $("#input_EventWindow_tl").val(item["EventWindow"]);
                        $("#input_MinusValue_tl").val(item["MinusValue"]);
                        $("#input_PlusValue_tl").val(item["PlusValue"]);
                        $("#input_EarliestValue_tl").val(item["EarliestValue"]);
                        $("#input_LatestValue_tl").val(item["LatestValue"]);
                    }
                    $('#trialProtocolLink').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
        },
        'click .glyphicon-cog':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getTrialProtocolItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["TrialProtocolItemsItems"].length > 0) {
                        var item = res["TrialProtocolItemsItems"][0];
                        $("#input_EventId_tc").val(item["EventId"]).trigger('change');
                        $("#input_IsMustExist_tc").prop('checked',item["IsMustExist"]);
                        $("#input_IsActive_tc").prop('checked',item["IsActive"]);
                        $("#input_IsEventGroup_tc").prop('checked',item["IsEventGroup"]);

                        $("#input_DisplayName_tc").val(item["DisplayName"]);

                        $("#input_BlindName_tc").val(item["BlindName"]);
                        $("#input_IsMultirecord_tc").val(item["IsMultirecord"] ? "1" : "0").trigger('change');

                        $("#input_MinusValue_tc").val(item["MinusValue"]);
                        $("#input_PlusValue_tc").val(item["PlusValue"]);
                        $("#input_EventWindow_tc").val(item["EventWindow"]);

                        $("#input_InstalmentsTypeId_tc").val(item["InstalmentsTypeId"]);
                        $("#input_MaxCount_tc").val(item["MaxCount"]);
                        $("#input_SortIndex_tc").val(item["SortIndex"]);
                        $("#input_Name_tc").val(item["Name"]);
                        $("#input_Description_tc").val(item["Description"]);
                        $("#input_FontSize_tc").val(item["FontSize"]);
                        $("#input_FontColor_tc").val(item["FontColor"]);
                        $("#input_IsBold_tc").val(item["IsBold"]);
                    }
                    updataTablePw(row.EventId);
                    _json.EventId=row.EventId;
                    $('#trialProtocolLinkConfig').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
        },
        'click .glyphicon-trash':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.confirm('您确认删除吗？',function () {
                tms.services.deleteTrialProtocolItems({
                    requestBody:{
                        id: row.Id
                    },
                    callback:function (res) {
                        $tableStudy.bootstrapTable('refresh');
                        tms.alert('删除成功');
                    }
                });
            });
        }
    };
}
//操作按钮
function actionFormatterBtn() {
    return['<div class="glyphicon-group">',
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
        '<div>'
    ].join('');
}
//移动
{
    function actionFormatterStudyMove(val,row,index) {

        var length=$tableStudy.bootstrapTable('getData').length;
        var btnList=[];
        btnList.push('<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="bottom" title="移动"></i>');
        if(length==1){
            return btnList.join('');
        }
        var index=index+1;
        if(index%10==1){
            btnList.push('<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>');
            return btnList.join('');
        }else if(index%10==0||index%10==length){
            btnList.push('<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>');
            return btnList.join('');
        }else{
            btnList.push('<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>');
            btnList.push('<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>');
            return btnList.join('');
        }
    }
    function actionFormatterFormMove(val,row,index) {
        var length=$tableForm.bootstrapTable('getData').length;
        var btnList=[];
        btnList.push('<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="bottom" title="移动"></i>');
        if(length==1){
            return btnList.join('');
        }
        var index=index+1;
        if(index%10==1){
            btnList.push('<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>');
            return btnList.join('');
        }else if(index%10==0||index%10==length){
            btnList.push('<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>');
            return btnList.join('');
        }else{
            btnList.push('<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>');
            btnList.push('<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>');
            return btnList.join('');
        }
    }
    window.actionsEventsStudyMove={
        'click .glyphicon-arrow-up':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要上移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftTrialProtocolItem({
                    requestBody:{
                        Id: id,
                        MoveType: 1
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableStudy.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-arrow-down':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要下移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftTrialProtocolItem({
                    requestBody:{
                        Id: id,
                        MoveType: 2
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableStudy.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-sort':function (e,value,row,index) {
            e.stopPropagation();
            $('#studyEventLinkMove').attr({'data-type':'trailProtocol','data-id':row.Id}).modal('show');
        }
    };
    window.actionsEventsFormMove={
        'click .glyphicon-arrow-up':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要上移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftEventItem({
                    requestBody:{
                        Id: id,
                        MoveType: 1
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableForm.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-arrow-down':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要下移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftEventItem({
                    requestBody:{
                        Id: id,
                        MoveType: 2
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableForm.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-sort':function (e,value,row,index) {
            e.stopPropagation();
            $('#studyEventLinkMove').attr({'data-type':'studyEvent','data-id':row.Id}).modal('show');
        }
    };
}
//表单相关
{
    window.actionsEventsForm={
        'click .glyphicon-edit':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getEventItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["EventItemsItems"].length > 0) {
                        var item = res["EventItemsItems"][0];
                        $("#input_OID_sl").val(item["FormId"]).trigger('change');
                        $("#input_DisplayName_sl").val(item["DisplayName"]);
                        $("#input_IsMultirecord_sl").val(item["IsMultirecord"]).trigger('change');

                        $("#input_IsActive_sl").prop('checked',item["IsActive"]);
                        $("#input_IsMustExist_sl").prop('checked',item["IsMustExist"]);
                        $("#input_IsNeedElectronicSignature_sl").prop('checked',item["IsNeedElectronicSignature"]);

                        $("#input_ActionValue_sl").val(item["ActionValue"]).trigger('change');
                        $("#input_ActionEventId_sl").val(item["ActionEventId"]).trigger('change');
                        $("#input_ActionFormId_sl").val(item["ActionFormId"]).trigger('change');

                    }
                    $('#studyEventLink').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
        },
        'click .glyphicon-cog':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getEventItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["EventItemsItems"].length > 0) {
                        var item = res["EventItemsItems"][0];
                        $("#input_OID_sc").val(item["FormId"]).trigger('change');
                        $("#input_DisplayName_sc").val(item["DisplayName"]);
                        $("#input_IsMultirecord_sc").val(item["IsMultirecord"]).trigger('change');
                        $("#input_SortIndex_sc").val(item["SortIndex"]);
                        $("#input_ActionValue_sc").val(item["ActionValue"]).trigger('change');
                        $("#input_ActionEventId_sc").val(item["ActionEventId"]).trigger('change');
                        $("#input_ActionFormId_sc").val(item["ActionFormId"]).trigger('change');

                        $("#input_Name_sc").val(item["Name"]);
                        $("#input_Description_sc").val(item["Description"]);
                        $("#input_FontSize_sc").val(item["FontSize"]);
                        $("#input_FontColor_sc").val(item["FontColor"]);
                        $("#input_IsBold_sc").prop('checked',item["IsBold"]);

                        $("#input_IsActive_sc").prop('checked',item["IsActive"]);
                        $("#input_IsMustExist_sc").prop('checked',item["IsMustExist"]);
                        $("#input_IsNeedElectronicSignature_sc").prop('checked',item["IsNeedElectronicSignature"]);
                    }
                    $('#studyEventLinkConfig').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
            _json.FormId=row.FormId;
            updataTableSPw(row.FormId);
        },
        'click .glyphicon-trash':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.confirm('您确认删除吗？',function () {
                tms.services.deleteEventItems({
                    requestBody:{
                        id: row.Id
                    },
                    callback:function (res) {
                        $tableForm.bootstrapTable('refresh');
                        tms.alert('删除成功');
                    }
                });
            });
        }
    };
}
//true/false格式化
{
    function actionIsTrueFalse(val,row){
        if(val=="true"){
            return '是';

        }else{
            return '否';
        }
    }
    function actionIsMultirecordEvent(val,row) {
        if(val=="true"){
            return '多事件';

        }else{
            return '单事件';
        }
    }
    function actionIsMultirecordForm(val,row) {
        if(val=="true"){
            return '多事件';

        }else{
            return '单事件';
        }
    }
}

function addRights() {
    var gid=nowRole.Id;
    var datas=getMenuIds(gid);
    tms.services.createOrUpdateAccessMenu({
        requestBody:{
            RoleId: gid,
            AccessMenuItems: datas
        },
        callback:function (data) {
            tms.alert('保存成功');
        }
    })
}
function getMenuIds(gid) {
    var data=[];
    var lv1=$table1.bootstrapTable('getSelections');
    var lv2=$('.checkbox-group');
    for (var i = 0; i < lv1.length; i++) {
        var obj = lv1[i];
        var menuItem={MenuId:obj.Id,RoleId:gid};
        data.push(menuItem);
    }
    for (var i = 0; i < lv2.length; i++) {
        var obj1 = $(lv2[i]);
        if(obj1.find('input[type=checkbox]').prop('checked')){
            var menuItem={MenuId:obj1.find('input[type=checkbox]').val(),RoleId:gid};
            data.push(menuItem);
        }
    }
    return data;
}
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateRole({
        requestBody:{
            Id: rowid,
            Name: $("#input_Name").val(),
            IsEnable:$("#input_IsEnable").find('input:radio:checked').val() == 1,
            Remark: $("#input_Remark").val(),
            FType: 2
        },
        callback:function (data) {
            updataMenu();
            tms.alert('保存成功',function () {
                $("#myModal2").modal('hide');
            });
        }
    })
}

