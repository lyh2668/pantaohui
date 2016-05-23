angular.module('Login', [])

.controller("LoginCtl", function($scope, $ionicPopup, AuthService) {

	$scope.wechatLogin = function() {
		AuthService.wechatLogin().success( function(data) {
			window.history.back();
		}).error(function(data) {
			$ionicPopup.alrt({
				title: '微信登录失败',
				template: '失败原因' + JSON.stringify(data),
				okText: '确定'
			})
		})
	}
	// $scope.wechatLogin = function() {
	// 	Wechat.auth("snsapi_userinfo", function (response) {
	
	// 		webRequest.getWechatUserInfo(response.code).then( function(data) {
	// 			$scope.jsonData = data;
	// 			$ionicPopup.alert({
	// 				title: '登录成功，获取用户信息',
	// 				template: '获取用户信息成功：' + JSON.stringify(data),
	// 				okText: '确定'
	// 			});
	// 		}, function(data) {
	// 			$scope.jsonData = data;
	// 			$ionicPopup.alert({
	// 				title: '登录成功',
	// 				template: '获取用户信息失败：' + JSON.stringify(data),
	// 				okText: '确定'
	// 			});
	// 		})

	// 	}, function (reason) {
	// 		$ionicPopup.alert({
	// 			title: '授权登录',
	// 			template: '授权登录失败：' + JSON.stringify(reason),
	// 			okText: '确定'
	// 		});
	// 	})
	// }
})