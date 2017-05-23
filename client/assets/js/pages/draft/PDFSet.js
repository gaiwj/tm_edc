/**
 * Created by cde.chen on 2017/5/15.
 */

// 搜索关键词
var sr = {
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
    $('#table1').bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.ecrf.getPDFDefine,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                CRFVersionId: bp1.CurrentDraftId,
                OId: sr.OId,
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
                res.rows = body["PDFDefineItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        },
        columns:[
            {
                field:'OId',
                title:'OID',
                width:150
            },{
                field:'FileUrl',
                title:'PDF相对路径名'
            },{
                field:'PreviewName',
                title:'预览方式',
                // formatter:'IsMultirecordFormatter',
                width:150
            },{
                field:'CreateTime',
                title:'创建时间',
                formatter:'formatter2',
                width:150
            },{
                field:'UpdateTime',
                title:'修改时间',
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

// 初始化table1
function onSearch() {
    sr.OId = $('#OID-01').val();
    loadList();
}

// 获取列表
function loadList() {
    $('#table1').bootstrapTable('refresh')
}

function onAdd() {
    $("#input_OID1").clearValue();
    $("#input_PDFFileId").clearValue();
    $("#input_PreviewId").clearValue();
    $("#modal1").attr("pid", "").modal('show');
}

function onEdit(id) {
    tms.services.getPDFDefine({
        requestBody:{
            IsPaged: false,
            Id: id
        },
        callback: function (data) {
            if (data["PDFDefineItems"].length > 0) {
                var item = data["PDFDefineItems"][0];

                $('#modal1 .modal-title').html("编辑PDF");
                $('#input_OID1').setValue(item["OId"]);
                $("#input_PreviewId").setValue(item["PreviewId"]);

                $('#modal1').attr("pid", id).modal('show');
            }
        }
    });
}

function onDelete(id) {
    tms.confirm("确定要删除选中的记录吗？", function () {
        tms.services.deletePDFDefine({
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
        tms.services.createOrUpdatePDFDefine({
            requestBody: {
                Id: Id,
                OId: $("#input_OID1").getValue(),
                PDFFileId: $("#input_PDFFileId").getValue(),
                PreviewId: $("#input_PreviewId").getValue(),
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

function formatter1() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
function formatter2(data) {
    return tms.formatDateTime(data);
}