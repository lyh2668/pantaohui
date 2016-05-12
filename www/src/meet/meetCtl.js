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

	$scope.meetDomainList = [
			"会议领域",
			"科技网络",
			"财经金融",
			"热点产业",
			"企业运营",
			"社群活动",
			"教育培训",
			"学术研讨",
			"网络营销"
		]
	$scope.meetTimeList = [
		"会议时间", "最近一周", "最近一月", "最近三月"
	]

	$scope.meetTyleList = [
		"会议类型", "展会", "论坛峰会", "产品发布会", "节庆活动",
		"招商会", "培训会", "研讨交流会", "沙龙", "年会"
	]

	$scope.showMenu = false;
	$scope.meetTitle = "";
	var menuIndex = 1;
	$scope.meetDomain = "会议领域"
	$scope.meetTime = "会议时间"
	$scope.meetType = "会议类型"

	$scope.clickMeetDomain = function() {
		$scope.showMenu = !$scope.showMenu
		$scope.menu = $scope.meetDomainList;
		menuIndex = 1
		$scope.data = { meetModelData: $scope.meetDomain }
	}

	$scope.clickMeetTime = function() {
		$scope.showMenu = !$scope.showMenu;
		$scope.menu = $scope.meetTimeList;
		menuIndex = 2
		$scope.data = { meetModelData: $scope.meetTime }
	}

	$scope.clickMeetType = function() {
		$scope.showMenu = !$scope.showMenu;
		$scope.menu = $scope.meetTyleList;
		menuIndex = 3
		$scope.data = { meetModelData: $scope.meetType }
	}

	$scope.meetDataChange = function(item) {
		if (menuIndex == 1) {
			$scope.meetDomain = item;
		}

		if (menuIndex == 2) {
			$scope.meetTime = item;
		}

		if (menuIndex == 3) {
			$scope.meetType = item;
		}
		$scope.showMenu = false
		console.log($scope.meetDomain, $scope.meetTime, $scope.meetType)
	}

	$scope.showSearch = false;
	$scope.clickSearch = function() {
		$scope.showSearch = !$scope.showSearch
	}

	$scope.toCityList = function() {
		console.log("go to city list.")
		$state.go('tabs.meet-citylist', {})
	}

	$scope.getCity = function() {
		$scope.city = Locals.get('city')
	}

	$scope.toScreen = function() {
		$state.go('tabs.meet-screen', {})
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

.controller('MeetDetailCtl', function ($scope, readJsonService, JSON_LOCAL_FILES, $sce, $ionicScrollDelegate) {
	$scope.showSideButton = true;

	$scope.disableSideButton = function() {
		$scope.showSideButton = false;
	}

	$scope.enableSideButton = function() {
		$scope.showSideButton = true;
	}

	$scope.getScrollPosition = function () {
		var scroll = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition();
		console.log(scroll);
	}
	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_MEET_DETAIL).then( function(data) {
		$scope.jsonData = data;
	}, function(data) {
		$scope.jsonData = data;
	})
})
