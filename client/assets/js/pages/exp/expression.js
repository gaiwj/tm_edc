/**
 * Created by snowden.xu on 2017/5/3.
 */
$table1 = $('#table1');

// 编辑传参
var currentRow = {
    id:'',
    variableId:'',
    lowLable:'',
    lowOperator:'',
    highLable:'',
    highOperator:'',
    lowValue:'',
    highValue:'',
    unitId:''
};

// 表单修改、删除按钮事件
window.actionEvents = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getRangeTypeItems({
            requestBody:{
                IsPaged: false,
                Id: row.Id
            },
            callback:function (data) {
                var temp = data['RangeTypeItemsItems'][0];
                currentRow = {
                    id:temp.Id,
                    variableId:temp.VariableId,
                    lowLable:temp.LowLable,
                    lowOperator:temp.LowOperator,
                    highLable:temp.HighLable,
                    highOperator:temp.HighOperator,
                    lowValue:temp.LowValue,
                    highValue:temp.HighValue,
                    unitId:temp.UnitId
                };
                //console.log(currentRow);
                $('#expressionEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteRangeTypeItems({
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

    // 验证
    fomVer();

    // 返回
    $('#back').click(function(){
        window.history.go(-1);
    })
});

// 初始化table1
function table1(){
    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.lab.getRangeTypeItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
                IsPaged:true,
                RangeTypeId: tms.util.getUrlParam('id'),
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
                res.rows = body["RangeTypeItemsItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'OId',
                title:'全局变量OID'
            },{
                field:'LowLable',
                title:'低位标签',
                width:100
            },{
                field:'LowOperator',
                title:'低位计算符',
                width:100
            },{
                field:'HighLable',
                title:'高位标签',
                width:100
            },{
                field:'HighOperator',
                title:'高位计算符',
                width:100
            },{
                field:'LowValue',
                title:'低位值',
                width:100
            },{
                field:'HighValue',
                title:'高位值',
                width:100
            },{
                field:'UnitName',
                title:'单位',
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
    $table1.bootstrapTable('refresh')
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 105;
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
        message: 'This value is not valid',
        fields: {
            variableId: {
                validators: {
                    notEmpty: {
                        message: '全局变量不能为空'
                    }
                }
            },
            lowLable: {
                validators: {
                    notEmpty: {
                        message: '低位标签不能为空'
                    }
                }
            },
            lowOperator:{
                validators: {
                    notEmpty: {
                        message: '低位计算符不能为空'
                    }
                }
            }
        }
    });
}