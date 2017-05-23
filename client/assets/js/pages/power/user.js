var userId=null;
var $table=null;
var $table1=null;

$(function () {
    $('.container-content').height(
        $('#main').height()-52
    );
    $table=$('.table').bootstrapTable({
        height:$('#main').height()-52,
        search:true,
        showHeader:false,
        classes:'table-hover table-no-bordered',
        columns:[{
            field:"Username",
            title:'名称',
            class:'td-name',
            formatter:'nameFormatter'
        }],
        onClickRow:clickRow
    });
    var bp1= BrowseParamService1.get();
    tms.services.getUser({
        requestBody:{
            CompanyId: bp1.CurrentCompanyId,
            Name: "",
            PageIndex: 1,
            PageSize: 100,
            SortField: "Name",
            DESC: true
        },
        callback:function (res) {
            if (res["Users"].length > 0) {
                var data=res["Users"];
                tms.util.menuList($('.menu-list'),data,null,clickRow);
            }
            $("[data-toggle='tooltip']").tooltip();
        }
    });
    //增加项目角色
    $('.role-list').on('click','.glyphicon-plus-sign',function () {
        var item_html=$('.role-item-mod').html();
        var item=$('<div class="role-item"></div>');
        item.html(item_html);
        $(this).parent().parent('.role-item').after(item);
        item.find('.select2s').select2();
    });
    //移除项目角色
    $('.role-list').on('click','.glyphicon-remove-sign',function () {
        $(this).parent().parent('.role-item').remove();
    })
});
function nameFormatter(v,row) {
    return v+'-'+row.Name;
}
function actionFormatter() {
    return['<div class="glyphicon-group">',
        '<i class="glyphicon glyphicon-cog" data-toggle="tooltip" data-placement="bottom" title="配置"></i>',
        '<div>'
    ].join('');
}
function onSave1() {
    if(!userId) return tms.alert('请选择一个用户！');
    var RoleId = $("#input_RoleId").val();
    var DefaultLanguage = $("#input_DefaultLanguage").val();
    var TimeZone = $("#input_TimeZone").val();
      tms.services.createOrUpdateUserRole({
          requestBody:{
              Id: "",
              UserId: userId,
              RoleId: RoleId,
              DefaultLanguage: DefaultLanguage,
              TimeZone: TimeZone
          },
          callback:function (data) {
             tms.alert("保存成功");
          }
      })
}
function onSave2() {
    if(!userId) return tms.alert('请选择一个用户！');
    var ids=[];
    $(".role-list").find(".role-item").each(function () {
        var jdom = $(this);
        var StudyId = jdom.find(".role_study").val();
        var EnvironmentId = jdom.find(".role_environment").val();
        var RoleId = jdom.find(".role_role").val();
        if (StudyId) {
            ids.push({
                UserId: userId,
                RoleId: RoleId,
                StudyId: StudyId,
                EnvironmentId: EnvironmentId
            });
        }
    });
    if (ids.length == 0) { tms.alert("请选择一个研究项目、环境、项目角色").show(); return; }
    tms.services.createOrUpdateUserStudyRole({
        requestBody:{
            UserId: userId,
            UserStudyRoleItems: ids
        },
        callback:function(data){
            tms.alert("保存成功");
        }
    })
}
function clickRow(row) {
    var row=row;
    userId=row.Id;
    $('.role-item-mod').hide();
    tms.services.getUserRole({
        requestBody:{
            IsPaged: false,
            UserId: row.Id
        },
        callback:function (res) {
            if (res["UserRoleItems"].length > 0) {
                var item = res["UserRoleItems"][0];
                $("#input_DefaultLanguage").val(item["DefaultLanguage"]).trigger("change");;
                $("#input_TimeZone").val(item["TimeZone"]).trigger("change");;
                $("#input_RoleId").val(item["RoleId"]).trigger("change");;
            }else{
                $("#input_DefaultLanguage").val("");
                $("#input_TimeZone").val("");
                $("#input_RoleId").val("");
            }
        }
    });
    tms.services.getUserStudyRole({
        requestBody:{
            IsPaged: false,
            UserId: row.Id
        },
        callback:function (res) {
            $('.role-list').html("");
            if (res["UserStudyRoleItems"].length > 0) {
                var userList=res["UserStudyRoleItems"];
                for (var i = 0; i < userList.length; i++) {
                    var obj = userList[i];
                    var item_html=$('.role-item-mod').html();
                    var item=$('<div class="role-item"></div>');
                    item.html(item_html);
                    $('.role-list').append(item);
                    item.find('.role_study').select2().val(obj.StudyId);
                    item.find('.role_environment').select2().val(obj.EnvironmentId);
                    item.find('.role_role').select2().val(obj.RoleId);
                }
            }else{
                var item_html=$('.role-item-mod').html();
                var item=['<div class="role-item">'];
                item.push(item_html+'</div>');
                $('.role-list').html(item.join(''));
            }
            $('.role-list').find('.select2s').select2();
        }
    })
}




