/**
 * Created by snowden.xu on 2017/5/15.
 */

$table = $('#table');

// 编辑传参
var currentRow = {};

// 搜索关键词
var sr = {
    code: ''
};

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

        window.location.href = "patientOne";
    }
}

$(function(){
    // 初始化table
    table();

    //表格自适应
    $(window).resize(function () {
        $table.bootstrapTable( 'resetView', {
            height: getHeight()
        });
    });

    // 查询
    $('#search').click(function () {
        loadList();
    });

    // 验证
    fomVer();

    // 新增受试者
    $('#patientAdd').click(function(){
    	location.href = 'patientAdd';
    })
});

// 初始化table
function table(){
    sr.code = $('#code').val();

    $table.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:true,
        method:'post',
        url:'/' + tms.urls.subject.getPatientList,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
                IsPaged: true,
                SiteId: bp1.CurrentHospitalId,
                StudyId: bp1.CurrentProjectId,
                EnvironmentId: bp1.CurrentEnvironmentId,
                Code: sr.code,
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
                res.rows = body["SubjectItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'Code',
                title:'受试者',
                formatter:'codeFormatter',
                events:'codeEvents'
            },{
                field:'RandomNum',
                title:'随机号',
                width:200
            },{
                field:'CRFVersionName',
                title:'当前eCRF版本',
                width:120
            },{
                field:'StatusName',
                title:'筛选状态',
                width:100
            },{
                title:'状态',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:200
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 获取列表
function loadList() {
    sr.code = $('#code').val();
    $table.bootstrapTable('refresh')
}

// 受试者formatter
function codeFormatter(value,row,index){
	return "<a href='javascript:;' class='codeLink'>"+ row.Code +"</a>"
}

// 状态actionFormatter
function actionFormatter(value,row,index){
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
    return $(window).height() - 232;
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