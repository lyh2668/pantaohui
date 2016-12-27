angular.module('Find', [])

.controller('FindCtl', function($scope, $state, $timeout, findService, $ionicScrollDelegate) {

	$scope.findList = [];

	$scope.toPublish = function() {
		$state.go('tabs.find-publish', {});
	}

	$scope.toMessage = function() {
		$state.go('tabs.find-message', {});
	}

	$scope.toDetail = function(id) {
		$state.go('tabs.find-detail', {id: id});
	}

	$scope.goTop = function() {
		$ionicScrollDelegate.scrollTop();
	}

	function moreChange(datas) {
		// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
		$timeout(function() {
			if(!datas || datas.length < findService.perPage) {
				$scope.more = false;
			} else {
				$scope.more = true;
			}
		}, 500); // 加一个延时，确保页面html已经渲染数据，从而首次不会自动触发loadMoreData
	}

	$scope.doRefresh = function() {

		findService.refreshFindList().then(function(datas) {

			console.log(datas)

			$scope.findList = datas;

			$scope.$broadcast('scroll.refreshComplete');

			moreChange(datas);
			
		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.loadMoreData = function() {
		findService.nextFindList().then(function(datas) {

			$scope.findList = $scope.findList.concat(datas);

			$scope.$broadcast('scroll.infiniteScrollComplete');

			moreChange(datas);
		})
	}

	// 初始化操作
	init();

	function init() {
		$scope.more = false;
		$scope.doRefresh();
	}

})