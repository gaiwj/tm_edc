
var $tableItemGroup=null;
var $tableItem=null;
var _json={ SearchOID:"",FormId:"",ItemGroupId:"",isFristItemGroup:true,isFristItem:true };
$(function () {
    $('.container-content').height(
        $('#main').height()-52
    );
    $tableItemGroup=$('#tableItemGroup').bootstrapTable({
        height:$('.topBlock').height()-49,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getFormItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            if(_json.isFristItemGroup) return false;
            return {
                FormId: _json.FormId,
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
                var _data= body["FormItemsItems"];
                res.total = body["RowCount"];
                res.rows=_data;
            });
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
                formatter:'actionFormatterItemGroupMove',
                events:'actionsEventsItemGroupMove'
            },
            {
                title:'操作',
                formatter:'actionFormatterBtn',
                events:'actionsEventsItemGroup',
                width:100
            },
            {
                field:'ItemGroupOID',
                title:'ItemGroupOID'
            },
            {
                field:'DisplayName',
                title:'显示名称'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsActive',
                title:'激活状态'
            },
            {
                formatter:'actionIsMultirecord',
                field:'IsMultirecord',
                title:'数据集类型'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsMustExist',
                title:'必须存在'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsReferData',
                title:'参考数据'
            },
            {
                field:'DisplayWay',
                title:'展现方式'
            },
            {
                field:'MaxCount',
                title:'记录添加上限'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsAllowAdd',
                title:'允许手动添加'
            },
            {
                field:'SASDatasetName',
                title:'SASDatasetName'
            }
        ],
        onClickRow:function (row) {
            _json.ItemGroupId=row.ItemGroupId;
            _json.isFristItem=false;
            $tableItem.bootstrapTable('refresh');
        }
    });
    $tableItem=$('#tableItem').bootstrapTable({
        height:$('.topBlock').height()-49,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getItemGroupItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            if(_json.isFristItem) return false;
            return {
                ItemGroupId: _json.ItemGroupId,
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
                var _data= body["ItemGroupItemsItems"];
                res.total = body["RowCount"];
                res.rows=_data;
            });
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
            {
                formatter:'actionFormatterItemMove',
                events:'actionsEventsItemMove',
                width:100
            },
            {
                title:'操作',
                formatter:'actionFormatterBtn',
                events:'actionsEventsItem',
                width:100
            },
            {
                field:'ItemOID',
                title:'ItemOID'
            },
            {
                field:'DisplayName',
                title:'显示名称'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsActive',
                title:'激活状态'
            },
            {
                field:'ControlsTypeName',
                title:'展现方式'
            },
            {
                formatter:'actionIsTrueFalse',
                field:'IsRequired',
                title:'必填'
            },
            {
                field:'DataFormat',
                title:'格式',
                width:150
            },
            {
                field:'HintName',
                title:'外部提示语'
            },
            {
                field:'DataTypeName',
                title:'数据类型'
            },
            {
                field:'DefaultValue',
                title:'默认值'
            },
            {
                field:'KeySequence',
                title:'KeySequence'
            },
            {
                field:'SASFieldName',
                title:'SASFieldName',
                width:150
            },
            {
                field:'UnitGroupName',
                title:'单位组'
            },
            {
                field:'DictionaryName',
                title:'编码字典'
            },
            {
                field:'RoleName',
                title:'角色'
            },
            {
                title:'特定编码字典'
            }

        ]
    });
    updataMenu();
    $('#itemForm-fde').bootstrapValidator({
        fields:{
            OId:{
                validators: {
                    notEmpty: {
                        message:'ItemGroupOID不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-fdigcs').bootstrapValidator({
        fields:{
            Order:{
                validators: {
                    notEmpty: {
                        message:'排序不能为空'
                    }
                }
            },
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            },
            Color:{
                validators: {
                    notEmpty: {
                        message:'字体颜色不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-fdic').bootstrapValidator({
        fields:{
            ItemOId:{
                validators: {
                    notEmpty: {
                        message:'ItemOId不能为空'
                    }
                }
            }
        }
    })
});
//表单相关
{
    function updataMenu() {
        tms.services.getDraftForm({
            requestBody:{
                CRFVersionId: bp1.CurrentDraftId,
                OId: _json.SearchOID,
                IsPaged: false
            },
            callback:function (res) {
                if (res["FormItems"].length > 0) {
                    var data=res["FormItems"];
                    tms.util.menuList($('.menu-list'),data,null,clickRow);
                }else{
                  $('.menu-list').html('　　没有找到符合条件的记录...');
                }
                $("[data-toggle='tooltip']").tooltip();
            }
        });
    }
    function clickRow(row) {
        var row=row;
        _json.FormId=row.Id;
        $('.role-item-mod').hide();
        _json.isFristItemGroup=false;
        $tableItemGroup.bootstrapTable('refresh');

    }
}
//ItemGroup相关
{
    window.actionsEventsItemGroup={
        'click .glyphicon-edit':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getFormItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["FormItemsItems"].length > 0) {
                        var item = res["FormItemsItems"][0];
                        $("#input_OID_fde").val(item["ItemGroupId"]).trigger('change');
                        $("#input_DisplayName_fde").val(item["DisplayName"]);
                        $("#input_IsMultirecord_fde").val(item["IsMultirecord"]);
                        $("#input_IsActive_fde").prop('checked',item["IsActive"]);
                        $("#input_IsMustExist_fde").prop('checked',item["IsMustExist"]);
                    }
                    $('#formDesignItemGroupEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
        },
        'click .glyphicon-cog':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.services.getFormItems({
                requestBody:{
                    IsPaged: false,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["FormItemsItems"].length > 0) {
                        var item = res["FormItemsItems"][0];
                        $("#input_ItemGroupId_fdigc").val(item["ItemGroupId"]).trigger('change');
                        $("#input_DisplayName_fdigc").val(item["DisplayName"]);
                        $("#input_IsMultirecord_fdigc").val(item["IsMultirecord"]).trigger('change');
                        $("#input_DisplayWay_fdigc").val(item["DisplayWay"]).trigger('change');
                        $("#input_SASDatasetName_fdigc").val(item["SASDatasetName"]);

                        $("#input_MaxCount_fdigc").val(item["MaxCount"]);
                        $("#input_SortIndex_fdigc").val(item["SortIndex"]);
                        $("#input_Name_fdigc").val(item["Name"]);
                        $("#input_Description_fdigc").val(item["Description"]);
                        $("#input_FontSize_fdigc").val(item["FontSize"]).trigger('change');

                        $("#input_FontColor_fdigc").val(item["FontColor"]);
                        $("#input_IsBold_fdigc").prop('checked',item["IsBold"]);
                        $("#input_IsActive_fdigc").prop('checked',item["IsActive"]);
                        $("#input_IsMustExist_fdigc").prop('checked',item["IsMustExist"]);
                        $("#input_IsReferData_fdigc").prop('checked',item["IsReferData"]);

                        $("#input_IsHiddenName_fdigc").prop('checked',item["IsHiddenName"]);
                        $("#input_IsAllowAdd_fdigc").prop('checked',item["IsAllowAdd"]);
                    }
                    $('#formDesignItemGroupConfig').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                }
            });
            _json.ItemGroupId=row.ItemGroupId;
            updataTableFdigc(row.ItemGroupId);
        },
        'click .glyphicon-trash':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.confirm('您确认删除吗？',function () {
                tms.services.deleteFormItems({
                    requestBody:{
                        id: row.Id
                    },
                    callback:function (res) {
                        $tableItemGroup.bootstrapTable('refresh');
                        $tableItem.bootstrapTable('removeAll');
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
//true/false格式化
{
    function actionIsTrueFalse(val,row){
        if(val=="true"){
            return '是';

        }else{
            return '否';
        }
    }
    function actionIsMultirecord(val,row) {
        if(val=="true"){
            return '多记录';

        }else{
            return '单记录';
        }
    }
}

//移动
{
    function actionFormatterItemGroupMove(val,row,index) {
        var length=$tableItemGroup.bootstrapTable('getData').length;
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
    window.actionsEventsItemGroupMove={
        'click .glyphicon-arrow-up':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要上移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftFormItem({
                    requestBody:{
                        Id: id,
                        MoveType: 1
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableItem.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-arrow-down':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要下移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftFormItem({
                    requestBody:{
                        Id: id,
                        MoveType: 2
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableItem.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-sort':function (e,value,row,index) {
            e.stopPropagation();
            $('#itemGroupItemMove').attr({'data-type':'edit','data-id':row.Id,'data-type':'group'}).modal('show');
        }
    };
    function actionFormatterItemMove(val,row,index) {
        var length=$tableItem.bootstrapTable('getData').length;
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
    window.actionsEventsItemMove={
        'click .glyphicon-arrow-up':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要上移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftItemGroupItem({
                    requestBody:{
                        Id: id,
                        MoveType: 1
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableItem.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-arrow-down':function (e,value,row,index) {
            e.stopPropagation();
            tms.confirm('确定要下移吗？',function(){
                var id = row.Id;
                tms.services.moveDraftItemGroupItem({
                    requestBody:{
                        Id: id,
                        MoveType: 2
                    },
                    callback:function(res){
                        tms.alert('移动成功');
                        $tableItem.bootstrapTable('refresh');
                    }
                })
            });
        },
        'click .glyphicon-sort':function (e,value,row,index) {
            e.stopPropagation();
            $('#itemGroupItemMove').attr({'data-type':'edit','data-id':row.Id,'data-type':'item'}).modal('show');
        }
    };
}
//item相关
{
    window.actionsEventsItem={
        'click .glyphicon-edit':function (e, value,row,index) {
            e.stopPropagation();
            tms.services.getItemGroupItems({
                requestBody:{
                    IsPaged: false,
                    StudyId: bp1.CurrentProjectId,
                    Id: row.Id
                },
                callback:function (res) {
                    if (res["ItemGroupItemsItems"].length > 0) {
                        var item = res["ItemGroupItemsItems"][0];
                        $("#input_ItemId_fdie").val(item["ItemId"]).trigger('change');
                        $("#input_IsActive_fdie").prop("checked",item["IsActive"]);
                        $("#input_IsRequired_fdie").prop("checked",item["IsRequired"]);
                        $("#input_IsAllowEdit_fdie").prop("checked",item["IsAllowEdit"]);
                        $("#input_IsAllowUpdate_fdie").prop("checked",item["IsAllowUpdate"]);

                        $("#input_IsMustSDV_fdie").prop("checked",item["IsMustSDV"]);
                        $("#input_IsMustInputClinicalSignificance_fdie").prop("checked",item["IsMustInputClinicalSignificance"]);
                        $("#input_IsMustCheck_fdie").prop("checked",item["IsMustCheck"]);
                        $("#input_IsAsFormDate_fdie").prop("checked",item["IsAsFormDate"]);
                        $("#input_IsAsEventDate_fdie").prop("checked",item["IsAsEventDate"]);

                        $("#input_IsEnrollmentDate_fdie").prop("checked",item["IsEnrollmentDate"]);
                        $("#input_IsShowBeforeEventDate_fdie").prop("checked",item["IsShowBeforeEventDate"]);
                        $("#input_IsNeedElectronicSignature_fdie").prop("checked",item["IsNeedElectronicSignature"]);
                        $("#input_DefaultValue_fdie").val(item["DefaultValue"]);
                        $("#input_KeySequence_fdie").val(item["KeySequence"]);

                        $("#input_RoleId_fdie").val(item["RoleId"]).trigger('change');
                        $("#input_IsAsSubjectCode_fdie").val(item["IsAsSubjectCode"]);
                        $("#input_SpecifiedDictionaryId_fdie").val(item["SpecifiedDictionaryId"]).trigger('change');


                        $('#formDesignItemEdit').attr({'data-type':'edit','data-id':item.Id}).modal('show');
                    }
                }
            })
        },
        'click .glyphicon-cog':function (e, value, row, index) {
            e.stopPropagation();
            var id = row.Id;
            tms.services.getItemGroupItems({
                requestBody:{
                    IsPaged: false,
                    Id: id
                },
                callback:function(res){
                    if (res["ItemGroupItemsItems"].length > 0) {
                        var item = res["ItemGroupItemsItems"][0];
                        $("#input_ItemId_fdic").val(item["ItemId"]).trigger('change');
                        $("#input_DisplayName_fdic").val(item["DisplayName"]);
                        $("#input_DataType_fdic").val(item["DataTypeId"]).trigger('change');
                        $("#input_ControlsTypeId_fdic").val(item["ControlsTypeId"]).trigger('change');
                        $("#input_SASFieldName_fdic").val(item["SASFieldName"]);

                        $("#input_DataFormat_fdic").val(item["DataFormat"]);
                        $("#input_SortIndex_fdic").val(item["SortIndex"]);
                        $("#input_HintId_fdic").val(item["HintId"]).trigger('change');
                        $("#input_KeySequence_fdic").val(item["KeySequence"]);
                        $("#input_DefaultValue_fdic").val(item["DefaultValue"]);

                        $("#input_UnitGroupId_fdic").val(item["UnitGroupId"]).trigger('change');
                        $("#input_DictionaryId_fdic").val(item["DictionaryId"]).trigger('change');
                        $("#input_RoleId_fdic").val(item["RoleId"]).trigger('change');

                        $("#input_SpecifiedDictionaryId_fdic").val(item["SpecifiedDictionaryId"]).trigger('change');
                        $("#input_Name_fdic").val(item["ItemName"]);

                        $("#input_Description_fdic").val(item["Description"]);
                        $("#input_FontSize_fdic").val(item["FontSize"]).trigger('change');
                        $("#input_FontColor_fdic").val(item["FontColor"]);
                        $("#input_IsBold_fdic").prop('checked',item["IsBold"]);

                        $("#input_IsActive_fdic").prop('checked',item["IsActive"]);
                        $("#input_IsRequired_fdic").prop('checked',item["IsRequired"]);
                        $("#input_IsAllowEdit_fdic").prop('checked',item["IsAllowEdit"]);
                        $("#input_IsAllowUpdate_fdic").prop('checked',item["IsAllowUpdate"]);

                        $("#input_IsMustSDV_fdic").prop('checked',item["IsMustSDV"]);
                        $("#input_IsMustInputClinicalSignificance_fdic").prop('checked',item["IsMustInputClinicalSignificance"]);
                        $("#input_IsMustCheck_fdic").prop('checked',item["IsMustCheck"]);
                        $("#input_IsAsFormDate_fdic").prop('checked',item["IsAsFormDate"]);
                        $("#input_IsAsEventDate_fdic").prop('checked',item["IsAsEventDate"]);

                        $("#input_IsEnrollmentDate_fdic").prop('checked',item["IsEnrollmentDate"]);
                        $("#input_IsShowBeforeEventDate_fdic").prop('checked',item["IsShowBeforeEventDate"]);
                        $("#input_IsNeedElectronicSignature_fdic").prop('checked',item["IsNeedElectronicSignature"]);
                        $("#input_DefaultValue_fdic").prop('checked',item["DefaultValue"]);
                        $("#input_KeySequence_fdic").prop('checked',item["KeySequence"]);

                        $("#input_IsAsSubjectCode_fdic").prop('checked',item["IsAsSubjectCode"]);

                        $('#formDesignItemConfig').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                        updataTablePw();

                    }
                }
            })
        },
        'click .glyphicon-trash':function (e, value, row, index) {
            e.stopPropagation();
            var row=row;
            tms.confirm('您确认删除吗？',function () {
                tms.services.deleteItemGroupItems({
                    requestBody:{
                        id: row.Id
                    },
                    callback:function (res) {
                        $tableItem.bootstrapTable('refresh');
                        tms.alert('删除成功');
                    }
                });
            });
        }
    };
}
//
//
// function addRights() {
//     var gid=nowRole.Id;
//     var datas=getMenuIds(gid);
//     tms.services.createOrUpdateAccessMenu({
//         requestBody:{
//             RoleId: gid,
//             AccessMenuItems: datas
//         },
//         callback:function (data) {
//             tms.alert('保存成功');
//         }
//     })
// }
// function getMenuIds(gid) {
//     var data=[];
//     var lv1=$table1.bootstrapTable('getSelections');
//     var lv2=$('.checkbox-group');
//     for (var i = 0; i < lv1.length; i++) {
//         var obj = lv1[i];
//         var menuItem={MenuId:obj.Id,RoleId:gid};
//         data.push(menuItem);
//     }
//     for (var i = 0; i < lv2.length; i++) {
//         var obj1 = $(lv2[i]);
//         if(obj1.find('input[type=checkbox]').prop('checked')){
//             var menuItem={MenuId:obj1.find('input[type=checkbox]').val(),RoleId:gid};
//             data.push(menuItem);
//         }
//     }
//     return data;
// }
// function addItem(rid) {
//     var rowid=rid||"";
//     var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
//     if(!isMustObjs.isValid()) return false;
//     tms.services.createOrUpdateRole({
//         requestBody:{
//             Id: rowid,
//             Name: $("#input_Name").val(),
//             IsEnable:$("#input_IsEnable").find('input:radio:checked').val() == 1,
//             Remark: $("#input_Remark").val(),
//             FType: 2
//         },
//         callback:function (data) {
//             updataMenu();
//             tms.alert('保存成功',function () {
//                 $("#myModal2").modal('hide');
//             });
//         }
//     })
// }

