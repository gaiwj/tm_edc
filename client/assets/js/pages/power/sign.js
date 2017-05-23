var nowRole=null;
var $table=null;
var $table1=null;
$(function () {
    $('.container-content').height(
        $('#main').height()-52
    );
    uc = Cookies.getJSON("usercache");
    $table=$('.table').bootstrapTable({
        height:'100%',
        search:true,
        showHeader:false,
        clickToSelect:true,
        classes:'table-hover table-no-bordered',
        columns:[{
            field:'Name',
            title:'名称',
            class:'td-name'
        }],
        onClickRow:clickRow
    });
    $table1=$('.table1').bootstrapTable({
        height:$('#main').height()-92,
        striped: true,
        clickToSelect:true,
        columns:[
            {
            title:'角色名称',
            field:'RoleName'
        },
        {
            field:'OID',
            title:'OID'
        },
        {
            field:'Name',
            title:'签名名称'
        },
        {
            field:'FContent',
            title:'申明内容',
            width:'40%'
        },
        {
            field:'IsEnable',
            title:'启用状态',
            formatter:'actionFormatter2'
        },
        {
            title:'操作',
            formatter:'actionFormatter1',
            events:'actionsEvents1',
            width:120
        }]
    });
    tms.services.getRole({
        requestBody:{
            Name: "",
            FType: 2
        },
        callback:function (res) {
            if (res["RoleItems"].length > 0) {
                var data=res["RoleItems"];
                tms.util.menuList($('.menu-list'),data,null,clickRow);
            }
            $("[data-toggle='tooltip']").tooltip();
        }
    });
    $('#itemForm').bootstrapValidator({
        fields:{
            Name:{
                validators: {
                    notEmpty: {
                        message:'请选择一个签名'
                    }
                }
            }
        }
    });
});
function clickRow(row) {
    var row=row;
    nowRole=row;
    updateTable(row.Id);
}
function updateTable(id) {
    tms.services.getSignatureDeclare({
        requestBody:{
            RoleId: id,
            StudyId: ""
        },
        callback:function (data) {
            var _data=data['SignatureDeclareItems'];
            $table1.bootstrapTable('load',_data);
        }
    })
}
function actionFormatter1(value,row) {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}
function actionFormatter2(value,row) {
    return row.IsEnable?'是':'否';
}
window.actionsEvents1={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        $("#input_Name").val(row["OID"]).change();
        if(row["IsEnable"]){
            $("#inlineRadio1").prop('checked',true);
            $("#inlineRadio1").parent().addClass('checked');
        }else{
            $("#inlineRadio2").prop('checked',true);
            $("#inlineRadio2").parent().addClass('checked');
        }
        $('#myModal5').attr({'data-type':'edit','data-id':row.Id}).modal('show');
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteSignatureDeclare({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    updateTable(nowRole.Id);
                }
            })
        });
    }
};
function addItem(rid) {
    if(!nowRole) return tms.alert('请选择角色！');
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;

    var option = $("#input_Name").find('option:selected');
    var value =$(option).val();
    var value2 = $(option).attr("value2") || "";
    var value3 = $(option).attr("value3") || "";

    tms.services.createOrUpdateSignatureDeclare({
        requestBody:{
            Id: rowid,
            StudyId: uc.CompanyId,
            RoleId: nowRole.Id,
            OID: value ,
            Name: value2,
            FContent:value3,
            IsEnable:$("#input_IsEnable").find('input:radio:checked').val() == 1
        },
        callback:function (data) {
            updateTable(nowRole.Id);
            tms.alert('保存成功',function () {
                $('#myModal5').modal('hide');
            });
        }
    })
}
