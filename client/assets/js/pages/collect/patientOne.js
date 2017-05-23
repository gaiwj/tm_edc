/**
 * Created by snowden.xu on 2017/5/16.
 */

$table = $('#table');

var statusInfo,statusNumber;

// 传参
var currentRow = {};

// 目录树配置
{
	var zTreeObjOne,zTreeObjTwo;
	var settingOne = {
		view: {
			fontCss: getFont,
			nameIsHTML: true,
			showLine: false,
			showIcon: false,
			addDiyDom: addDiyDom
		},
		callback: {
			beforeClick: zTreeBeforeClickOne
		}
	};
	var settingTwo = {
		view: {
			fontCss: getFont,
			nameIsHTML: true,
			showLine: false,
			showIcon: false,
			addDiyDom: addDiyDom
		},
		callback: {
			beforeClick: zTreeBeforeClickTwo
		}
	};
	var zNodesOne = [];
	var zNodesTwo = [];

	function zTreeBeforeClickOne(treeId, treeNode, clickFlag) {
		$('#menuTwo').find('a').removeClass('curSelectedNode')
	    // 初始化table
	    table(treeNode.id);
	    currentRow.subjectEventId = treeNode.id;
	    currentRow.eventId = treeNode.EventId;
	};
	function zTreeBeforeClickTwo(treeId, treeNode, clickFlag) {
		$('#menuOne').find('a').removeClass('curSelectedNode')
	    // 初始化table
	    table(treeNode.id);
	    currentRow.subjectEventId = treeNode.id;
	    currentRow.eventId = treeNode.eventId;
	};

	function getFont(treeId, node) {
		return node.font ? node.font : {};
	};

	function addDiyDom(treeId, treeNode) {
		//console.log(treeNode)
		//stopPropagation();
		var aObj = $("#" + treeNode.tId + "_a");
		if ($("#diyBtn_"+treeNode.id).length>0) return;
		// 判断是复制/删除/还原
        if (!treeNode["Locked"] && treeNode["IsAddable"]) {
            if (treeNode["IsAllowAdd"] && !treeNode["IsDeleted"])
		var editStr = "<i class='diyBtn1 glyphicon glyphicon-plus-sign glyphicon-copys' data-placement='bottom' title='复制' id='diyBtn_" + treeNode.id
			+ "' title='"+treeNode.name+"' onclick='onEventCopy(\"" + treeNode.eventId + "\")'></i>";

            if (treeNode["AddType"] == 2 && treeNode["IsAllowDelete"]) {
                if (!treeNode["IsDeleted"])
                    		var editStr = "<i class='diyBtn1 glyphicon glyphicon-remove glyphicon-copys' data-placement='bottom' title='删除' id='diyBtn_" + treeNode.id
			+ "' title='"+treeNode.name+"' onfocus='this.blur();' onclick='onEventDelete(\"" + treeNode.eventId + "\",\"" + treeNode.id + "\")'></i>";
                else
		var editStr = "<i class='diyBtn1 glyphicon glyphicon-refresh' data-placement='bottom' title='恢复' id='diyBtn_" + treeNode.id
			+ "' title='"+treeNode.name+"' onfocus='this.blur();' onclick='onEventRecovery(\"" + treeNode.eventId + "\",\"" + treeNode.id + "\")'></i>";
            }
        }

		aObj.append(editStr);
	};
}

// 状态操作
window.actionEvents = {
 	'click .glyphicon-pencil':function(e,value,row,index){
 		// 签名事件
		e.stopPropagation();
		if (row.Locked == 0 && !row.IsDeleted) {
			currentRow.IntId = row.IntId;
			currentRow.Id = row.Id;
	 		$('#checkSignPwdAndPin').modal('show');
		}
 	},
 	'click .glyphicon-check':function(e,value,row,index){
 		// 核查事件
 		e.stopPropagation();
 		if (row.Locked == 0 && !row.IsDeleted) {
	    	if (row.Verification == 0) {
	    		statusInfo = "确定要核查吗？";
	    		statusNumber = 7;
	    	}else{
	    		statusInfo = "确定要取消核查吗？";
	    		statusNumber = 14;
	    	}
	    	statusConfirm(statusInfo,statusNumber,row.Id);
 		}
 	},
 	'click .glyphicon-eye-open':function(e,value,row,index){
 		// 审核事件
 		e.stopPropagation();
 		if (row.Locked == 0 && !row.IsDeleted) {
	    	if (row.Checked == 0) {
	    		statusInfo = "确定要审核吗？";
	    		statusNumber = 4;
	    	}else{
	    		statusInfo = "确定要取消审核吗？";
	    		statusNumber = 11;
	    	}
			statusConfirm(statusInfo,statusNumber,row.Id);
 		}
 	},
 	'click .glyphicon-screenshot':function(e,value,row,index){
 		// 冻结事件
 		e.stopPropagation();
 		if (row.Locked == 0 && !row.IsDeleted) {
	    	if (row.Freeze == 0) {
	    		statusInfo = "确定要冻结吗？";
	    		statusNumber = 5;
	    	}else{
	    		statusInfo = "确定要取消冻结吗？";
	    		statusNumber = 12;
	    	}
			statusConfirm(statusInfo,statusNumber,row.Id);
 		}
 	},
 	'click .glyphicon-lock':function(e,value,row,index){
 		// 锁定事件
 		e.stopPropagation();
 		if (!row.IsDeleted) {
	    	if (row.Locked == 0) {
	    		statusInfo = "确定要锁定吗？";
	    		statusNumber = 6;
	    	}else{
	    		statusInfo = "确定要取消锁定吗？";
	    		statusNumber = 13;
	    	}
	    	statusConfirm(statusInfo,statusNumber,row.Id);
	    }
 	},
 	'click .glyphicon-plus-sign':function(e,value,row,index){
 		// 复制事件
 		e.stopPropagation();
 		tms.confirm('确定要复制该表单吗？',function(){
 			tms.services.addForm({
 				requestBody:{
		            StudyId: bp1.CurrentProjectId,
		            EnvironmentId: bp1.CurrentEnvironmentId,
		            SiteId: bp1.CurrentHospitalId,
		            SubjectId: bp2.PatientId,
		            SubjectIntId: bp2.IntId,
		            CRFVersionId: bp1.CurrentDraftId,
		            SubjectEventId: currentRow.subjectEventId,
		            EventId: currentRow.eventId,
		            FormId: row.FormId
 				},
 				callback:function(data){
 					table(currentRow.subjectEventId);
 				}
 			})
 		})
 	},
 	'click .glyphicon-remove':function(e,value,row,index){
 		// 删除事件
 		e.stopPropagation();
 		tms.confirm('确定要删除该表单吗？',function(){
 			tms.services.deleteForm({
 				requestBody:{
                    StudyId: bp1.CurrentProjectId,
                    EnvironmentId: bp1.CurrentEnvironmentId,
                    SiteId: bp1.CurrentHospitalId,
                    SubjectId: bp2.PatientId,
                    SubjectIntId: bp2.IntId,
                    CRFVersionId: bp1.CurrentDraftId,
                    SubjectEventId: currentRow.subjectEventId,
                    EventId: currentRow.eventId,
                    FormId: row.FormId,
                    SubjectFormId: row.Id
 				},
 				callback:function(data){
 					table(currentRow.subjectEventId);
 				}
 			})
 		})
 	},
 	'click .glyphicon-refresh':function(e,value,row,index){
 		// 恢复事件
 		e.stopPropagation();
 		tms.confirm('确定要恢复该表单吗？',function(){
 			tms.services.recoveryForm({
 				requestBody:{
                    StudyId: bp1.CurrentProjectId,
                    EnvironmentId: bp1.CurrentEnvironmentId,
                    SiteId: bp1.CurrentHospitalId,
                    SubjectId: bp2.PatientId,
                    SubjectIntId: bp2.IntId,
                    CRFVersionId: bp1.CurrentDraftId,
                    SubjectEventId: currentRow.subjectEventId,
                    EventId: currentRow.eventId,
                    FormId: row.FormId,
                    SubjectFormId: row.Id
 				},
 				callback:function(data){
 					table(currentRow.subjectEventId);
 				}
 			})
 		})
 	}

 }

// 表单名称操作
window.nameEvents = {
    'click .codeLink':function(e,value,row,index){
        e.stopPropagation();

        bp2.EventName = currentRow.eventName;
        bp2.SubjectEventId = currentRow.subjectEventId;
        bp2.SubjectFormId = row.Id;
        bp2.FormId = row.FormId;
        bp2.FormName = row.DisplayName;

        console.log(bp2.SubjectEventId)

        tms.setLocalStorage("browseparam2",bp2,true);
        window.location.href = "patientCRF";
    }
}

$(function(){
	// 当前栏目高亮
	hotNav('nav_collect_patientList');

	// 顶部导航
	$('#hospitalName').html(bp1.CurrentHospitalName);
	$('#patientCode').html(bp2.PatientCode);

    // 加载访视
    getSubjectEvent(function(){
    	// 默认选中第一个
		var treeObj = $.fn.zTree.getZTreeObj("menuOne");
		var nodes = treeObj.getNodes();
		if (nodes.length>0) {
			treeObj.selectNode(nodes[0]);
			table(nodes[0].id);
			currentRow.eventName = nodes[0].displayName;
			currentRow.subjectEventId = nodes[0].id;
		}
    });

	// 初始化table
	$table.bootstrapTable({
        height:getHeight(),
        striped: true,
		columns:[
            {
                field:'Name',
                title:'表单名称',
                formatter:'nameFormatter',
                events:'nameEvents'
            },{
                title:'状态',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:280
            }
        ],
        rowStyle:function(row,index){
        	if (row.IsDeleted){
	    		return {
					classes: 'recorddeleted'
				}
        	}
        	return {};
        }
    });

    //表格自适应
    $(window).resize(function () {
        $table.bootstrapTable( 'resetView', {
            height: getHeight()
        });
		$('#menuOne').css('height',getHeight()/2 - 18);
		$('#menuTwo').css('height',getHeight()/2 - 18);
    });

    // 验证
    fomVer();
})

// 左侧计划访视
{
	// 计划访视
	function getSubjectEvent(callback){
		tms.services.getSubjectEvent({
			requestBody:{
	            SubjectId: bp2.PatientId,
	            EnvironmentId: bp1.CurrentEnvironmentId,
	            StudyId: bp1.CurrentProjectId,
	            SubjectIntId: bp2.IntId
			},
			callback:function(data){
				data.SEventItems.each(function(i,item){
					var bgColor;
					if (item['IsDeleted']) {
						bgColor = '#dedede'
					}
					if (item['EventTypeValue'] == 1) {
						zNodesOne.push({
							name:item['Name'], 
							id:item['Id'],
							eventId:item['EventId'],
							displayName:item['DisplayName'],
							font:{
								'font-weight':makeCss(item).fontweight,
								'color':makeCss(item).color,
								'font-size':makeCss(item).fontSize +'px !important',
								'background':bgColor
							},
							open:true,
							Locked:item.Locked,
							IsAddable:item.IsAddable,
							IsAllowAdd:item.IsAllowAdd,
							IsDeleted:item.IsDeleted,
							AddType:item.AddType,
							IsAllowDelete:item.IsAllowDelete,
							children:[]
						})
					}else{
						zNodesTwo.push({
							name:item['Name'], 
							id:item['Id'],
							eventId:item['EventId'],
							displayName:item['DisplayName'],
							font:{
								'font-weight':makeCss(item).fontweight,
								'color':makeCss(item).color,
								'font-size':makeCss(item).fontSize +'px !important',
								'background':bgColor
							},
							open:true, 
							Locked:item.Locked,
							IsAddable:item.IsAddable,
							IsAllowAdd:item.IsAllowAdd,
							IsDeleted:item.IsDeleted,
							AddType:item.AddType,
							IsAllowDelete:item.IsAllowDelete,
							children:[]
						})
					}
				})
				// 计划内访视
				zTreeObjOne = $.fn.zTree.init($("#menuOne"), settingOne, zNodesOne);
				// 不定期访视
				zTreeObjTwo = $.fn.zTree.init($("#menuTwo"), settingTwo, zNodesTwo);
				$('#menuOne').css('height',getHeight()/2 - 18);
				$('#menuTwo').css('height',getHeight()/2 - 18);
				if (callback) callback();
			}
		})
	}

	// 复制访视
	function onEventCopy(eventId){
	    tms.confirm("确定要复制该访视吗？", function () {
			tms.services.addEvent({
				requestBody:{
		            StudyId: bp1.CurrentProjectId,
		            EnvironmentId: bp1.CurrentEnvironmentId,
		            SiteId: bp1.CurrentHospitalId,
		            SubjectId: bp2.PatientId,
		            SubjectIntId: bp2.IntId,
		            CRFVersionId: bp1.CurrentDraftId,
		            EventId: eventId
				},
				callback:function(data){
					location.reload();
				}
			})
	    });
	}
	// 删除访视
	function onEventDelete(eventId,SubjectEventId){
	    tms.confirm("确定要删除该访视吗？", function () {
			tms.services.deleteEvent({
				requestBody:{
		            StudyId: bp1.CurrentProjectId,
		            EnvironmentId: bp1.CurrentEnvironmentId,
		            SiteId: bp1.CurrentHospitalId,
		            SubjectId: bp2.PatientId,
		            SubjectIntId: bp2.IntId,
		            CRFVersionId: bp1.CurrentDraftId,
		            EventId: eventId,
		            SubjectEventId: SubjectEventId
				},
				callback:function(data){
					location.reload();
				}
			})
	    });
	}
	// 恢复访视
	function onEventRecovery(eventId,SubjectEventId){
	    tms.confirm("确定要恢复该访视吗？", function () {
			tms.services.recoveryEvent({
				requestBody:{
		            StudyId: bp1.CurrentProjectId,
		            EnvironmentId: bp1.CurrentEnvironmentId,
		            SiteId: bp1.CurrentHospitalId,
		            SubjectId: bp2.PatientId,
		            SubjectIntId: bp2.IntId,
		            CRFVersionId: bp1.CurrentDraftId,
		            EventId: eventId,
		            SubjectEventId: SubjectEventId
				},
				callback:function(data){
					location.reload();
				}
			})
	    });
	}
}

// 右侧表单
{
	// 初始化table
	function table(SubjectEventId){
		tms.services.getSubjectEventForm({
			requestBody:{
	            SubjectEventId: SubjectEventId,
	            EnvironmentId: bp1.CurrentEnvironmentId,
	            StudyId: bp1.CurrentProjectId,
	            SubjectIntId: bp2.IntId
			},
			callback:function(data){
				$table.bootstrapTable('load',data.SCRFItems);
				$('.glyphicon').tooltip();
			}
		})
	}

	// 状态Formatter
	function actionFormatter(value,row,index){
		// 判断复制
		var copy;

	    if (!row["Locked"] && row["IsAddable"]) {
	        if (row["IsAllowAdd"] && !row["IsDeleted"]){
	        	copy = '<i class="pull-right glyphicon glyphicon-plus-sign glyphicon-copys" data-toggle="tooltip" data-placement="bottom" title="复制"></i>';
	        } 

	        if (row["AddType"] == 2 && row["IsAllowDelete"]) {
	            if (!row["IsDeleted"])
	                copy = copys =	'<i class="pull-right glyphicon glyphicon-remove glyphicon-copys" data-toggle="tooltip" data-placement="bottom" title="删除"></i>';
	            	
	            else
	                copy = '<i class="pull-right glyphicon glyphicon-refresh" data-toggle="tooltip" data-placement="bottom" title="恢复"></i>';
	        }
	    }
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
	        '<i class="glyphicon glyphicon-lock glyphicon-other-'+ row.Locked +'" data-toggle="tooltip" data-placement="bottom" title="锁定"></i>',
	        // 复制
	        copy
	        
	    ].join(''); 
	}

	// 状态Event
	{
		function statusConfirm(statusInfo,statusNumber,SubjectFormId){
		    tms.confirm(statusInfo, function () {
		        statusEvent(statusNumber,SubjectFormId);
		    });
		}

		function statusEvent(statusNumber,SubjectFormId){
			tms.services.updateStatus({
				requestBody:{
					StudyId:bp1.CurrentProjectId,
					EnvironmentId:bp1.CurrentEnvironmentId,
					SiteId:bp1.CurrentHospitalId,
					SubjectId:bp2.PatientId,
					SubjectIntId:bp2.IntId,
					Operate:statusNumber,
					Range:1,
					DeclareValue:'',
					SubjectEventId: currentRow.subjectEventId,
					SubjectFormId:SubjectFormId
				},
				callback:function(data){
					setTimeout(function(){
						table(currentRow.subjectEventId);
					},500)
				}
			})
		}
	}

	// 表单名称Formatter
	function nameFormatter(value,row,index){
		return "<a href='javascript:;' class='codeLink' style='color:"+ makeCss(row).color +";font-weight:"+ makeCss(row).fontWeight +";font-Size:"+ makeCss(row).fontSize +"px;'>" + row.Name + "</a>";
	}
}

// 通用
{
	// 获取浏览器高度
	function getHeight() {
	    return $(window).height() - 155;
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

    // 生成CSS
    function makeCss(item) {
        var fontsize = 12;
        switch (item.FontSize) {
            case "1":
                fontsize = 12;
                break;
            case "2":
                fontsize = 14;
                break;
            case "3":
                fontsize = 16;
                break;
        }
        var fontweight = item.IsBold ? "bold" : "normal";
        return {
            "fontSize": fontsize,
            "color": item.FontColor,
            "fontWeight": fontweight
        }
    }

	// 顶部位置切换
	{
	    // 切换研究中心
	    function onSelectHospital(e) {
	        selectHospital(function () { window.location.reload(); });
	        cancelBubble(e);
	    }
	    // 跳转到受试者列表页面
	    function goPatientList() {
	        window.location.href = 'patientList'
	    }
	    // 跳转到受试者页面
	    function goPatientOne() {
	        window.location.href = 'patientOne'
	        //IframeGo("/page_collect/Patient/PatientOne.aspx");
	    }
	    // 进入指定CRF
	    function goPatientCRF() {
	        //IframeGo("/page_collect/Patient/PatientCRF.aspx");
	    }
	}

}