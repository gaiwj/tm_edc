var $tableBefore=null;
var $tableLogic=null;
var _json={lastFormId:"",lastItemId:"",lastItemGroupId:"",lastFormId2:"",lastItemId2:"",lastItemGroupId2:"" };
$(function () {
    $('#editCheckOid').html(bp1.EditCheckOId);
    $tableBefore=$('#tableBefore').bootstrapTable({
        height:$('#tableBefore').parent().height()-50,
        striped: true,
        clickToSelect:true,
        columns:[
            {
                formatter:"actionFormatterBeforeMove",
                events:'actionsEventsMove'
            },
            {
                field:'ConditionTypeName',
                title:'类别'
            },
            {
                field:'ConditionCon',
                title:'条件内容'
            },
            {
                title:'操作',
                formatter:'actionFormatterBefore',
                events:'actionsEventsBefore',
                width:120
            }
            ]
    });
    $tableLogic=$('#tableLogic').bootstrapTable({
        height:$('#tableLogic').parent().height()-50,
        striped: true,
        clickToSelect:true,
        columns:[
            {
                field:'ActionCon',
                title:'数据点'
            },
            {
                field:'FunctionName',
                title:'动作'
            },
            {
                title:'操作',
                formatter:'actionFormatterBefore',
                events:'actionsEventsLogic',
                width:120
            }
        ]
    });
    $('#itemForm-eac').bootstrapValidator({
        fields:{
            Item:{
                validators: {
                    notEmpty: {
                        message:'Item不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-eac-right').bootstrapValidator({
        fields:{
            Action:{
                validators: {
                    notEmpty: {
                        message:'动作不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-ecfg-constant').bootstrapValidator({
        fields:{
            DataFormat:{
                validators: {
                    notEmpty: {
                        message:'格式不能为空'
                    }
                }
            }
        }
    });
    updateTableBefore();
    updateTableLogic();
});

//前置条件
{
    function updateTableBefore() {
        tms.services.getEditCheckCondition({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                EditCheckId: bp1.EditCheckId,
                IsPaged: false,
                IsDetailed:false
            },
            callback:function (res) {
                $tableBefore.bootstrapTable('load',res["EditCheckConditionItems"]);
            }
        })
    }
    function actionFormatterBefore(val,row,index) {
        return[
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
            ].join('');
    }
   window.actionsEventsBefore={
       'click .glyphicon-edit':function (e, value, row, index) {
           var row=row;
           tms.services.getEditCheckCondition({
               requestBody:{
                   IsPaged: false,
                   IsDetailed:true,
                   Id: row.Id
               },
               callback:function (res) {
                   if (res["EditCheckConditionItems"].length > 0) {
                       var item = res["EditCheckConditionItems"][0];

                       $("#input_ConditionTypeId_ecfg").val(item["ConditionTypeId"]).trigger('change');
                       $("#input_EventId_ecfg").val(item["EventId"]).trigger('change');
                       $("#input_IsApplyAllEvent_ecfg").prop('checked',item["IsApplyAllEvent"]);
                       _json.lastFormId = item["FormId"];
                       $("#input_IsApplyAllForm_ecfg").prop('checked',item["IsApplyAllForm"]);

                       _json.lastItemGroupId = item["ItemGroupId"];
                       $("#input_IsApplyAllItemGroup_ecfg").prop('checked',item["IsApplyAllItemGroup"]);
                       _json.lastItemId = item["ItemId"];
                       $("#input_ItemGroupNo_ecfg").val(item["ItemGroupNo"]);
                       $("#input_FormNo_ecfg").val(item["FormNo"]);

                       $("#input_EventNo_ecfg").val(item["EventNo"]);
                       $("#input_LogicPosition_ecfg").val(item["LogicPosition"]).trigger('change');
                       $("#input_IsNeedCheck_ecfg").prop('checked',item["IsNeedCheck"]);
                       $("#input_IsAssemble_ecfg").prop('checked',item["IsAssemble"]);
                       $("#input_ValueTypeId_ecfg").val(item["ValueTypeId"]).trigger('change');

                       $("#input_ConstValue_ecfg").val(item["ConstValue"]).trigger('change');
                       $("#input_DataFormat_ecfg").val(item["DataFormat"]).trigger('change');
                       $("#input_FunctionId_ecfg").val(item["FunctionId"]).trigger('change');
                       $("#input_OrderBy_ecfg").val(item["OrderBy"]).trigger('change');
                       $("#input_Range_ecfg").val(item["Range"]).trigger('change');
                   }
                   $('#editCheckConditionEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
               }

           });
       },
       'click .glyphicon-trash':function (e,value,row,index) {
           tms.confirm('确定要删除吗？',function(){
               tms.services.deleteEditCheckCondition({
                   requestBody:{
                       id:row.Id
                   },
                   callback:function (data) {
                      updateTableBefore();
                      tms.alert('删除成功')
                   }
               })
           });
       }
   }

}
//移动
{
    function actionFormatterBeforeMove(val,row,index) {

        var length=$tableBefore.bootstrapTable('getData').length;
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
    window.actionsEventsMove={
        'click .glyphicon-arrow-up':function (e,value,row,index) {
            tms.confirm('确定要上移吗？',function(){
                var id = row.Id;
                tms.services.moveEditCheckCondition({
                    requestBody:{
                        Id: id,
                        MoveType: 1
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        updateTableBefore();
                    }
                })
            });
        },
        'click .glyphicon-arrow-down':function (e,value,row,index) {
            tms.confirm('确定要下移吗？',function(){
                var id = row.Id;
                tms.services.moveEditCheckCondition({
                    requestBody:{
                        Id: id,
                        MoveType: 2
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        updateTableBefore();
                    }
                })
            });
        },
        'click .glyphicon-sort':function (e,value,row,index) {
            $('#editCheckConditionMove').attr({'data-type':'edit','data-id':row.Id}).modal('show');
        }
    };
}
//逻辑动作
{
    function updateTableLogic() {
        tms.services.getEditCheckAction({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                EditCheckId: bp1.EditCheckId,
                IsPaged: false,
                IsDetailed:false
            },
            callback:function (res) {
                $tableLogic.bootstrapTable('load',res["EditCheckActionItems"]);
            }
        })
    }
    window.actionsEventsLogic={
        'click .glyphicon-edit':function (e, value, row, index) {
            var row=row;
            tms.services.getEditCheckAction({
                requestBody:{
                    IsPaged: false,
                    IsDetailed:true,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["EditCheckActionItems"].length > 0) {
                        var item = res["EditCheckActionItems"][0];
                        var items = item["EditCheckActionParameterItems"][0];

                        $("#input_FunctionId_eac").val(item["FunctionId"]).trigger('change');
                        var FunctionId = $("#input_FunctionId_eac").find('option:selected').attr('value2');


                        $("#input_EventId_eac").val(item["EventId"]).trigger('change');
                        _json.lastFormId = item["FormId"];
                        _json.lastItemGroupId  = item["ItemGroupId"];
                        _json.lastItemId  = item["ItemId"];


                        if (FunctionId == "210") {
                            $("#input_EventId2_eac").val(items["EventId"]).trigger('change');
                            _json.lastFormId2 = items["FormId"];
                            _json.lastItemGroupId2 = items["ItemGroupId"];
                            _json.lastItemId2 = items["ItemId"];
                        }
                        else if (FunctionId == "206") {
                            $("#input_EventId3_eac").val(items["EventId"]).trigger('change');
                        }
                        else if (FunctionId == "207") {
                            $("#input_FormId3_eac").val(items["FormId"]).trigger('change');
                        }


                        if (FunctionId == "201")
                            $("#input_ConstValue_eac").val(items["ConstValue"]);//异常消息
                        else
                            $("#input_ConstValue2_eac").val(items["ConstValue"]);//赋值的值


                        $("#input_IsMustUserClose_eac").val(item["IsMustUserClose"]).trigger('change');
                        $("#input_QueryClassId_eac").val(item["QueryClassId"]).trigger('change');
                        $("#input_ItemGroupNo2_eac").val(items["ItemGroupNo"]);
                        $("#input_FormNo2_eac").val(items["FormNo"]);
                        $("#input_EventNo2_eac").val(items["EventNo"]);
                        $("#input_LogicPosition2_eac").val(items["LogicPosition"]).trigger('change');
                        $("#input_OrderBy2_eac").val(item["OrderBy"]).trigger('change');
                        $("#input_Range2_eac").val(item["Range"]).trigger('change');
                        $("#input_IsApplyAllEvent_eac").prop('checked',items["IsApplyAllEvent"]);
                        $("#input_IsApplyAllForm_eac").prop('checked',items["IsApplyAllForm"]);
                        $("#input_IsApplyAllItemGroup_eac").prop('checked',items["IsApplyAllItemGroup"]);
                        $("#input_ItemGroupNo_eac").val(item["ItemGroupNo"]);
                        $("#input_FormNo_eac").val(item["FormNo"]);
                        $("#input_EventNo_eac").val(item["EventNo"]);
                        $("#input_LogicPosition_eac").val(item["LogicPosition"]).trigger('change');
                        $("#input_OrderBy_eac").val(items["OrderBy"]).trigger('change');
                        $("#input_Range_eac").val(items["Range"]).trigger('change');
                        $("#input_SubjectStatusId_eac").val(items["SubjectStatusId"]).trigger('change');
                        $("#input_QueryClassId2_eac").val(items["QueryClassId"]).trigger('change');
                        $("#VoluationType_eac").val(items["ConditionTypeValue"]).trigger('change');
                    }
                    $('#editCheckActionEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }

            });
        },
        'click .glyphicon-trash':function (e,value,row,index) {
            tms.confirm('确定要删除吗？',function(){
                tms.services.deleteEditCheckAction({
                    requestBody:{
                        id:row.Id
                    },
                    callback:function (data) {
                        updateTableLogic();
                        tms.alert('删除成功');
                    }
                })
            });
        }
    }
}