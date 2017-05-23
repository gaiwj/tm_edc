var $table2=null;
var $table1=null;
var dictionaryId=null;
$(function () {
    var Length2={
        validators: {
            numeric: {message:'长度只能为数字'},
            notEmpty: {message:'长度不能为空'}
        }
    };
    var SignificantNumber2={
        validators: {
            notEmpty: {
                message:'有效位数不能为空'
            },
            numeric: {
                message:'有效位数只能为数字'
            }
        }
    };
   $table1=$('#table').bootstrapTable({
       height:400,
       clickToSelect:true,
       pagination:true,
       striped:true,
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
               height:'40%'
           },
           {
               field:'DataTypeName',
               title:'数据类型'
           },
           {
               field:'DictionaryName',
               title:'编码字典'
           },
           {
               field:'SASFieldName',
               title:'SASFieldName'
           },
           {
               field:'StandardTypeName',
               title:'标准'
           },
           {
               formatter:'actionFormatter',
               events:'actionsEvents1',
               title:'操作'
           }
       ],
       onClickRow:function (row) {
           updateTable2(row.Id);
       }
   });
   $table2=$('#tableTwo').bootstrapTable({
       height:300,
       pagination:true,
       striped:true,
       columns:[
           {
               field:'Domain',
               title:'应用域',
               width:150
           },
           {
               field:'Name',
               title:'名称'
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
                trigger:"change",
                validators: {
                    notEmpty: {
                        message:'OID不能为空'
                    }
                }
            },
            Name:{
                trigger:"change",
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            },
            DataType:{
                trigger:"change",
                validators: {
                    notEmpty: {
                        message:'请选择数据类型'
                    }
                }
            },
            Length:{
                validators: {
                    numeric: {
                        message:'长度只能为数字'
                    }
                }
            },
            SignificantNumber:{
                validators: {
                    numeric: {
                        message:'有效位数只能为数字'
                    }
                }
            }
        }
    });
   $('#itemCDASH').bootstrapValidator({
       fields:{
           CDASHName:{
               validators: {
                   notEmpty: {
                       message:'名称不能为空'
                   }
               }
           },
           Domain:{
               validators: {
                   notEmpty: {
                       message:'应用域不能为空'
                   }
               }
           }
       }
   })
   $('#input_DataType').change(function () {
        var tp=$(this).find('option:selected').attr('value2');
        var did=$(this).val();
        if(!tp) return;
        $('.form-group').find('small').remove();
       switch (tp) {
           case "1":
           case "2":
           case "3":
               $('#input_Length').attr({'name':'Length2'});
               $('#input_Length,#input_SignificantNumber').parent().parent('.form-group').addClass('has-require');
               $('#itemForm').bootstrapValidator('addField','Length2',Length2);
               $('#input_SignificantNumber').attr({'name':'SignificantNumber2'});
               $('#itemForm').bootstrapValidator('addField','SignificantNumber2',Length2);
               break;
           case "4":
           case "5":
               $('#input_Length').parent().parent('.form-group').addClass('has-require');
               $('#input_SignificantNumber').parent().parent('.form-group').removeClass('has-require');
               $('#input_Length').attr({'name':'Length2'});
               $('#itemForm').bootstrapValidator('addField','Length2',Length2);
               $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
               $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
               break;
           default:
               $('#input_SignificantNumber,#input_Length').parent().parent('.form-group').removeClass('has-require');
               $('#input_Length').attr({'name':'Length'});
               $('#itemForm').bootstrapValidator('addField','Length',{});
               $('#input_SignificantNumber').attr({'name':'SignificantNumber'});
               $('#itemForm').bootstrapValidator('addField','SignificantNumber',{});
       }
       $('#itemForm').data('bootstrapValidator')
           .updateStatus( $('#input_Length').attr('name'), 'NOT_VALIDATED', null);
       $('#itemForm').data('bootstrapValidator')
           .updateStatus( $('#input_SignificantNumber').attr('name'), 'NOT_VALIDATED', null);
        updateDictionary(did,function (data) {
            var options=data;
            $('#input_DictionaryId').html(options.join(''));
            $('#input_DictionaryId').val(dictionaryId);
        });
    });
   updateDictionary(null,function (data) {
        var options=data;
        $('#input_NoteDictionaryId').html(options.join(''));
        $('#input_DictionaryId').val(dictionaryId);
   });
   updateTable1();
});
//
function updateDictionary(id,fn) {
    var did=id;
    var data = {
        IsPaged: false,
        IsLab: false,
        IsBase: true
        //CRFVersionId: bp1.CurrentDraftId
    };
    if(did) data.DataTypeId=did;
    tms.services.getDiction({
        requestBody:data,
        callback:function (data) {
            var _data=data.DictionaryItems;
            var options=[];
            options.push('<option value="" >...</option>');
            for (var i = 0; i < _data.length; i++) {
                if(_data[i].IsChecked){
                    options.push('<option checked value="'+_data[i].Id+'" >'+_data[i].Name+'</option>')
                }else{
                    options.push('<option value="'+_data[i].Id+'" >'+_data[i].Name+'</option>')
                }
            }
            return fn(options);
        }
    })
}

//更新表1
function updateTable1(json) {
    var _json=json||{DataTypeId:"",StandardTypeId:"",OId:""};
    tms.services.getItems({
        requestBody:{
            DataTypeId:_json.DataTypeId,
            StandardTypeId: _json.StandardTypeId,
            OId: _json.OId,
            IsBase: true
        },
        callback:function (data) {
            var _data=data.ItemsItems;
            $table1.bootstrapTable("load",_data);
            $("[data-toggle='tooltip']").tooltip();
        }
    })
}
//更新表2
function updateTable2(id) {
    var gid=id;
    $table2.bootstrapTable("removeAll");
    tms.services.getCDASHAnnotation({
        requestBody:{
            ItemId: gid
        },
        callback:function (data) {
            var _data=data.CDASHAnnotationItems;
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
        var row=row;
        tms.services.getItems({
            requestBody:{
                IsPaged: false,
                IsBase: true,
                Id: row.Id
            },
            callback:function (res) {
                if (res["ItemsItems"].length > 0) {
                    var item = res["ItemsItems"][0];
                    $("#input_OID").val(item["OId"]).change();
                    $("#input_Name").val(item["Name"]).change();
                    $("#input_DataType").val(item["DataTypeId"], false).change();
                    $("#input_Length").val(item["Length"]);
                    $("#input_SignificantNumber").val(item["SignificantNumber"]);
                    $("#input_SASFieldName").val(item["SASFieldName"]);
                    $("#input_StandardTypeId").val(item["StandardTypeId"]);
                    $("#input_Hint").val(item["Hint"]);
                    dictionaryId=item["DictionaryId"];
                    $("#input_NoteDictionaryId").val(item["NoteDictionaryId"]);
                    $("#input_Description").val(item["Description"]);
                }
                $('#myModal2').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }

        });
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteItems({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable1();
                    tms.alert('删除成功',function () {
                        $('#myModal2').modal('hide');
                    });
                }
            })
        });
    }
}
window.actionsEvents2={
    'click .glyphicon-edit':function (e, value,row,index) {
        tms.services.getCDASHAnnotation({
            requestBody:{
                id:row.Id
            },
            callback:function (data) {
                var _data=data.CDASHAnnotationItems[0];
                $('#input_Domain').val(_data.Domain);
                $('#input_CDASHName').val(_data.Name);
                $('#myModal').attr({'data-type':'edit','data-id':_data.Id});
                $('#myModal').modal('show');
            }
        })
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteCDASHAnnotation({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable2(row.ItemId);
                    tms.alert('删除成功',function () {
                        $('#myModal').modal('hide');
                    });
                }
            })
        });
    }
}
//新增item
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateItems1({
        requestBody:{
            Id:rowid,
            OId:$('#input_OID').val(),
            Name: $('#input_Name').val(),
            DataTypeId: $('#input_DataType').val(),
            Length: $('#input_Length').val(),
            SignificantNumber: $('#input_SignificantNumber').val(),
            SASFieldName: $('#input_SASFieldName').val(),
            StandardTypeId: $('#input_StandardTypeId').val(),
            Hint: $('#input_Hint').val(),
            DictionaryId:$('#input_DictionaryId').val(),
            NoteDictionaryId: $('#input_NoteDictionaryId').val(),
            Description: $('#input_Description').val(),
            IsBase: true
        },
        callback:function () {
            updateTable1();
            tms.alert('保存成功',function () {
                $('#myModal2').modal('hide');
            });
        }
    })

}
//搜索
function searchItem(){
    var _DataType=$('#search_DataType').val();
    var _StandardType=$('#search_StandardType').val();
    var _OID=$('#search_OID').val();
    var _search={
        DataTypeId:_DataType,
        StandardTypeId:_StandardType,
        OId:_OID
    }
    updateTable1(_search);
}