/**
 * Created by snowden.xu on 2017/4/25.
 */

$table1 = $('#table1');
// 编辑传参
var currentRow = {
    Id:''               // 配置列表Id
};

// 修改、删除按钮事件
window.actionEvents = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        // 编辑事件
        editEvent(row);
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteExport({
                requestBody:{
                    id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    // 重置数据
                    restData();
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

    // 保存
    $('#save').click(function(){
        save();
    })
});

// 初始化table1
function table1(){
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
                IsAccord: null,
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
                field:'RoleName',
                title:'项目角色',
                width:100
            },{
                field:'IsEnable',
                title:'启用状态',
                formatter:'isEnalbeFormatter',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:100
            }
        ],
        onClickRow:function(row){
            editEvent(row);
        },
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 450;
}

// 启用状态
function isEnalbeFormatter(value, row, index){
    return row.IsEnable ? '启用' : '禁用' ;
}

// 操作
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// 保存
function save(){
    var Name = $("#name").val();
    var Description = $("#description").val();
    var FileType = $("#fileType").val();
    var ODMVersion = $("#ODMVersion").val();
    var DataRange = $("#dataRange").val();
    var IsAccord = $("#isAccord").find('input:radio:checked').val() == 1;
    var RoleId = $("#roleId").val();
    var SystemSupplier = $("#systemSupplier").val();
    var SystemName = $("#systemName").val();
    var SystemVersion = $("#systemVersion").val();
    var LanguageId = $("#languageId").val();
    var IsEnable = $("#isEnable").find('input:radio:checked').val() == 'true';

    //console.log(IsEnable);
    tms.services.createOrUpdateExport({
        requestBody:{
            Id: $('#save').text() == '保存' ? currentRow.Id : '',
            Name: Name,
            Description: Description,
            FileType: FileType,
            ODMVersion: ODMVersion,
            DataRange: DataRange,
            IsAccord: IsAccord,
            RoleId: RoleId,
            SystemSupplier: SystemSupplier,
            SystemName: SystemName,
            SystemVersion: SystemVersion,
            LanguageId: LanguageId,
            IsEnable: IsEnable,
            CRFVersionId: bp1.CurrentDraftId
        },
        callback:function (data) {
            tms.alert('保存成功');
            // 重置数据
            restData();
        }
    })
}

// 编辑触发事件
function editEvent(row){
    // 显示保存按钮
    $('#save').text('保存');
    tms.services.getExport({
        requestBody:{
            CompanyId: bp1.CurrentCompanyId,
            Id: row.Id,
            IsPaged: false
        },
        callback:function (data) {
            var temp = data.ExportItems[0];
            currentRow.Id = temp['Id'];
            $('#name').val(temp['Name']);
            $('#description').val(temp['Description']);
            $('#fileType').val(temp['FileType']).trigger('change');
            //$('#ODMVersion').val(temp['ODMVersion']).trigger('change');;
            $('#dataRange').val(temp['DataRange']).trigger('change');
            $('#isAccord').val(temp['IsAccord']);
            $('#roleId').val(temp['RoleId']).trigger('change');
            $('#systemSupplier').val(temp['SystemSupplier']);
            $('#systemName').val(temp['SystemName']);
            $('#systemVersion').val(temp['SystemVersion']);
            $('#languageId').val(temp['LanguageId']).trigger('change');

            if(temp['IsEnable']){
                $("#inlineRadio1").prop('checked',true);
                $("#inlineRadio1").parent().addClass('checked');
                $("#inlineRadio2").prop('checked',false);
                $("#inlineRadio2").parent().removeClass('checked');
            }else{
                $("#inlineRadio2").prop('checked',true);
                $("#inlineRadio2").parent().addClass('checked');
                $("#inlineRadio1").prop('checked',false);
                $("#inlineRadio1").parent().removeClass('checked')
            }
        }
    });
}

// 保存/删除后重置数据
function restData(){
    $table1.bootstrapTable('refresh');
    // 显示新建按钮
    $('#save').text('新建');
    // 清空表单
    $("#name").val('');
    $("#description").val('');
    $("#fileType").val('1').trigger('change');
    $("#dataRange option:first").prop("selected", 'selected').trigger('change');
    $("#roleId").val('').trigger('change');
    $("#systemVersion").val('');
    $("#languageId option:first").prop("selected", 'selected').trigger('change');
    $("#inlineRadio1").prop('checked',true);
    $("#inlineRadio1").parent().addClass('checked');
    $("#inlineRadio2").prop('checked',false);
    $("#inlineRadio2").parent().removeClass('checked');
}