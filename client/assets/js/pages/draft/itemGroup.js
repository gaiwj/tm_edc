var $tableItem=null;
var $tableItemGroup=null;
var _json={IsMultirecord:null,IsReferData:null,StandardTypeIdL:"",OId:"",ItemGroupId:"",IsFristItem:false};
$(function () {
    $tableItemGroup=$('#table').bootstrapTable({
        height:400,
        clickToSelect:true,
        pagination:true,
        striped:true,
        method: 'POST',
        url:'/' + tms.urls.draft.getDraftItemGroup,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                IsMultirecord:_json.IsMultirecord,
                IsReferData: _json.IsReferData,
                StandardTypeId: _json.StandardTypeId,
                OId: _json.OId,
                IsBase: true,
                IsPaged: true,
                CRFVersionId: bp1.CurrentDraftId,
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
                var _data= body["ItemGroupItems"];
                res.total = body["RowCount"];
                res.rows=_data;
            });
            if(!res.rows||res.rows.length==0){
                $tableItemGroup.bootstrapTable('removeAll');
                $tableItem.bootstrapTable('removeAll');
            }
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
            {
                formatter:"singleClick",
                radio:true
            },
            {
                field:'OId',
                title:'OID'
            },
            {
                field:'Name',
                title:'名称',
                height:'40%'
            },
            {
                field:'IsMultirecordName',
                title:'是否多记录'
            },
            {
                field:'IsReferDataName',
                title:'参考数据'
            },
            {
                field:'SASDatasetName',
                title:'SASDatasetName'
            },
            {
                field:'StandardTypeName',
                title:'标准'
            },
            {
                formatter:'actionFormatter',
                events:'actionsEvents1',
                title:'操作'
            }
        ],
        onClickRow:function (row) {
            _json.gid=row.Id;
            if(!$tableItem){
                loadTableItem();
            }else{
                $tableItem.bootstrapTable('refresh');
            }
        }
    });
    $tableItem=$('#tableTwo').bootstrapTable({
        height:300,
        pagination:true,
        striped:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getItemGroupItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            if(!_json.IsFristItem) return false;
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
                formatter:'actionFormatter2',
                events:'actionsEvents2',
                title:'操作',
                width:180
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
                field:'IsActive',
                title:'激活状态'
            },
            {
                field:'ControlsTypeName',
                title:'展现方式'
            },
            {
                field:'IsRequired',
                title:'必填 '
            },
            {
                field:'DataFormat',
                title:'格式'
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
                title:'SASFieldName'
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
                field:'SpecifiedDictionaryName',
                title:'特定编码字典'
            }

        ]
    });
    $('#itemForm').bootstrapValidator({
        fields:{
            DisplayName:{
                validators: {
                    notEmpty: {
                        message:'显示名称不能为空'
                    }
                }
            },
            MaxCount:{
                validators: {
                    numeric: {
                        message:'上限只能为数字'
                    }
                }
            }
        }
    });
    $('#itemForm_GIE').bootstrapValidator({
        fields:{
            ItemOId:{
                validators: {
                    notEmpty: {
                        message:'ItemOId不能为空'
                    }
                }
            }
        }
    });
});
function loadTableItem() {
    _json.IsFristItem=true;
    $tableItem.bootstrapTable('refresh');
}
function singleClick(val,row,index) {
    if(index==0){
        _json.ItemGroupId=row.Id;
        loadTableItem();
        return {
            checked:true
        };
    }
}
function actionFormatter(val,row,index) {

    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
function actionFormatter2(val,row) {
    var length=$tableItem.bootstrapTable('getData').length;

    if(row.SortIndex%10==1){
        return[
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
            '<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="bottom" title="移动"></i>',
            '<i class="glyphicon" data-toggle="tooltip" data-placement="bottom" title="上移"></i>',
            '<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>'
        ].join('');
    }else if(row.SortIndex%10==0||row.SortIndex%10==length){
        return[
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
            '<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="bottom" title="移动"></i>',
            '<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>',
            '<i class="glyphicon" data-toggle="tooltip" data-placement="bottom" title="下移"></i>'
        ].join('');
    }else{
        return[
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
            '<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="bottom" title="移动"></i>',
            '<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="bottom" title="上移"></i>',
            '<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="bottom" title="下移"></i>'
        ].join('');
    }


}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        e.stopPropagation();
        var row=row;
        tms.services.getItemGroup({
            requestBody:{
                IsPaged: false,
                IsBase: false,
                Id: row.Id
            },
            callback:function (res) {
                if (res["ItemGroupItems"].length > 0) {
                    var item = res["ItemGroupItems"][0];
                    $("#input_OID").val(item["OId"]);
                    $("#input_Name").val(item["Name"]);
                    $("#input_IsMultirecord").val(item["IsMultirecord"]?"1":"0").trigger('change');
                    if(item["IsReferData"]){
                        $("#input_IsReferData").find('input[value="1"]').prop('checked',true);
                    }else{
                        $("#input_IsReferData").find('input[value="0"]').prop('checked',true);
                    }
                    $("#input_DisplayName").val(item["DisplayName"]);
                    $("#input_DisplayWay").val(item["DisplayWay"]);
                    $("#input_FontSize").val(item["FontSize"]);
                    $("#input_FontColor").val(item["FontColor"]);
                    $("#input_IsBold").prop('checked',item["IsBold"]);
                    $("#input_IsHiddenName").prop('checked',item["IsHiddenName"]);

                    $("#input_MaxCount").val(item["MaxCount"]);
                    $("#input_IsAllowAdd").prop('checked',item["IsAllowAdd"]);
                }
                $('#itemGroupEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });

    },
    'click .glyphicon-trash':function (e,value,row,index) {
        e.stopPropagation();
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteDraftItemGroup({
                requestBody:{
                    Ids:[row.Id]
                },
                callback:function (data) {
                   $tableItemGroup.bootstrapTable('refresh');
                    tms.alert('删除成功');
                }
            })
        });
    }
}
window.actionsEvents2={
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
                    $("#input_ItemId").val(item["ItemId"]).trigger('change');
                    $("#input_IsActive").prop("checked",item["IsActive"]);
                    $("#input_IsRequired").prop("checked",item["IsRequired"]);
                    $("#input_IsAllowEdit").prop("checked",item["IsAllowEdit"]);
                    $("#input_IsAllowUpdate").prop("checked",item["IsAllowUpdate"]);

                    $("#input_IsMustSDV").prop("checked",item["IsMustSDV"]);
                    $("#input_IsMustInputClinicalSignificance").prop("checked",item["IsMustInputClinicalSignificance"]);
                    $("#input_IsMustCheck").prop("checked",item["IsMustCheck"]);
                    $("#input_IsAsFormDate").prop("checked",item["IsAsFormDate"]);
                    $("#input_IsAsEventDate").prop("checked",item["IsAsEventDate"]);

                    $("#input_IsEnrollmentDate").prop("checked",item["IsEnrollmentDate"]);
                    $("#input_IsShowBeforeEventDate").prop("checked",item["IsShowBeforeEventDate"]);
                    $("#input_IsNeedElectronicSignature").prop("checked",item["IsNeedElectronicSignature"]);
                    $("#input_DefaultValue").val(item["DefaultValue"]);
                    $("#input_KeySequence").val(item["KeySequence"]);

                    $("#input_RoleId").val(item["RoleId"]).trigger('change');
                    $("#input_IsAsSubjectCode").val(item["IsAsSubjectCode"]);
                    $("#input_SpecifiedDictionaryId").val(item["SpecifiedDictionaryId"]).trigger('change');


                    $('#itemGroupItemEdit').attr({'data-type':'edit','data-id':item.Id}).modal('show');
                }
            }
        })
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        e.stopPropagation();
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteItemGroupItems({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    $tableItem.bootstrapTable('refresh');
                    tms.alert('删除成功');
                }
            })
        });
    },
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
    'click .glyphicon-cog':function (e,value,row,index) {
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
                    $("#input_ItemId_cf").val(item["ItemId"]).trigger('change');
                    $("#input_DisplayName_cf").val(item["DisplayName"]);
                    $("#input_DataType_cf").val(item["DataTypeId"]).trigger('change');
                    $("#input_ControlsTypeId_cf").val(item["ControlsTypeId"]).trigger('change');
                    $("#input_SASFieldName_cf").val(item["SASFieldName"]);

                    $("#input_DataFormat_cf").val(item["DataFormat"]);
                    $("#input_SortIndex_cf").val(item["SortIndex"]);
                    $("#input_HintId_cf").val(item["HintId"]).trigger('change');
                    $("#input_KeySequence_cf").val(item["KeySequence"]);
                    $("#input_DefaultValue_cf").val(item["DefaultValue"]);

                    $("#input_UnitGroupId_cf").val(item["UnitGroupId"]).trigger('change');
                    $("#input_DictionaryId_cf").val(item["DictionaryId"]).trigger('change');
                    $("#input_RoleId_cf").val(item["RoleId"]).trigger('change');

                    $("#input_SpecifiedDictionaryId_cf").val(item["SpecifiedDictionaryId"]).trigger('change');
                    $("#input_Name_cf").val(item["ItemName"]);

                    $("#input_Description_cf").val(item["Description"]);
                    $("#input_FontSize_cf").val(item["FontSize"]).trigger('change');
                    $("#input_FontColor_cf").val(item["FontColor"]);
                    $("#input_IsBold_cf").prop('checked',item["IsBold"]);

                    $("#input_IsActive_cf").prop('checked',item["IsActive"]);
                    $("#input_IsRequired_cf").prop('checked',item["IsRequired"]);
                    $("#input_IsAllowEdit_cf").prop('checked',item["IsAllowEdit"]);
                    $("#input_IsAllowUpdate_cf").prop('checked',item["IsAllowUpdate"]);

                    $("#input_IsMustSDV_cf").prop('checked',item["IsMustSDV"]);
                    $("#input_IsMustInputClinicalSignificance_cf").prop('checked',item["IsMustInputClinicalSignificance"]);
                    $("#input_IsMustCheck_cf").prop('checked',item["IsMustCheck"]);
                    $("#input_IsAsFormDate_cf").prop('checked',item["IsAsFormDate"]);
                    $("#input_IsAsEventDate_cf").prop('checked',item["IsAsEventDate"]);

                    $("#input_IsEnrollmentDate_cf").prop('checked',item["IsEnrollmentDate"]);
                    $("#input_IsShowBeforeEventDate_cf").prop('checked',item["IsShowBeforeEventDate"]);
                    $("#input_IsNeedElectronicSignature_cf").prop('checked',item["IsNeedElectronicSignature"]);
                    $("#input_DefaultValue_cf").prop('checked',item["DefaultValue"]);
                    $("#input_KeySequence_cf").prop('checked',item["KeySequence"]);

                    $("#input_IsAsSubjectCode_cf").prop('checked',item["IsAsSubjectCode"]);

                    $('#itemGroupItemConfig').attr({'data-type':'edit','data-id':row.Id}).modal('show');
                    updataTablePw();

                }
            }
        })
    },
    'click .glyphicon-sort':function (e,value,row,index) {
        e.stopPropagation();
        $('#itemGroupItemMove').attr({'data-type':'edit','data-id':row.Id}).modal('show');
    }


}
//新增item
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return tms.alert('必填项为空！');
    tms.services.createOrUpdateItemGroup1({
        requestBody:{
            Id: rowid,
            OId: $('#input_OID').val(),
            Name:$("#input_Name").val(),
            IsMultirecord: $('#input_IsMultirecord').val() == 1,
            IsReferData: $("#input_IsReferData").find('input:radio:checked').val() == 1,
            SASDatasetName: $("#input_SASDatasetName").val(),
            StandardTypeId: $("#input_StandardTypeId").val(),
            Description: $("#input_Description").val(),
            IsBase: true
        },
        callback:function () {
            tms.alert('保存成功',function () {
                updateTable1();
                tms.alert('保存成功',function () {
                    $('#myModal3').modal('hide');
                });
            })
        }
    })

}
//搜索
function searchItem(){
    _json.IsMultirecord=$('#search-IsMultirecord').val()==""?null:$('#search-IsMultirecord').val()=="1";
    _json.IsReferData=$('#search-IsReferData').val()==""?null:$('#search-IsReferData').val()=="1";
    _json.StandardType=$('#search-StandardTypeId').val();
    _json.OID=$('#search-OID').val();
    $tableItemGroup.bootstrapTable('refresh');
}