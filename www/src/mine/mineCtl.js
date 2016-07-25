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
		} else {

		// 	AuthService.autoLogin().then(function(data) {
		// 		$scope.getUserInfo();
		// 	})

			$scope.data = {
				thumb: "src/mine/images/未登录.png"
			}
		}
		return AuthService.isLogin()
	}

	$scope.getUserInfo = function() {
		var wxUserInfo = AuthService.getWxUserInfo()
		var userInfo = AuthService.getUserInfo();

		for (var value in wxUserInfo) {
			$scope.data.nickname = wxUserInfo.nickname;
			$scope.data.thumb = wxUserInfo.headimgurl;
			$scope.data.city = wxUserInfo.city;
		}

		for (var value in userInfo) {
			$scope.data.nickname = userInfo.nickname;
			$scope.data.thumb = userInfo.thumb;
			$scope.data.city = userInfo.company;
		}
	}

	$scope.toLoginView = function() {
		if (AuthService.isLogin()) {
			$state.go('tabs.userInfo')
		} else {
			$state.go('tabs.login')
		}
	}

	$scope.toMyPublishMeet = function() {
		if (AuthService.isLogin()) {
			$state.go('tabs.myPublishMeet', {uid: AuthService.getUid()});
		} else {
			$state.go('tabs.login')
		}
	}

	$scope.toMyFavorMeet = function() {
		if (AuthService.isLogin()) {
			$state.go('tabs.myFavorMeet', {uid: AuthService.getUid()});
		} else {
			$state.go('tabs.login')
		}
	}
})