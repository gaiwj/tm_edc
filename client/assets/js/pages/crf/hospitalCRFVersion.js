/**
 * Created by robert.wu on 2017/4/28.
 */
var sr = {
    EnvironmentId: "",
    SiteCode: "",
    SiteName: "",
    CRFVersion: ""
};

// 按钮事件
window.operateEvents = {
    'click .btn_edit1': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onEdit1(row["Id"], tr);
    }
};

$(function () {
    // 日期控件初始化
    $('.dataTimepick').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn'),
        showTodayButton:true
    });

    $("#table1").bootstrapTable({
        height: getHeight(),
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.crf.getCRFDeploy,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                EnvironmentId: sr.EnvironmentId,
                SiteCode: sr.SiteCode,
                SiteName: sr.SiteName,
                CRFVersion: sr.CRFVersion,
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
                res.rows = body["CRFDeployItems"];
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
    function load1() {
        $("#table1").bootstrapTable('refresh', {pageNumber: 1});
    }
}

// 执行事件
{
    function onSearch() {
        sr.EnvironmentId = $("#input_Environment0").getValue();
        sr.SiteCode = $("#input_Code0").getValue();
        sr.SiteName = $("#input_Name0").getValue();
        sr.CRFVersion = $("#input_CRFVersion0").getValue();
        load1();
    }
    
    function onEdit1(id) {
        $("#modal1").attr("pid", id).modal('show');
        tms.services.getCRFDeploy({
            requestBody: {
                IsPaged: false,
                Id: id
            },
            callback: function (res) {
                if (res["CRFDeployItems"].length > 0) {
                    var item = res["CRFDeployItems"][0];
                    $("#input_EnvironmentName1").html(item["EnvironmentName"]);
                    $("#input_SiteName1").html(item["SiteName"]);
                    $("#input_CRFVersionName1").html(item["CRFVersionName"]);
                    $("#input_EffectiveDate1").setValue(tms.formatDate(item["EffectiveDate"]));
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
            tms.services.updateEffectiveDate({
                requestBody: {
                    Id: Id,
                    EffectiveDate: $("#input_EffectiveDate1").getValue()
                },
                callback: function (res) {
                    load1();
                    $modal.modal("hide");
                }
            });
        }
    }
    
    function onBack() {
        window.location.href = "/crf/crfDraft";
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01() {
        return [
            '<i class="glyphicon glyphicon-edit btn_edit1" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
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
}
