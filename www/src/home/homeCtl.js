angular.module('Home', [])

.controller('HomeCtl', function($scope, readJsonService, JSON_LOCAL_FILES, webRequest, SERVICE_API_URL, 
	AuthService, $ionicSlideBoxDelegate, $state, $timeout, $ionicPopup, commonRequest, $ionicHistory) {

	// $ionicHistory.clearHistory();

	$scope.toMeetDetail = function(data) {
		var uid = null;
		if (AuthService.getUserInfo() && 'uid' in AuthService.getUserInfo()) {
			uid = AuthService.getUserInfo().uid
		}

		var params = {
			id: data.id,
			uid: uid
		}

		$state.go('tabs.home-meetDetail', params);
	}

	var requestCount = 0;

	var stopRefresh = function(count) {
		++requestCount;

		if (requestCount == count) {
			$scope.$broadcast('scroll.refreshComplete');
			requestCount = 0;
		}
	}

	var requestMeetHotPoint = function() {
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_HOT_POINT).then( function(data) {
			$scope.meetHotPointDatas = data;
			stopRefresh(3);
		}, function(data) {
			$scope.meetHotPointDatasErr = data;
		})
	}


	var requestMeetHot = function() {
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_HOT).then( function(data) {
			$scope.meetHotDatas = data;
			stopRefresh(3);
			// 如果site字段存在并且site的值为空
			if("site" in $scope.meetHotDatas && $scope.meetHotDatas.site == "") {
				$scope.meetHotDatas.site = "未知"
			}
			for (var index = 0; index < $scope.meetHotDatas.length; ++index) {
				if("thumb" in $scope.meetHotDatas[index]) {
					commonRequest.thumbToSrc(index, $scope.meetHotDatas[index].thumb, 110, "jsonp").then(function(data) {
						$scope.meetHotDatas[data.id].thumb = data.thumb;
					})
				}
			}
		}, function(data) {
			$scope.meetHotDatasErr = data;
		})
	}

	var requestNewsHot = function() {
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_NEWS_HOT).then( function(data) {
			stopRefresh(3);
			$scope.newsHotDatas = data;
			$ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
			$ionicSlideBoxDelegate.$getByHandle('image-viewer').loop(true);
		}, function(data) {
			$scope.newsHotDatasErr = data;
		})
	}

	requestMeetHotPoint();
	requestMeetHot();
	requestNewsHot();

	$scope.doRefresh = function() {
    requestCount = 0;

    requestMeetHotPoint();
		requestMeetHot();
		requestNewsHot();

    var timer = $timeout( function() {
      //simulate async response
      requestCount = 0;
      console.log("refresh timeout.");
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 5000);

    $scope.$on('scroll.refreshComplete', function( event ) {
			$timeout.cancel( timer );
		})
      
  };

})