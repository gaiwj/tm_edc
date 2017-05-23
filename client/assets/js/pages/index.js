/**
 * 首页
 */

// 加载当前栏目名称
var path = document.location.pathname.replace('/','');
switch (path){
    case 'index':
        $('.line').hide();
        $('.nav-name').hide();
        $('#homePage').hide();
        break;
    default:
}

// 按钮事件
window.operateEvents = {
    'click .projectlink': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        //console.log(row);
        bp1.CurrentProjectId = row.StudyId;
        bp1.CurrentProjectName = row.StudyCode;
        bp1.CurrentEnvironmentId = row.EnvironmentId;
        bp1.CurrentEnvironmentName = row.EnvironmentName;
        bp1.CurrentHospitalId = row.SiteId;
        bp1.CurrentHospitalName = row.SiteName;
        tms.setLocalStorage("browseparam1",bp1,true);
        goCollect(row, tr);
    }
};

$(function () {
    $('#table1').bootstrapTable({
        height: getHeight(),
        striped: true
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
        tms.services.getAllProjects({
            callback: function (data) {
                $("#table1").bootstrapTable('load', data['StudySite']);
                $('.glyphicon').tooltip();
            }
        });
    }
}

// 执行事件
{
    function goCollect(row) {
        window.location.href = "/collect";
    }
}

// 表格数据绑定格式化
{
    function formatter1(data, row) {
        return "<a href='javascript:;' class='projectlink'>" + row["StudyName"] + "(" + row["EnvironmentName"] + ")</a>";
    }

    function formatter2(data) {
        return "研究中心(" + data + ")";
    }
}

// 其他
{
    function getHeight() {
        return $(window).height() - 390;
    }

    function onResize() {
        $("#table1").bootstrapTable( 'resetView', {
            height: getHeight()
        });
    }
}