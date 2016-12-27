angular.module('Login', [])

.controller("LoginCtl", function($scope, $ionicPopup, AuthService, $timeout, $location, $stateParams) {

	$scope.wechatLogin = function() {
		var url = window.location.origin + window.location.pathname;
		if ($stateParams.redirectUri) {
		  url = $stateParams.redirectUri;
		}
		AuthService.wechatLogin(url).success( function(data) {
			// window.history.back();
		}).error(function(data) {
			$ionicPopup.alrt({
				title: '微信登录失败',
				template: '失败原因' + JSON.stringify(data),
				okText: '确定'
			})
		})
	}

	$scope.loginData = {
		username: '',
		password: ''
	}

	$scope.login = function() {

		var username = $scope.loginData.username;
		var password = $scope.loginData.password;

		AuthService.login(username, password, "正在登录中...").then(function(data) {
			$location.path("/mine");
		}, function(err) {

		})
	}
})