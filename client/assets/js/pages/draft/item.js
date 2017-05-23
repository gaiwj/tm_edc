var $table1=null;
var _json={DataTypeId:"",StandardTypeId:"",OId:""};
var controlTypeId;
var dictionaryId;
$(function () {
    $table1=$('#table').bootstrapTable({
        height:$(window).height()-251,
        striped: true,
        clickToSelect:true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.draft.getDraftItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                DataTypeId: _json.DataTypeId,
                StandardTypeId: _json.StandardTypeId,
                CRFVersionId: bp1.CurrentDraftId,
                OId: _json.OId,
                IsBase: true,
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
                var _data= body["ItemsItems"];
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
                title:'OID',
                width:'50%'
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
                title:'编码字典'
            },
            {
                field:'DisplayName',
                title:'显示名称'
            },
            {
                field:'StandardTypeName',
                title:'标准'
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
            DisplayName:{
                validators: {
                    notEmpty: {
                        message:'显示名称不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm-info').bootstrapValidator({
        fields:{
            ControlsTypeId:{
                validators: {
                    notEmpty: {
                        message:'展现方式不能为空'
                    }
                }
            }
        }

    })
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
        tms.services.getItems({
            requestBody:{
                IsPaged: false,
                CRFVersionId: row.CurrentDraftId,
                Id: row.Id
            },
            callback:function (res) {
                if (res["ItemsItems"].length > 0) {
                    var item = res["ItemsItems"][0];

                     dictionaryId = item["DictionaryId"];
                     controlTypeId = item["ControlsTypeId"];

                    $("#input_OID").val(item["OId"]);
                    $("#input_Name").val(item["Name"]);
                    $("#input_DataType").val(item["DataTypeId"]).change();
                    $("#input_Length").val(item["Length"]);
                    $("#input_SignificantNumber").val(item["SignificantNumber"]);
                    $("#input_NoteDictionaryId").val(item["NoteDictionaryId"]);
                    $("#input_HintId").val(item["HintId"]);
                    $("#input_UnitGroupId").val(item["UnitGroupId"]);
                    $("#input_DisplayName").val(item["DisplayName"]);
                    $("#" + currentForamtControlId).find('select.select2').val(item["DataFormat"]).trigger("change");

                    $("#input_FontSize").val(item["FontSize"]);
                    $("#input_FontColor").val(item["FontColor"]);
                    $("#input_IsBold").prop('checked',item["IsBold"]);
                    $("#input_IsCheckMustInput").prop('checked',item["IsCheckMustInput"]);
                    $("#input_IsCheckInputError").prop('checked',item["IsCheckInputError"]);
                    var limits=item["ItemsLimits"];
                    $('.range-list').empty();
                    for (var i = 0; i < limits.length; i++) {
                        var obj = limits[i];
                        var item_html=$('.range-mod').html();
                        var item=$('<div class="range-item"></div>');
                        item.html(item_html);
                        $('.range-list').append(item);
                        item.find('.range-limit').select2().val(obj.LimitTypeId).trigger("change");
                        item.find('.range-operator').select2().val(obj.Operator).trigger("change");
                        item.find('.range-value').val(obj.Value);
                        if(i==0) item.find('.glyphicon-remove-sign').remove();
                    }
                    if(limits.length===0){
                        var item_html=$('.range-mod').html();
                        var item=['<div class="range-item">'];
                        item.push(item_html+'</div>');
                        $('.range-list').html(item.join(''));
                        $('.range-list').find('.range-limit').select2();
                        $('.range-list').find('.range-operator').select2();
                        $('.range-list').find('.glyphicon-remove-sign').remove();
                    }
                }
                $('#itemEdit').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }

        });
        tms.services.getHint({
            requestBody:{
                IsPaged:false,
                CRFVersionId:bp1.CurrentDraftId
            },
            callback:function (res) {
                if (res["HintItems"].length > 0) {
                    var items = res["HintItems"];
                    var options=[];
                    options.push('<option value="">...</option>');
                    for (var i = 0; i < items.length; i++) {
                        var obj = items[i];
                        options.push('<option value="'+obj.Id+'">'+obj.DictionaryName+'</option>');
                    }
                    $('#input_HintId').html(options.join(''));
                }
            }
        });
        tms.services.getDiction({
            requestBody:{
                IsPaged :false,
                IsLab:false,
                IsBase:false,
                CRFVersionId:bp1.CurrentDraftId
            },
            callback:function (res) {
                if (res["DictionaryItems"].length > 0) {
                    var items = res["DictionaryItems"];
                    var options=[];
                    options.push('<option value="">...</option>');
                    for (var i = 0; i < items.length; i++) {
                        var obj = items[i];
                        options.push('<option value="'+obj.Id+'">'+obj.Name+'</option>');
                    }
                    $('#input_NoteDictionaryId').html(options.join(''));
                }
            }
        })

    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteDraftItems({
                requestBody:{
                    Ids: [row.Id],
                    CRFVersionId: bp1.CurrentDraftId,
                    StudyId:bp1.CurrentProjectId
                },
                callback:function (data) {
                    $table1.bootstrapTable('refresh');
                }
            })
        });
    }
}

//搜索
function searchItem(){
    _json.DataTypeId=$('#search-dataType').val();
    _json.StandardTypeId=$('#search-standardType').val();
    _json.OId=$('#search-OID').val();
    $table1.bootstrapTable('refresh',{pageNumber:1});
}