/**
 * Created by snowden.xu on 2017/4/18.
 */
$table1= $('#table1');
$table2= $('#table2');
// 编辑传参
var currentRow = {
    Id:'',               // 表单Id
    OId:'',              // 表单OId
    Name:'',             // 表单Name
    IsMultirecord:'',    // 表单类型
    StandardTypeId:'',   // 表单标准
    Description:'',      // 表单描述

    CDASHId:'',          // CDASHId
    Domain:'',           // CDASH应用域
    CDASHName:''         // CDASH名称
};
// 搜索关键词
var sr = {
    StandardTypeId: '',
    IsMultirecord:'',
    OId:''
};

// 表单修改、删除按钮事件
window.actionEvents01 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getForm({
            requestBody:{
                IsPaged: false,
                IsBase: true,
                Id: row.Id
            },
            callback:function (data) {
                console.log(data);
                currentRow = {
                    Id:data['FormItems'][0].Id,
                    OId:data['FormItems'][0].OId,
                    Name:data['FormItems'][0].Name,
                    IsMultirecord:data['FormItems'][0].IsMultirecord ? '1' : '0',
                    StandardTypeId:data['FormItems'][0].StandardTypeId,
                    Description:data['FormItems'][0].Description
                };
                //console.log(currentRow);
                $('#formEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteForm({
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

// CDASH注释修改、删除按钮事件
window.actionEvents02 = {
  'click .glyphicon-edit': function(e,value,row,index){
      e.stopPropagation();
      tms.services.getCDASHAnnotation({
          requestBody:{
              IsPaged: false,
              Id: row.Id
          },
          callback:function(data){
              //console.log(data);
              currentRow = {
                  Id:data['CDASHAnnotationItems'][0].FormId,
                  CDASHId:data['CDASHAnnotationItems'][0].Id,
                  Domain:data['CDASHAnnotationItems'][0].Domain,
                  CDASHName:data['CDASHAnnotationItems'][0].Name
              };
              $('#formCDASH').modal('show');
          }
      })
  },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteCDASHAnnotation({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    loadCDASH($table1.bootstrapTable('getSelections')[0].Id);
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

    // 初始化table1
    table1();

    $table2.bootstrapTable({
        height:300,
        striped: true,
        clickToSelect:true,
        columns:[{
            field:'Domain',
            title:'应用域',
            width:100
        },{
            field:'Name',
            title:'名称'
        },{
            title:'操作',
            formatter:'actionFormatter',
            events:'actionEvents02',
            width:100
        }]
    });

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
    sr.OId = $('#OID-01').val();
    $table1.bootstrapTable({
        height:415,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.crfLib.getForm,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            console.log(params);
            return {
                IsMultirecord:sr.IsMultirecord == "" ? null : sr.IsMultirecord == 1,
                StandardTypeId:sr.StandardTypeId,
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
                res.rows = body["FormItems"];
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
                radio: true,
                formatter:'statusFormatter'
            },{
                field:'OId',
                title:'OID',
                width:100
            },{
                field:'Name',
                title:'名称'
            },{
                field:'IsMultirecord',
                title:'表单类型',
                formatter:'IsMultirecordFormatter',
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

// 获取列表
function loadList() {
    sr.IsMultirecord = $('#IsMultirecord-01').val();
    sr.StandardTypeId = $('#StandardTypeId-01').val();
    sr.OId = $('#OID-01').val();
    //console.log(1);
    $table1.bootstrapTable('refresh')
}

// 获取
function loadCDASH(FormId){
    //console.log('清空了数据');
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

// 表单类型
function IsMultirecordFormatter(value, row, index) {
    return row.IsMultirecord ? '多表单' : '单表单' ;
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