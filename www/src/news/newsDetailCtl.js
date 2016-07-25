angular.module('News', [])

.controller('NewsDetailCtl', function ($scope, $stateParams, readJsonService, JSON_LOCAL_FILES, 
	$sce, $location, WxShare, newsService, commonRequest, $ionicHistory, $state, $document, $ionicLoading) {

	$scope.loaded = false;
  $ionicLoading.show({
    template: '加载中...',
  });

	$scope.id = $stateParams.id;
	$scope.url = $location.path();

	console.log($scope.url)

	var params = {
		id: $scope.id
	}

	var options = {
      index: 0,
      shareEl: false,
      // tapToClose: true,
  };

	var items = [];
	var pswpElement = document.querySelectorAll('.pswp')[0];

	function imgOnload(img, index) {
		return function() {
			console.log("imgOnload: [index, img]", index, img);
			// 只有实际图片宽度大于250时，才需要放大图片，否则可能时图标或者无需放大的图片。
			if (img.naturalWidth > 250) {
				var item = {
					src: img.src,
					w: img.naturalWidth,
					h: img.naturalHeight
				}
				items.push(item);

				angular.element(img).bind("click", bindImg(index));
			}
		}
	}

	function bindImg(index) {
		return function() {
			console.log("bindImg: [index, items]", index, items);

			options.index = index;
			var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
			gallery.goTo(index);
			
		}
	}

	newsService.refreshNewsDetail(params).then( function(data) {

		console.log("newsDetail", data)
		$scope.detailInfo = data;

		$scope.loaded = true;
		$ionicLoading.hide();

		commonRequest.thumbToSrc(0, $scope.detailInfo.thumb, 560, "jsonp").then(function(data) {
			$scope.detailInfo.thumb = data.thumb;
			var description = $scope.detailInfo.description ? $scope.detailInfo.description : "蟠桃会－免费会议策划与营销专家"
			WxShare.wxShare($scope.detailInfo.title, description, 
				"http://" + $location.host() + $scope.detailInfo.thumb, $location.absUrl());
		})

    var myDocument = angular.element($document.find("pre"));
		myDocument.ready(function() {
			var imgs = myDocument.find("img");
			console.log(imgs);
			
			for(var index = 0; index < imgs.length; ++index) {
				var img = imgs[index];
				if(img.naturalWidth == 0 && img.naturalHeight == 0) {
					// 绑定图片加载完成事件，加载完以后才能获取图片Size
					angular.element(img).bind("load", imgOnload(img, index))
				} else {
					imgOnload(img, index)();
				}
			}
		})

	}, function(err) {
		console.log("err: ", err);
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

	$scope.backHome = function() {
  	$ionicHistory.clearHistory();
		$state.go("tabs.home");
	}
})