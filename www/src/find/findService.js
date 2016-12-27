angular.module('Find', [])

.service('findService', function(SERVICE_API_URL, webRequest, $q) {
	var findList = []
	var findParams = {}
	var perPage = 15;

	var refreshFindList = function(params) {
		console.log(params);
		findParams = params;
		
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_LIST, params).then( function(data) {
			deferred.resolve(data);

			if (data) {
				findList = data;
			}
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextFindList = function() {
		var deferred = $q.defer();

		console.log(findList);

		if (findList && findList.length >= perPage) {
			var lastIndex = findList.length - 1;
			findParams.id = parseInt(findList[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_LIST, findParams).then( function(data) {

			findList = findList.concat(data);
			console.log("loadmore:", findParams, findList)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	return {
		perPage: perPage,
		refreshFindList: refreshFindList,
		nextFindList: nextFindList
	}
})