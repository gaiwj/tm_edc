var $tableDerivation=null;
var $tableApplyItem=null;
var _json={lastFormId:"",lastItemId:"",lastItemGroupId:"",lastFormId2:"",lastItemId2:"",lastItemGroupId2:"" };
$(function () {
    $('#derivationOId').html(bp1.DerivationOId);
    $tableDerivation=$('#tableDerivation').bootstrapTable({
        height:$('#tableDerivation').parent().height()-50,
        striped: true,
        clickToSelect:true,
        columns:[
            {
                formatter:"actionFormatterDerivationMove",
                events:'actionsEventsMove'
            },
            {
                field:'ConditionTypeName',
                title:'类别'
            },
            {
                field:'DerivationName',
                title:'条件内容'
            },
            {
                title:'操作',
                formatter:'actionFormatterDerivation',
                events:'actionsEventsDervation',
                width:120
            }
        ]
    });
    $tableApplyItem=$('#tableAppleItem').bootstrapTable({
        height:$('#tableAppleItem').parent().height()-50,
        striped: true,
        clickToSelect:true,
        columns:[
            {
                field:'ItemNameCon',
                title:'Item'
            },
            {
                title:'操作',
                formatter:'actionFormatterDerivation',
                events:'actionsEventsAppleItem',
                width:120
            }
        ]
    });
    $('#itemForm-dfe-constant').bootstrapValidator({
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
    updateTableDerivation();
    updateTableAppleItem();
});

//计算公式
{
    function updateTableDerivation() {
        tms.services.getDerivationCondition({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                DerivationId: bp1.DerivationId,
                IsPaged: false,
                IsDetailed:false
            },
            callback:function (res) {
                $tableDerivation.bootstrapTable('load',res["DerivationConditionItems"]);
            }
        })
    }
    function actionFormatterDerivation(val,row,index) {
        return[
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }
    window.actionsEventsDervation={
        'click .glyphicon-edit':function (e, value, row, index) {
            var row=row;
            tms.services.getDerivationCondition({
                requestBody:{
                    IsPaged: false,
                    IsDetailed:true,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["DerivationConditionItems"].length > 0) {
                        var item = res["DerivationConditionItems"][0];

                        $("#input_ConditionTypeId_dfe").val(item["ConditionTypeId"]).trigger('change');
                        $("#input_EventId_dfe").val(item["EventId"]).trigger('change');
                        $("#input_IsApplyAllEvent_dfe").prop('checked',item["IsApplyAllEvent"]);
                        _json.lastFormId = item["FormId"];
                        $("#input_IsApplyAllForm_dfe").prop('checked',item["IsApplyAllForm"]);

                        _json.lastItemGroupId = item["ItemGroupId"];
                        $("#input_IsApplyAllItemGroup_dfe").prop('checked',item["IsApplyAllItemGroup"]);
                        _json.lastItemId = item["ItemId"];
                        $("#input_ItemGroupNo_dfe").val(item["ItemGroupNo"]);
                        $("#input_FormNo_dfe").val(item["FormNo"]);

                        $("#input_EventNo_dfe").val(item["EventNo"]);
                        $("#input_LogicPosition_dfe").val(item["LogicPosition"]).trigger('change');
                        $("#input_IsAssemble_dfe").prop('checked',item["IsAssemble"]);
                        $("#input_ValueTypeId_dfe").val(item["ValueTypeId"]).trigger('change');

                        $("#input_ConstValue_dfe").val(item["ConstValue"]).trigger('change');
                        $("#input_DataFormat_dfe").val(item["DataFormat"]).trigger('change');
                        $("#input_FunctionId_dfe").val(item["FunctionId"]).trigger('change');
                        $("#input_OrderBy_dfe").val(item["OrderBy"]).trigger('change');
                        $("#input_Range_dfe").val(item["Range"]).trigger('change');
                    }
                    $('#derivationFormulaEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }

            });
        },
        'click .glyphicon-trash':function (e,value,row,index) {
            tms.confirm('确定要删除吗？',function(){
                tms.services.deleteDerivationCondition({
                    requestBody:{
                        id:row.Id
                    },
                    callback:function (data) {
                        updateTableDerivation();
                        tms.alert('删除成功')
                    }
                })
            });
        }
    }
}
//移动
{
    function actionFormatterDerivationMove(val,row,index) {

        var length=$tableDerivation.bootstrapTable('getData').length;
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
//适用Item
{
    function updateTableAppleItem() {
        tms.services.getDerivationApplyItems({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                DerivationId: bp1.DerivationId,
                IsPaged: false,
                IsDetailed:false
            },
            callback:function (res) {
                $tableApplyItem.bootstrapTable('load',res["DerivationApplyItemsItems"]||[]);
            }
        })
    }
    window.actionsEventsAppleItem={
        'click .glyphicon-edit':function (e, value, row, index) {
            var row=row;
            tms.services.getDerivationApplyItems({
                requestBody:{
                    IsPaged: false,
                    IsDetailed:true,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["DerivationApplyItemsItems"].length > 0) {
                        var item = res["DerivationApplyItemsItems"][0];
                        $("#input_EventId_die").val(item["EventId"]).trigger('change');
                        $("#input_IsApplyAllEvent_die").prop('checked',item["IsApplyAllEvent"]);
                        _json.lastFormId = item["FormId"];
                        $("#input_IsApplyAllForm_die").prop('checked',item["IsApplyAllForm"]);

                        _json.lastItemGroupId = item["ItemGroupId"];
                        $("#input_IsApplyAllItemGroup_die").prop('checked',item["IsApplyAllItemGroup"]);
                        _json.lastItemId = item["ItemId"];
                        $("#input_ItemGroupNo_die").val(item["ItemGroupNo"]);
                        $("#input_FormNo_die").val(item["FormNo"]);
                        $("#input_EventNo_die").val(item["EventNo"]);
                    }
                    $('#derivationItemEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }

            });
        },
        'click .glyphicon-trash':function (e,value,row,index) {
            tms.confirm('确定要删除吗？',function(){
                tms.services.deleteDerivationApplyItems({
                    requestBody:{
                        id:row.Id
                    },
                    callback:function (data) {
                        updateTableAppleItem();
                        tms.alert('删除成功');
                    }
                })
            });
        }
    }
}