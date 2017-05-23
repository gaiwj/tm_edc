/**
 * Created by snowden.xu on 2017/4/26.
 */

$table1 = $('#table1');

// 下载按钮事件
window.actionEvents = {
    'click .glyphicon-download': function (e, value, row, index) {
        e.stopPropagation();
        // 下载
        window.open("http://"+row.DownLoad);
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
});

// 初始化table1
function table1(){
    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.odmLog.getODMLog,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
                Id:'',
                CompanyId:bp1.CurrentCompanyId,
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
                res.rows = body["ODMLogItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'FileOID',
                title:'文件OID'
            },{
                field:'ODMVersion',
                title:'ODM版本',
                width:100
            },{
                field:'FileType',
                title:'文件类型',
                formatter:'fileTypeFormatter',
                width:100
            },{
                field:'EndTime',
                title:'数据截止时间',
                formatter:'endTimeFormatter',
                width:180
            },{
                field:'ODMCreateTime',
                title:'生成ODM时间',
                formatter:'createTimeFormatter',
                width:180
            },{
                field:'Message',
                title:'异常信息',
                width:100
            },{
                field:'UserId',
                title:'操作者',
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
    return $(window).height() - 105;
}

// 文件类型
function fileTypeFormatter(value, row, index){
    return row.FileType == 1 ? '快照' : '事务' ;
}

// 数据截止时间
function endTimeFormatter(value, row, index){
    return tms.formatDateTime(row.EndTime);
}

// 生成ODM时间
function createTimeFormatter(value, row, index){
    return tms.formatDateTime(row.ODMCreateTime);
}

// 操作
function actionFormatter(value,row,index) {
    if (row.Status == 2) {
        return[
            '<i class="glyphicon glyphicon-download" data-toggle="tooltip" data-placement="bottom" title="下载"></i>'
        ].join('');
    }else{
        return ''
    }
}