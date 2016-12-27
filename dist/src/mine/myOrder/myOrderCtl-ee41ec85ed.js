angular.module('Mine', [])

.controller('myOrderCtl', function($scope, $ionicScrollDelegate, $timeout, $state, myOrderService, $stateParams) {
	$scope.getOrder = function() {
		myOrderService.getOrder($stateParams.id).then(function(data) {
			$scope.data = data;
			console.debug(data);
		}, function(err) {

		})
	}

	$scope.toPay = function(id) {
		myOrderService.wxPay(id);
	}
})