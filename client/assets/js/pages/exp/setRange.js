/**
 * Created by robert.wu on 2017/5/8.
 */

//var rangetypes = [];

var rangetypes = [];
var LabRangeConditionItems = null;
var saved_UnitId = "";

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
    }
};

$(function () {
    var title = window.localStorage.title;
    $("#title").html(title ? "正常值范围 - " + title : "正常值范围");
    var type = RUrl.queryString("type");
    var backname = "";
    switch (type) {
        case "1":
            backname = "返回实验室";
            break;
        case "2":
            backname = "返回全局检验";
            break;
        default:
            backname = "返回"
            break;
    }
    $("#btn_back").html(backname);

    // 日期控件初始化
    $('.dataTimepick').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn'),
        showTodayButton:true
    });

    var labid = RUrl.queryString("labid");

    $("#input_LabItemsId1").change(function () {
        input_UnitId = $("#input_UnitId1").empty();

        var valueid = $(this).getSeletedOption().attr("valueid");
        tms.services.getUnitGroupItems({
            requestBody: {
                IsPaged: false,
                UnitGroupId: valueid
            },
            callback: function (res) {
                var options = "";
                $.each(res["UnitGroupItemsItems"], function(i, item) {
                    options += "<option value='" + item["UnitId"] + "'>" + item["Name"] + "</option>";
                });
                input_UnitId.html(options);
                if (saved_UnitId) input_UnitId.setValue(saved_UnitId);
            }
        });
    });

    tms.services.getLabRangeConditionItemsByLabId({
        requestBody: {
            LabId: labid
        },
        callback: function (res) {
            var columns = [];
            columns.push({ field: 'Code', title: '检验项代码', width: '100' });
            columns.push({ field: 'LabItemName', title: '检验项' });
            columns.push({ field: 'FromDate', title: '开始日期', width: '100', formatter: 'actionFormatter02' });
            columns.push({ field: 'ToDate', title: '结束日期', width: '100', formatter: 'actionFormatter02' });
            columns.push({ field: 'LowValue', title: '下限', width: '100' });
            columns.push({ field: 'HighValue', title: '上限', width: '100' });
            columns.push({ field: 'UnitName', title: '单位', width: '100' });
            $.each(res["LabRangeConditionItems"], function(i, item) {
                var index = 8;
                if (item["LowOperator"] == 1) {
                    columns.push({
                        title: item["LowLable"],
                        width: '100',
                        formatter: function (data, row) {
                            var condition = getConditionById(row, item["Id"]);
                            return condition ? condition["DictionaryItemsName"] : "";
                        }
                    });
                }
                else {
                    columns.push({
                        title: item["LowLable"],
                        width: '100',
                        formatter: function (data, row) {
                            var condition = getConditionById(row, item["Id"]);
                            return condition ? condition["LowValue"] : "";
                        }
                    });
                    columns.push({
                        title: item["HighLable"],
                        width: '100',
                        formatter: function (data, row) {
                            var condition = getConditionById(row, item["Id"]);
                            return condition ? condition["HighValue"] : "";
                        }
                    });
                }
            });
            columns.push({ title: '操作', width: '200', formatter: 'actionFormatter01', events: 'operateEvents' });

            $("#table1").bootstrapTable({
                height: getHeight(),
                striped: true,
                pagination: true,
                clickToSelect: true,
                method: 'post',
                url: '/' + tms.urls.globalInspection.getLabRange,
                dataType: 'json',
                sidePagination: 'server',
                contentType: 'application/x-www-form-urlencoded',
                queryParamsType: '',
                queryParams: function (params) {
                    return {
                        LabId: labid,
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
                        res.rows = body["LabRangeItems"];
                        res.total = body["RowCount"];
                    });
                    return res;
                },
                onLoadSuccess: function () {
                    $(".glyphicon").tooltip();
                },
                columns: columns
            }).show();
        }
    });

    $("#form1").bootstrapValidator();

    $(window).resize(function () {
        onResize();
    });
    onResize();
});

// 加载表格
{
    function load1() {
        $("#table1").bootstrapTable('refresh');
    }
}

// 执行事件
{
    function onBack() {
        window.location.href = "/exp/laboratory";
    }

    function onAdd() {
        loadConditions(function () {
            $("#input_LabItemsId1").clearValue();
            $("#input_FromDate1").clearValue();
            $("#input_ToDate1").clearValue();
            $("#input_LowValue1").clearValue();
            $("#input_HighValue1").clearValue();

            saved_UnitId = "";
            LabRangeConditionItems = [];

            $("#modal1").attr("pid", "").modal('show');
        });
    }

    function onEdit(id) {
        loadConditions(function () {
            tms.services.getLabRange({
                requestBody: {
                    IsPaged: false,
                    Id: id
                },
                callback: function (res) {
                    if (res["LabRangeItems"].length > 0) {
                        var item = res["LabRangeItems"][0];
                        $("#input_LabItemsId1").setValue(item["LabItemsId"]);
                        $("#input_FromDate1").setValue(tms.formatDate(item["FromDate"]));
                        $("#input_ToDate1").setValue(tms.formatDate(item["ToDate"]));
                        $("#input_LowValue1").setValue(item["LowValue"]);
                        $("#input_HighValue1").setValue(item["HighValue"]);

                        saved_UnitId = item["UnitId"];
                        LabRangeConditionItems = item["LabRangeConditionItems"];

                        $("#modal1").attr("pid", id).modal('show');
                    }
                }
            });
        });
    }

    function onDelete(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteLabRange({
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

        checkForm("#form1", function () {
            var LabRangeCondition = [];
            rangetypes.each(function (i, item) {
                var id = item.id;
                if (item.type == 1) {
                    LabRangeCondition.push({
                        LowValue: "",
                        HighValue: "",
                        RangeTypeItemsId: id,
                        DictionaryItemsId: item.tr.find(".input_temp1").getValue()
                    });
                }
                else if (item.type == 2) {
                    LabRangeCondition.push({
                        LowValue: item.tr1.find(".input_temp2").getValue(),
                        HighValue: item.tr2.find(".input_temp3").getValue(),
                        RangeTypeItemsId: id,
                        DictionaryItemsId: ""
                    });
                }
            });

            var i=0;

            tms.services.createOrUpdateLabRange({
                requestBody: {
                    Id: Id,
                    LabId: RUrl.queryString("labid"),
                    LabItemsId: $("#input_LabItemsId1").getValue(),
                    FromDate: $("#input_FromDate1").getValue(),
                    ToDate: $("#input_ToDate1").getValue(),
                    LowValue: $("#input_LowValue1").getValue(),
                    HighValue: $("#input_HighValue1").getValue(),
                    UnitId: $("#input_UnitId1").getValue(),
                    LabRangeCondition: LabRangeCondition
                },
                callback: function (res) {
                    load1();
                    $modal.modal("hide");
                }
            });
        });
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter02(data) {
        return tms.formatDate(data);
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

    function getConditionById(data, id) {
        for (var i = 0; i < data["LabRangeConditionItems"].length; i++) {
            var item = data["LabRangeConditionItems"][i];
            if (item["RangeTypeItemsId"] == id) return item;
        }
        return null;
    }

    function getConditionById2(id) {
        if (!LabRangeConditionItems) return null;
        for (var i = 0; i < LabRangeConditionItems.length; i++) {
            if (LabRangeConditionItems[i]["RangeTypeItemsId"] == id) return LabRangeConditionItems[i];
        }
        return null;
    }
    
    function loadConditions(callback) {
        var $form1 = $("#form1");

        $form1.find(".rangetype_1,.rangetype_2,.rangetype_3,.rangetype_4").remove();
        rangetypes = [];

        var rangetypeid = RUrl.queryString("rangetypeid");
        if (rangetypeid != "") {
            tms.services.getRangeTypeItems({
                requestBody: {
                    IsPaged: false,
                    RangeTypeId: rangetypeid
                },
                callback: function (res) {
                    $.each(res["RangeTypeItemsItems"], function(i, item) {
                        var condition = getConditionById2(item["Id"]);
                        if (item["LowOperator"] == 1) {
                            var tr = "";
                            tr += "<div class='form-group rangetype_1' rid='" + item["Id"] + "'>";
                            tr += "<label class='col-md-3'>" + item["LowLable"] + "</label>";
                            tr += "<div class='col-md-8'>";
                            tr += "<select id='' name='' class='form-control select2 input_temp1'>";
                            tr += "<option>...</option>";
                            for (var j = 0; j < item["DictionaryItems"].length; j++) {
                                var itemj = item["DictionaryItems"][j];
                                var selected = (condition && condition["DictionaryItemsId"] == itemj["Id"]) ? " selected='selected'" : "";
                                tr += "<option value='" + itemj["Id"] + "' " + selected + ">" + ("" + itemj["Name"]).encodeHtml() + "</option>";
                            }
                            tr += "</select>";
                            tr += "</div>";
                            tr += "</div>";
                            tr = $(tr);
                            $form1.append(tr);

                            rangetypes.push({
                                id: item["Id"],
                                type: 1,
                                tr: tr
                            });
                        }
                        else {
                            var tr1 = "<div class='form-group rangetype_2' rid='" + item["Id"] + "'>";
                            tr1 += "<label class='col-md-3'>" + item["LowLable"] + "</label>";
                            tr1 += "<div class='col-md-8'>";
                            var value = (condition && condition["LowValue"]) ? condition["LowValue"] : item["LowValue"];
                            tr1 += "<input id='' name='' type='text' class='form-control input_temp2' value='" + value + "'/>";
                            tr1 += "</div>";
                            tr1 += "</div>";
                            tr1 = $(tr1);
                            $form1.append(tr1);

                            var tr2 = "<div class='form-group rangetype_3' rid='" + item["Id"] + "'>";
                            tr2 += "<label class='col-md-3'>" + item["HighLable"] + "</label>";
                            tr2 += "<div class='col-md-8'>";
                            var value = (condition && condition["HighValue"]) ? condition["HighValue"] : item["HighValue"];
                            tr2 += "<input id='' name='' type='text' class='form-control input_temp3' value='" + value + "'/>";
                            tr2 += "</div>";
                            tr2 += "</div>";
                            tr2 = $(tr2);
                            $form1.append(tr2);

                            var tr3 = "<div class='form-group rangetype_4' rid='" + item["Id"] + "'>";
                            tr3 += "<label class='col-md-3'>单位</label>";
                            tr3 += "<div class='col-md-8'>";
                            tr3 += "<span uid='" + item["UnitId"] + "'>" + item["UnitName"] + "</span>";
                            tr3 += "</div>";
                            tr3 += "</div>";
                            tr3 = $(tr3);
                            $form1.append(tr3);

                            rangetypes.push({
                                id: item["Id"],
                                type: 2,
                                tr1: tr1,
                                tr2: tr2,
                                tr3: tr3
                            });
                        }
                    });

                    $form1.find('.select2').select2({
                        minimumResultsForSearch: -1,
                        width: "100%"
                    });
                },
                endCallback: function () {
                    if(callback) callback();
                }
            });
        }
        else {
            if(callback) callback();
        }
    }
}