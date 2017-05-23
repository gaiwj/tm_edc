var $table1=null;
var _json={Name:""};
$(function () {
    $table1=$('#table').bootstrapTable({
        height:$(window).height()-201,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.queryClass.getQueryClass,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                Name: _json.Name,
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
                var _data= body["QueryClassItems"];
                res.total = body["RowCount"];
                for (var i = 0; i < _data.length; i++) {
                    _data[i].IsEnable=_data[i].IsEnable?'启用':'停用';
                }
                res.rows=_data;
            });
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
        {
            field:'Name',
            title:'名称',
            width:'50%'
        },
        {
            field:'Value',
            title:'值'
        },
        {
            field:'IsEnable',
            title:'是否启用'
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
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            },
            Value:{
                validators: {
                    notEmpty: {
                        message:'值不能为空'
                    },
                    numeric: {
                        message:'值只能为数字'
                    }
                }
            }
        }
    });
});
//

function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getQueryClass({
            requestBody:{
                Id: row.Id
            },
            callback:function (res) {
                if (res["QueryClassItems"].length > 0) {
                    var item = res["QueryClassItems"][0];
                    $("#input_Name").val(item["Name"]).change();
                    $("#input_Value").val(item["Value"]).change();
                    if(item["IsEnable"]){
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
            tms.services.deleteQueryClass({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable1();
                }
            })
        });
    }
}
//新增item
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateQueryClass({
        requestBody:{
            Id: rowid,
            Name: $('#input_Name').val(),
            Value:$("#input_Value").val(),
            IsEnable:  $("#input_IsEnable").find('input:radio:checked').val() == 1,
        },
        callback:function () {
            $table1.bootstrapTable('refresh');
            tms.alert('保存成功',function () {
                $('#myModal3').modal('hide');
            })
        }
    })

}
//搜索
function searchItem(){
    _json.Name=$('#input-Name').val();
    $table1.bootstrapTable('refresh',{pageNumber:1});
}