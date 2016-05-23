angular.module('Mine', [])

.controller('MineCtl', function($scope, $ionicPopup, $state, Locals, AuthService) {
	$scope.data = {
		thumb: "src/mine/images/未登录.png",
		nickname: "",
		city: ""
	}

	console.log(AuthService.isLogin())

	$scope.isLogin = function() {
		if (AuthService.isLogin()) {
			$scope.getUserInfo()
		}
		return AuthService.isLogin()
	}

	$scope.getUserInfo = function() {
		var userInfo = AuthService.getUserInfo()
		for (var value in userInfo) {
			$scope.data.nickname = userInfo.nickname;
			$scope.data.thumb = userInfo.headimgurl;
		}
	}

	$scope.toLoginView = function() {
		if (AuthService.isLogin()) {
			$state.go('tabs.userInfo', {})
		} else {
			$state.go('tabs.login', {})
		}
	}
})