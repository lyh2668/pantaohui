angular.module('News', [])

.service('newsService', function($q, webRequest, SERVICE_API_URL) {

	var newsList = []
	var newsParams = {}
	var perPage = 15;

	var setParams = function(params) {
		if (params == undefined) {
			newsParams = {}
		} else {
			newsParams = params
		}
		console.log("this.params: ", newsParams)
	}

	var refreshNewsList = function(params) {
		console.log(params);
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_NEWS_LIST, params).then( function(data) {
			deferred.resolve(data);

			if (data) {
				newsList[data[0].catid] = data;
			}
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextNewsList = function(catid) {
		var deferred = $q.defer();

		console.log(newsList);

		if (newsList[catid] && newsList[catid].length >= perPage) {
			var lastIndex = newsList[catid].length - 1;
			newsParams.id = parseInt(newsList[catid][lastIndex].id);
		}
		newsParams.catid = catid;

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_NEWS_LIST, newsParams).then( function(data) {

			newsList[catid] = newsList[catid].concat(data);
			console.log("loadmore:", newsParams, newsList[catid])

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getNewsList = function(catid) {
		return newsList[catid];
	}

	var refreshNewsDetail = function(params) {
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_NEWS_DETAIL, params).then( function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	return {
		setParams: setParams,
		refreshNewsList: refreshNewsList,
		nextNewsList: nextNewsList,
		perPage: perPage,
		refreshNewsDetail: refreshNewsDetail
	}
})