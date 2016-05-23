angular.module('starter')

.controller('StartCtl', function($scope, $state, $window, $location, WeixinService, WxConstant) {



	WeixinService.config();
	
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