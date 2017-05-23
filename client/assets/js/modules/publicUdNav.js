// 公共通用上下伸缩导航
/*
$(function() {
	var navConfig = {
			navList: [{
				title: '规则设置',
				link: '/basicConfig',
				ico: 'fa-id-card',
				permission: 15
			}, {
				title: '任务配置',
				link: '/basicConfig/taskConfig',
				ico: 'fa-cog',
				permission: 19
			}, {
				title: '词典管理',
				link: '/basicConfig/versionName',
				ico: 'fa-address-book',
				permission: 22,
				childNav: [{
					title: '版本名称',
					link: '/basicConfig/versionName'
				}, {
					title: '职能组',
					link: '/basicConfig/functionTeam'
				}]
			}, {
				title: '权限分配',
				link: '/basicConfig/rightsAllotment',
				ico: 'fa-user',
				permission: 25
			}]
		},
		tem = template('tpl/publicUdNav', navConfig);

	// 获取dom插入
	$('.baseconfig-nav').html(tem);

	// 防止基础配置权限错乱
	var userinfo = tms.getLocalStorage('userInfo', true);

	if (userinfo && userinfo.permission && userinfo.permission instanceof Array) {
		if (userinfo.permission.indexOf(15) !== -1) {
			$('#basicConfig').attr('href', '/basicConfig');
		} else if (userinfo.permission.indexOf(19) !== -1) {
			$('#basicConfig').attr('href', '/basicConfig/taskConfig');
		} else if (userinfo.permission.indexOf(22) !== -1) {
			$('#basicConfig').attr('href', '/basicConfig/versionName');
		} else if (userinfo.permission.indexOf(25) !== -1) {
			$('#basicConfig').attr('href', '/basicConfig/rightsAllotment');
		};
	};
	

	// 一级导航
	var patt = /\/([a-zA-Z0-9]+)$/,
		urlName = patt.test(location.pathname) ? RegExp.$1 : false,
		linkS = $('.public-ud-nav .ud-link');

	// 如果当前的url配对就添加默认标识
	if (urlName) linkS.each(function() {
		var curDom = $(this);

		if (patt.test(curDom.attr('href')))
			if (RegExp.$1 === urlName) {
				var parContDom = curDom.parent().parent();

				curDom.parent().addClass('ud-active');

				// 如果有父级导航就添加选中标识
				if (parContDom.get(0).className === 'ud-child-list') parContDom.parent().addClass('ud-active')
			};
	});
});*/
