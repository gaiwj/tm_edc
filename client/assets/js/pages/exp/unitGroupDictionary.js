var $table1=null;
var $table2=null;
var _json={Name:"",OId:"",nowId:""};
$(function () {
    $table1=$('#table1').bootstrapTable({
        height:$(window).height()-252,
        striped: true,
        pagination:true,
        method: 'POST',
        url:'/' + tms.urls.lab.getUnitGroup,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        clickToSelect:true,
        singleSelect:true,
        queryParams:function(params){
            return {
                Name: _json.Name,
                OId: _json.OId,
                IsLab: true,
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
                res.rows = body["UnitGroupItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        onLoadSuccess:function(){
            $("[data-toggle='tooltip']").tooltip();
        },
        columns:[
        {
            radio:true
        },
        {
            field:'OId',
            title:'OID'
        },
        {
            field:'Name',
            title:'名称',
            width:'50%'
        },
        {
            title:'操作',
            formatter:'actionFormatter',
            events:'actionsEvents1',
            width:120
        }],
        onClickRow:function(row,obj){
            _json.nowId=row.Id;
            updateTable2(_json.nowId);
        }
    });
    $table2=$('#table2').bootstrapTable({
        height:$(window).height()-252,
        striped: true,
        columns:[
        {
            field:'OID',
            title:'OID'
        },
        {
            field:'Name',
            title:'名称',
            width:'50%'
        },
        {
            title:'操作',
            formatter:'actionFormatter2',
            events:'actionsEvents2',
            width:120
        }]
    });
    $('#itemForm').bootstrapValidator({
        fields:{
            OID:{
                validators: {
                    notEmpty: {
                        message:'OID不能为空！'
                    }
                }
            },
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空！'
                    }
                }
            }
        }
    });
    $('#itemForm2').bootstrapValidator({
        fields:{
            unit:{
                validators: {
                    notEmpty: {
                        message:'单位不能为空！'
                    }
                }
            }
        }
    });
});
function updateTable2(rid) {
    var rowid=rid||"";
    tms.services.getUnitGroupItems({
        requestBody:{
            UnitGroupId: rowid,
            IsPaged: false
        },
        callback:function(data){
            var _data=data.UnitGroupItemsItems;
            $table2.bootstrapTable('load',_data);
        }
    })
}
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
function actionFormatter2() {
    return[
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getUnitGroup({
            requestBody:{
                Id: row.Id,
                IsPaged: false,
                IsLab: true
            },
            callback:function (res) {
                if (res["UnitGroupItems"].length > 0) {
                    var item = res["UnitGroupItems"][0];
                    $("#input_OID").val(item["OId"]);
                    $("#input_Name").val(item["Name"]);
                }
                $('#myModal2').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteUnitGroup({
                requestBody:{
                    id:row.Id
                },
                callback:function () {
                    $table1.bootstrapTable('refresh');
                    tms.alert('删除成功');
                }
            })
        });
    }
}
window.actionsEvents2={
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteUnitGroupItems({
                requestBody:{
                    id:row.Id
                },
                callback:function () {
                    updateTable2(_json.nowId);
                    tms.alert('删除成功');
                }
            })
        });
    }
}
//新增计量单位组
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return tms.alert('必填项为空！');
    tms.services.createOrUpdateUnitGroup({
        requestBody:{
            Id: rowid,
            OId: $('#input_OID').val(),
            Name: $('#input_Name').val(),
            IsBase: true,
            IsLab: true
        },
        callback:function () {
            $table1.bootstrapTable('refresh');
            tms.alert('保存成功',function () {
                $('#myModal2').modal('hide');
            })
        }
    })

}
//新增计量单位
function addItem2() {
    var isMustObjs=$('#itemForm2').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return tms.alert('必填项为空！');
    tms.services.createOrUpdateUnitGroupItems({
        requestBody:{
            UnitGroupId:  _json.nowId,
            UnitId: $('#input_Unit').val(),
            IsBase: true,
            IsLab: true
        },
        callback:function () {
            updateTable2(_json.nowId);
            tms.alert('保存成功',function () {
                $('#myModal3').modal('hide');
            })
        }
    })

}
//搜索
function searchItem(){
    _json.Name=$('#search-Name').val();
    _json.OId=$('#search-OID').val();
    $table1.bootstrapTable('refresh',{
        pageNumber: 1
    })
}