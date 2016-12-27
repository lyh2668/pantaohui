angular.module('News', [])

.controller('NewsCtl', function($scope, $ionicSlideBoxDelegate, $timeout, newsService, commonRequest, $ionicScrollDelegate, $state, $stateParams) {

	console.log(document.body.clientHeight)

	var params = {}

	$scope.more = true;

	$scope.loadMoreData = function(catid) {

		if ((catid == 2 && $scope.newsHotDatas && $scope.newsHotDatas.length >= newsService.perPage) ||
				(catid == 5 && $scope.newsBdDatas && $scope.newsBdDatas.length >= newsService.perPage)) {

			newsService.nextNewsList(catid).then( function(datas) {
				switch(catid) {
					case 2: {
						var length = $scope.newsHotDatas.length;
						$scope.newsHotDatas = $scope.newsHotDatas.concat(datas);
						$ionicSlideBoxDelegate.$getByHandle("slideBox").update();
						thumbToSrc(length, $scope.newsHotDatas, 120);
					}
					break;
					case 5: {
						var length = $scope.newsBdDatas.length;
						$scope.newsBdDatas = $scope.newsBdDatas.concat(datas);
						$ionicSlideBoxDelegate.$getByHandle("slideBox").update();
						thumbToSrc(length, $scope.newsBdDatas, 120);
					}
					break;
					default: break;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
				if(!datas || datas.length < newsService.perPage) {
					$scope.more = false;
				} else {
					$scope.more = true;
				}
			}, function(err) {
				
			})
		}
	}

	$scope.$on('scroll.infiniteScrollComplete', function() {
		console.log('scroll.infiniteScrollComplete')
	})

	$scope.doRefresh = function(catid) {
		$scope.more = true;

		params.catid = catid

		newsService.refreshNewsList(params).then( function(datas) {
			switch(catid) {
				case 2: {
					$scope.newsHotDatas = datas;
					thumbToSrc(0, $scope.newsHotDatas, 120);
				}
				break;
				case 5: {
					$scope.newsBdDatas = datas;
					thumbToSrc(0, $scope.newsBdDatas, 120);
				}
				break;
				default: break;
			}
			$scope.$broadcast('scroll.refreshComplete');
		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})

		var timer = $timeout( function() {
      //simulate async response
      console.log("refresh timeout.");
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 5000);

    $scope.$on('scroll.refreshComplete', function( event ) {
			$timeout.cancel( timer );
		})
	}

	// $scope.$on('stateChangeSuccess', function() {
 //    $scope.loadMoreData();
 //  });

  var refresh = function(catid) {
  	params.catid = catid
  	$scope.more = true;
		newsService.refreshNewsList(params).then( function(datas) {
			switch(catid) {
				case 2: {
					$scope.newsHotDatas = datas;
					thumbToSrc(0, $scope.newsHotDatas, 120);
				}
				break;
				case 5: {
					$scope.newsBdDatas = datas;
					thumbToSrc(0, $scope.newsBdDatas, 120);
				}
				break;
				default: break;
			}
			$ionicScrollDelegate.$getByHandle('newsScroll').resize();
			$ionicSlideBoxDelegate.$getByHandle('newsSlider').update();
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function(err) {
		})
  }

	$scope.slideIndex = 0;

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    console.log("slide Change");
    
    if ($scope.slideIndex == 0) {
    	console.log("slide 1");
    	if(!$scope.newsHotDatas) {
    		refresh(2);
    	}
   	}

  	else if ($scope.slideIndex == 1){
     	console.log("slide 2");
     	if(!$scope.newsBdDatas) {
    		refresh(5);
    	}
   	}
  };

  $scope.activeSlide = function (index) {
   	$ionicSlideBoxDelegate.slide(index);
   	$ionicSlideBoxDelegate.$getByHandle('newsSlider').update();
 	}; 

 	function thumbToSrc(startIndex, list, width) {
 		for (var index = startIndex; index < list.length; ++index) {
			if("thumb" in list[index]) {
				commonRequest.thumbToSrc(index, list[index].thumb, width, "jsonp").then(function(data) {
					list[data.id].thumb = data.thumb;
				})
			}
		}
 	}

 	$scope.toNewsDetail = function(id) {
 		$state.go('tabs.news-detail', { id: id });
 	}

 	refresh(2);
})


