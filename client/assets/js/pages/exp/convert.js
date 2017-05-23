/**
 * Created by snowden.xu on 2017/5/4.
 */
$table1 = $('#table1');

// 编辑传参
var currentRow = {
    id:'',
    oid:'',
    name:'',
    isEnable:'',
    description:'',
    countTypeId:''
};

// 搜索关键词
var sr = {
    isEnable: '',
    countTypeId: '',
    name:'',
    oid:''
};


// 表单修改、删除按钮事件
window.actionEvents = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getDerivation({
            requestBody:{
                IsPaged: false,
                IsLab:true,
                Id: row.Id
            },
            callback:function (data) {
                var temp = data['DerivationItems'][0];
                currentRow = {
                    id:temp.Id,
                    oid:temp.OId,
                    name:temp.Name,
                    isEnable:temp.IsEnable,
                    description:temp.Description,
                    countTypeId:temp.CountTypeId
                };
                console.log(currentRow);
                $('#convertEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDerivation({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    $.hash('page', 0);
                    loadList();
                }
            });
        });
    },
    'click .glyphicon-cog':function(e,value,row,index){
        e.stopPropagation();
        location.href = 'convert?oid=' + row.OId + "&id=" + row.Id + "&countTypeValue=" + row.CountTypeValue;
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
    sr.isEnable = $('#isEnable').val();
    sr.countTypeId = $('#countTypeId').val();
    sr.name = $('#name').val();
    sr.oid = $('#oid').val();

    var lastPage = $.hash('page');
    var pageNum = parseInt(!lastPage ? 1: lastPage);

    $table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.calculate.getDerivation,
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
            //console.log("params.pageNumber:" + params.pageNumber)
            //console.log(PageIndex);
            return {
                OId: sr.oid,
                Name: sr.name,
                CountTypeId: sr.countTypeId,
                IsEnable: sr.isEnable == "" ? null : sr.isEnable == 1,
                CRFVersionId: "",
                IsBase: false,
                IsLab: true,
                IsPaged: true,
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
                res.rows = body["DerivationItems"] == null ? [] : body["DerivationItems"];
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
                title:'名称'
            },{
                field:'Description',
                title:'描述',
                width:200
            },{
                field:'CountTypeName',
                title:'类别',
                width:100
            },{
                field:'Description',
                title:'描述',
                width:100
            },{
                field:'EnableName',
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
    sr.isEnable = $('#isEnable').val();
    sr.countTypeId = $('#countTypeId').val();
    sr.name = $('#name').val();
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
        '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
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
            Name: {
                validators: {
                    notEmpty: {
                        message: '名称不能为空'
                    }
                }
            },
            description:{
                validators: {
                    notEmpty: {
                        message: '描述不能为空'
                    },
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