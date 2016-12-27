angular.module('Search', [])

.controller('meetSearch', function($scope, $ionicScrollDelegate, $state, searchService) {
	$scope.searchKey = ''
	$scope.histories = searchService.getHistorySearch();
	console.log($scope.histories);

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: searchService.getUid()
		}

		$state.go('tabs.meet-detail', params);
	}

	$scope.clearSearch = function() {
    $scope.searchKey = '';
    $scope.more = false;
    $ionicScrollDelegate.scrollTop();
  };

  var params = {}

  $scope.more = true;
  $scope.focus = true;
  $scope.searchComplete = false;

  $scope.focusSearch = function() {
  	$scope.focus = true;
  	console.log("focus")
  }

  $scope.blurSearch = function() {
  	
  }

  $scope.meetSearch = function() {

  	console.log("search", $scope.searchKey);
  	if($scope.searchKey && $scope.searchKey != '') {
  		params.keyword = $scope.searchKey
  		console.log(params);
  		$scope.searchComplete = false;
  		refreshMeetList(params);

  		searchService.addHistorySearch($scope.searchKey);
  	}
  }

  var refreshMeetList = function(params) {
		searchService.refreshMeetList(params).then( function(data) {
			$scope.searchComplete = true;
			$scope.jsonDatas = data;
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function(err) {
		})
  }

	$scope.loadMoreData = function() {
		console.log("load more.")
		if ($scope.jsonDatas && $scope.jsonDatas.length >= searchService.perPage) {
			searchService.nextMeetList(params).then( function(data) {
				$scope.searchComplete = true;
				$scope.jsonDatas = $scope.jsonDatas.concat(data);
				if($scope.jsonDatas != null) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}

				// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
				if(data == null || data.length < searchService.perPage) {
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

	$scope.searchChange = function() {
		if(!$scope.searchKey.length) {
			$scope.more = false;
			$scope.searchComplete = false;
			$scope.jsonDatas = []
		} else {
			$scope.more = true;
		}
    $ionicScrollDelegate.scrollTop();
  };

  $scope.hotSearch = [{
  	title: "大数据"
  }, {
  	title: "互联网金融"
  }, {
  	title: "云计算"
  }, {
  	title: "物联网"
  }, {
  	title: "智慧城市"
  }, {
  	title: "虚拟现实"
  }]

  $scope.clickHotItem = function(title) {
  	$scope.searchKey = title;
  	$scope.meetSearch();
  }

})