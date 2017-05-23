/**
 * Created by robert.wu on 2017/4/28.
 */

//var bp1 = Cookies.getJSON("browseparam1");

// 按钮事件
window.operateEvents = {
    'click .btn_edit1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit(row["Id"], tr);
    },
    'click .btn_delete1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onDelete(row["Id"], tr);
    },
    'click .btn_release1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onRelease(row["Id"], tr);
    },
    'click .btn_enable2_1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEnable1(row["Id"], tr);
    },
    'click .btn_enable2_2': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEnable2(row["Id"], tr);
    }
};

window.nameEvents = {
    'click .draft':function(e,value,row,index){
        e.stopPropagation();
        uc.CurrentDraftId=row.Id;
        bp1.CurrentDraftId = row.Id;
        bp1.CurrentDraftName = row.Name;
        tms.setLocalStorage("browseparam1",bp1,true);
        Cookies.set("usercache",JSON.stringify(uc));
    }
}

$(function () {
    // 日期控件初始化
    $('.dataTimepick').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn'),
        showTodayButton:true
    });

    $("#input_EffectiveDate3").on('dp.change dp.show', function (e) {
        $('#form3').bootstrapValidator('revalidateField', 'EffectiveDate');
    });

    $("#input_EffectiveDate4").on('dp.change dp.show', function (e) {
        $('#form4').bootstrapValidator('revalidateField', 'EffectiveDate');
    });

    $("#projectselect").change(function () {
        var option = $(this).find("option:selected");
        bp1.CurrentProjectId = option.attr("value");
        bp1.CurrentProjectName = option.html();
        //Cookies.set("browseparam1",JSON.stringify(bp1));
        tms.setLocalStorage("browseparam1",bp1,true);
        load1();
        load2();
        load3();
    }).change();

    $('#table1,#table2,#table3,#table4').bootstrapTable({
        height: 245,
        striped: true,
        pagination: false,
        clickToSelect: true
    }).show();

    $("#form1,#form2,#form3,#form4").bootstrapValidator();

    RResize.onResized();
});

RResize.onResized(function () {
    $("#table1,#table2").each(function () {
       var $this = $(this);
       var content = $this.closest(".content");
       var height = content.height();
       $this.bootstrapTable( 'resetView', { height: height - 60 });
    });
});

// 加载表格
{
    function load1() {
        tms.services.getCRFVersion({
            requestBody: {
                StudyId: bp1.CurrentProjectId,
                IsDraft: true,
                IsPaged: false
            },
            callback: function (data) {
                $("#table1").bootstrapTable('load', data['CRFVersionItems']);
                $('.glyphicon').tooltip();
            }
        });
    }

    function load2() {
        tms.services.getCRFVersion({
            requestBody: {
                StudyId: bp1.CurrentProjectId,
                IsDraft: false,
                IsPaged: false
            },
            callback: function (data) {
                $("#table2").bootstrapTable('load', data['CRFVersionItems']);
                $('.glyphicon').tooltip();
            }
        });
    }

    function load3() {
        tms.services.getProject({
            requestBody: {
                projectId: bp1.CurrentProjectId
            },
            callback: function (res) {
                $("#ProjectDescription").html(res["ProjectDescription"]);
                $("#PlanNum").html(res["PlanNum"]);
                $("#Principal").html(res["Principal"]);
                $("#SignatureDeclaration").html(res["SignatureDeclaration"]);
                RResize.resizeContent();
            }
        });
    }
}

// 执行事件
{
    function onAdd() {
        $("#input_Name1").clearValue();
        $("#modal1").attr("pid", "").modal('show');
    }
    function onEdit(id) {
        tms.services.getCRFVersion({
            requestBody: {
                IsPaged: false,
                Id: id,
                IsDraft: true
            },
            callback: function (res) {
                if (res["CRFVersionItems"].length > 0) {
                    var item = res["CRFVersionItems"][0];
                    $("#input_Name1").setValue(item["Name"]);
                    $("#modal1").attr("pid", id).modal('show');
                }
            }
        });
    }
    function onDelete(id) {
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteCRFVersion({
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
            tms.services.updateVersionName({
                requestBody: {
                    Id: Id,
                    Name: $("#input_Name1").getValue(),
                    StudyId: bp1.CurrentProjectId
                },
                callback: function (data) {
                    load1();
                    $modal.modal("hide");
                }
            });
        }
    }
    function onRelease(id) {
        tms.services.getTrialProtocol({
            requestBody: {
                CRFVersionId: id
            },
            callback: function (data) {
                if (data && data["TrialProtocolItems"]) {
                    var options = "";
                    $.each(data["TrialProtocolItems"], function (i, item) {
                        options += "<option value='" + item["Id"] + "'>" + item["Name"] + "</option>";
                    });
                    $("#input_TrialProtocol2").html(options).trigger('change');
                }
            },
            endCallback: function () {
                $("#input_OID2").clearValue();
                $("#input_Name2").clearValue();
                $("#input_Description2").clearValue();
                $("#input_TrialProtocol2").clearValue();
                $("#modal2").attr("draftid", id).modal('show');
            }
        });
    }
    function onSave2(dom) {
        var $modal = $(dom).closest(".modal");
        var FromCRFVersionId = $modal.attr("draftid");

        var $form = $("#form2");
        var bv = $form.data('bootstrapValidator');
        if (bv) {
            bv.validate();
            if (!bv.isValid()) {
                return false;
            }
            tms.services.addProcCRFVersion({
                requestBody: {
                    Id: "",
                    OID: $("#input_OID2").getValue(),
                    Name: $("#input_Name2").getValue(),
                    Description: $("#input_Description2").getValue(),
                    TrialProtocolId: $("#input_TrialProtocol2").getValue(),
                    FromCRFVersionId: FromCRFVersionId,
                    StudyId: bp1.CurrentProjectId,
                    IsDraft: true
                },
                callback: function (data) {
                    load2();
                    $modal.modal("hide");
                }
            });
        }
    }

    function onEnable1(id, tr) {
        tms.services.getSite({
            requestBody: {
                StudyId: bp1.CurrentProjectId,
                CRFVersionId: id,
                IsProc: false
            },
            callback: function (res) {
                if (res["Sites"] && res["Sites"].length > 0)
                    $("#table3").bootstrapTable("load", res["Sites"]);
                $("#modal3").attr("pid", id).modal('show');
            }
        });
    }
    function onEnable2(id, tr) {
        tms.services.getSite({
            requestBody: {
                StudyId: bp1.CurrentProjectId,
                CRFVersionId: id,
                IsProc: true
            },
            callback: function (res) {
                if (res["Sites"] && res["Sites"].length > 0)
                    $("#table4").bootstrapTable("load", res["Sites"]);
                $("#modal4").attr("pid", id).modal('show');
            }
        });
    }
    function onSave3(dom) {
        var $modal = $(dom).closest(".modal");
        var Id = $modal.attr("pid");

        checkForm("#form3", function () {
            var Hospitals = [];
            var rows = $("#table3").bootstrapTable("getAllSelections");
            $.each(rows, function (i, row) {
                Hospitals.push({
                    Id: row.Id,
                    Code: row.Code,
                    Name: row.Name
                });
            });
            if (Hospitals.length <= 0) {
                tms.alert("请选择一个或多个研究中心");
                return;
            }
            tms.services.createOrUpdateCRFDeploy({
                requestBody: {
                    EnvironmentId: $("#input_EnvironmentId3").getValue(),
                    EffectiveDate: $("#input_EffectiveDate3").getValue(),
                    Hospitals: Hospitals,
                    CRFVersionId: Id,
                    StudyId: bp1.CurrentProjectId,
                    IsProc: false
                },
                callback: function (res) {
                    load2();
                    $modal.modal("hide");
                }
            });
        });
    }
    function onSave4(dom) {
        var $modal = $(dom).closest(".modal");
        var Id = $modal.attr("pid");

        checkForm("#form4", function () {
            var Hospitals = [];
            var rows = $("#table4").bootstrapTable("getAllSelections");
            $.each(rows, function (i, row) {
                Hospitals.push({
                    Id: row.Id,
                    Code: row.Code,
                    Name: row.Name
                });
            });
            if (Hospitals.length <= 0) {
                tms.alert("请选择一个或多个研究中心");
                return;
            }
            tms.services.createOrUpdateCRFDeploy({
                requestBody: {
                    EnvironmentId: $("#input_EnvironmentId4").html(),
                    EffectiveDate: $("#input_EffectiveDate4").getValue(),
                    Hospitals: Hospitals,
                    CRFVersionId: Id,
                    StudyId: bp1.CurrentProjectId,
                    IsProc: false
                },
                callback: function (res) {
                    load2();
                    $modal.modal("hide");
                }
            });
        });
    }

    function onGoHospital() {
        window.location.href = "/crf/hospitalCRFVersion";
    }

    function goDraft(){

    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit1" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
            '<i class="glyphicon glyphicon-trash btn_delete1" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
            '<i class="glyphicon glyphicon-expand btn_release1" data-toggle="tooltip" data-placement="bottom" title="发布"></i>'
        ].join('');
    }

    function actionFormatter02() {
        return [
            '<i class="glyphicon glyphicon-log-in btn_enable2_1" data-toggle="tooltip" data-placement="bottom" title="验证启用"></i>',
            '<i class="glyphicon glyphicon-log-out btn_enable2_2" data-toggle="tooltip" data-placement="bottom" title="正式启用"></i>'
        ].join('');
    }

    function nameFormatter(value, row, index){
        return "<a href='/draft' class='draft'>"+ row.Name +"</a>";
    }
}
