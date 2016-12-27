angular.module('FindMessage', [])

.service('findMessageService', function(SERVICE_API_URL, webRequest, $q, AuthService) {
	var findMessage = []
	var findMessageParams = {}
	var perPage = 15;

	var refreshFindMessageList = function(params) {
		console.log(params);

		findMessageParams = params ? params : findMessageParams;

		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_MESSAGE, params).then( function(data) {
			deferred.resolve(data);

			if (data) {
				findMessage = data;
			}
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextFindMessageList = function() {
		var deferred = $q.defer();

		console.log(findMessage);

		if (findMessage && findMessage.length >= perPage) {
			var lastIndex = findMessage.length - 1;
			findMessageParams.id = parseInt(findMessage[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_MESSAGE, findMessageParams).then( function(data) {

			findMessage = findMessage.concat(data);
			console.log("loadmore:", findMessageParams, findMessage)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getUid = function() {
		return AuthService.getUid();
	}

	return {
		perPage: perPage,
		refreshFindMessageList: refreshFindMessageList,
		nextFindMessageList: nextFindMessageList,
		getUid: getUid
	}
})