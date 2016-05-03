angular.module('News', [])

.controller('NewsCtl', function($scope, $ionicSlideBoxDelegate, readJsonService, JSON_LOCAL_FILES) {

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_LIST).then( function(datas) {
		$scope.jsonHotDatas = [];
		$scope.jsonBdDatas = [];

		for (var i = 0; i < datas.length; ++i) {
			if("1" == datas[i].catid) {
				$scope.jsonHotDatas.push(datas[i]);
			}
			if("2" == datas[i].catid) {
				$scope.jsonBdDatas.push(datas[i]);
			}
		}

	}, function(datas) {
		$scope.errData = datas;
	})

	$scope.slideIndex = 0;

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    console.log("slide Change");

    if ($scope.slideIndex == 0) {
    	console.log("slide 1");
   	}

  	else if ($scope.slideIndex == 1){
     	console.log("slide 2");
   	}

   	// else if ($scope.slideIndex == 2){
    //  	console.log("slide 3");
   	// }

  };

  $scope.activeSlide = function (index) {
   	$ionicSlideBoxDelegate.slide(index);
 	};  
})

.controller('NewsDetailCtl', function ($scope, $stateParams, readJsonService, JSON_LOCAL_FILES, 
	$sce, $ionicActionSheet, $ionicPopup) {
	var id = $stateParams.id;

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_LIST).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if (id == datas[i].id) {
				$scope.detailInfo = datas[i];
			}
		}
	}, function(datas) {
		// $scope.jsonData = datas;
	})

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_DATA).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if (id == datas[i].id) {
				$scope.content = datas[i].content;
			}
		}
	}, function(datas) {

	})

	$scope.share = function(title, desc, url, thumb) {
		ionicActionSheet.show({
			buttons: [
				{ text: '<b>分享至微信朋友圈</b>' },
				{ text: '分享给微信好友' }
			],
			titleText: '分享',
			cancelText: '取消',
			cancel: function() {

			},
			buttonClicked: function(index) {
				switch(index) {
					case 0: {
						$scope.shareViaWechat(WeChat.Scene.timeline, title, desc, url, thumb);
					}
					case 1: {
						$scope.shareViaWechat(WeChat.Scene.session, title, desc, url, thumb);
					}
				}
			}
		})
	}

	$scope.shareViaWechat = function(scene, title, desc, url, thumb) {
		var msg = {
			title: title ? titile : "没有标题",
			description: desc ? desc : "没有描述信息",
			url: url ? url : "#",
			thumb: thumb ? thumb : null
		}

		WeChat.share(msg, scene, function() {
			$ionicPopup.alert({
				title: '分享成功',
				template: '感谢您的支持！',
				okText: '关闭'
			});
		}, function(res) {
			$ionicPopup.alert({
				title: '分享失败',
				template: '错误原因' + res,
				okText: '确定'
			})
		})
	}	
})
