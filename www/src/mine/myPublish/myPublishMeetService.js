angular.module('Mine', [])

.service('myPublishMeetService', function($q, webRequest, SERVICE_API_URL, AuthService) {

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
		getMeetList: function() {
			return meetList;
		},
		getUid: getUid,
		autoLogin: autoLogin
	}
})