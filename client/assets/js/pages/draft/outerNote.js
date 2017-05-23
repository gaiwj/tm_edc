var $table1=null;
var _json={DictionaryName:"",Version:"",Code:""};
$(function () {
    $table1=$('#table').bootstrapTable({
        height:$(window).height()-251,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.ecrf.getHint,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                DictionaryName: _json.DictionaryName,
                Version: _json.Version,
                Code: _json.Code,
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
                var _data= body["HintItems"];
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
                field:'DictionaryName',
                title:'外部提示语',
                width:'50%'
            },
            {
                field:'Version',
                title:'版本'
            },
            {
                field:'Code',
                title:'代码'
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
            Name:{
                validators: {
                    notEmpty: {
                        message:'外部提示语不能为空'
                    }
                }
            },
            Version:{
                validators: {
                    notEmpty: {
                        message:'版本不能为空'
                    }
                }
            },
            Code:{
                validators: {
                    notEmpty: {
                        message:'代码不能为空'
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
        tms.services.getHint({
            requestBody:{
                IsPaged: false,
                CRFVersionId: bp1.CurrentDraftId,
                Id: row.Id
            },
            callback:function (res) {
                if (res["HintItems"].length > 0) {
                    var item = res["HintItems"][0];
                    $("#input_DictionaryName").val(item["DictionaryName"]);
                    $("#input_Version").val(item["Version"]);
                    $("#input_Code").val(item["Code"]);
                }
                $('#outerNoteEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }

        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteHint({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                   $table1.bootstrapTable('refresh');
                }
            })
        });
    }
};

//搜索
function searchItem(){
    _json.DictionaryName=$('#search-DictionaryName').val();
    _json.Version=$('#search-Version').val();
    _json.Code=$('#search-Code').val();
    $table1.bootstrapTable('refresh',{pageNumber:1});
}