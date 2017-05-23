/**
 * Created by robert.wu on 2017/4/26.
 */

// 按钮事件
window.operateEvents = {
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
    }
};

$(function () {
    hotNav("nav_crf_paramConfig");

    // 加载选项
    {
        var options1 = "<option value=''>...</option>";
        for (var i = 1900; i <= 2100; i++) options1 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKYearEqual").append(options1);

        var options2 = "<option value=''>...</option>";
        for (var i = 1; i <= 12; i++) options2 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKMonthEqual").append(options2);

        var options3 = "<option value=''>...</option>";
        for (var i = 1; i <= 31; i++) options3 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKDayEqual").append(options3);

        var options4 = "<option value=''>...</option>";
        for (var i = 0; i <= 24; i++) options4 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKHourEqual").append(options4);

        var options5 = "<option value=''>...</option>";
        for (var i = 0; i <= 60; i++) options5 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKMinuteEqual").append(options5);

        var options6 = "<option value=''>...</option>";
        for (var i = 0; i <= 60; i++) options6 += "<option value='" + i + "'>" + i + "</option>";
        $("#input_UKSecondEqual").append(options6);
    }


    $("#table1").bootstrapTable({
        height: 245,
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.crf.getEnvironment,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                IsPaged: true,
                IsProc: false,
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
                res.rows = body["EnvironmentItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    }).show();

    $('#table2').bootstrapTable({
        height: 343,
        striped: true,
        pagination: true,
        clickToSelect: true
    }).show();

    $("#form1,#form2").bootstrapValidator();

    load1();
    load3();
    load4();
});

// 加载表格
{
    function load1() {
        tms.services.getUKDate({
            requestBody: {
                IsPaged: false
            },
            callback: function (data) {
                $("#input_UKYearEqual").val("" + parseInt(data["UKYearEqual"])).trigger("change");
                $("#input_UKMonthEqual").val("" + parseInt(data["UKMonthEqual"])).trigger("change");
                $("#input_UKDayEqual").val("" + parseInt(data["UKDayEqual"])).trigger("change");
                $("#input_UKHourEqual").val("" + parseInt(data["UKHourEqual"])).trigger("change");
                $("#input_UKMinuteEqual").val("" + parseInt(data["UKMinuteEqual"])).trigger("change");
                $("#input_UKSecondEqual").val("" + parseInt(data["UKSecondEqual"])).trigger("change");
            }
        });
    }

    function load2() {
        $("#table1").bootstrapTable('refresh', {pageNumber: 1});
    }
    
    function load3() {
        tms.services.getWorkflow({
            requestBody: {
                IsPaged: false
            },
            callback: function (res) {
                if (res['WorkflowItems']) {
                    // var data = [];
                    // $.each(res['WorkflowItems'], function (i, item) {
                    //     data.push({
                    //         ActionValueName: "<strong>" + item["ActionValueName"] + "</strong>",
                    //         SavedValue: item[""]
                    //     });
                    // });
                    $("#table2").bootstrapTable('load', res['WorkflowItems']);
                    $('.glyphicon').tooltip();
                }
            }
        });
    }

    function load4() {
        tms.services.getSystemSetting({
            requestBody: {},
            callback: function (res) {
                if (res["SystemSettingItem"]) {
                    $("#input_QueryCodeLen").val(res["SystemSettingItem"]["QueryCodeLen"]);
                    $("#input_SubjectInitStatus").val(res["SystemSettingItem"]["SubjectInitStatusId"]).trigger("change");
                    $("#input_SignatureType").val(res["SystemSettingItem"]["SignatureType"]).trigger("change");
                }
            }
        });
    }
}

// 执行事件
{
    function onSave1() {
        var UKYearEqual = $("#input_UKYearEqual").val();
        var UKMonthEqual = $("#input_UKMonthEqual").val();
        var UKDayEqual = $("#input_UKDayEqual").val();
        var UKHourEqual = $("#input_UKHourEqual").val();
        var UKMinuteEqual = $("#input_UKMinuteEqual").val();
        var UKSecondEqual = $("#input_UKSecondEqual").val();
        tms.services.createOrUpdateUKDate({
            requestBody: {
                UKYearEqual: UKYearEqual,
                UKMonthEqual: UKMonthEqual,
                UKDayEqual: UKDayEqual,
                UKHourEqual: UKHourEqual,
                UKMinuteEqual: UKMinuteEqual,
                UKSecondEqual: UKSecondEqual
            },
            callback: function (res) {
                tms.alert("保存成功");
            }
        });
    }

    function onAdd2() {
        $("#input_Name1").clearValue();
        $("#input_IsEnable1").clearValue();
        $("#modal1").attr("pid", "").modal('show');
    }
    function onEdit2(id) {
        tms.services.getEnvironment({
            requestBody: {
                IsPaged: false,
                Id: id
            },
            callback: function (res) {
                if (res["EnvironmentItems"].length > 0) {
                    var item = res["EnvironmentItems"][0];
                    $("#input_Name1").setValue(item["Name"]);
                    $("#input_IsEnable1").setValue(item["IsEnable"]);
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onDelete2(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteEnvironment({
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
            tms.services.createOrUpdateEnvironment({
                requestBody: {
                    Id: Id,
                    Name: $("#input_Name1").getValue(),
                    IsEnable: $("#input_IsEnable1").getValue() == "1"
                },
                callback: function (res) {
                    load2();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onEdit3(id) {
        tms.services.getWorkflow({
            requestBody: {
                Id: id
            },
            callback: function (res) {
                if (res["WorkflowItems"].length > 0) {
                    var item = res["WorkflowItems"][0];
                    $("#input_Saved").setValue("" + item["SavedValue"]);
                    $("#input_Entry").setValue("" + item["EntryValue"]);
                    $("#input_Query").setValue("" + item["QueryValue"]);
                    $("#input_Signature").setValue("" + item["SignatureValue"]);
                    $("#input_Checked").setValue("" + item["CheckedValue"]);
                    $("#input_Locked").setValue("" + item["LockedValue"]);
                    $("#input_SDV").setValue("" + item["SDVValue"]);
                    $("#input_Freeze").setValue("" + item["FreezeValue"]);
                    $("#modal2").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onSave3(dom) {
        var $modal = $(dom).closest(".modal");
        var Id = $modal.attr("pid");

        var $form = $("#form1");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.updateWorkflow({
                requestBody: {
                    Id: Id,
                    SavedValue: $("#input_Saved").getValue(),
                    EntryValue: $("#input_Entry").getValue(),
                    QueryValue: $("#input_Query").getValue(),
                    SignatureValue: $("#input_Signature").getValue(),
                    CheckedValue: $("#input_Checked").getValue(),
                    LockedValue: $("#input_Locked").getValue(),
                    SDVValue: $("#input_SDV").getValue(),
                    FreezeValue: $("#input_Freeze").getValue()
                },
                callback: function (res) {
                    load3();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onSave4() {
        var QueryCodeLen = $("#input_QueryCodeLen").val();
        var SubjectInitStatusId = $("#input_SubjectInitStatus").val();
        var SignatureType = $("#input_SignatureType").val();
        tms.services.setSystem({
            requestBody: {
                QueryCodeLen: QueryCodeLen,
                SubjectInitStatusId: SubjectInitStatusId,
                SignatureType: SignatureType,
                StudyId: bp1.CurrentProjectId
            },
            callback: function (res) {
                tms.alert("保存成功");
            }
        });
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit2" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete2" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
        ].join('');
    }

    function actionFormatter02() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit3" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>'
        ].join('');
    }

    function actionFormatter03(data) {
        return "<strong>" + data + "</strong>";
    }

    function actionFormatter04(data) {
        return data == 2 ? "不限" : data == 1 ? "已保存" : "未保存";
    }

    function actionFormatter05(data) {
        return data == 2 ? "不限" : data == 1 ? "已录入" : "未录入";
    }

    function actionFormatter06(data) {
        return data == 2 ? "不限" : data == 1 ? "有疑问" : "无疑问";
    }

    function actionFormatter07(data) {
        return data == 2 ? "不限" : data == 1 ? "已签名" : "未签名";
    }

    function actionFormatter08(data) {
        return data == 2 ? "不限" : data == 1 ? "已核查" : "未核查";
    }

    function actionFormatter09(data) {
        return data == 2 ? "不限" : data == 1 ? "已锁定" : "未锁定";
    }

    function actionFormatter10(data) {
        return data == 2 ? "不限" : data == 1 ? "已审核" : "未审核";
    }

    function actionFormatter11(data) {
        return data == 2 ? "不限" : data == 1 ? "已冻结" : "未冻结";
    }

    function actionFormatter12(data) {
        return data == true ? "已启用" : "未启用";
    }
}

