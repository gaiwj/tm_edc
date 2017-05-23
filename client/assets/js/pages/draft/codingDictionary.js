/**
 * Created by snowden.xu on 2017/5/9.
 */

$table1 = $('#table1');
$table2 = $('#table2');
$table3 = $('#table3');
$table4 = $('#table4');
$table5 = $('#table5');

 // 编辑传参
var currentRow = {
    typeName:'',
    id:'',
    gid:'',
    oid:'',
    value:'',
    Name:'',
	rank:'',
    enumId:'',
    enumOid:'',
    enumValue:'',
    enumRank:'',
    outerDicOid:'',
    outerDicDictionaryName:'',
    outerDicVersion:'',
    outerDicInstanceName:'',
    outerDicUrl:'',
    moveId:''
};

 // 搜索关键词
var sr = {
    dataType: '',
    standardTypeId: '',
    oid:''
};

// 表单修改、删除按钮事件
window.actionEvents01 = {
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDraftDictionary({
                requestBody:{
                    Ids: [row.Id]
                },
                callback:function (data) {
	                tms.alert('删除成功');
	                loadList();
                }
            });
        });
    }
};

window.actionEvents02 = {
    'click .glyphicon-edit':function(e,value,row,index){
        e.stopPropagation();
        tms.services.getDictionItems({
            requestBody:{
                IsPaged: false,
                Id: row.Id,
                IsLab: false
            },
            callback:function (data) {
                var temp = data.DictionaryItemsItems[0];
                console.log(temp);
			    currentRow.id = temp.Id;
			    currentRow.value = temp.Value;
			    currentRow.Name = temp.Name;
				currentRow.rank = temp.Rank;
				$('#keyValueEdit').modal('show');
            }
        });
    }
};

window.actionEvents03 = {
    'click .glyphicon-edit':function(e,value,row,index){
        e.stopPropagation();
        tms.services.getDictionItems({
            requestBody:{
                IsPaged: false,
                Id: row.Id,
                IsLab: false
            },
            callback:function(data){
                //console.log(data.DictionaryItemsItems);
                var temp = data.DictionaryItemsItems[0];
                currentRow.enumId = temp.Id;
                currentRow.enumValue = temp.Value;
                currentRow.enumRank = temp.Rank;
                console.log(currentRow);
                $('#enumEdit').modal('show');
            }
        })
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDictionaryItems({
                requestBody:{
                    id: [row.Id]
                },
                callback:function (data) {
                     e.currentTarget.parentNode.parentNode.remove();
                    tms.alert('删除成功');
                }
            });
        });
    }
};

window.actionEvents04 = {
    'click .glyphicon-edit':function(e,value,row,index){
        e.stopPropagation();
        tms.services.getDictionItems({
            requestBody:{
                IsPaged: false,
                Id: row.Id,
                IsLab: false
            },
            callback:function(data){
                //console.log(data.DictionaryItemsItems);
                var temp = data.DictionaryItemsItems[0];
                currentRow.outerDicId = temp.Id;
                currentRow.outerDicDictionaryName = temp.DictionaryName;
                currentRow.outerDicVersion = temp.Version;
                currentRow.outerDicInstanceName = temp.InstanceName;
                currentRow.outerDicUrl = temp.Url;
                console.log(currentRow);
                $('#outerDicEdit').modal('show');
            }
        })
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDictionaryItems({
                requestBody:{
                    id: [row.Id]
                },
                callback:function (data) {
                     e.currentTarget.parentNode.parentNode.remove();
                    tms.alert('删除成功');
                }
            });
        });
    }
};

// 移动事件
window.moveEvents = {
    'click .glyphicon-sort':function(e,value,row,index){
        e.stopPropagation();
        currentRow.moveId = row.Id;
        $('#keyValueMove').modal('show');
    },
    'click .glyphicon-arrow-up':function(e,value,row,index){
        e.stopPropagation();
        tms.services.moveDraftDictionary({
            requestBody:{
                Id: row.Id,
                MoveType: 1 
            },
            callback:function(data){
                loadDictionaryItems(currentRow.gid,currentRow.typeName);
            }
        })
    },
    'click .glyphicon-arrow-down':function(e,value,row,index){
        e.stopPropagation();
        tms.services.moveDraftDictionary({
            requestBody:{
                Id: row.Id,
                MoveType: 2 
            },
            callback:function(data){
                loadDictionaryItems(currentRow.gid,currentRow.typeName);
            }
        })
    }
};

$(function(){
 	//表格自适应
    $(window).resize(function () {
        $table2.bootstrapTable( 'resetView', {
            height: getHeight()
        });
        $table4.bootstrapTable( 'resetView', {
            height: getHeight()
        });
        $table5.bootstrapTable( 'resetView', {
            height: getHeight()
        });
    });

 	// 加载table1
 	table1();

 	// 加载table2
 	table2();

    // 加载table3
    table3();

    // 加载table4
    table4();

    // 加载table5
    table5();

 	// 查询
    $('#search').click(function () {
        loadList();
    });

    // 验证
    fomVer();
 })

// 初始化table1
function table1(){
	sr.dataType = $('#dataType').val();
    sr.standardTypeId = $('#standardTypeId').val();
    sr.oid = $('#oid').val();

	$table1.bootstrapTable({
        height:300,
        striped: true,
        pagination:true,
        clickToSelect:true,
        method:'post',
        url:'/' + tms.urls.lab.getDiction,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
				DataTypeId: sr.dataType, 
				StandardTypeId: sr.standardTypeId, 
				CRFVersionId: bp1.CurrentDraftId, 
				OId: sr.oid, 
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
        queryParamsType:'',
		columns:[{
                radio: true,
                formatter:'statusFormatter'
			},{
	            field:'OId',
	            title:'OID',
	            width:100
	        },{
	            field:'Name',
	            title:'名称'
	        },{
	            field:'DictionaryTypeName',
	            title:'字典类型',
	            width:130
	        },{
	            field:'DataTypeName',
	            title:'数据类型',
	            width:130
	        },{
	            field:'SASFormatName',
	            title:'SASFormatName',
	            width:130
	        },{
	            title:'操作',
	            width:70,
	            formatter:'actionFormatter01',
	            events:'actionEvents01',
	        }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        },
        onClickRow:function (row) {
        	currentRow.oid = row.OId;
        	currentRow.gid = row.Id;
            currentRow.typeName = row.DictionaryTypeName;
            loadDictionaryItems(row.Id,row.DictionaryTypeName);
            $('#changName').text(row.DictionaryTypeName);
        }
    });
}

// 初始化table2(键值对)
function table2(){
	$table2.bootstrapTable({
        height:getHeight(),
        striped: true,
        clickToSelect:true,
        columns:[{
            title:'',
            formatter:'moveFormatter',
            events:'moveEvents',
            width:150
        },{
            field:'Value',
            title:'值',
            width:100
        },{
            field:'Name',
            title:'显示值'
        },{
            field:'Rank',
            title:'Rank'
        },{
            title:'操作',
            formatter:'actionFormatter02',
            events:'actionEvents02',
            width:70
        }]
    });
}

// 获取编码字典
function table3(){
	$table3.bootstrapTable({
	    striped: true,
	    pagination:true,
	    clickToSelect:true,
	    method:'post',
	    url:'/' + tms.urls.draft.getReferenceDictionary,
	    dataType: 'json',
	    sidePagination:'server',
	    contentType: 'application/x-www-form-urlencoded',
	    queryParams:function(params){
	        return {
				CRFVersionId: bp1.CurrentDraftId,
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
	    queryParamsType:'',
	    columns:[{
	            checkbox: true
			},{
	            field:'OId',
	            title:'OID',
	            width:100
	        },{
	            field:'Name',
	            title:'名称'
	        },{
	            field:'DictionaryTypeName',
	            title:'字典类型',
	            width:80
	        },{
	            field:'DataTypeName',
	            title:'数据类型',
	            width:80
	        },{
	            field:'SASFormatName',
	            title:'SASFormatName'
	        }
	    ]
	});
}

// 初始化table4(枚举)
function table4(){
	$table4.bootstrapTable({
        height:getHeight(),
        striped: true,
        clickToSelect:true,
        columns:[{
            field:'Value',
            title:'值'
        },{
            field:'Rank',
            title:'Rank',
            width:100
        },{
            title:'操作',
            formatter:'actionFormatter03',
            events:'actionEvents03',
            width:100
        }]
    });
}

// 初始化table5(外部字典)
function table5(){
	$table5.bootstrapTable({
        height:getHeight(),
        striped: true,
        clickToSelect:true,
        columns:[{
            field:'DictionaryName',
            title:'字典名称',
            width:100
        },{
            field:'Version',
            title:'版本'
        },{
            field:'InstanceName',
            title:'局部实例名'
        },{
            field:'Url',
            title:'字典引用地址'
        },{
            title:'操作',
            formatter:'actionFormatter03',
            events:'actionEvents04',
            width:70
        }]
    });
}

// 刷新表单
function loadDictionaryItems(dictionaryId,typeName){
    $table2.bootstrapTable("removeAll");
    $table4.bootstrapTable("removeAll");
    $table5.bootstrapTable("removeAll");
    tms.services.getDictionItems({
        requestBody:{
			DictionaryId: dictionaryId, 
			IsPaged: false 
        },
        callback:function (data) {
        	switch (typeName){
            	case '枚举':
            		$table4.bootstrapTable('load',data['DictionaryItemsItems']);
            		$('.tab2').show();
                    //console.log(data['DictionaryItemsItems'].length)
            		$('.tab1').hide();
            		$('.tab3').hide();
			        $table4.bootstrapTable( 'resetView', {
			            height: getHeight()
			        });
            		break;
            	case '键值对':
            		$table2.bootstrapTable('load',data['DictionaryItemsItems']);
            		$('.tab1').show();
            		$('.tab2').hide();
            		$('.tab3').hide();
			        $table2.bootstrapTable( 'resetView', {
			            height: getHeight()
			        });
            		break;
            	case '外部字典':
            		$table5.bootstrapTable('load',data['DictionaryItemsItems']);
            		$('.tab3').show();
            		$('.tab1').hide();
            		$('.tab2').hide();
			        $table5.bootstrapTable( 'resetView', {
			            height: getHeight()
			        });
            		break;
            	default:
            }
            $('.glyphicon').tooltip();
            // 移除表格第一条的上移和最后一条的下移按钮
            $('#table2').find('.glyphicon-arrow-up').first().remove();
            $('#table2').find('.glyphicon-arrow-down').last().remove();
        }
    })
}

// 获取列表
function loadList() {
	sr.dataType = $('#dataType').val();
    sr.standardTypeId = $('#standardTypeId').val();
    sr.oid = $('#oid').val();
    $table1.bootstrapTable('refresh');
}

function loadList3(){
	$table3.bootstrapTable('refresh',{
		pageNumber: 1
	})
}

// table1操作(编码字典)
function actionFormatter01() {
    return[
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// table2操作(键值对)
function actionFormatter02() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>'
    ].join('');
}

function moveFormatter(value,row,index){
    return[
        '<i class="glyphicon glyphicon-sort" data-toggle="tooltip" data-placement="right" title="移动"></i>',
        '<i class="glyphicon glyphicon-arrow-up" data-toggle="tooltip" data-placement="right" title="上移"></i>',
        '<i class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" data-placement="right" title="下移"></i>'
    ].join('');  
}

// table4操作(枚举)
function actionFormatter03(){
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// 默认第一行选中
function statusFormatter(value,row,index){
    if (index === 0) {
        currentRow.oid = row.OId;
        currentRow.gid = row.Id;
        currentRow.typeName = row.DictionaryTypeName;
        loadDictionaryItems(row.Id,row.DictionaryTypeName);
        $('#changName').text(row.DictionaryTypeName);
        return {
            checked: true
        }
    }
    return value;
}

// 获取浏览器高度
function getHeight() {
    return $(window).height() - 550;
}

// 验证
function fomVer(){
    $('form').bootstrapValidator({
        fields: {
            rank03: {
                validators:{
                    regexp: {
                        regexp: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                        message: '只允许输入正小数'
                    }
                }
            },
            enumRank: {
                validators:{
                    regexp: {
                        regexp: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                        message: '只允许输入正小数'
                    }
                }
            }
        }
    });
}