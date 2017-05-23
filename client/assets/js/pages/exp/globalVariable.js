var $table1=null;
var _json={DataTypeId:"",OId:""};
$(function () {
    var Length2={
        validators: {
            numeric: {message:'长度只能为数字'},
            notEmpty: {message:'长度不能为空'}
        }
    };
    var SignificantNumber2={
        validators: {
            notEmpty: {
                message:'有效位数不能为空'
            },
            numeric: {
                message:'有效位数只能为数字'
            }
        }
    };
    $table1=$('#table').bootstrapTable({
        height:$(window).height()-202,
        striped: true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.lab.getVariable,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                DataTypeId: _json.DataTypeId,
                OId: _json.OId,
                IsPaged:true,
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
                res.rows = body["VariableItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
            {
            field:'OId',
            title:'OID',
            width:'50%'
            },
            {
                field:'Name',
                title:'OID'
            },
            {
                field:'Name',
                title:'名称'
            },
            {
                field:'DataTypeName',
                title:'数据类型'
            },
            {
                field:'DictionaryName',
                title:'全局字典'
            },
            {
                field:'UnitGroupName',
                title:'全局单位字典'
            },
            {
                field:'SASFieldName',
                title:'SASFieldName'
            },
            {
                title:'操作',
                formatter:'actionFormatter',
                events:'actionsEvents1',
                width:120
            }]
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
            DataFormat:{
                validators: {
                    notEmpty: {
                        message:'数据格式不能为空'
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
    $('#input_DataType').change(function () {
        var tp=$(this).find('option:selected').attr('value2');
        var did=$(this).val();
        if(!tp) return;
        $('.form-group').find('small').remove();
        switch (tp) {
            case "1":
            case "2":
            case "3":
                $('#input_Length').attr({'name':'Length2'});
                $('#input_Length,#input_SignificantNumber').parent().parent('.form-group').addClass('has-require');
                $('#itemForm').bootstrapValidator('addField','Length2',Length2);
                $('#input_SignificantNumber').attr({'name':'SignificantNumber2'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber2',Length2);
                break;
            case "4":
            case "5":
                $('#input_Length').parent().parent('.form-group').addClass('has-require');
                $('#input_SignificantNumber').parent().parent('.form-group').removeClass('has-require');
                $('#input_Length').attr({'name':'Length2'});
                $('#itemForm').bootstrapValidator('addField','Length2',Length2);
                $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
                break;
            default:
                $('#input_SignificantNumber,#input_Length').parent().parent('.form-group').removeClass('has-require');
                $('#input_Length').attr({'name':'Length'});
                $('#itemForm').bootstrapValidator('addField','Length',{});
                $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
                $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
        }
        $('#itemForm').data('bootstrapValidator')
            .updateStatus( $('#input_Length').attr('name'), 'NOT_VALIDATED', null);
        $('#itemForm').data('bootstrapValidator')
            .updateStatus( $('#input_SignificantNumber').attr('name'), 'NOT_VALIDATED', null);
    });
});

function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getVariable({
            requestBody:{
                Id: row.Id,
                IsPaged: false,
                IsLab: true
            },
            callback:function (res) {
                if (res["VariableItems"].length > 0) {
                    var item = res["VariableItems"][0];
                    $("#input_OID").val(item["OId"]);
                    $("#input_Name").val(item["Name"]);
                    $("#input_DataType").val(item["DataTypeId"]).change();
                    $("#input_Length").val(item["Length"]);
                    $("#input_SignificantNumber").val(item["SignificantNumber"]);
                    $("#input_SASFieldName").val(item["SASFieldName"]);
                    $("#input_DataFormat").val(item["DataFormat"]);
                    $("#input_DictionaryId").val(item["DictionaryId"]).change();
                    $("#input_Unit").val(item["UnitGroupId"]).change();
                    $("#input_Description").val(item["Description"]);
                }
                $('#myModal6').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteVariable({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    $table1.bootstrapTable('refresh');
                    tms.alert('删除成功');
                }
            })
        });
    }
};
//新增
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return tms.alert('必填项为空！');
    tms.services.createOrUpdateVariable({
        requestBody:{
            Id: rowid,
            OId: $('#input_OID').val(),
            Name: $('#input_Name').val(),
            DataTypeId: $('#input_DataType').val(),
            Length: $('#input_Length').val(),
            SignificantNumber: $('#input_SignificantNumber').val(),
            SASFieldName:$('#input_SASFieldName').val(),
            DataFormat: $('#input_DataFormat').val(),
            DictionaryId:$('#input_DictionaryId').val(),
            UnitGroupId: $('#input_Unit').val(),
            Description:$('#input_Description').val()
        },
        callback:function () {
            $table1.bootstrapTable('refresh');
            tms.alert('保存成功',function () {
                $('#myModal6').modal('hide');
            })
        }
    })

}
//搜索
function searchItem(){
    _json.DataTypeId=$('#search_DataType').val();
    _json.OId=$('#search_OID').val();
    $table1.bootstrapTable('refresh',{
        pageNumber: 1
    })
}