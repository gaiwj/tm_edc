/**
 * Created by robert.wu on 2017/4/27.
 */
var sr = {
    OId: "",
    Name: ""
};

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
    }
};

$(function () {
    $("#table1").bootstrapTable({
        height: getHeight(),
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.lab.getUnit,
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
                res.rows = body["UnitItems"];
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
        sr.Name = $("#input_Name0").val();
        sr.OId = $("#input_OId0").val();
        loadList();
    }
    
    function onAdd1() {
        $("#input_OID1").clearValue();
        $("#input_Name1").clearValue();
        $("#input_Mark1").clearValue();
        $("#input_Value1").clearValue();
        $("#modal1").attr("pid", "").modal('show');
    }
    function onEdit1(id) {
        tms.services.getUnit({
            requestBody: {
                IsPaged: false,
                Id: id,
                IsLab: false
            },
            callback: function (res) {
                if (res["UnitItems"].length > 0) {
                    var item = res["UnitItems"][0];
                    $("#input_OID1").setValue(item["OId"]);
                    $("#input_Name1").setValue(item["Name"]);
                    $("#input_Mark1").setValue(item["Mark"]);
                    $("#input_Value1").setValue(item["Value"]);
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onDelete1(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteUnit({
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
            tms.services.createOrUpdateUnit({
                requestBody: {
                    Id: Id,
                    OID: $("#input_OID1").getValue(),
                    Name: $("#input_Name1").getValue(),
                    Mark: $("#input_Mark1").getValue(),
                    Value: $("#input_Value1").getValue(),
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
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit1" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete1" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter02(data) {
        return tms.formatDateTime(data);
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
