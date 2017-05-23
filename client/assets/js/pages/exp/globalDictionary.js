var $table2=null;
var $table1=null;
var _json={DataTypeId:"",OId:"",DictionaryId:"",ItemOId:""};
$(function () {
    $table1=$('#table').bootstrapTable({
        height:400,
        clickToSelect:true,
        pagination:true,
        striped:true,
        method: 'POST',
        url:'/' + tms.urls.lab.getDiction,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType: '',
        queryParams:function(params){
            return {
                DataTypeId: _json.DataTypeId,
                OId: _json.OId,
                IsLab: true,
                IsPaged: true,
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
                res.rows = body["DictionaryItems"];
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
                width:'40%'
            },
            {
                field:'DataTypeName',
                title:'数据类型'
            },
            {
                field:'SASFormatName',
                title:'SASFormatName'
            },
            {
                formatter:'actionFormatter',
                events:'actionsEvents1',
                title:'操作'
            }
        ],
        onClickRow:function (row) {
            _json.ItemOId=row.OId;
            _json.DictionaryId=row.Id;
            updateTable2(_json.DictionaryId);
        }
    });
    $table2=$('#tableTwo').bootstrapTable({
        height:300,
        striped:true,
        columns:[
            {
                field:'Value',
                title:'值',
                width:150
            },
            {
                field:'Name',
                title:'显示值'
            },
            {
                field:'Rank',
                title:'Rank'
            },
            {
                formatter:'actionFormatter',
                events:'actionsEvents2',
                title:'操作',
                width:100
            }
        ]
    });
    $('#itemForm').bootstrapValidator({
        fields:{
            OID:{
                validators: {
                    notEmpty: {
                        message:'OID不能为空'
                    }
                }
            },
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            }
        }
    });
    $('#itemForm2').bootstrapValidator({
        fields:{
            Value:{
                validators: {
                    notEmpty: {
                        message:'值不能为空'
                    }
                }
            },
            Name:{
                validators: {
                    notEmpty: {
                        message:'显示值不能为空'
                    }
                }
            }
        }
    })
});

//更新表2
function updateTable2(id) {
    var gid=id;
    $table2.bootstrapTable("removeAll");
    tms.services.getDictionItems({
        requestBody:{
            DictionaryId: gid,
            IsPaged: false
        },
        callback:function (data) {
            var _data=data.DictionaryItemsItems;
            if(!_data) return;
            $table2.bootstrapTable("load",_data);
            $("[data-toggle='tooltip']").tooltip();
        }
    })
}
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        e.stopPropagation();
        var row=row;
        tms.services.getDiction({
            requestBody:{
                IsPaged: false,
                IsLab: true,
                Id: row.Id
            },
            callback:function (res) {
                if (res["DictionaryItems"].length > 0) {
                    var item = res["DictionaryItems"][0];
                    $("#input_OID").val(item["OId"]);
                    $("#input_Name").val(item["Name"]);
                    $("#input_DataType").val(item["DataTypeId"]).change();
                    $("#input_SASFormatName").val(item["SASFormatName"]);
                    $("#input_Description").val(item["Description"]);
                }
                $('#myModal4').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        e.stopPropagation();
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteDiction({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    $table1.bootstrapTable('refresh');
                    tms.alert('删除成功',function () {
                        $table2.bootstrapTable('removeAll');
                    })
                }
            })
        });
    }
}
window.actionsEvents2={
    'click .glyphicon-edit':function (e, value,row,index) {
        e.stopPropagation();
        tms.services.getDictionItems({
            requestBody:{
                id:row.Id
            },
            callback:function (data) {
                var _data=data.DictionaryItemsItems[0];
                $('#input_Value2').val(_data.Value);
                $('#input_Name2').val(_data.Name);
                $("#input_Rank").val(_data.Rank);
                $('#myModal5').attr({'data-type':'edit','data-id':_data.Id});
                $('#myModal5').modal('show');
            }
        })
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        e.stopPropagation();
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteDictionaryItems({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable2(_json.DictionaryId);
                    tms.alert('删除成功',function () {
                        $table2.bootstrapTable('removeAll');
                    })
                }
            })
        });
    }
};
//新增item
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateDictionary2({
        requestBody:{
            Id:rowid,
            OId:$('#input_OID').val(),
            Name: $('#input_Name').val(),
            DataTypeId: $('#input_DataType').val(),
            SASFormatName: $('#input_SASFormatName').val(),
            Description: $('#input_Description').val(),
            IsBase: false,
            IsLab: true
        },
        callback:function () {
            $table1.bootstrapTable('refresh');
            tms.alert('保存成功',function () {
                $table2.bootstrapTable('removeAll');
                $('#myModal4').modal('hide');
            });
        }
    })

}
//新增键值对item
function addItem2(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateDictionaryItems({
        requestBody:{
            Id:rowid,
            DictionaryId: _json.DictionaryId,
            Value:$('#input_Value2').val(),
            Name: $('#input_Name2').val(),
            Rank: $('#input_Rank').val(),
            IsBase: false,
            IsLab: true
        },
        callback:function () {
            updateTable2(_json.DictionaryId);
            tms.alert('保存成功',function () {
                $('#myModal5').modal('hide');
            });
        }
    })

}
//搜索
function searchItem(){
    _json.DataTypeId=$('#search_DataType').val();
    _json.OId=$('#search_OID').val();
    $table1.bootstrapTable('refresh');
}