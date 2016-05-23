angular.module('Mine', [])

.controller('UserInfoCtl', function($scope, AuthService) {
	var userInfo = AuthService.getUserInfo()

	$scope.datas = [
		{ title: "头像", value: userInfo.headimgUrl },
		{ title: "昵称", value: userInfo.nickname },
		{ title: "性别", value: userInfo.sex == "1" ? "男" : "女"},
		{ title: "省份", value: userInfo.province },
		{ title: "城市", value: userInfo.city },
		{ title: "国家", value: userInfo.country }
	]
})