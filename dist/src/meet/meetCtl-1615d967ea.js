angular.module('Meet', [])

.controller('MeetCtl', function ($scope, $state, $ionicPopover, $ionicViewSwitcher, $templateCache, readJsonService, JSON_LOCAL_FILES,
 Locals, $ionicScrollDelegate, $timeout, meetService, $stateParams, $ionicHistory) {

	$scope.toMeetDetail = function(data) {
		var params = {
			id: data.id,
			uid: meetService.getUid()
		}
		// $ionicHistory.nextViewOptions({
		// 	disableBack: true
		// });
		$state.go('tabs.meet-detail', params);
	}

	$scope.more = false;

	$scope.loadMoreData = function() {
		if ($scope.jsonDatas && $scope.jsonDatas.length >= meetService.perPage) {
			meetService.nextMeetList().then( function(data) {
				$scope.jsonDatas = $scope.jsonDatas.concat(data);
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
				if(!data || data.length < meetService.perPage) {
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
		meetService.refreshMeetList(params).then( function(data) {
			$scope.jsonDatas = data;
			$scope.$broadcast('scroll.refreshComplete');
		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})

		var timer = $timeout( function() {
			console.log("refresh timeout.");
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 5000);
	}

	meetService.getMeetClass().then( function(datas) {
		console.log(datas)
		$ionicScrollDelegate.$getByHandle("leftDropdownScroll").scrollBy(0, 0);
		if(datas && datas.length == 3) {
			$scope.data.first.title = datas[0].title;
			$scope.data.first.value = datas[0].value;
			$scope.data.second.title = datas[1].title;
			$scope.data.second.value = datas[1].value;
			$scope.data.third.title = datas[2].title;
			$scope.data.third.value = datas[2].value;

			$scope.toggle1LabelTitle = $scope.data.first.title;

			$scope.meetDomain = datas[0].data;
			$scope.meetDomain.unshift($scope.data.first);
			$scope.meetTime = datas[1].data;
			$scope.meetTime.unshift($scope.data.second);
			$scope.meetSort = datas[2].data;
			$scope.meetSort.unshift($scope.data.third);
		}

	}, function(err) {

	});


	$scope.data = {
		first: {
			id: "0",
			title: "",
			value: "",
		},
		second: {
			id: "0",
			title: "",
			value: ""
		},
		third: {
			id: "0",
			title: "",
			value: ""
		}
	}

	var params = {
		"meet_domain": "",
		"meet_stime": "",
		"meet_sort": "",
		"meet_cityid": ""
	}
	

	$scope.showSubMeetClass = false

	$scope.showBackup = false;

	$scope.toggle1Checked = false;
	$scope.toggle2Checked = false;
	$scope.toggle3Checked = false;
	

	var hideToggle = function(toggle) {
		$scope.toggle1Checked = false;
		$scope.toggle2Checked = false;
		$scope.toggle3Checked = false;
		toggle = true;
	}

	$scope.hideBackup = function() {
		$scope.showBackup = false;
		hideToggle();
	}

	$scope.touchToggle1 = function() {
		$scope.toggle2Checked = false;
		$scope.toggle3Checked = false;
		if ($scope.toggle1Checked) {
			$scope.showBackup = true;
		} else {
			$scope.showBackup = false;
		}
	}

	$scope.touchToggle2 = function() {
		$scope.toggle1Checked = false;
		$scope.toggle3Checked = false;
		if ($scope.toggle2Checked) {
			$scope.showBackup = true;
		} else {
			$scope.showBackup = false;
		}
	}

	$scope.touchToggle3 = function() {
		$scope.toggle1Checked = false;
		$scope.toggle2Checked = false;
		if ($scope.toggle3Checked) {
			$scope.showBackup = true;
		} else {
			$scope.showBackup = false;
		}
	}

	var refreshMeetList = function(params) {
		$scope.more = true;
		meetService.refreshMeetList(params).then( function(datas) {
			$ionicScrollDelegate.$getByHandle("contentScroll").scrollTop();
			$scope.jsonDatas = datas;
			$scope.firstStateChange = false;
			if(!datas || datas.length < meetService.perPage) {
				$scope.more = false;
			}
		}, function(err) {

		})
	}

	$scope.clickMeetSubClass = function(item) {
		if ($scope.toggle1Checked) {
			$scope.toggle1LabelTitle = item.title;
		}
		$scope.showBackup = false;

		hideToggle();

		console.log("subClass: ", item);
		params.meet_domain = item.id;
		refreshMeetList(params)
		
	}

	$scope.clickSubClassLabel = function(item) {
		event.stopPropagation();
		$scope.toggle1LabelTitle = item.title;
		params.meet_domain = item.id;
		refreshMeetList(params)
	}

	$scope.clickMeetTime = function(item) {
		$scope.showBackup = false;
		hideToggle();

		params.meet_stime = item.id;
		refreshMeetList(params)
	}

	$scope.clickMeetSort = function(item) {
		$scope.showBackup = false;
		hideToggle();

		params.meet_sort = item.id
		refreshMeetList(params)
	}

	$scope.clickMeetClass = function(item) {
		$ionicScrollDelegate.$getByHandle("rightDropdownScroll").scrollTop();

		console.log("clicked: ", item.title);
		console.log("model:", $scope.data.first);

		if ("title" in item && item.id == "0") {
			$scope.toggle1LabelTitle = $scope.data.first.title;

			$scope.showSubMeetClass = false;
			$scope.showBackup = false;
			hideToggle();
			params.meet_domain = 0;
			refreshMeetList(params);
		}

		if("id" in item && item.id != "0") {
			
			$scope.mainClassIndex = item.id;

			var subclassFirst = {
				id: item.id,
				title: item.title
			}
			$scope.meetSubClass = {}
			$scope.meetSubClass = $scope.meetDomain[item.id].subclass;
			if ($scope.meetSubClass[0].title != item.title) {
				$scope.meetSubClass.unshift(subclassFirst)
			}
			$scope.showSubMeetClass = true
		}
	}

	$scope.toCityList = function() {
		$state.go('tabs.meet-citylist');
	}

	$scope.toSearch = function() {
		$state.go('tabs.meet-search');
	}

	var cityObj = {}
	$scope.city = ""
	$scope.firstStateChange = true;
	$scope.getCityName = function() {
		if($scope.city == "") {
			$scope.city = "全国"
			params.meet_cityid = 0;
			
		}

		if (cityObj = Locals.getObject("cityObj")) {
			// 如果城市没改变则不刷新页面
			if(cityObj.title == $scope.city && !$scope.firstStateChange) {
				return ;
			}
			$scope.city = cityObj.title;
			params.meet_cityid = cityObj.cityid;
		} else {
			var cityTmp = {
      	cityid: 0,
      	id: 0,
      	title: "全国"
    	}
    	Locals.setObject("cityObj", cityTmp);
		}

		refreshMeetList(params);
	}
	$scope.getCityName();
	$scope.$on('$stateChangeSuccess', $scope.getCityName);

	$scope.animation = 'slide-in-up';

})


