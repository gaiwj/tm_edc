/**
 * Created by robert.wu on 2017/4/20.
 */
var sr = {
    DataTypeId: "",
    StandardTypeId: "",
    OId: ""
};

var currentRow = null;

// 按钮事件
window.operateEvents = {
    'click .btn_edit1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit1(row["Id"], tr);
    },
    'click .btn_delete1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete1(row["Id"], tr);
    },
    'click .btn_edit2': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit2(row["Id"], tr);
    },
    'click .btn_delete2': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete2(row["Id"], tr);
    },
    'click .btn_edit3': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit3(row["Id"], tr);
    },
    'click .btn_delete3': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete3(row["Id"], tr);
    },
    'click .btn_edit4': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit4(row["Id"], tr);
    },
    'click .btn_delete4': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete4(row["Id"], tr);
    },
    'click .btn_edit5': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit5(row["Id"], tr);
    },
    'click .btn_delete5': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete5(row["Id"], tr);
    }
};

$(function() {
    $("#table1").bootstrapTable({
        height: 400,
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.lab.getDiction,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                DataTypeId: sr.DataTypeId,
                StandardTypeId: sr.StandardTypeId,
                OId: sr.OId,
                IsLab: false,
                IsBase: true,
                IsPaged: true,
                PageIndex: params.pageNumber - 1,
                PageSize: params.pageSize
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["DictionaryItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onClickRow: function (row) {
            currentRow = row;
            switch(row["DictionaryTypeValue"]) {
                case 1:
                    $("#block1").show().bootstrapTable("resetView", { height: 200 });
                    $("#block2").hide();
                    $("#block3").hide();
                    load2();
                    break;
                case 2:
                    $("#block1").hide();
                    $("#block2").show().bootstrapTable("resetView", { height: 200 });
                    $("#block3").hide();
                    load3();
                    break;
                case 3:
                    $("#block1").hide();
                    $("#block2").hide();
                    $("#block3").show().bootstrapTable("resetView", { height: 200 });
                    load4();
                    break;
            }

            loadCDASH();
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    }).show();

    $('#table2,#table3,#table4').bootstrapTable({
        height: 400,
        striped: true,
        pagination: false,
        clickToSelect: true
    }).show();

    $("#table5").bootstrapTable({
        height: 400,
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.crfLib.getCDASHAnnotation,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                DictionaryId: currentRow ? currentRow["Id"] : "none",
                IsPaged: true,
                PageIndex: params.pageNumber - 1,
                PageSize: params.pageSize
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                if (body["CDASHAnnotationItems"]) res.rows = body["CDASHAnnotationItems"];
                if (body["RowCount"]) res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    });

    $("#form1,#form2,#form3,#form4,#form5").bootstrapValidator();
});

// 加载表格
{
    function loadList() {
        $("#table1").bootstrapTable('refresh', {pageNumber: 1});
    }

    function load2() {
        if (currentRow && currentRow["Id"]) {
            $("#table2").bootstrapTable("removeAll");
            tms.services.getDictionItems({
                requestBody: {
                    DictionaryId: currentRow["Id"],
                    IsPaged: false
                },
                callback: function (data) {
                    $("#table2").bootstrapTable('load', data['DictionaryItemsItems']);
                    $('.glyphicon').tooltip();
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }

    function load3() {
        if(currentRow && currentRow["Id"]) {
            $("#table3").bootstrapTable("removeAll");
            tms.services.getDictionItems({
                requestBody: {
                    DictionaryId: currentRow["Id"],
                    IsPaged: false
                },
                callback: function (data) {
                    $("#table3").bootstrapTable('load', data['DictionaryItemsItems']);
                    $('.glyphicon').tooltip();
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }

    function load4() {
        if(currentRow && currentRow["Id"]) {
            $("#table4").bootstrapTable("removeAll");
            tms.services.getDictionItems({
                requestBody: {
                    DictionaryId: currentRow["Id"],
                    IsPaged: false
                },
                callback: function (data) {
                    $("#table4").bootstrapTable('load', data['DictionaryItemsItems']);
                    $('.glyphicon').tooltip();
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }

    function loadCDASH() {
        $("#table5").bootstrapTable('refresh', {pageNumber: 1});
    }
}

// 执行事件
{
    function onSearch() {
        sr.DataTypeId = $("#input_DataType").val();
        sr.StandardTypeId = $("#input_StandardType").val();
        sr.OId = $("#input_OId").val();
        loadList();
    }

    function onAdd1() {
        $("#input_OID1").val("");
        $("#input_Name1").val("");
        $("#input_DataType1").val(null).trigger("change");
        $("#input_SASFormatName1").val("");
        $("#input_StandardType1").val(null).trigger("change");
        $("#input_DictionaryType1").val(null).trigger("change");
        $("#input_CodeType1").val(null).trigger("change");
        $("#input_Description1").val("");
        $("#modal1").attr("pid", "").modal('show');
    }
    function onEdit1(id) {
        tms.services.getDiction({
            requestBody: {
                IsPaged: false,
                IsLab: false,
                IsBase: true,
                Id: id
            },
            callback: function (res) {
                if (res["DictionaryItems"].length > 0) {
                    var item = res["DictionaryItems"][0];
                    $("#input_OID1").val(item["OId"]);
                    $("#input_Name1").val(item["Name"]);
                    $("#input_DataType1").val(item["DataTypeId"]);
                    $("#input_SASFormatName1").val(item["SASFormatName"]);
                    $("#input_StandardType1").val(item["StandardTypeId"]);
                    $("#input_DictionaryType1").val(item["DictionaryTypeId"]);
                    $("#input_CodeType1").val(item["CodeTypeId"]);
                    $("#input_Description1").val(item["Description"]);
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onDelete1(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDiction({
                requestBody:{
                    Id: id
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

        var $form = $("#form1");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateDictionary1({
                requestBody: {
                    Id: Id,
                    OID: $("#input_OID1").val(),
                    Name: $("#input_Name1").val(),
                    DataTypeId: $("#input_DataType1").val(),
                    SASFormatName: $("#input_SASFormatName1").val(),
                    StandardTypeId: $("#input_StandardType1").val(),
                    DictionaryTypeId: $("#input_DictionaryType1").val(),
                    CodeTypeId: $("#input_CodeType1").val(),
                    Description: $("#input_Description1").val(),
                    IsBase: true,
                    IsLab: false
                },
                callback: function (data) {
                    loadList();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onAdd2() {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID2").val(currentRow["OId"]);
            $("#input_Value2").val("");
            $("#input_Name2").val("");
            $("#input_Rank2").val("");
            $("#modal2").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onEdit2(id) {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID2").val(currentRow["OId"]);
            tms.services.getDictionItems({
                requestBody: {
                    IsPaged: false,
                    IsLab: false,
                    Id: id
                },
                callback: function (res) {
                    if (res["DictionaryItemsItems"].length > 0) {
                        var item = res["DictionaryItemsItems"][0];
                        $("#input_Value2").val(item["Value"]);
                        $("#input_Name2").val(item["Name"]);
                        $("#input_Rank2").val(item["Rank"]);
                        $("#modal2").attr({ pid: id, dicid: item["Id"] }).modal('show');
                    }
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onDelete2(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDictionaryItems({
                requestBody:{
                    Id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    load2();
                }
            });
        });
    }
    function onSave2(dom) {
        var modal = $(dom).closest(".modal");
        var Id = modal.attr("pid");

        var $form = $("#form2");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateDictionaryItems({
                requestBody: {
                    Id: Id,
                    Value: $("#input_Value2").val(),
                    Name: $("#input_Name2").val(),
                    Rank: $("#input_Rank2").val(),
                    IsBase: true,
                    IsLab: false,
                    DictionaryId: currentRow["Id"]
                },
                callback: function (data) {
                    load2();
                    modal.modal("hide");
                }
            });
        }
    }

    function onAdd3() {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID3").val(currentRow["OId"]);
            $("#input_Value3").val("");
            $("#input_Rank3").val("");
            $("#modal3").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onEdit3(id) {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID3").val(currentRow["OId"]);
            tms.services.getDictionItems({
                requestBody: {
                    IsPaged: false,
                    IsLab: false,
                    Id: id
                },
                callback: function (res) {
                    if (res["DictionaryItemsItems"].length > 0) {
                        var item = res["DictionaryItemsItems"][0];
                        $("#input_Value3").val(item["Value"]);
                        $("#input_Rank3").val(item["Rank"]);
                        $("#modal3").attr({ pid: id, dicid: item["Id"] }).modal('show');
                    }
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onDelete3(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDictionaryItems({
                requestBody:{
                    Id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    load3();
                }
            });
        });
    }
    function onSave3(dom) {
        var modal = $(dom).closest(".modal");
        var Id = modal.attr("pid");

        var $form = $("#form3");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateDictionaryItems({
                requestBody: {
                    Id: Id,
                    Value: $("#input_Value3").val(),
                    Rank: $("#input_Rank3").val(),
                    IsBase: true,
                    IsLab: false,
                    DictionaryId: currentRow["Id"]
                },
                callback: function (data) {
                    load3();
                    modal.modal("hide");
                }
            });
        }
    }

    function onAdd4() {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID4").val(currentRow["OId"]);
            $("#input_DictionaryName4").val("");
            $("#input_Version4").val("");
            $("#input_InstanceName4").val("");
            $("#input_Url4").val("");
            $("#modal4").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onEdit4(id) {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID4").val(currentRow["OId"]);
            tms.services.getDictionItems({
                requestBody: {
                    IsPaged: false,
                    IsLab: false,
                    Id: id
                },
                callback: function (res) {
                    if (res["DictionaryItemsItems"].length > 0) {
                        var item = res["DictionaryItemsItems"][0];
                        $("#input_DictionaryName4").val(item["DictionaryName"]);
                        $("#input_Version4").val(item["Version"]);
                        $("#input_InstanceName4").val(item["InstanceName"]);
                        $("#input_Url4").val(item["Url"]);
                        $("#modal4").attr({ pid: id, dicid: item["Id"] }).modal('show');
                    }
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onDelete4(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDictionaryItems({
                requestBody:{
                    Id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    load4();
                }
            });
        });
    }
    function onSave4(dom) {
        var modal = $(dom).closest(".modal");
        var Id = modal.attr("pid");

        var $form = $("#form4");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateDictionaryItems({
                requestBody: {
                    Id: Id,
                    DictionaryName: $("#input_DictionaryName4").val(),
                    Version: $("#input_Version4").val(),
                    InstanceName: $("#input_InstanceName4").val(),
                    Url: $("#input_Url4").val(),
                    IsBase: true,
                    IsLab: false,
                    DictionaryId: currentRow["Id"]
                },
                callback: function (data) {
                    load4();
                    modal.modal("hide");
                }
            });
        }
    }

    function onAdd5() {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID5").val(currentRow["OId"]);
            $("#input_Domain5").val("");
            $("#input_Name5").val("");
            $("#modal5").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onEdit5(id) {
        if(currentRow && currentRow["Id"]) {
            $("#input_OID5").val(currentRow["OId"]);
            tms.services.getCDASHAnnotation({
                requestBody: {
                    IsPaged: false,
                    Id: id
                },
                callback: function (res) {
                    if (res["CDASHAnnotationItems"].length > 0) {
                        var item = res["CDASHAnnotationItems"][0];
                        $("#input_Domain5").val(item["Domain"]);
                        $("#input_Name5").val(item["Name"]);
                        $("#modal5").attr({ pid: id, dicid: item["Id"] }).modal('show');
                    }
                }
            });
        }
        else {
            tms.alert("请选择一个字典");
        }
    }
    function onDelete5(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteCDASHAnnotation({
                requestBody:{
                    Id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    loadCDASH();
                }
            });
        });
    }
    function onSave5(dom) {
        var modal = $(dom).closest(".modal");
        var Id = modal.attr("pid");

        var $form = $("#form5");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateCDASHAnnotation({
                requestBody: {
                    Id: Id,
                    Domain: $("#input_Domain5").val(),
                    Name: $("#input_Name5").val(),
                    DictionaryId: currentRow["Id"],
                    IsBase: true
                },
                callback: function (data) {
                    loadCDASH();
                    modal.modal("hide");
                }
            });
        }
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit1" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete1" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter02() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit2" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete2" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter03() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit3" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete3" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter04() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit4" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete4" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter05() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit5" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete5" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }
}