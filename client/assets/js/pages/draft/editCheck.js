var $tableEditCheck=null;
var _json={Name:"",OId:"",IsEnable:""};
$(function () {
    $tableEditCheck=$('#table').bootstrapTable({
        height:$(window).height()-201,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.editCheck.getEditCheck,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                OId: _json.OId,
                Name: _json.Name,
                IsEnable: _json.IsEnable == "" ? null : _json.IsEnable == 1,
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
                var _data= body["EditCheckItems"];
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
                field:'OId',
                title:'OID'
            },
            {
                field:'Name',
                title:'名称'
            },
            {
                field:'Description',
                title:'描述'
            },
            {
                field:'EnableName',
                title:'启用状态',
                formatter:"actionFormatterIsEnable"
            },
            {
                title:'操作',
                formatter:'actionFormatter',
                events:'actionsEvents1',
                width:120
            }]
    });
    $('#itemForm-ece').bootstrapValidator({
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
            Des:{
                validators: {
                    notEmpty: {
                        message:'描述不能为空'
                    }
                }
            }
        }
    });
});
//是否启用格式化
function actionFormatterIsEnable(val,row) {
    if(row.IsEnable) return "是";
    return "否";
}
//操作格式化
function actionFormatter(val,row) {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getEditCheck({
            requestBody:{
                Id: row.Id
            },
            callback:function (res) {
                if (res["EditCheckItems"].length > 0) {
                    var item = res["EditCheckItems"][0];
                    $("#input_OID_ece").val(item["OId"]);
                    $("#input_Name_ece").val(item["Name"]);
                    $("#input_Description_ece").val(item["Description"]);
                    if(item["IsEnable"]){
                        $('#input_IsEnable_ece').find('input[value=1]').prop('checked',true);
                    }else{
                        $('#input_IsEnable_ece').find('input[value=0]').prop('checked',true);
                    }
                }
                $('#editCheckEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }

        });
    },
    'click .glyphicon-cog':function (e, value, row, index) {
        var row=row;
        bp1.EditCheckId=row.Id;
        bp1.EditCheckOId=row.OId;
        tms.setLocalStorage("browseparam1",bp1,true);
        window.location.href="/draft/editCheck/editcheckConfig";
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteEditCheck({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                   $tableEditCheck.bootstrapTable('refresh');
                   tms.alert('删除成功');
                }
            })
        });
    }
}
//搜索
function searchItem(){
    _json.Name=$('#search-Name').val();
    _json.IsEnable=$('#search-IsEnable').val();
    _json.OId=$('#search-OId').val();
    $tableEditCheck.bootstrapTable('refresh',{pageNumber:1});
}