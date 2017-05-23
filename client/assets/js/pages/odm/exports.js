/**
 * Created by snowden.xu on 2017/4/26.
 */

$table1 = $('#table1');

// 搜索关键词
var sr = {
    name: '',
    description:'',
    dataRange:'',
    isAccord:'',
    fileType:'',
    version:''
};

// 编辑传参
var currentRow = {
    Id:'',
    title:''
};

// 运行导出按钮事件
window.actionEvents = {
    'click .glyphicon-share': function (e, value, row, index) {
        e.stopPropagation();
        currentRow = {
            Id:row.Id,
            title:row.DataRangeName
        };
        //console.log(currentRow);
        switch (row.DataRangeDescription) {
            case "MetaData":
                $('#metaData').modal('show');
                break;
            case "ReferenceData":
                $('#referenceData').modal('show');
                break;
            case "AdminData":
                $('#adminData').modal('show');
                break;
            case "AllClinicalData":
                $('#allClinicalData').modal('show');
                break;
            case "SingleSiteData":
                $('#singleSiteData').modal('show');
                break;
            case "SingleSubjectData":
                currentRow.title = '单个受试者临床数据';
                $('#singleSubjectData').modal('show');
                break;
        }
    }
};

$(function(){
    // 初始化table1
    table1();

    //表格自适应
    $(window).resize(function () {
        $table1.bootstrapTable( 'resetView', {
            height: getHeight()
        });
    });

    // 查询
    $('#search').click(function () {
        loadList();
    });

    // 验证
    fomVer();

    // 日期控件初始化
    $('.dataTimepick').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn'),
        showTodayButton:true
    });

    // 加载标题
    $('.modal').on('show.bs.modal',function(){
        $('.modal-title').html(currentRow.title);
    });
});

// 获取列表
function loadList() {
    sr.name = $('#name').val();
    sr.description = $('#description').val();
    sr.dataRange = $('#dataRange').val();
    sr.isAccord = $('#isAccord').val();
    sr.fileType = $('#fileType').val();
    sr.version = $('#version').val();

    $table1.bootstrapTable('refresh')
}

// 初始化table1
function table1(){
    sr.name = $('#name').val();
    sr.description = $('#description').val();
    sr.dataRange = $('#dataRange').val();
    sr.isAccord = $('#isAccord').val();
    sr.fileType = $('#fileType').val();
    sr.version = $('#version').val();

    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.export.getExport,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
                CompanyId:bp1.CurrentCompanyId,
                IsPaged:true,
                Name: sr.name,
                Description:sr.description,
                DataRange:sr.dataRange,
                IsAccord:sr.isAccord == 1,
                FileType:sr.fileType,
                PageIndex:params.pageNumber-1,
                PageSize:params.pageSize
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["ExportItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'Name',
                title:'名称'
            },{
                field:'Description',
                title:'描述',
                width:200
            },{
                field:'DataRangeName',
                title:'数据范围',
                width:120
            },{
                field:'IsAccord',
                title:'符合21CFR11',
                formatter:'isAccordFormatter',
                width:100
            },{
                field:'FileType',
                title:'文件类型',
                formatter:'fileTypeFormatter',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:60
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 210;
}

// 符合21CFR11
function isAccordFormatter(value, row, index){
    return row.IsAccord ? '是' : '否' ;
}

// 文件类型
function fileTypeFormatter(value, row, index){
    return row.FileType == 1 ? '快照' : '事务' ;
}

// 操作
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-share" data-toggle="tooltip" data-placement="bottom" title="运行导出"></i>'
    ].join('');
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        message: 'This value is not valid',
        fields: {
            crfVersion: {
                validators: {
                    notEmpty: {
                        message: 'eCRF版本不能为空'
                    }
                }
            }
        }
    });
}

