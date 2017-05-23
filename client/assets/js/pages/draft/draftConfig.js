/**
 * Created by snowden.xu on 2017/5/8.
 */

$table1 = $("#table1");
$table2 = $("#table2");

// 编辑传参
var currentRow = {
    id:'',
    name:''
};

// 编辑事件
window.actionEvents = {
	'click .glyphicon-edit':function(e,val,row,index){
        e.stopPropagation();
        tms.services.getCRFVersion({
        	requestBody:{
                IsPaged: false,
                Id: row.Id,
                IsDraft: false
        	},
        	callback:function(data){
        		currentRow = {
        			id:data.CRFVersionItems[0].Id,
        			name:data.CRFVersionItems[0].Name
        		}
        		$('#crfDraftEdit').modal('show');
        	}
        })
	}
}

$(function(){
    //表格自适应
    $(window).resize(function () {
        $table1.bootstrapTable( 'resetView', {
            height: getHeight()
        });
        $table2.bootstrapTable( 'resetView', {
            height: getHeight()
        });
    });

    $("#projectselect").change(function () {
        var option = $(this).find("option:selected");
        bp1.CurrentProjectId = option.attr("value");
        bp1.CurrentProjectName = option.html();
        tms.setLocalStorage("browseparam1",bp1,true);
        // 加载项目信息
		loadProjectInfo();
		// 加载草案概况
		table1();
		// 加载可用版本
		table2()

    }).change();

    // 加载受试者表
    loadPatientForm();

    // 验证
    fomVer();

    // 保存草案
    $('#save').click(function(){
        save();
    })
})
 
// 初始化table1
function table1(){
	$table1.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:false,
        method:'post',
        url:'/' + tms.urls.draft.getDraftSummary,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
				CRFVersionId:bp1.CurrentDraftId
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["Items"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
		columns:[
            {
                field:'Name',
                title:'项'
            },{
                field:'Count',
                title:'总数',
                width:100
            },{
                field:'UpdateTime',
                title:'最后时间',
                width:160,
                formatter:'updataTimeFormatter'
            }
        ]
    });
}

// 初始化table2
function table2(){
	$table2.bootstrapTable({
        height:getHeight(),
        striped: true,
        pagination:false,
        method:'post',
        url:'/' + tms.urls.crf.getCRFVersion,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
            	StudyId: bp1.CurrentProjectId, 
            	IsPaged: false, 
            	IsDraft: false, 
            	FromCRFVersionId: bp1.CurrentDraftId
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["CRFVersionItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
		columns:[
            {
                title:'操作',
                formatter:'actionFormatter',
                events:'actionEvents',
                width:100
            },{
                field:'Name',
                title:'名称'
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });	
}

// 重新加载table2
function loadList() {
    $table2.bootstrapTable('refresh')
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 465;
}

// 获取项目信息
function loadProjectInfo() {
	tms.services.getProject({
        requestBody:{
			projectId:bp1.CurrentProjectId
        },
        callback:function (data) {
            $("#projectDescription").html(data["ProjectDescription"]);
            $("#planNum").html(data["PlanNum"]);
            $("#principal").html(data["Principal"]);
            $("#signatureDeclaration").html(data["SignatureDeclaration"]);
        }
    })
}

// 获取受试者表
function loadPatientForm() {
	//$('#formId').empty();
    var _data = [];
	tms.services.getSubjectForm({
        requestBody:{
			CRFVersionId:bp1.CurrentDraftId
        },
        callback:function (data) {
        	for(var i = 0; i < data.FormItems.length; i++){
                    var item = data.FormItems[i];
                     _data.push({
                        id: item.Id,
                        text: item.Name
                    })
            }
            $('#formId').select2({
                width:'100%',
                minimumResultsForSearch: -1,
                data: _data
            });
			
	        if (data["CurrentFormId"]) {
	            $("#formId").val(data["CurrentFormId"]).trigger('change');
	        }
        }
    })
}

// 草案保存
function save() {
    var formId = $("#formId").val();
    if (!formId) {
        tms.alert("请选择一张表");
        return;
    }

    tms.services.setSubjectForm({
        requestBody:{
            Id: "",
            FormId: formId,
            CRFVersionId: bp1.CurrentDraftId,
            StudyId: bp1.CurrentProjectId
        },
        callback:function(data){
            tms.alert('保存成功');
        }
    })
}

// 操作
function actionFormatter() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>'
    ].join('');
}

// 更新时间
function updataTimeFormatter(value, row, index){
	return tms.formatDateTime(row.UpdateTime);
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        fields: {
            name01: {
                validators: {
                    notEmpty: {
                        message: '名称不能为空'
                    }
                }
            },
            oid02:{
                validators:{
                    notEmpty:{
                        message:'版本OID不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.\-]+$/,
                        message: '只允许输入英文字母、数字、"_"、"."、"-"'
                    }
                }
            },
            name02:{
                validators:{
                    notEmpty:{
                        message:'名称不能为空'
                    }
                }
            },
            description02:{
                validators: {
                    notEmpty: {
                        message: '描述不能为空'
                    },
                    stringLength: {
                        max: 255,
                        message: ' '
                    },
                    callback: {
                        message: ' ',
                        callback: function(value, validator) {
                            if (value.length <= 255) {
                                message = '还可以输入' + (255- value.length) + '字符';
                                $('.isMessage').remove();
                                $('#description02').after("<div class='isMessage'>"+ message +"</div>");
                                return true;

                            }else{
                                return false;
                            }  
                        }
                    }
                }
            }
        }
    });
}