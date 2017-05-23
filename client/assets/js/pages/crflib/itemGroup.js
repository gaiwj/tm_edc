var $table2=null;
var $table1=null;
$(function () {
    $table1=$('#table').bootstrapTable({
        height:400,
        clickToSelect:true,
        pagination:true,
        striped:true,
        columns:[
            {
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
                field:'IsMultirecord',
                title:'数据集类型'
            },
            {
                field:'IsReferData',
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
            updateTable2(row.Id);
        }
    });
    $table2=$('#tableTwo').bootstrapTable({
        height:300,
        pagination:true,
        striped:true,
        columns:[
            {
                field:'Domain',
                title:'应用域',
                width:150
            },
            {
                field:'Name',
                title:'名称'
            },
            {
                formatter:'actionFormatter',
                events:'actionsEvents2',
                title:'操作',
                width:100
            }
        ]
    });
    $('#itemForm').bootstrapValidator({
        fields:{
            OID:{
                validators: {
                    notEmpty: {
                        message:'OID不能为空'
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
            DataType:{
                validators: {
                    notEmpty: {
                        message:'请选择数据类型'
                    }
                }
            },
            Length:{
                validators: {
                    numeric: {
                        message:'长度只能为数字'
                    }
                }
            },
            SignificantNumber:{
                validators: {
                    numeric: {
                        message:'有效位数只能为数字'
                    }
                }
            }
        }
    });
    $('#itemCDASH').bootstrapValidator({
        fields:{
            CDASHName:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            },
            Domain:{
                validators: {
                    notEmpty: {
                        message:'应用域不能为空'
                    }
                }
            }
        }
    })
    $('#input_DataType').change(function () {
        var tp=$(this).find('option:selected').attr('value2');
        var did=$(this).val();
        if(!tp) return;
        switch (tp) {
            case "1":
            case "2":
            case "3":
                $('#input_Length').attr({'name':'Length2'});
                $('#itemForm').bootstrapValidator('addField','Length2',Length2);
                $('#input_SignificantNumber').attr({'name':'SignificantNumber2'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber2',Length2);
                break;
            case "4":
            case "5":
                $('#input_Length').attr({'name':'Length2'});
                $('#itemForm').bootstrapValidator('addField','Length2',Length2);
                $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
                break;
            default:
                $('#input_Length').attr({'name':'Length'});
                $('#itemForm').bootstrapValidator('addField','Length',{});
                $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
        }
        updateDictionary(did,function (data) {
            var options=data;
            $('#input_DictionaryId').html(options.join(''));
        });
    });
    updateTable1();
});
//

//更新表1
function updateTable1(json) {
    var _json=json||{IsMultirecord:"",IsReferData:"",StandardTypeId:"",OId:""};
    tms.services.getItemGroup({
        requestBody:{
            IsMultirecord: _json.IsMultirecord,
            IsReferData: _json.IsReferData,
            StandardTypeId: _json.StandardTypeId,
            OId: _json.OId,
            IsBase: true
        },
        callback:function (data) {
            var _data=data.ItemGroupItems;
            for (var i = 0; i < _data.length; i++) {
               _data[i].IsMultirecord=_data[i].IsMultirecord?'多记录':'单记录';
               _data[i].IsReferData=_data[i].IsReferData?'是':'否';
            }

            $table1.bootstrapTable("load",_data);
            $("[data-toggle='tooltip']").tooltip();
        }
    })
}
//更新表2
function updateTable2(id) {
    var gid=id;
    $table2.bootstrapTable("removeAll");
    tms.services.getCDASHAnnotation({
        requestBody:{
            ItemId: gid
        },
        callback:function (data) {
            var _data=data.CDASHAnnotationItems;
            if(!_data) return;
            $table2.bootstrapTable("load",_data);
            $("[data-toggle='tooltip']").tooltip();
        }
    })
}
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getItemGroup({
            requestBody:{
                IsPaged: false,
                IsBase: true,
                Id: row.Id
            },
            callback:function (res) {
                if (res["ItemGroupItems"].length > 0) {
                    var item = res["ItemGroupItems"][0];
                    $("#input_OID").val(item["OId"]).change();
                    $("#input_Name").val(item["Name"]).change();
                    $("#input_IsMultirecord").val(item["IsMultirecord"]?"1":"2");
                    $("#input_SASDatasetName").val(item["SASDatasetName"]);
                    $("#input_StandardTypeId").val(item["StandardTypeId"]);
                    $("#input_Description").val(item["Description"]);
                    if(item["IsReferData"]){
                        $("#inlineRadio1").prop('checked',true);
                        $("#inlineRadio1").parent().addClass('checked');
                    }else{
                        $("#inlineRadio2").prop('checked',true);
                        $("#inlineRadio2").parent().addClass('checked');
                    }
                }
                $('#myModal3').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }

        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteItemGroup({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable1();
                    tms.alert('删除成功',function () {
                        $('#myModal3').modal('hide');
                    });
                }
            })
        });
    }
}
window.actionsEvents2={
    'click .glyphicon-edit':function (e, value,row,index) {
        tms.services.getCDASHAnnotation({
            requestBody:{
                id:row.Id
            },
            callback:function (data) {
                var _data=data.CDASHAnnotationItems[0];
                $('#input_Domain').val(_data.Domain);
                $('#input_CDASHName').val(_data.Name);
                $('#myModal').attr({'data-type':'edit','data-id':_data.Id});
                $('#myModal').modal('show');
            }
        })
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteCDASHAnnotation({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable2(row.ItemId);
                    tms.alert('删除成功',function () {
                        $('#myModal').modal('hide');
                    });
                }
            })
        });
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
    var _IsMultirecord=$('#search_mulit').val()==""?null:$('#search_mulit').val()=="1";
    var _IsReferData=$('#search_ReferData').val()==""?null:$('#search_ReferData').val()=="1";
    var _StandardType=$('#search_StandardType').val();
    var _OID=$('#search_OID').val();
    var _search={
        IsMultirecord:_IsMultirecord,
        IsReferData:_IsReferData,
        StandardTypeId:_StandardType,
        OId:_OID
    }
    updateTable1(_search);
}