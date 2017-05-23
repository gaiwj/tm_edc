$table1= $('#table1');

// 编辑传参
var currentRow = {
    Id:'',               // 事件Id
    OId:'',              // 事件OId
    Name:'',             // 事件Name
    IsMultirecord:'',    // 事件类型
    StandardTypeId:'',   // 事件标准
    Description:'',      // 事件描述
    EventTypeId:'',      // 事件类别

    CDASHId:'',          // CDASHId
    Domain:'',           // CDASH应用域
    CDASHName:''         // CDASH名称
};
// 搜索关键词
var sr = {
    StandardTypeId: '',
    EventTypeId:'',
    IsMultirecord:'',
    OId:''
};

// 修改、删除按钮事件
window.actionEvents01 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getEvent({
            requestBody:{
                IsPaged: false,
                IsBase: true,
                Id: row.Id
            },
            callback:function (data) {
                //console.log(data);
                var res = data['EventItems'][0];
                currentRow = {
                    Id:res.Id,
                    OId:res.OId,
                    Name:res.Name,
                    IsMultirecord:res.IsMultirecord ? '1' : '0',
                    StandardTypeId:res.StandardTypeId,
                    EventTypeId:res.EventTypeId,
                    Description:res.Description
                };
                //console.log(currentRow);
                $('#studyEventEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteEvent({
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
    $('#IsMultirecord-01').select2({
        minimumResultsForSearch: -1,
        width: "100%"
    });
    $('#StandardTypeId-01').select2({
        minimumResultsForSearch: -1,
        width: "100%"
    });
    $('#EventTypeId-01').select2({
        minimumResultsForSearch: -1,
        width: "100%"
    });

    // 初始化table1
    table1();

    // 查询
    $('#search').click(function () {
        loadList();
    });

    // 验证表单
    fomVer();
});

// 初始化table1
function table1(){
    sr.IsMultirecord = $('#IsMultirecord-01').val();
    sr.StandardTypeId = $('#StandardTypeId-01').val();
    sr.EventTypeId = $('#EventTypeId-01').val();
    sr.OId = $('#OID-01').val();
    $table1.bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.crfLib.getEvent,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
           // console.log(params);
            return {
                IsMultirecord:sr.IsMultirecord == "" ? null : sr.IsMultirecord == 1,
                StandardTypeId:sr.StandardTypeId,
                EventTypeId:sr.EventTypeId,
                OId:sr.OId,
                IsBase:true,
                IsPaged:true,
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
                res.rows = body["EventItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        onClickRow:function (row) {
            loadCDASH(row.Id);
        },
        columns:[
            {
                field:'OId',
                title:'OID',
                width:100
            },{
                field:'Name',
                title:'名称'
            },{
                field:'IsMultirecord',
                title:'事件类型',
                formatter:'IsMultirecordFormatter',
                width:100
            },{
                field:'EventTypeName',
                title:'类别',
                width:100
            },{
                field:'Description',
                title:'描述',
                width:100
            },{
                field:'StandardTypeName',
                title:'标准',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents01',
                width:100
            }
        ]
    });
}

// 获取
function loadCDASH(FormId){
    $table2.bootstrapTable("removeAll");
    tms.services.getCDASHAnnotation({
        requestBody:{
            FormId:FormId,
            IsPaged: false
        },
        callback:function (data) {
            //console.log(data);
            $table2.bootstrapTable('load',data['CDASHAnnotationItems']);
            $('.glyphicon').tooltip();
        }
    })
}

// 获取表单列表
function loadList(){
    sr.IsMultirecord = $('#IsMultirecord-01').val();
    sr.StandardTypeId = $('#StandardTypeId-01').val();
    sr.EventTypeId = $('#EventTypeId-01').val();
    sr.OId = $('#OID-01').val();
    $table1.bootstrapTable('refresh')
}

// 事件类型
function IsMultirecordFormatter(value, row, index) {
    return row.IsMultirecord ? '多事件' : '单事件' ;
}

// 默认第一行选中
function statusFormatter(value,row,index){
    if (index === 0) {
        loadCDASH(row.Id);
        return {
            checked: true
        }
    }
    return value;
}

// 操作1
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
            OID: {
                validators: {
                    notEmpty: {
                        message: 'OID不能为空'
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
            Domain:{
                validators: {
                    notEmpty: {
                        message: '应用域不能为空'
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
                                $('#Description-02').after("<div class='isMessage'>"+ message +"</div>");
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