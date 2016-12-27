angular.module('FindDetail', [])

.service('findDetailService', function(SERVICE_API_URL, webRequest, $q, $stateParams, $ionicLoading, $timeout, AuthService) {

	var findDetailList = []
	var findDetailParams = {id: $stateParams.id, commentid: 0}
	var perPage = 15;

	var refreshFindDetailList = function(params) {

		var deferred = $q.defer();
		if (params) {
			findDetailParams = params;
		}
		findDetailParams.id = $stateParams.id;
		findDetailParams.commentid = 0;

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_DETAIL, findDetailParams).then( function(data) {
			deferred.resolve(data);

			if (data) {
				findDetailList = data;
			}
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextFindDetailList = function() {
		var deferred = $q.defer();
		findDetailParams.id = $stateParams.id;

		console.log(findDetailList);

		if (findDetailList.commentlist && findDetailList.commentlist.length >= perPage) {
			var lastIndex = findDetailList.commentlist.length - 1;
			findDetailParams.commentid = parseInt(findDetailList.commentlist[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_FIND_DETAIL, findDetailParams).then( function(data) {

			findDetailList.commentlist = findDetailList.commentlist.concat(data);
			console.log("loadmore:", findDetailParams, findDetailList)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var replyCommit = function(params) {
		var deferred = $q.defer();


		webRequest.postServiceData(SERVICE_API_URL.API_FIND_REPLY, params).then( function(data) {

			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var showMsg = function(str) {
		$ionicLoading.show({
			template: '<p style="text-align: center">' + str + '</p>'
		})

		$timeout(function() {
			$ionicLoading.hide();
		}, 500);
	}

	var getUid = function() {
		return AuthService.getUid();
	}

	return {
		perPage: perPage,
		refreshFindDetailList: refreshFindDetailList,
		nextFindDetailList: nextFindDetailList,
		replyCommit: replyCommit,
		showMsg: showMsg,
		getUid: getUid
	}
})