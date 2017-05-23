/**
 * Created by robert.wu on 2017/5/16.
 */
var sr = {
    SiteId: "",
    FormId: "",
    QueryClassId: "",
    SubjectId: "",
    ItemGroupId: "",
    QueryCode: "",
    EventId: "",
    QueryStatus: ""
};

$(function() {
    hotNav("collect_query");

    $("#Action_Type").change(function () {
        var value = $(this).val();
        if (value) {
            $("#Action_ReplyContent").show();
            $("#Action_Submit").show();
        }
        else {
            $("#Action_ReplyContent").hide();
            $("#Action_Submit").hide();
        }
        loadList();
    });

    $("#table1").bootstrapTable({
        height: getHeight(),
        striped: true,
        pagination: true,
        clickToSelect: true,
        method: 'post',
        url: '/' + tms.urls.query.getQuery,
        dataType: 'json',
        sidePagination: 'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams: function (params) {
            return {
                SiteId: sr.SiteId,
                FormId: sr.FormId,
                QueryClassId: sr.QueryClassId,
                SubjectId: sr.SubjectId,
                ItemGroupId: sr.ItemGroupId,
                QueryCode: sr.QueryCode,
                EventId: sr.EventId,
                QueryStatus: sr.QueryStatus,
                CanOperateStatus: $("#Action_Type").getValue(),
                StudyId: bp1.CurrentProjectId,
                EnvironmentId: bp1.CurrentEnvironmentId,
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
                res.rows = body["QueryItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function() {
            $(".glyphicon").tooltip();
        }
    }).show();

    $(window).resize(function () {
        onResize();
    });
    onResize();
});

// 加载表格
{
    function loadList() {
        $("#table1").bootstrapTable('refresh', {pageNumber: 1});
    }
}

// 执行事件
{
    function onSearch() {
        sr.SiteId = $("#input_SiteId").getValue();
        sr.FormId = $("#input_FormId").getValue();
        sr.QueryClassId = $("#input_QueryClassId").getValue();
        sr.SubjectId = $("#input_SubjectId").getValue();
        sr.ItemGroupId = $("#input_ItemGroupId").getValue();
        sr.QueryCode = $("#input_QueryCode").getValue();
        sr.EventId = $("#input_EventId").getValue();
        sr.QueryStatus = $("#input_QueryStatus").getValue();
        loadList();
    }
    
    function onSubmit() {

    }
}

// 其他
{
    function getHeight() {
        return $(window).height() - $("#searchbar").outerHeight() - 70;
    }

    function onResize() {
        $("#table1").bootstrapTable( 'resetView', {
            height: getHeight()
        });
    }
}