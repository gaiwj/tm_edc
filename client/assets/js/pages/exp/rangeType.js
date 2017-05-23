/**
 * Created by snowden.xu on 2017/5/3.
 */
$table1 = $('#table1');

// 编辑传参
var currentRow = {
    id:'',
    oid:'',
    rangType:'',
    isEnable:'',
    description:''
};

// 搜索关键词
var sr = {
    rangeType: '',
    oid: ''
};


// 表单修改、删除按钮事件
window.actionEvents = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getRangeType({
            requestBody:{
                IsPaged: false,
                Id: row.Id
            },
            callback:function (data) {
                var temp = data['RangeTypeItems'][0];
                currentRow = {
                    id:temp.Id,
                    oid:temp.OId,
                    rangType:temp.Name,
                    isEnable:temp.IsEnable,
                    description:temp.Description
                };
                console.log(currentRow);
                $('#rangeTypeEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();

        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteRangeType({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    loadList();
                }
            });
        });
    },
    'click .glyphicon-th-list':function(e,value,row,index){
        e.stopPropagation();
        location.href = '?name=' + row.Name + "&id=" +row.Id;
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
});

// 初始化table1
function table1(){
    sr.rangeType = $('#rangeType').val();
    sr.oid = $('#oid').val();

    var lastPage = $.hash('page');
    var pageNum = parseInt(!lastPage ? 1: lastPage);

    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.lab.getRangeType,
        dataType: 'json',
        sidePagination:'server',
        pageNumber:pageNum,
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            if (pageNum > 1) {
                PageIndex = pageNum -1;
                pageNum = 1;
            }else{
                PageIndex = params.pageNumber - 1;
            }
            return {
                IsPaged:true,
                Name: sr.rangeType,
                OId: sr.oid,
                PageIndex:PageIndex,
                PageSize:params.pageSize
            }
        },
        onPageChange:function(page){ 
            $.hash('page',page);
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["RangeTypeItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'OId',
                title:'OID',
                width:100
            },{
                field:'Name',
                title:'范围类型'
            },{
                field:'Description',
                title:'描述',
                width:200
            },{
                field:'IsEnable',
                title:'启用状态',
                formatter:'isEnableFormatter',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:100
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 获取列表
function loadList() {
    sr.rangeType = $('#rangeType').val();
    sr.oid = $('#oid').val();
    $table1.bootstrapTable('refresh');
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 210;
}

// 启用状态
function isEnableFormatter(value, row, index){
    return row.IsEnable ? '已启用' : '未启用' ;
}

// 操作
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-th-list" data-toggle="tooltip" data-placement="bottom" title="表达式"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        fields: {
            oid: {
                validators: {
                    notEmpty: {
                        message: 'OID不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.\-]+$/,
                        message: '只允许输入英文字母、数字、"_"、"."、"-"'
                    }
                }
            },
            rangType: {
                validators: {
                    notEmpty: {
                        message: '范围类型不能为空'
                    }
                }
            },
            description:{
                message: ' ',
                validators: {
                    stringLength: {
                        max: 255,
                        message: ' '
                    },
                    callback: {
                        message: ' ',
                        callback: function(value, validator) {
                            if (value.length <= 255) {
                                message = '还可以输入' + (255- value.length) + '字符';
                                $('.isMessage').remove();
                                $('#description-01').after("<div class='isMessage'>"+ message +"</div>");
                                return true;

                            }else{
                                return false;
                            }  
                        }
                    }
                }

            }
        }
    });
}