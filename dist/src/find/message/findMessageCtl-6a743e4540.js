angular.module('FindMessage', [])

.controller('FindMessageCtl', function($scope, findMessageService, $timeout) {

	function moreChange(datas) {
		// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
		$timeout(function() {
			if(!datas || datas.length < findMessageService.perPage) {
				$scope.more = false;
			} else {
				$scope.more = true;
			}
		}, 500); // 加一个延时，确保页面html已经渲染数据，从而首次不会自动触发loadMoreData
	}

	$scope.doRefresh = function() {

		$scope.params = {
			uid: findMessageService.getUid()
		}

		findMessageService.refreshFindMessageList($scope.params).then(function(datas) {

			console.log(datas)

			$scope.findMessageList = datas;

			$scope.$broadcast('scroll.refreshComplete');

			moreChange(datas);
			
		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.loadMoreData = function() {
		findMessageService.nextFindMessageList().then(function(datas) {

			$scope.findMessageList = $scope.findMessageList.concat(datas);

			$scope.$broadcast('scroll.infiniteScrollComplete');

			moreChange(datas);
		})
	}

	init();

	function init() {
		$scope.findMessageList = [];
		$scope.doRefresh();
	}
})