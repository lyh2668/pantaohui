angular.module('Meet', [])

.service('meetRequestService', function($q, webRequest, SERVICE_API_UR, $rootScope) {
	var perPage = 15;

	var meetList = [];

	var meetParams = {};

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

  $rootScope.$on('stateChangeSuccess', function() {
    meetList = []; // 状态跳转时，保证meetList为空
  })

  return {
  	loadmore: loadmore,
  	refresh: refresh
  }
})