var nowRole=null;
var $table=null;
var $table1=null;
var tableQuery=null;
var nowRoleId2=null;
$(function () {
    $('.container-content').height(
        $('#main').height()-52
    );
    $table=$('.table').bootstrapTable({
        height:'100%',
        search:true,
        showHeader:false,
        classes:'table-hover table-no-bordered',
        columns:[{
            field:'Name',
            title:'名称',
            class:'td-name'
        },
            {
                title:'操作',
                formatter:'actionFormatter',
                events:'actionsEvents'
            }]
    });
    $table1=$('.table1').bootstrapTable({
        height:$('#main').height()-92,
        striped: true,
        clickToSelect:true,
        columns:[{
            checkbox:true,
            formatter:'actionFormatter2'
        },
            {
                field:'Name',
                title:'模块'
            },
            {
                title:'操作',
                formatter:'actionFormatter1',
                events:'actionsEvents1'
            }]
    });
    tableQuery= $('.tableQuery').bootstrapTable({
        height:290,
        clickToSelect:'true',
        striped: true,
        columns:[{
            checkbox:true,
            formatter:'queryFormatter'
        },
        {
            field:'Name',
            title:'名称'
        },
        {
            field:'Value',
            title:'值'
        },
        {
            title:'是否启用',
            field:'IsEnable'
        }]
    });
    updataTable1();
    $('#itemForm').bootstrapValidator({
        fields:{
            Name:{
                validators: {
                    notEmpty: {
                        message:'名称不能为空'
                    }
                }
            }
        }
    });
    $('.select-query').on('change',function () {
        var tp=$(this).val();
        updateTableQuery(tp)
    });
});
function updataTable1() {
    tms.services.getRole({
        requestBody:{
            Name: "",
            FType: 2
        },
        callback:function (res) {
            if (res["RoleItems"].length > 0) {
                var data=res["RoleItems"];
                tms.util.menuList($('.menu-list'),data,'actionsEvents',actionFormatter);
            }
            $("[data-toggle='tooltip']").tooltip();
        }
    });
}
function updateTable(id) {
    tms.services.getMenu({
        requestBody:{
            iType:2,
            roleId:id
        },
        callback:function (data) {
            var _data=data['MenuItems'];
            $table1.bootstrapTable('load',_data);
        }
    })
}
function updateTableQuery(tp){
    tms.services.getQueryClass2({
        requestBody:{
            roleId:nowRoleId2,
            queryStatus:tp
        },
        callback:function (res) {
            tableQuery.bootstrapTable('load',res['QueryClassItems']);
            $('#myModal4').modal('show');
        }
    })
}
function actionFormatter() {
    return['<div class="glyphicon-group">',
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-th-large" data-toggle="tooltip" data-placement="bottom" title="配置模块权限"></i>',
        '<i class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="bottom" title="配置质疑权限"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>',
        '<div>'
    ].join('');
}
window.actionsEvents={
    'click .glyphicon-edit':function (e, value, row, index) {
        var row=row;
        tms.services.getRole({
            requestBody:{
                Id: row.Id,
                FType: 2
            },
            callback:function (res) {
                if (res["RoleItems"].length > 0) {
                    var item = res["RoleItems"][0];
                    $("#input_Name").val(item["Name"]).change();
                    $("#input_Remark").val(item["Remark"]);
                    if(item["IsEnable"]){
                        $("#inlineRadio1").prop('checked',true);
                        $("#inlineRadio1").parent().addClass('checked');
                        $("#inlineRadio2").prop('checked',false);
                        $("#inlineRadio2").parent().removeClass('checked');
                    }else{

                        $("#inlineRadio1").prop('checked',false);
                        $("#inlineRadio1").parent().removeClass('checked');
                        $("#inlineRadio2").prop('checked',true);
                        $("#inlineRadio2").parent().addClass('checked');
                    }
                }
                $('#myModal2').attr({'data-type':'edit','data-id':row.Id}).modal('show');
            }
        });
    },
    'click .glyphicon-th-large':function (e, value, row, index) {
        var row=row;
        nowRole=row;
        updateTable(row.Id);
    },
    'click .glyphicon-question-sign':function (e, value, row, index) {
        var row=row;
        nowRoleId2=row.Id;
        updateTableQuery("1");
    },
    'click .glyphicon-trash':function (e,value,row,index) {
        tms.confirm('确定要删除吗？',function(){
            tms.services.deleteRole({
                requestBody:{
                    id:row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    updataTable1();
                }
            })
        });
    }
};
function actionFormatter1(value,row) {
    var children=row.Children;
    var rights=[];
    for (var i = 0; i < children.length; i++) {
        var obj = children[i];
        rights.push("<div class='groups'>");
        if(obj.IsChecked){
            rights.push('<div class="checkbox checkbox-group p-checkbox"><label><input type="checkbox" checked value="'+obj.Id+'">'+obj.Name+'</label></div>');
        }else{
            rights.push('<div class="checkbox checkbox-group p-checkbox"><label><input type="checkbox" value="'+obj.Id+'">'+obj.Name+'</label></div>')
        }
        if(obj.Children){
            for (var j = 0; j < obj.Children.length; j++) {
                var obj1 = obj.Children[j];
                if(obj1.IsChecked){
                    rights.push('<div class="checkbox checkbox-group checkbox-group-children"><label><input type="checkbox" checked value="'+obj1.Id+'" >'+obj1.Name+'</label></div>');
                }else{
                    rights.push('<div class="checkbox checkbox-group checkbox-group-children"><label><input type="checkbox" value="'+obj1.Id+'">'+obj1.Name+'</label></div>')
                }

            }
        }
        rights.push('</div>');
    }
    rights.push('<button type="button" class="btn btn-add selectAllRights">全选</button>');
    rights.push('<button type="button" class="btn btn-add selectNoAllRights" >全不选</button>');
    return rights.join('')
}
window.actionsEvents1={
    'click .p-checkbox':function (e, value, row, index) {
        e.stopPropagation();
        $(this).parent().find('.checkbox-group input[type=checkbox]').prop('checked',$(this).find('input[type=checkbox]').prop('checked'));
    },
    'click .selectAllRights':function (e, value, row, index) {
        e.stopPropagation();
        $(this).parent().find('.checkbox-group input[type=checkbox]').prop('checked',true);
    },
    'click .selectNoAllRights':function (e, value, row, index) {
        e.stopPropagation();
        $(this).parent().find('.checkbox-group input[type=checkbox]').prop('checked',false);
    },
    'click .checkbox-group-children':function (e) {
        e.stopPropagation();
    }
}
function actionFormatter2(value,row) {
    return  row.IsChecked?{checked:true}:{checked:false}
}
function addRights() {
    var gid=nowRole.Id;
    var datas=getMenuIds(gid);
    tms.services.createOrUpdateAccessMenu({
        requestBody:{
            RoleId: gid,
            AccessMenuItems: datas
        },
        callback:function (data) {
            tms.alert('保存成功');
        }
    })
}
function getMenuIds(gid) {
    var data=[];
    var lv1=$table1.bootstrapTable('getSelections');
    var lv2=$('.checkbox-group');
    for (var i = 0; i < lv1.length; i++) {
        var obj = lv1[i];
        var menuItem={MenuId:obj.Id,RoleId:gid};
        data.push(menuItem);
    }
    for (var i = 0; i < lv2.length; i++) {
        var obj1 = $(lv2[i]);
        if(obj1.find('input[type=checkbox]').prop('checked')){
            var menuItem={MenuId:obj1.find('input[type=checkbox]').val(),RoleId:gid};
            data.push(menuItem);
        }
    }
    return data;
}
function addItem(rid) {
    var rowid=rid||"";
    var isMustObjs=$('#itemForm').data('bootstrapValidator').validate();
    if(!isMustObjs.isValid()) return false;
    tms.services.createOrUpdateRole({
        requestBody:{
            Id: rowid,
            Name: $("#input_Name").val(),
            IsEnable:$("#input_IsEnable").find('input:radio:checked').val() == 1,
            Remark: $("#input_Remark").val(),
            FType: 2
        },
        callback:function (data) {
            updataTable1();
            tms.alert('保存成功',function () {
                $("#myModal2").modal('hide');
            });
        }
    })
}
function queryFormatter(v,row) {
    if(row.IsChecked) return { checked: true}
}
function addQuery() {
    var s_rows=tableQuery.bootstrapTable('getSelections');
    var ids=[];
    for (var i = 0; i < s_rows.length; i++) {
        var obj = s_rows[i];
        ids.push(obj.Id);
    }
    var q_status=$('.select-query').val();
    tms.services.createOrUpdateRoleQueryAction({
        requestBody:{
            QueryStatus:q_status,
            RoleId: nowRoleId2,
            RoleQueryActionEntrys: ids
        },
        callback:function(res){
            tms.alert('保存成功!',function () {
                $("#myModal4").modal('hide');
            });
        }
    })
}
