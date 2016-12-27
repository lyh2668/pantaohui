angular.module('Mine', [])

.controller('myApplyMeetCtl', function($scope, $ionicScrollDelegate, $timeout, $state, myApplyMeetService, $stateParams) {

	// $scope.jsonDatas = [{
	// 	title: "国脉海洋蟠桃会",
	// 	place: "海洋科学城",
	// 	start_time: "2016-09-19",
	// 	username: "一横",
	// 	tel: "13588568241",
	// 	email: "1234@qq.com",
	// 	ticket_type: "儿童票",
	// 	price: "¥1000",
	// 	state: "0",
	// 	payid: "273",
	// 	number: "SN12341234"
	// }, 
	// {
	// 	title: "国际旅游大会",
	// 	place: "临城",
	// 	start_time: "2016-09-19",
	// 	username: "一横",
	// 	tel: "13588568241",
	// 	email: "1234@qq.com",
	// 	ticket_type: "成人票",
	// 	price: "¥1000",
	// 	state: "1",
	// 	payid: "273",
	// 	number: "SN32143214"
	// }]

	$scope.toOrder = function(id) {
		event.stopPropagation();
		$state.go('order', {id: id})
	}

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: myApplyMeetService.getUid()
		}

		$state.go('tabs.meet-detail', params);
	}

	$scope.loadMoreData = function() {
		myApplyMeetService.nextMeetList().then( function(data) {
			$scope.jsonDatas = myApplyMeetService.getMeetList();
			$scope.$broadcast('scroll.infiniteScrollComplete');

			moreChange(data);

		}, function(err) {
			
		})
	}

	$scope.doRefresh = function() {
		params.id = "";
		myApplyMeetService.refreshMeetList(params).then( function(data) {
			$scope.jsonDatas = myApplyMeetService.getMeetList();
			$scope.$broadcast('scroll.refreshComplete');

			moreChange(data);

		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})

		var timer = $timeout(function() {
			//simulate async response
			console.log("refresh timeout.");
			//Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 5000);

    $scope.$on('scroll.refreshComplete', function( event ) {
			$timeout.cancel( timer );
		})
	}


	var uid = null;

	var params = {
  	id: "",
  	uid: ""
  }

	if(myApplyMeetService.getUid() == null) {
		myApplyMeetService.autoLogin().then(function(data) {
			uid = data.userinfo.uid;
			// uid = 3608;
			params.uid = uid;
			$scope.doRefresh(params);
		});
	} else {
		uid = myApplyMeetService.getUid();
		params.uid = uid;
		$scope.doRefresh(params);
	}
	

	function moreChange(datas) {
		// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
		$timeout(function() {
			if(!datas || datas.length < myApplyMeetService.perPage) {
				$scope.more = false;
			} else {
				$scope.more = true;
			}
		}, 500); // 加一个延时，确保页面html已经渲染数据，从而首次不会自动触发loadMoreData
	}

	$scope.init = function() {
		$scope.more = false;
		$scope.doRefresh();
	}

})