angular.module('Mine', [])

.service('myPublishMeetService', function($q, webRequest, SERVICE_API_URL, AuthService) {
var perPage = 15;

	var meetList = []

	var meetParams = {}

	var refreshMeetList = function(params) {
		
		meetParams = params;
		console.log("refreshMeetList", meetParams);

		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, meetParams).then( function(data) {
			
			meetList = data;
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextMeetList = function() {
		var deferred = $q.defer();

		if (meetList && meetList.length >= perPage) {
			var lastIndex = meetList.length - 1;
			meetParams.id = parseInt(meetList[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, meetParams).then( function(data) {

			meetList = meetList.concat(data);
			console.log("loadmore:", meetParams, meetList)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getUid = function() {
		if (AuthService.getUserInfo() && 'uid' in AuthService.getUserInfo()) {
			return AuthService.getUserInfo().uid
		} else {
			return null
		}
	}

	var autoLogin = function() {

		var deferred = $q.defer();
		AuthService.autoLogin().then(function(data) {

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	return {
		refreshMeetList: refreshMeetList,
		nextMeetList: nextMeetList,
		perPage: perPage,
		getMeetList: function() {
			return meetList;
		},
		getUid: getUid,
		autoLogin: autoLogin
	}
})