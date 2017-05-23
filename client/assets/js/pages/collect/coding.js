/**
 * Created by snowden.xu on 2017/5/12.
 */

$table = $('#table');

$(function(){
	// 加载研究中心
	loadProject();
})

// 获取研究中心
function loadProject(){
	var _data = [];
	tms.services.getDropDownHospital({
		requestBody:{
			StudyId:bp1.CurrentProjectId
		},
		callback:function(data){
			for(var i = 0; i < data.Sites.length; i++){
                var item = data.Sites[i];
                 _data.push({
                    id: item.Id,
                    text: item.Name
                })
            }
            $('#siteId').select2({
                width:'100%',
                minimumResultsForSearch: -1,
                data: _data
            });
		}
	})
}
