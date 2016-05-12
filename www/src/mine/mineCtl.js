angular.module('Mine', [])

.controller('MineCtl', function($scope, $ionicPopup, $state, webRequest) {
	$scope.jsonData = "Access_token"
	$scope.wechatLogin = function() {
		// webRequest.getWechatUserInfo("0015f5Ov0HUQln1KIwPv0V68Ov05f5OT").then( function(data) {
		// 		$scope.jsonData = data;
		// 	}, function(data) {
		// 		$scope.jsonData = data;
		// 	}	
		Wechat.auth("snsapi_userinfo", function (response) {
	
				$ionicPopup.alert({
					title: '授权登录',
					template: '授权登录成功：' + JSON.stringify(response),
					okText: '确定'
				});

			webRequest.getWechatUserInfo(response.code).then( function(data) {
				$scope.jsonData = data;
			}, function(data) {
				$scope.jsonData = data;
			})

		}, function (reason) {
			$ionicPopup.alert({
				title: '授权登录',
				template: '授权登录失败：' + JSON.stringify(reason),
				okText: '确定'
			});
		})
	}

	$scope.toLoginView = function() {
		$state.go('tabs.login', {})
	}
})