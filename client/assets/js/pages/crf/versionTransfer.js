/**
 * Created by snowden.xu on 2017/4/28.
 */

var selectedrows = [];

// 搜索关键词
var sr = {
    StudyId: "",
    CRFVersionFromId: "",
    CRFVersionToId: "",
    EnvironmentFromId: "",
    EnvironmentToId: "",
    ExcuteType: null
};

// 按钮事件
window.operateEvents = {
    'click .btn_excute': function (e, value, row, index) {
        e.stopPropagation();
        var tr = $(this).closest("tr");
        onExcute(row["Id"], tr);
    }
};

$(function(){
    $("#table1").bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.dataMigrate.getDataMigrate,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                Search:{
                    StudyId: sr.StudyId,
                    CRFVersionFromId: sr.CRFVersionFromId,
                    CRFVersionToId: sr.CRFVersionToId,
                    EnvironmentFromId: sr.EnvironmentFromId,
                    EnvironmentToId: sr.EnvironmentToId,
                    ExcuteType: sr.ExcuteType,
                    PageIndex: params.pageNumber-1,
                    PageSize: params.pageSize
                }
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                //res.rows = body["DataMigrateItems"] == null ? [] : body["DataMigrateItems"];
                res.rows = body["DataMigrateItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess: function () {
            $(".glyphicon").tooltip();
        },
        columns:[
            {
                field:'CreateTime',
                title:'迁移时间',
                formatter:'actionFormatter02'
            },{
                field:'StudyName',
                title:'项目'
            },{
                field:'EnvironmentFromName',
                title:'当前环境'
            },{
                field:'CRFVersionFromName',
                title:'当前版本'
            },{
                field:'EnvironmentToName',
                title:'目标环境'
            },{
                field:'CRFVersionToName',
                title:'目标版本'
            },{
                field:'Successed',
                title:'执行结果',
                formatter:'actionFormatter03'
            },{
                title:'操作',
                formatter:'actionFormatter01',
                events:'operateEvents',
                width:100
            }
        ]
    }).show();

    $("#table2").bootstrapTable({
        height:350,
        striped: true,
        pagination:true,
        // smartDisplay: true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.subject.getMigrateSubjectList,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        queryParams:function(params){
            return {
                StudyId: '44359cf078704f6991bea748007ac3ce',
                EnvironmentId: 'FB9C9CCA-9AFC-40F2-B17A-431A0F76EE60',
                CRFVersionId: '87afd5e3-a96f-4a5c-b3c0-1fae66b18c8c',
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
                res.rows = body["MigrateSubjectItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onCheck: function (row) {
            selectedrows.push(row);
        },
        onUncheck: function (row) {
            var index = selectedrows.indexOfFn(function (item) {
                return row.Id == item.Id;
            });
            if (index >= 0) selectedrows.splice(index, 1);
        },
        columns:[{
            checkbox: true
        },
            {
                field:'Code',
                title:'受试者编号'
            },{
                field:'SiteCode',
                title:'中心编号'
            }
        ]
    }).show();

    $(window).resize(function () {
        onResize();
    });
    onResize();
});

function load1() {
    $("#table1").bootstrapTable('refresh');
}

function load2(page) {
    if (page)
        $("#table2").bootstrapTable('refresh',  {pageNumber: page});
    else
        $("#table2").bootstrapTable('refresh');
}

// 执行事件
{
    function onSearch() {
        sr.StudyId = $("#projects-01").getValue();
        sr.CRFVersionFromId = $("#crfVersionFromName").getValue();
        sr.CRFVersionToId = $("#crfVersionToName").getValue();
        sr.EnvironmentFromId = $("#environmentFromName").getValue();
        sr.EnvironmentToId = $("#environmentToName").getValue();
        sr.ExcuteType = $("#ExcuteType").getValue();
        load1();
    }

    function onAdd1() {
        $("#projects-02").clearValue();
        $("#crfVersionFromName-01").clearValue();
        $("#crfVersionToName-01").clearValue();
        $("#environmentFromName-01").clearValue();
        $("#environmentToName-01").clearValue();
        selectedrows = [];
        $("#modal1").modal('show');
        //$("#table2").bootstrapTable("removeAll");
        setTimeout(function () {
            // $("#table2").bootstrapTable('resetView', {
            //     height: 350
            // });
            load2(1);
        }, 500);
    }

    function onSave1(dom) {
        var $modal = $(dom).closest(".modal");

        var StudyId = $('#projects-02').getValue();
        var StudyName = $('#projects-02').getText();
        var CRFVersionFromId = $('#crfVersionFromName-01').getValue();
        var CRFVersionToId = $('#crfVersionToName-01').getValue();
        var EnvironmentFromId = $('#environmentFromName-01').getValue();
        var EnvironmentToId = $('#environmentToName-01').getValue();

        if (!StudyId || !CRFVersionFromId || !CRFVersionToId || !EnvironmentFromId || !EnvironmentToId) {
            tms.alert("请填写完整信息");
            return;
        }

        var DataMigrateItems = [];
        var rows = $("#table2").bootstrapTable("getAllSelections");
        $.each(rows, function (i, row) {
            DataMigrateItems.push({
                SiteId: row.Site,
                SubjectId: row.Id,
                SiteCode: row.SiteCode,
                SubjectCode: row.Code
            });
        });
        if (DataMigrateItems.length <= 0) {
            tms.alert("请选择一个或多个要迁移的受试者");
            return;
        }

        tms.services.createDataMigrate({
            requestBody: {
                StudyId: StudyId,
                StudyName: StudyName,
                CRFVersionFromId: CRFVersionFromId,
                CRFVersionToId: CRFVersionToId,
                EnvironmentFromId: EnvironmentFromId,
                EnvironmentToId: EnvironmentToId,
                DataMigrateItems: DataMigrateItems
            },
            callback: function (data) {
                load1();
                $modal.modal("hide");
            }
        });
    }
    
    function onExcute(id) {
        tms.services.excuteMigratePlan({
            requestBody: {
                MigrateId: id
            },
            callback: function (res) {
                load1();
                tms.alert("操作成功");
            }
        });
    }
}

// 表格数据绑定格式化
{
    function actionFormatter01(data, row) {
        if (row["Successed"] != 2 || row["Successed"] != 4)
            return [
                '<i class="glyphicon glyphicon-play-circle btn_excute" data-toggle="tooltip" data-placement="bottom" title="执行"></i>'
            ].join('');
        else
            return "";
    }

    function actionFormatter02(data) {
        return tms.formatDateTime(data);
    }

    function actionFormatter03(data) {
        var temp = {
            0: "未执行",
            1: "部分迁移成功",
            2: "迁移成功",
            3: "迁移失败",
            4: "正在迁移中..."
        }
        return temp[data] || "";
    }
}

// 其他
{
    function getHeight() {
        return $(window).height() - 280;
    }

    function onResize() {
        $("#table1").bootstrapTable( 'resetView', {
            height: getHeight()
        });
    }
}
