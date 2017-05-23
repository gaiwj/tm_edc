/**
 * Created by snowden.xu on 2017/5/19.
 */

$(function(){
    // 当前栏目高亮
    hotNav('nav_collect_patientList');

    // 顶部导航
    $('#hospitalName').html(bp1.CurrentHospitalName);
    $('#patientCode').html(bp2.PatientCode);
    $('#eventName').html(bp2.EventName);
    $('#formName').html(bp2.FormName);

    // 加载事件列表
    getSubjectEvent();

    //表格自适应
    $(window).resize(function () {
        $('#menuOne').css('height',getHeight());
    });
})

// 目录树配置
{
    var zTreeObjOne;
    var settingOne = {
        view: {
            fontCss: getFont,
            nameIsHTML: true,
            showLine: false,
            showIcon: false
        }
    };
    var zNodesOne = [];

    function getFont(treeId, node) {
        return node.font ? node.font : {};
    };
}

// 左侧事件列表
{

    function getSubjectEvent(){
        //console.log(bp2.SubjectEventId)
        tms.services.getSubjectEventForm({
            requestBody:{
                SubjectEventId: bp2.SubjectEventId,
                EnvironmentId: bp1.CurrentEnvironmentId,
                StudyId: bp1.CurrentProjectId
            },
            callback:function(data){
                console.log(data)
                data.SCRFItems.each(function(i,item){
                    zNodesOne.push({
                        name:item['Name'], 
                        id:item['Id'],
                        font:{
                            'font-weight':makeCss(item).fontweight,
                            'color':makeCss(item).color,
                            'font-size':makeCss(item).fontSize +'px !important'
                        },
                        open:true
                    })
                })
                zTreeObjOne = $.fn.zTree.init($("#menuOne"), settingOne, zNodesOne);
                $('#menuOne').css('height',getHeight());
            }
        })
    }
}

// 通用
{
    // 获取浏览器高度
    function getHeight() {
        return $(window).height() - 145;
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
