angular.module('starter')

.controller('StartCtl', function($scope, $state, $window, $location, WeixinService, WxConstant,
 webRequest, Locals) {

	WeixinService.config();

	function getAppid() {
		if(!Locals.get('pantaohui_appid')) {
			webRequest.getAppid().then( function(data) {
				console.log('new appid: ', data.appid);
				Locals.set('pantaohui_appid', data.appid);
			}, function(err) {
				// 
			})
		} else {
			console.log('cur appid:', Locals.get('pantaohui_appid'));
		}
	}

	getAppid();
	
})

.controller('TabsCtrl', function($scope, $rootScope, $state) {
  $rootScope.$on('$ionicView.beforeEnter', function() {
		var statename = $state.current.name;
		//tabs中存在的主页面不需要隐藏，hidetabs=false
		if(statename === 'tabs.home' || statename === 'tabs.meet'||
			statename === 'tabs.news' || statename === 'tabs.mine') {
			$rootScope.hideTabs = false;
		} else {
			$rootScope.hideTabs = true;
		}
  });
})
