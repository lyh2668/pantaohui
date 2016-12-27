angular.module('Mine', [])

.service('myFavorMeetService', function($q, webRequest, SERVICE_API_URL, AuthService) {
  var perPage = 15;

	var meetList = []

	var meetParams = {}

  var loadmore = function(params) {
  	var deferred = $q.defer();

  	meetParams = params;

  	if(meetList.length > 0) {
  		meetParams.id = meetList[meetList.length - 1].id;
  	} else {
  		meetParams.id = 0;
  	}

  	webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, meetParams).then( function(data) {
  		if("list" in data && data.list != null) {
  			meetList = data.list;
  		} else {
  			meetList = [];
  		}
  		
  		deferred.resolve(meetList);
  	}, function(err) {
  		deferred.reject(err);
  	})

  	return deferred.promise;
  }

  var refresh = function(params) {
  	var deferred = $q.defer();

  	meetParams = params;
  	meetParams.id = 0;

  	loadmore(meetParams).then(function(data) {
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

	var cancelFavor = function() {
		var deferred = $q.defer();

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_FAVOR).then( function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})
	}

	return {
		// refreshMeetList: refreshMeetList,
		// nextMeetList: nextMeetList,
		perPage: perPage,
		getMeetList: function() {
			return meetList;
		},
		getUid: getUid,
		autoLogin: autoLogin,
		loadmore: loadmore,
		refresh: refresh,
		cancelFavor: cancelFavor
	}
})