/**
 * Created by robert.wu on 2017/5/9.
 */
var sr = {
    LabTypeId: "",
    RangeTypeId: "",
    Name: ""
};

// 按钮事件
window.operateEvents = {
    'click .btn_edit': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit(row["Id"], tr);
    },
    'click .btn_delete': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete(row["Id"], tr);
    },
    'click .btn_setrange': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onSetRange(row["Id"], row["RangeTypeId"], tr);
    }
};

$(function () {
    $("#table1").bootstrapTable({
        height: getHeight(),
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.globalInspection.getLab,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                LabTypeId: sr.LabTypeId,
                Name: sr.Name,
                RangeTypeId: sr.RangeTypeId,
                IsGlobal: true,
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
                res.rows = body["LabItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function () {
            $(".glyphicon").tooltip();
        }
    }).show();

    $("#form1").bootstrapValidator();

    $(window).resize(function () {
        onResize();
    });
    onResize();
});

// 加载表格
{
    function loadList() {
        $("#table1").bootstrapTable('refresh');
    }
}

// 执行事件
{
    function onSearch() {
        sr.LabTypeId = $("#input_LabTypeId0").val();
        sr.RangeTypeId = $("#input_RangeTypeId0").val();
        sr.Name = $("#input_Name0").val();
        loadList();
    }

    function onAdd() {
        $("#input_LabTypeId1").clearValue();
        $("#input_Name1").clearValue();
        $("#input_RangeTypeId1").clearValue();
        $("#input_Description1").clearValue();
        $("#input_IsApprove1").removeAttr("checked");
        $("#modal1").attr("pid", "").modal('show');
    }

    function onEdit(id) {
        tms.services.getLab({
            requestBody: {
                IsPaged: false,
                IsGlobal: true,
                Id: id
            },
            callback: function (res) {
                if (res["LabItems"].length > 0) {
                    var item = res["LabItems"][0];
                    $("#input_LabTypeId1").setValue(item["LabTypeId"]);
                    $("#input_Name1").setValue(item["Name"]);
                    $("#input_RangeTypeId1").setValue(item["RangeTypeId"]);
                    $("#input_Description1").setValue(item["Description"]);
                    if (item["IsApprove"]) $("#input_IsApprove1").get(0).checked = true;
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
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
            tms.services.createOrUpdateLab({
                requestBody: {
                    Id: Id,
                    LabTypeId: $("#input_LabTypeId1").getValue(),
                    Name: $("#input_Name1").getValue(),
                    RangeTypeId: $("#input_RangeTypeId1").getValue(),
                    Description: $("#input_Description1").getValue(),
                    IsApprove: $("#input_IsApprove1").is(':checked'),
                    IsGlobal: true
                },
                callback: function (data) {
                    loadList();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onDelete(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteLab({
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

    function onPointHospital(id) {
        window.location.href = "/exp/pointHospital";
    }

    function onSetRange(id, rangetypeid) {
        window.location.href = "/exp/setRange?labid=" + id + "&rangetypeid=" + rangetypeid;
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-fullscreen btn_setrange" data-toggle="tooltip" data-placement="bottom" title="设置范围"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter02(data) {
        return data ? "是" : "否";
    }
}

// 其他
{
    function getHeight() {
        return $(window).height() - 210;
    }

    function onResize() {
        $("#table1").bootstrapTable( 'resetView', {
            height: getHeight()
        });
    }
}