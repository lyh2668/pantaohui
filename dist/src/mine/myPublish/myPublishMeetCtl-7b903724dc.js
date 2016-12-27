angular.module('Mine', [])

.controller('myPublishMeetCtl', function($scope, $ionicScrollDelegate, $timeout, $state, myPublishMeetService, $stateParams) {

	var uid = null;

	var params = {
  	id: "",
  	uid: "",
  	center_type: "publish"
  }

	if(myPublishMeetService.getUid() == null) {
		myPublishMeetService.autoLogin().then(function(data) {
			uid = data.userinfo.uid;
			params.uid = uid;
			refreshMeetList(params);
		});
	} else {

		uid = myPublishMeetService.getUid();
		params.uid = uid;
		refreshMeetList(params);
	}

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: myPublishMeetService.getUid()
		}

		$state.go('tabs.meet-detail', params);
	}

	$scope.more = true;

	$scope.loadMoreData = function() {
		if ($scope.jsonDatas && $scope.jsonDatas.length >= myPublishMeetService.perPage) {
			myPublishMeetService.nextMeetList().then( function(data) {
				$scope.jsonDatas = myPublishMeetService.getMeetList();
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
				if(!data || data.length < myPublishMeetService.perPage) {
					$scope.more = false;
				} else {
					$scope.more = true;
				}
			}, function(err) {
				
			})
		} else {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	}

	$scope.doRefresh = function() {
		$scope.more = true;
		params.id = "";
		myPublishMeetService.refreshMeetList(params).then( function(data) {
			$scope.jsonDatas = myPublishMeetService.getMeetList();
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

	$scope.$on('stateChangeSuccess', function() {
    $scope.loadMoreData();
  });

	function refreshMeetList(params) {
		if(!params.uid) {
			$scope.jsonDatas = myPublishMeetService.getMeetList();
			return;
		}

		myPublishMeetService.refreshMeetList(params).then( function(datas) {
			$ionicScrollDelegate.$getByHandle("contentScroll").scrollTop();
			$scope.jsonDatas = myPublishMeetService.getMeetList();
			if(!datas || datas.length < myPublishMeetService.perPage) {
				$scope.more = false;
			}
		}, function(err) {

		})
	}


})