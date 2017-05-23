/**
 * Created by snowden.xu on 2017/5/13.
 */

$tablePatients = $('#table');

// 编辑传参
var currentRow = {};

var statusInfo,statusNumber;

// 状态操作
window.actionEvents = {
 	'click .glyphicon-pencil':function(e,value,row,index){
 		// 签名事件
		e.stopPropagation();
		if (row.Locked == 0) {
			currentRow.IntId = row.IntId;
			currentRow.Id = row.Id;

	 		$('#checkSignPwdAndPin').modal('show');
		}
 	},
 	'click .glyphicon-check':function(e,value,row,index){
 		// 核查事件
 		e.stopPropagation();
 		if (row.Locked == 0) {
	    	if (row.Verification == 0) {
	    		statusInfo = "确定要核查吗？";
	    		statusNumber = 7;
	    	}else{
	    		statusInfo = "确定要取消核查吗？";
	    		statusNumber = 14;
	    	}
	    	statusConfirm(statusInfo,row.SiteId,row.Id,row.IntId,statusNumber);
 		}
 	},
 	'click .glyphicon-eye-open':function(e,value,row,index){
 		// 审核事件
 		e.stopPropagation();
 		if (row.Locked == 0) {
	    	if (row.Checked == 0) {
	    		statusInfo = "确定要审核吗？";
	    		statusNumber = 4;
	    	}else{
	    		statusInfo = "确定要取消审核吗？";
	    		statusNumber = 11;
	    	}
			statusConfirm(statusInfo,row.SiteId,row.Id,row.IntId,statusNumber);
 		}
 	},
 	'click .glyphicon-screenshot':function(e,value,row,index){
 		// 冻结事件
 		e.stopPropagation();
 		if (row.Locked == 0) {
	    	if (row.Freeze == 0) {
	    		statusInfo = "确定要冻结吗？";
	    		statusNumber = 5;
	    	}else{
	    		statusInfo = "确定要取消冻结吗？";
	    		statusNumber = 12;
	    	}
			statusConfirm(statusInfo,row.SiteId,row.Id,row.IntId,statusNumber);
 		}
 	},
 	'click .glyphicon-lock':function(e,value,row,index){
 		// 锁定事件
 		e.stopPropagation();
    	if (row.Locked == 0) {
    		statusInfo = "确定要锁定吗？";
    		statusNumber = 6;
    	}else{
    		statusInfo = "确定要取消锁定吗？";
    		statusNumber = 13;
    	}
    	statusConfirm(statusInfo,row.SiteId,row.Id,row.IntId,statusNumber);
 	},
 }

// 受试者编号状态操作
window.codeEvents = {
    'click .codeLink':function(e,value,row,index){
        e.stopPropagation();

        bp1.CurrentDraftId = row.CRFVersionId;
        bp1.CurrentDraftName = row.CRFVersionName;
        bp1.DraftEffectDate = row.EffectiveDate;
        tms.setLocalStorage("browseparam1",bp1,true);

        bp2.PatientId = row.Id;
        bp2.PatientCode = row.Code;
        bp2.IntId = row.IntId;
        tms.setLocalStorage("browseparam2",bp2,true);

        window.location.href = "collect/patientOne";
    }
}

$(function(){
	// 加载受试者列表
	tablePatients();

	// 加载项目概况
	projectInfo();

 	// 表格自适应
    $(window).resize(function () {
        $tablePatients.bootstrapTable( 'resetView', {
            height: getHeight()
        });
        $('.projectInfo').css('height',getHeight());
    });

    $('.projectInfo').css('height',getHeight());

    // 验证
    fomVer();
})

// 获取受试者列表
function tablePatients(){
	$tablePatients.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:false,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.subject.getRecentPatients,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
				IsPaged:true,
				StudyId:bp1.CurrentProjectId,
				EnvironmentId:bp1.CurrentEnvironmentId,
				PageIndex:0,
                PageSize:10
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["SubjectItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
		columns:[{
	            field:'Code',
	            title:'受试者编号',
	            width:100,
	            formatter:'codeFormatter',
	            events:'codeEvents'
	        },{
	            field:'SiteName',
	            title:'研究中心名称'
	        },{
	            field:'RandomNum',
	            title:'随机号',
	            width:100
	        },{
	            field:'CRFVersionName',
	            title:'当前eCRF版本',
	            width:100
	        },{
	            field:'StatusName',
	            title:'筛选状态',
	            width:100
	        },{
	            title:'状态',
	            width:200,
	            formatter:'actionFormatter',
	            events:'actionEvents',
	        }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 重新加载受试者列表
function loadList(){
	$tablePatients.bootstrapTable('refresh')
}

// 受试者编号formatter
function codeFormatter(value,row,index){
	return "<a href='javascript:;' class='codeLink'>"+ row.Code +"</a>"
}

// 状态actionFormatter
function actionFormatter(value,row,index){
	/*录入状态：
	0 未录入    灰色
	1 部分录入  红色
	2 完全录入  蓝色

	质疑状态：
	0 没有质疑                  灰色
	1 有质疑且有未关闭的质疑    红色
	2 有质疑且全部已关闭        蓝色

	核查：
	0 未核查      灰色
	1 已核查      蓝色
	2 不需要核查  不显示*/
    return[
    	// 录入
		'<i class="glyphicon glyphicon-edit glyphicon-'+ row.EntryStatus +'" data-toggle="tooltip" data-placement="bottom" title="录入"></i>',
		// 质疑
		'<i class="glyphicon glyphicon-question-sign glyphicon-'+ row.QueryStatus +'" data-toggle="tooltip" data-placement="bottom" title="质疑"></i>',
		// 签名
		'<i class="glyphicon glyphicon-pencil glyphicon-other-'+ row.Signature +'" data-toggle="tooltip" data-placement="bottom" title="签名"></i>',
		// 核查
		'<i class="glyphicon glyphicon-check glyphicon-other-'+ row.Verification +'" data-toggle="tooltip" data-placement="bottom" title="核查"></i>',
		// 审核
		'<i class="glyphicon glyphicon-eye-open glyphicon-other-'+ row.Checked +'" data-toggle="tooltip" data-placement="bottom" title="审核"></i>',
		// 冻结
		'<i class="glyphicon glyphicon-screenshot glyphicon-other-'+ row.Freeze +'" data-toggle="tooltip" data-placement="bottom" title="冻结"></i>',
		// 锁定
		'<i class="glyphicon glyphicon-lock glyphicon-other-'+ row.Locked +'" data-toggle="tooltip" data-placement="bottom" title="锁定"></i>'
    ].join('');  
}

// 项目概况
function projectInfo(){
	tms.services.getProject({
		requestBody:{
			projectId: bp1.CurrentProjectId
		},
		callback:function(data){
            $("#ProjectDescription").html(data["ProjectDescription"]);
            $("#PlanNum").html(data["PlanNum"]);
            $("#Principal").html(data["Principal"]);
            $("#SignatureDeclaration").html(data["SignatureDeclaration"]);
		}
	})
}

// 状态操作
function statusEvent(SiteId,SubjectId,SubjectIntId,Operate){
	tms.services.updateStatus({
		requestBody:{
			StudyId:bp1.CurrentProjectId,
			EnvironmentId:bp1.CurrentEnvironmentId,
			SiteId:SiteId,
			SubjectId:SubjectId,
			SubjectIntId:SubjectIntId,
			Operate:Operate,
			Range:3,
			DeclareValue:''
		},
		callback:function(data){
			setTimeout(function(){
				loadList();
			},500)
			//location.reload();
		}
	})
}

function statusConfirm(statusInfo,SiteId,Id,IntId,statusNumber){
    tms.confirm(statusInfo, function () {
        statusEvent(SiteId,Id,IntId,statusNumber);
    });
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 110;
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        fields: {
            passWord: {
                validators:{
		            notEmpty: {
		                message:'请输入密码'
		            }
                }
            },
            pin: {
                validators:{
		            notEmpty: {
		                message:'请输入PIN码'
		            }
                }
            }
        }
    });
}