angular.module('FindDetail', [])

.controller('FindDetailCtl', function($scope, $timeout, findDetailService, $document) {

	$scope.replySetBlur = function() {
		return $scope.replyBlur;
	}

	// $document.ready(function() {
	// 	var button = document.getElementById('reply-others');
	// console.log(button);
	// var inputElem = document.getElementById('reply-input');
	// button.addEventListener('click', function(ev){
	// 	console.log("focus");
	//   inputElem.focus();
	// });
	// })
	
	$scope.resetDatas = function() {
		$scope.replyMessage.message = "";
		$scope.replyPlaceholder = "回复 楼主...";
		$scope.params.pid = 0;
		$scope.replyBlur = false;
		$scope.inReply = false;
		document.getElementById('reply-input').blur();
	}

	$scope.replyOthers = function(event, nickname, pid, index) {

		event.stopPropagation();

		$scope.replyMessage.message = "";
		$scope.replyPlaceholder = "回复 #" + index + " " + nickname;
		$scope.replyBlur = true;
		$scope.params.pid = pid;
		$scope.index = index;
	}

	$scope.reply = function() {
		if (!$scope.replyMessage.message) {
			console.log("回复内容是空的");
			return;
		}

		$scope.inReply = true;

		$scope.params.content = $scope.replyMessage.message;
		$scope.params.content_id = $scope.findDetail.id;
		$scope.params.uid = findDetailService.getUid();

		findDetailService.replyCommit($scope.params).then(function(data) {
			console.log("回复内容", $scope.replyMessage.message);

			// 回复成功 插入所回复的对象，使页面同步更新
			if ($scope.params.pid == 0) {
				$scope.replyList.unshift(data.data);
			} else {
				$scope.replyList[$scope.index - 1].chlist.push(data.data);
			}

			$scope.resetDatas();

			findDetailService.showMsg("评论成功");

		}, function(err) {
			findDetailService.showMsg("评论失败：", err.errmsg);
			$scope.inReply = false;
		})
	}

	function moreChange(datas) {
		// 如果返回的数据不存在或者单页少于15条则表示没有更多数据 
		$timeout(function() {
			if(!datas || datas.length < findDetailService.perPage) {
				$scope.more = false;
			} else {
				$scope.more = true;
			}
		}, 500); // 加一个延时，确保页面html已经渲染数据，从而首次不会自动触发loadMoreData
	}

	$scope.doRefresh = function() {

		findDetailService.refreshFindDetailList().then(function(data) {

			console.log(data)

			$scope.findDetail = data;
			$scope.replyList = data.commentlist;

			$scope.$broadcast('scroll.refreshComplete');

			moreChange(data.commentlist);

		}, function(err) {
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.loadMoreData = function() {

		findDetailService.nextFindDetailList().then(function(datas) {

			$scope.replyList = $scope.replyList.concat(datas);

			$scope.$broadcast('scroll.infiniteScrollComplete');

			moreChange(datas.commentlist);
		})
	}

	// 初始化操作
	init();

	function init() {
		$scope.findDetail = [];
		$scope.replyList = [];
		$scope.params = { pid: 0 }
		$scope.more = false;
		$scope.inReply = false;
		$scope.replyPlaceholder = "回复 楼主...";
		$scope.replyBlur = false;
		$scope.replyMessage = {
			message: ""
		};

		$scope.doRefresh();
	}
})