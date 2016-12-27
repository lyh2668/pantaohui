angular.module('FindPublish', [])

.service('findPublishService', function(WxImage, $q, SERVICE_API_URL, webRequest, $ionicLoading, $timeout, AuthService) {
	var choosePicture = function(cnt) {
		var deferred = $q.defer();

		WxImage.wxChooseImage(cnt).then(function(data) {
			console.log("为什么消失了", data);
			deferred.resolve(data);
		});

		return deferred.promise;
	}

	var previewImage = function(current, urls) {
		WxImage.wxPreviewImage(current, urls);
	}

	var showMsg = function(str) {
		$ionicLoading.show({
			template: '<p style="text-align: center">' + str + '</p>'
		})

		$timeout(function() {
			$ionicLoading.hide();
		}, 500);
	}

	var publish = function(params, deferred) {
		$ionicLoading.show("发布中，请稍后...");
			webRequest.postServiceData(SERVICE_API_URL.API_FIND_PUBLISH, params).then( function(data) {
				showMsg("发布成功");
				deferred.resolve(data);
			}, function(err) {
				showMsg("发布失败: ", err);
				deferred.reject(err);
			})
	}

	var syncUpload = function(localIds, params) {
		var deferred = $q.defer();

		if(localIds.length > 0) {
			WxImage.wxSyncUpload(localIds).then(function(data) {
				params.serverIds = data;
				publish(params, deferred);
			}, function(err) {
				showMsg("上传图片失败: ", err);
				deferred.reject(err);
			});
		} else {
			publish(params, deferred);
		}
		
		return deferred.promise;
	}

	var getUserInfo = function() {
		return AuthService.getUserInfo();
	}

	var getUid = function() {
		return AuthService.getUid();
	}

	return {
		choosePicture: choosePicture,
		previewImage: previewImage,
		syncUpload: syncUpload,
		getUserInfo: getUserInfo,
		getUid: getUid,
	}
})