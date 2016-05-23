angular.module('Home', [])

.controller('HomeCtl', function($scope, readJsonService, $window, JSON_LOCAL_FILES, WeixinService, WxConstant, Locals, AuthService) {

	AuthService.autoWechatLogin();

	$scope.myActiveSlide = 1;

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_MEET_INDEX).then( function(data) {
		$scope.jsonDatas = data;
	}, function(data) {
		$scope.jsonDatas = data;
	})


	

	// WeixinService.getTicket().then(function(data) {
	// 	$scope.ticket = data.ticket
	// 	$scope.nonceStr = WeixinService.getNonceStr()
	// 	$scope.timeStamp = WeixinService.getTimeStamp()
	// 	$scope.signature = WeixinService.createSignature($scope.ticket, $scope.nonceStr, $scope.timeStamp)
	// })


})