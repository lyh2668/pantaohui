angular.module('Search', [])

.service('searchService', function($q, webRequest, SERVICE_API_URL, AuthService) {
	var perPage = 15;

	var searchList = []

	var searchParams = {}

	var refreshMeetList = function(params) {
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, params).then( function(data) {
			deferred.resolve(data);
			meetList = data;
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextMeetList = function(params) {
		var deferred = $q.defer();

		if (meetList && meetList.length >= perPage) {
			var lastIndex = meetList.length - 1;
			params.id = parseInt(meetList[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, params).then( function(data) {

			meetList = meetList.concat(data);
			console.log("loadmore:", params, meetList)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getMeetList = function() {
		return meetList;
	}

	var getUid = function() {
		if (AuthService.getUserInfo() && 'uid' in AuthService.getUserInfo()) {
			return AuthService.getUserInfo().uid
		} else {
			return null
		}
	}

	return {
		getMeetList: getMeetList,
		refreshMeetList: refreshMeetList,
		nextMeetList: nextMeetList,
		perPage: perPage,
		getUid: getUid
	}
})