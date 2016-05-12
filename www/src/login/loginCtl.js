angular.module('Login', [])

.controller("LoginCtl", function($scope, $ionicPopup, webRequest) {
	$scope.jsonData = "Access_token"
	$scope.wechatLogin = function() {
		Wechat.auth("snsapi_userinfo", function (response) {
	
			webRequest.getWechatUserInfo(response.code).then( function(data) {
				$scope.jsonData = data;
				$ionicPopup.alert({
					title: '登录成功，获取用户信息',
					template: '获取用户信息成功：' + JSON.stringify(data),
					okText: '确定'
				});
			}, function(data) {
				$scope.jsonData = data;
				$ionicPopup.alert({
					title: '登录成功',
					template: '获取用户信息失败：' + JSON.stringify(data),
					okText: '确定'
				});
			})

		}, function (reason) {
			$ionicPopup.alert({
				title: '授权登录',
				template: '授权登录失败：' + JSON.stringify(reason),
				okText: '确定'
			});
		})
	}
})