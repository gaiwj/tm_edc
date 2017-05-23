// 搜索关键词
var sr = {
    StandardTypeId: '',
    IsMultirecord:'',
    OId:''
};

var currentRow = null;

// 按钮事件1
window.actionEvents01 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        onEdit1(row.Id);
    },
    'click .glyphicon-trash':function(e, value, row, index){
        e.stopPropagation();
        onDelete1(row.Id);
    }
};

// 按钮事件2
window.actionEvents02 = {
    'click .glyphicon-edit': function(e,value,row,index){
        e.stopPropagation();
        onEdit2(row.Id);
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        onDelete2(row.Id);
    }
};

$(function(){
    $('#table1').bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.draft.getDraftForm,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                StandardTypeId: sr.StandardTypeId,
                CRFVersionId: bp1.CurrentDraftId,
                OId: sr.OId,
                IsMultirecord: sr.IsMultirecord == "" ? null : sr.IsMultirecord == 1,
                IsBase: true,
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
                res.rows = body["FormItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onClickRow:function (row) {
            currentRow = row;
            load2();
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        },
        columns:[
            {
                radio: true
            },{
                field:'OId',
                title:'OID',
                width:100
            },{
                field:'Name',
                title:'名称'
            },{
                field:'IsMultirecord',
                title:'表单类型',
                formatter:'IsMultirecordFormatter',
                width:100
            },{
                field:'StandardTypeName',
                title:'标准',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents01',
                width:100
            }
        ]
    });

    $('#table2').bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.ecrf.getFormPDF,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                CRFVersionId: bp1.CurrentDraftId,
                FormId: currentRow ? currentRow["Id"] : "xxx",
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
                res.rows = body["FormPDFItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    });

    $('form').bootstrapValidator();
});

// 加载表格
{
    function loadList() {
        $('#table1').bootstrapTable('refresh');
    }

    function load2() {
        if (currentRow && currentRow["Id"]) {
            $("#table2").bootstrapTable("removeAll");
            $('#table2').bootstrapTable('refresh');
        }
        else {
            tms.alert("请选择一个表单");
        }
    }
}

// 执行事件
{
    function onSearch() {
        sr.IsMultirecord = $('#search-IsMultirecord').val();
        sr.StandardTypeId = $('#search-StandardTypeId').val();
        sr.OId = $('#search-OID').val();
        loadList();
    }
    
    function onImport() {
        $('#itemGroupImport').modal('show');
    }
    
    function onEdit1(id) {
        tms.services.getForm({
            requestBody:{
                IsPaged: false,
                Id: id
            },
            callback: function (data) {
                if (data["FormItems"].length > 0) {
                    var item = data["FormItems"][0];

                    $('#formEdit .modal-title').html("编辑表单");
                    $('#input_OID1').setValue(item["OId"]);
                    $('#input_Name1').setValue(item["Name"]);
                    $("#input_IsMultirecord").setValue(item["IsMultirecord"] ? "1" : "0");
                    $("#input_DisplayName").setValue(item["DisplayName"]);
                    $("#input_FontSize").setValue(item["FontSize"]);
                    $("#input_FontColor").setValue(item["FontColor"]);
                    $("#input_IsBold").setValue(item["IsBold"]);
                    $("#input_MaxCount").setValue(item["MaxCount"]);
                    $("#input_IsAllowAdd").setValue(item["IsAllowAdd"]);

                    $('#formEdit').attr("pid", id).modal('show');
                }
            }
        });
    }

    function onDelete1(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDraftForm({
                requestBody:{
                    Ids: [id]
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    loadList();
                }
            });
        });
    }

    function onSave1(dom) {
        var $modal = $(dom).closest(".modal");
        var Id = $modal.attr("pid");

        if ($('#sumForm1').data('bootstrapValidator').validate().isValid()){
            tms.services.createOrUpdateForm2({
                requestBody: {
                    Id: Id,
                    OId: $("#input_OID1").getValue(),
                    Name: $("#input_Name1").getValue(),
                    IsMultirecord: $("#input_IsMultirecord").getValue() == "1",
                    DisplayName: $("#input_DisplayName").getValue(),
                    FontSize: $("#input_FontSize").getValue(),
                    FontColor: $("#input_FontColor").getValue(),
                    IsBold: $("#input_IsBold").getValue(),
                    MaxCount: $("#input_MaxCount").getValue(),
                    IsAllowAdd: $("#input_IsAllowAdd").getValue(),
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

    function onAdd2() {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID2").setValue(currentRow["OId"]);
            $("#input_PDFId").clearValue();
            $("#form_pdf").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个表单");
        }
    }

    function onEdit2(id) {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID2").setValue(currentRow["OId"]);
            tms.services.getFormPDF({
                requestBody: {
                    IsPaged: false,
                    Id: id
                },
                callback: function (data) {
                    if (data["FormPDFItems"].length > 0) {
                        var item = data["FormPDFItems"][0];

                        $('#form_pdf .modal-title').html("引用PDF");
                        $('#input_PDFId').setValue(item["PDFId"]);
                        $('#form_pdf').attr("pid", id).modal('show');
                    }
                }
            });
        }
        else {
            tms.alert("请选择一个表单");
        }
    }
    
    function onDelete2(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteFormPDF({
                requestBody:{
                    id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    load2();
                }
            });
        });
    }
    
    function onSave2(dom) {
        if(currentRow && currentRow["Id"]) {
            var $modal = $(dom).closest(".modal");
            var Id = $modal.attr("pid");

            if ($('#sumForm1').data('bootstrapValidator').validate().isValid()) {
                tms.services.createOrUpdateFormPDF({
                    requestBody: {
                        Id: Id,
                        OId: $("#input_OID2").getValue(),
                        PDFId: $("#input_PDFId").getValue(),
                        IsBase: false,
                        StudyId: bp1.CurrentProjectId,
                        CRFVersionId: bp1.CurrentDraftId,
                        FormId: currentRow["Id"]
                    },
                    callback: function (data) {
                        $('.modal').modal('hide');
                        load2();
                        tms.alert('操作成功');
                    }
                });
            }
        }
        else {
            tms.alert("请选择一个表单");
        }
    }
}

// 表格数据绑定格式化
{
    function actionFormatter() {
        return [
            '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    // 表单类型
    function IsMultirecordFormatter(value, row, index) {
        return row.IsMultirecord ? '多表单' : '单表单' ;
    }
}
