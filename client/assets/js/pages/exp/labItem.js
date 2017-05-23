/**
 * Created by snowden.xu on 2017/5/2.
 */

$table1 = $('#table1');

// 编辑传参
var currentRow = {
    Id:'',
    name:'',
    code:'',
    unit:'',
    isEnable:''
};

// 搜索关键词
var sr = {
    name: '',
    code: ''
};

// 表单修改、删除按钮事件
window.actionEvents = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getLabItems({
            requestBody:{
                IsPaged: false,
                Id: row.Id
            },
            callback:function (data) {
                console.log(data);
                var temp = data['LabItemsItems'][0];
                currentRow = {
                    id:temp.Id,
                    name:temp.Name,
                    code:temp.Code,
                    unit:temp.UnitGroupId,
                    isEnable:temp.IsEnable
                };
                //console.log(currentRow);
                $('#labItemEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteLabItems({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    loadList();
                }
            });
        });
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
    sr.name = $('#name').val();
    sr.code = $('#code').val();

    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.lab.getLabItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
                IsPaged:true,
                Name: sr.name,
                Code: sr.code,
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
                res.rows = body["LabItemsItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'Code',
                title:'代码',
                width:100
            },{
                field:'Name',
                title:'名称'
            },{
                field:'UnitGroupName',
                title:'单位词典',
                width:100
            },{
                field:'IsEnable',
                title:'启用状态',
                formatter:'isEnableFormatter',
                width:100
            },{
                field:'CreateTime',
                title:'创建时间',
                formatter:'createTimeeFormatter',
                width:200
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
    sr.name = $('#name').val();
    sr.code = $('#code').val();
    //console.log(1);
    $table1.bootstrapTable('refresh')
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 210;
}

// 启用状态
function isEnableFormatter(value, row, index){
    return row.IsEnable ? '已启用' : '未启用' ;
}

// 创建时间
function createTimeeFormatter(value, row, index){
    return tms.formatDateTime(row.CreateTime);
}

// 操作
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        fields: {
            code: {
                validators: {
                    notEmpty: {
                        message: '代码不能为空'
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '名称不能为空'
                    }
                }
            },
            unit:{
                validators: {
                    notEmpty: {
                        message: '单位词典不能为空'
                    }
                }
            }
        }
    });
}