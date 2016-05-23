angular.module('News', [])

.controller('NewsCtl', function($scope, $ionicSlideBoxDelegate, readJsonService, JSON_LOCAL_FILES) {

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_LIST).then( function(datas) {
		$scope.jsonHotDatas = [];
		$scope.jsonBdDatas = [];

		for (var i = 0; i < datas.length; ++i) {
			if("1" == datas[i].catid) {
				$scope.jsonHotDatas.push(datas[i]);
			}
			if("2" == datas[i].catid) {
				$scope.jsonBdDatas.push(datas[i]);
			}
		}

	}, function(datas) {
		$scope.errData = datas;
	})

	$scope.slideIndex = 0;

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    console.log("slide Change");

    if ($scope.slideIndex == 0) {
    	console.log("slide 1");
   	}

  	else if ($scope.slideIndex == 1){
     	console.log("slide 2");
   	}

   	// else if ($scope.slideIndex == 2){
    //  	console.log("slide 3");
   	// }

  };

  $scope.activeSlide = function (index) {
   	$ionicSlideBoxDelegate.slide(index);
 	};  
})

.controller('NewsDetailCtl', function ($scope, $stateParams, readJsonService, JSON_LOCAL_FILES, 
	$sce, $location, WxShare) {

	$scope.id = $stateParams.id;
	$scope.url = $location.path();

	console.log($scope.url)

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_LIST).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if ($scope.id == datas[i].id) {
				$scope.detailInfo = datas[i];
			}
		}
	}, function(datas) {
		// $scope.jsonData = datas;
	})

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_DATA).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if ($scope.id == datas[i].id) {
				$scope.content = datas[i].content;
			}
		}
	}, function(datas) {

	})

	$scope.share = function() {
		WxShare.share($scope.detailInfo.title, "蟠桃会会议", $scope.url, $scope.detailInfo.thumb);
	}

	$scope.hasWechat = function() {
		if (typeof Wechat === "undefined") {
			return false;
		} else {
			return true;
		}
	}
})
