/**
 * Created by robert.wu on 2017/5/5.
 */
var sr = {
    StudyId: "",
    SiteName: ""
};

$(function () {
    $('#table1').bootstrapTable({
        height: getHeight(),
        striped: true,
        pagination: false,
        clickToSelect: true
    }).show();

    load1();

    $(window).resize(function () {
        onResize();
    });
    onResize();
});

// 加载表格
{
    function load1() {
        $("#table1").bootstrapTable("removeAll");
        tms.services.getProjectsSite({
            requestBody: {
                StudyId: sr.StudyId,
                SiteName: sr.SiteName
            },
            callback: function (data) {
                $("#table1").bootstrapTable('load', data['StudySite']);
            }
        });
    }
}

// 执行事件
{
    function onSearch() {
        sr.StudyId = $("#input_StudyId0").val();
        sr.SiteName = $("#input_SiteName0").val();
        load1();
    }

    function onSave() {
        var LabAssignedItems = [];
        var rows = $("#table1").bootstrapTable("getAllSelections");
        $.each(rows, function (i, row) {
            LabAssignedItems.push({
                StudyId: row.StudyId,
                SiteId: row.SiteId
            });
        });
        if (LabAssignedItems.length <= 0) {
            tms.alert("请选择一个或多个研究中心");
            return;
        }
        tms.services.createOrUpdateLabAssigned({
            requestBody: {
                LabAssignedItems: LabAssignedItems
            },
            callback: function (res) {
                tms.alert("保存成功");
            }
        });
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