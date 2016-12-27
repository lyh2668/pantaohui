angular.module('Mine', [])

.controller('myFavorMeetCtl', function($scope, $ionicScrollDelegate, $timeout, $state, myFavorMeetService, $stateParams) {

	var uid = null;

	var params = {
  	id: "",
  	uid: "",
  	center_type: "interest"
  }

	if(myFavorMeetService.getUid() == null) {
		myFavorMeetService.autoLogin().then(function(data) {
			uid = data.userinfo.uid;
			params.uid = uid;
			refreshMeetList(params);
		});
	} else {

		uid = myFavorMeetService.getUid();
		params.uid = uid;
		refreshMeetList(params);
	}

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: myFavorMeetService.getUid()
		}

		$state.go('tabs.meet-detail', params);
	}

	$scope.more = true;

	$scope.loadMoreData = function() {
		if ($scope.jsonDatas && $scope.jsonDatas.length >= myFavorMeetService.perPage) {
			myFavorMeetService.nextMeetList().then( function(data) {
				$scope.jsonDatas = myFavorMeetService.getMeetList();
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
				if(!data || data.length < myFavorMeetService.perPage) {
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
		myFavorMeetService.refreshMeetList(params).then( function(data) {
			$scope.jsonDatas = myFavorMeetService.getMeetList();
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
			$scope.jsonDatas = myFavorMeetService.getMeetList();
			return;
		}

		myFavorMeetService.refreshMeetList(params).then( function(datas) {
			$ionicScrollDelegate.$getByHandle("contentScroll").scrollTop();
			$scope.jsonDatas = myFavorMeetService.getMeetList();
			if(!datas || datas.length < myFavorMeetService.perPage) {
				$scope.more = false;
			}
		}, function(err) {

		})
	}


})