angular.module('Mine', [])

.controller('myFavorMeetCtl', function($scope, $ionicScrollDelegate, $timeout, $state, myFavorMeetService, $stateParams, meetRequestService) {

	var uid = null;

	var params = {
  	id: "",
  	uid: "",
  	center_type: "interest"
  }

  $scope.jsonDatas = [];
	$scope.more = false;

	// 上拉加载
	$scope.loadMoreData = function() {

		if($scope.jsonDatas.length > 0) {
  		params.id = $scope.jsonDatas[$scope.jsonDatas.length - 1].id;
  	} else {
  		params.id = 0;
  	}

		meetRequestService.loadmore(params).then( function(datas) {
			$scope.jsonDatas = $scope.jsonDatas.concat(datas);

			meetRequestService.thumbToSrc()

			if(datas.length <= 0) {
				$scope.more = false;
			}

			$scope.$broadcast('scroll.infiniteScrollComplete');

		})
	}

	// 下拉刷新
	$scope.doRefresh = function() {

		meetRequestService.refresh(params).then( function(datas) {
			$scope.jsonDatas = datas;
		})
		.finally( function() {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.more = true;
		})

		var timer = $timeout( function() {
			$scope.$broadcast('scroll.refreshComplete');
		}, 5000);

		$scope.$on('scroll.refreshComplete', function(event) {
			$timeout.cancel(timer);
		})
	}

	if(myFavorMeetService.getUid() == null) {
		myFavorMeetService.autoLogin().then(function(data) {
			uid = data.userinfo.uid;
			params.uid = uid;
			$scope.more = true;
		});
	} else {

		uid = myFavorMeetService.getUid();
		params.uid = uid;
		$scope.more = true;
	}

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: myFavorMeetService.getUid()
		}

		$state.go('tabs.meet-detail', params);
	}

	$scope.cancelFavor = function(data) {

	}

})