angular.module('Mine', [])

.service('myOrderService', function($q, webRequest, SERVICE_API_URL, AuthService, WxPay, $rootScope) {
	var getOrder = function(id) {
		
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MINE_ORDER, {id: id}).then( function(data) {

			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var wxPay = function(id) {
		WxPay.wxPay(id);
	}

	return {
		getOrder: getOrder,
		wxPay: wxPay
	}
})