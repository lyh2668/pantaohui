angular.module('Mine', [])

.controller('UserInfoCtl', function($scope, AuthService) {
	var wxUserInfo = AuthService.getWxUserInfo();
	var userInfo = AuthService.getUserInfo();

	if (userInfo) {
		$scope.thumb = userInfo.thumb == "" ? "src/mine/images/未登录.png" : userInfo.thumb;
		$scope.datas = [
			{ title: "昵称", value: userInfo.nickname },
			{ title: "性别", value: userInfo.sex == "0" ? "男" : "女"},
			{ title: "公司", value: userInfo.company },
			{ title: "QQ", value: userInfo.qq }
		]
	} else if (wxUserInfo) {
		$scope.thumb = wxUserInfo.headimgUrl;
		$scope.datas = [
			{ title: "昵称", value: wxUserInfo.nickname },
			{ title: "性别", value: wxUserInfo.sex == "1" ? "男" : "女"},
			{ title: "省份", value: wxUserInfo.province },
			{ title: "城市", value: wxUserInfo.city },
			{ title: "国家", value: wxUserInfo.country }
		]
	}
	

	$scope.exitLogin = function() {
		AuthService.exitLogin()
		window.history.back();
	}
})