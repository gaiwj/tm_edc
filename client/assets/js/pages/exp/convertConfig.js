/**
 * Created by snowden.xu on 2017/5/4.
 */
$table1 = $('#table1');
$table2 = $('#table2');

// 编辑传参1
var currentRow = {
    id:'',
    fromUnitId:'',
	toUnitId:'',
	ParamA:'',
	ParamB:'',
	ParamM:'',
	ParamN:'',
};

// 编辑传参2
var currentRow2 = {
    id:'',
    derivationApplyTypeId:'',
    labItemId:'',
    defaultUnitId:''
};


// 表单修改、删除按钮事件
window.actionEvents01 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getDerivationConvert({
            requestBody:{
                IsPaged: false,
                Id: row.Id
            },
            callback:function (data) {
                var temp = data['DerivationConvertItems'][0];
                currentRow = {
				    id:temp.Id,
				    fromUnitId:temp.FromUnitId,
					toUnitId:temp.ToUnitId,
					ParamA:temp.ParamA,
					ParamB:temp.ParamB,
					ParamM:temp.ParamM,
					ParamN:temp.ParamN,
                };
                console.log(currentRow);
                $('#convertFormulaEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDerivationConvert({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    $.hash('page', 0);
                    loadList1();
                }
            });
        });
    }
};

// 表单修改、删除按钮事件
window.actionEvents02 = {
    'click .glyphicon-edit': function (e, value, row, index) {
        e.stopPropagation();
        tms.services.getDerivationApplyItems({
            requestBody:{
                IsPaged: false,
                IsDetailed: true,
                Id: row.Id
            },
            callback:function (data) {
                var temp = data['DerivationApplyItemsItems'][0];
                currentRow2 = {
				    id:temp.Id,
				    derivationApplyTypeId:temp.DerivationApplyTypeId,
				    labItemId:temp.LabItemId,
				    defaultUnitId:temp.DefaultUnitId
                };
                console.log(currentRow2);
                $('#convertItemEdit').modal('show');
            }
        });
    },
    'click .glyphicon-trash':function(e,value,row,index){
        e.stopPropagation();
        tms.confirm("确定要删除选中的记录吗？", function () {
            tms.services.deleteDerivationApplyItems({
                requestBody:{
                    Id: row.Id
                },
                callback:function (data) {
                    tms.alert('删除成功');
                    $.hash('page', 0);
                    loadList2();
                }
            });
        });
    }
};

$(function(){
    // 初始化table1
    table1();

    // 初始化table2
    table2();

    // 验证
    //fomVer();

    // 返回
    $('#back').click(function(){
        window.history.go(-1);
    })

    // 计算公式
    $('#convertFormula').click(function(){
    	if (!getGid()) {
			tms.alert("请选择一个自动计算");
			return; 
		}
    	$('#convertFormulaEdit').modal('show');
    });

    // 适用Item
    $('#convertItem').click(function(){
    	if (!getGid()) {
			tms.alert("请选择一个自动计算");
			return; 
		}
    	$('#convertItemEdit').modal('show');
    });
});

// url传参获取id
function getGid() {
    return tms.util.getUrlParam('id');
}

// url传参获取coutTypeValue
function getCTValue() {
    return tms.util.getUrlParam('countTypeValue');
}

// 初始化table1
function table1(){
	if (!getGid()) {
		tms.alert("请选择一个自动计算");
		return; 
	}
    $table1.bootstrapTable({
        height:370,
        striped: true,
        method:'post',
        url:'/' + tms.urls.calculate.getDerivationConvert,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
				CRFVersionId:"",
				DerivationId:tms.util.getUrlParam('id'),
				IsPaged:false
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["DerivationConvertItems"] == null ? [] : body["DerivationConvertItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'FromUnitName',
                title:'原始',
                width:100
            },{
                field:'ToUnitName',
                title:'目标'
            },{
                field:'TypeName',
                title:'类别',
                width:200
            },{
                field:'Formula',
                title:'计算公式',
                width:100
            },{
                title:'操作',
                formatter:'actionFormatter01',
                events:'actionEvents01',
                width:100
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 初始化table2
function table2(){
	if (!getGid()) {
		tms.alert("请选择一个自动计算");
		return; 
	}
    $table2.bootstrapTable({
        height:300,
        striped: true,
        method:'post',
        url:'/' + tms.urls.calculate.getDerivationApplyItems,
        dataType: 'json',
        sidePagination:'server',
        contentType: 'application/x-www-form-urlencoded',
        queryParams:function(params){
            return {
            	CRFVersionId: "", 
            	DerivationId: tms.util.getUrlParam('id'), 
            	IsPaged: false, 
            	IsDetailed: false
            }
        },
        responseHandler: function (data) {
            var res = {
                rows: [],
                total: 0
            };
            processRResult(data, function (body) {
                res.rows = body["DerivationApplyItemsItems"] == null ? [] : body["DerivationApplyItemsItems"];
                res.total = body["RowCount"];
            });
            return res;
        },
        queryParamsType:'',
        columns:[
            {
                field:'DerivationApplyTypeName',
                title:'类别',
                width:100
            },{
                field:'LabItemName',
                title:'检验项'
            },{
                field:'UnitName',
                title:'默认单位',
                width:200
            },{
                title:'操作',
                formatter:'actionFormatter02',
                events:'actionEvents02',
                width:100
            }
        ],
        onLoadSuccess:function(){
            $('.glyphicon').tooltip();
        }
    });
}

// 获取列表1
function loadList1() {
    $table1.bootstrapTable('refresh');
}

// 获取列表2
function loadList2() {
    $table2.bootstrapTable('refresh');
}

// 操作1
function actionFormatter01() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}

// 操作2
function actionFormatter02() {
    return[
        '<i class="glyphicon glyphicon-edit" data-toggle="tooltip" data-placement="bottom" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="删除"></i>'
    ].join('');
}