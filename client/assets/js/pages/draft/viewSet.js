/**
 * Created by cde.chen on 2017/5/15.
 */

// 搜索关键词
var sr = {
    LanguageId: '',
    OId:''
};

// 表单修改、删除按钮事件
window.actionEvents01 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        onEdit(row.Id);
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        onDelete(row.Id);
    }
};

$(function(){
    $("#table1").bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.ecrf.getPreview,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                LanguageId: sr.LanguageId,
                CRFVersionId: bp1.CurrentDraftId,
                OId: sr.OId,
                IsPaged: true,
                PageIndex:params.pageNumber-1,
                PageSize:params.pageSize
            }
        },
        responseHandler: function (data) {
            //console.log(data);
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["PreviewItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onClickRow:function (row) {
            loadCDASH(row.Id);
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        },
        columns:[
            {
                field:'OId',
                title:'OID',
                width: 100
            },{
                field:'LanguageName',
                title:'语言',
                width: 100
            },{
                field:'PreviewContent',
                title:'内容'
            },{
                field:'CreateTime',
                title:'创建时间',
                formatter:'formatter2',
                width:150
            },{
                field:'UpdateTime',
                title:'修改时间',
                formatter:'formatter2',
                width:150
            },{
                title:'操作',
                formatter:'formatter1',
                events:'actionEvents01',
                width:150
            }
        ]
    });

    $('form').bootstrapValidator();
});
// 查询
function onSearch() {
    sr.LanguageId = $("#input_LanguageId").getValue();
    sr.OId = $("#input_OId").getValue();
    loadList();
}

// 获取列表
function loadList() {
    $("#table1").bootstrapTable('refresh')
}

function onAdd() {
    $("#input_LanguageId1").clearValue();
    $("#input_OID1").clearValue();
    $("#input_PreviewContent").clearValue();
    $("#modal1").attr("pid", "").modal('show');
}

function onEdit(id) {
    tms.services.getPreview({
        requestBody:{
            IsPaged: false,
            Id: id
        },
        callback: function (data) {
            if (data["PreviewItems"].length > 0) {
                var item = data["PreviewItems"][0];
                $("#input_LanguageId1").setValue(item["LanguageId"]);
                $("#input_OID1").setValue(item["OId"]);
                $("#input_PreviewContent").setValue(item["PreviewContent"]);
                $('#modal1').attr("pid", id).modal('show');
            }
        }
    });
}

function onDelete(id) {
    tms.confirm("确定要删除选中的记录吗？", function () {
        tms.services.deletePreview({
            requestBody:{
                id: id
            },
            callback:function (data) {
                tms.alert('删除成功');
                loadList();
            }
        });
    });
}

function onSave(dom) {
    var $modal = $(dom).closest(".modal");
    var Id = $modal.attr("pid");

    if ($('#sumForm1').data('bootstrapValidator').validate().isValid()){
        tms.services.createOrUpdatePreview({
            requestBody: {
                Id: Id,
                OId: $("#input_OID1").getValue(),
                LanguageId: $("#input_LanguageId1").getValue(),
                PreviewContent: $("#input_PreviewContent").getValue(),
                IsBase: false,
                CRFVersionId: bp1.CurrentDraftId,
                StudyId: bp1.CurrentProjectId
            },
            callback:function(data){
                $modal.modal('hide');
                loadList();
                tms.alert('操作成功');
            }
        });
    }
}

// 操作
function formatter1() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
function formatter2(data) {
    return tms.formatDateTime(data);
}
