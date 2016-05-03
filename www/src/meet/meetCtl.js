angular.module('Meet', [])

.controller('MeetCtl', function ($scope, $state, $ionicPopover, $templateCache, readJsonService, JSON_LOCAL_FILES, Locals) {
	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_MEET_LIST).then( function(data) {
		$scope.jsonDatas = data;
	}, function(data) {
		$scope.jsonDatas = data;
	})

	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.meetDomain = {
		currentActivity: "会议领域",
		activities: [
			"科技网络",
			"财经金融",
			"热点产业",
			"企业运营",
			"社群活动",
			"教育培训",
			"学术研讨",
			"网络营销"
		]
	}

	$scope.toCityList = function() {
		console.log("go to city list.")
		$state.go('tabs.meet-citylist', {})
	}

	$scope.$on('to-parent', function(d, data) {
		console.log(data)
	})

	$scope.getCity = function() {
		$scope.city = Locals.get('city')
	}

	$scope.animation = 'slide-in-up';

	$ionicPopover.fromTemplateUrl('src/popover/popMore.html', {
    scope: $scope
  }).then(function(popover) {
  	// popover.hide();
  	// popover.show();
    $scope.popover = popover;
    // 消除第一次样式变化引起的bug
    $scope.popover.show();
    $scope.popover.hide();
  });
})

.controller('MeetDetailCtl', function ($scope, readJsonService, JSON_LOCAL_FILES, $sce) {
	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_MEET_DETAIL).then( function(data) {
		$scope.jsonData = data;
	}, function(data) {
		$scope.jsonData = data;
	})
})
