/**
 * Created by robert.wu on 2017/4/27.
 */
var sr = {
    OId: "",
    Name: ""
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
    'click .btn_delete2': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete2(row["Id"], tr);
    }
};

$(function () {
    $("#table1").bootstrapTable({
        height: 245,
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.lab.getUnitGroup,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                Name: sr.Name,
                OId: sr.OId,
                IsLab: false,
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
                res.rows = body["UnitGroupItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onClickRow: function (row) {
            currentRow = row;
            load2();
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    }).show();

    $('#table2').bootstrapTable({
        height: 245,
        striped: true,
        pagination: true,
        clickToSelect: true
    }).show();

    $("#form1,#form2").bootstrapValidator();

    RResize.onResized();
});

RResize.onResized(function () {
    $("#content").height(RResize.scrheight - 210);
    $("#table1,#table2").bootstrapTable( 'resetView', {
        height: RResize.scrheight - 210 - 60
    });
});

// 加载表格
{
    function load1() {
        $("#table1").bootstrapTable('refresh', {pageNumber: 1});
    }

    function load2() {
        if (currentRow && currentRow["Id"]) {
            $("#table2").bootstrapTable("removeAll");
            tms.services.getUnitGroupItems({
                requestBody: {
                    UnitGroupId: currentRow["Id"],
                    IsPaged: false
                },
                callback: function (data) {
                    $("#table2").bootstrapTable('load', data['UnitGroupItemsItems']);
                    $('.glyphicon').tooltip();
                }
            });
        }
        else {
            tms.alert("请选择一个字典组");
        }
    }
}

// 执行事件
{
    function onSearch() {
        sr.Name = $("#input_Name0").val();
        sr.OId = $("#input_OId0").val();
        load1();
    }

    function onAdd1() {
        $("#input_OID1").clearValue();
        $("#input_Name1").clearValue();
        $("#modal1").attr("pid", "").modal('show');
    }
    function onEdit1(id) {
        tms.services.getUnitGroup({
            requestBody: {
                IsPaged: false,
                Id: id,
                IsLab: false
            },
            callback: function (res) {
                if (res["UnitGroupItems"].length > 0) {
                    var item = res["UnitGroupItems"][0];
                    $("#input_OID1").setValue(item["OId"]);
                    $("#input_Name1").setValue(item["Name"]);
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onDelete1(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteUnitGroup({
                requestBody:{
                    Id: id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    load1();
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
            tms.services.createOrUpdateUnitGroup({
                requestBody: {
                    Id: Id,
                    OID: $("#input_OID1").getValue(),
                    Name: $("#input_Name1").getValue(),
                    IsBase: true,
                    IsLab: false
                },
                callback: function (data) {
                    load1();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onAdd2() {
        if(currentRow && currentRow["Id"]) {
            $("#input_Unit").clearValue();
            $("#modal2").attr("pid", "").modal('show');
        }
        else {
            tms.alert("请选择一个单位组");
        }
    }
    function onDelete2(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteUnitGroupItems({
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
        var $modal = $(dom).closest(".modal");
        var Id = $modal.attr("pid");

        var $form = $("#form1");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.createOrUpdateUnitGroupItems({
                requestBody: {
                    UnitGroupId: currentRow["Id"],
                    UnitId: $("#input_Unit").getValue(),
                    IsBase: true,
                    IsLab: false
                },
                callback: function (data) {
                    load2();
                    $modal.modal("hide");
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
            '<i class="glyphicon glyphicon-trash btn_delete2" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }
}
