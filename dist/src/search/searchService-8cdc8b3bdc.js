angular.module('Search', [])

.service('searchService', function($q, webRequest, SERVICE_API_URL, AuthService, Locals) {
	var perPage = 15;

	var searchList = []

	var searchParams = {}

	var refreshMeetList = function(params) {
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, params).then( function(data) {
			deferred.resolve(data.list);
			meetList = data.list;
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

			meetList = meetList.concat(data.list);
			console.log("loadmore:", params, meetList)

			deferred.resolve(data.list);

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

	var historyKey = "pantaohui_historySearchKey";
	var histories = Locals.getObject(historyKey) ? Locals.getObject(historyKey) : [];

	var getHistorySearch = function() {

		return histories;

	}

	var addHistorySearch = function(historyItem) {

		var pos = histories.indexOf(historyItem);
		if (pos != -1) {
			histories.splice(pos, 1);
		}

		// 历史记录最多存储5条
		if (histories.length >= 5) {
			histories.pop();
		}

		histories.unshift(historyItem);
		Locals.setObject(historyKey, histories);

	}

	return {
		getMeetList: getMeetList,
		refreshMeetList: refreshMeetList,
		nextMeetList: nextMeetList,
		perPage: perPage,
		getUid: getUid,
		getHistorySearch: getHistorySearch,
		addHistorySearch: addHistorySearch
	}
})