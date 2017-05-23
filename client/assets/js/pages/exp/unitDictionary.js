var $table1=null;
var _json={Name:"",OId:""};
$(function () {
    $table1=$('#table').bootstrapTable({
        height:$(window).height()-202,
        striped: true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.lab.getUnit,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                Name: _json.Name,
                OId: _json.OId,
                IsLab: true,
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
                res.rows = body["UnitItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[{
            field:'OId',
            title:'OID',
            width:'50%'
        },
            {
                field:'Name',
                title:'名称'
            },
            {
                field:'Mark',
                title:'符号'
            },
            {
                field:'CreateTime',
                title:'创建时间'
            },
            {
                field:'UpdateTime',
                title:'修改时间'
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
                        message:'OID不能为空！'
                    }
                }
            },
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空！'
                    }
                }
            },
            Mark:{
                validators: {
                    notEmpty: {
                        message:'符号不能为空！'
                    }
                }
            },
            Value:{
                validators: {
                    numeric: {
                        message:'值必须为数字！'
                    }
                }
            }
        }
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
        tms.services.getUnit({
            requestBody:{
                Id: row.Id,
                IsPaged: false,
                IsLab: true
            },
            callback:function (res) {
                if (res["UnitItems"].length > 0) {
                    var item = res["UnitItems"][0];
                    $("#input_OID").val(item["OId"]);
                    $("#input_Mark").val(item["Mark"]);
                    $("#input_Name").val(item["Name"]);
                    $("#input_Value").val(item["Value"]);
                }
                $('#myModal').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteUnit({
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
}
//新增
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return tms.alert('必填项为空！');
    tms.services.createOrUpdateUnit({
        requestBody:{
            Id: rowid,
            OId: $('#input_OID').val(),
            Mark: $('#input_Mark').val(),
            Name: $('#input_Name').val(),
            Value: $('#input_Value').val(),
            IsBase: true,
            IsLab: true
        },
        callback:function () {
            $table1.bootstrapTable('refresh');
            tms.alert('保存成功',function () {
                $('#myModal').modal('hide');
            })
        }
    })

}
//搜索
function searchItem(){
    _json.Name=$('#search-Name').val();
    _json.OId=$('#search-OID').val();
    $table1.bootstrapTable('refresh',{
        pageNumber: 1
    })
}