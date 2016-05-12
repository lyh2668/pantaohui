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
	$sce, $ionicActionSheet, $ionicPopup, $location) {

	$scope.id = $stateParams.id;
	$scope.url = $location.path();

	console.log($scope.url)

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_LIST).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if ($scope.id == datas[i].id) {
				$scope.detailInfo = datas[i];
			}
		}
	}, function(datas) {
		// $scope.jsonData = datas;
	})

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_NEWS_DATA).then( function(datas) {
		for (var i = 0; i < datas.length; ++i) {
			if ($scope.id == datas[i].id) {
				$scope.content = datas[i].content;
			}
		}
	}, function(datas) {

	})



	$scope.share = function(title, desc, thumb) {

		// if (typeof Wechat !== 'undefined') { 
		// 	console.log("Wechat defined")
		// } else {
		// 	console.log("Wechat undefined")
		// 	alert("Wechat plugin is not installed.");
		// 	return
		// }

		$ionicActionSheet.show({
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
						$scope.shareViaWechat(Wechat.Scene.TIMELINE, $scope.detailInfo.title, 
							"蟠桃会资讯", $scope.url, $scope.detailInfo.thumb);
						break;
					}
					case 1: {
						$scope.shareViaWechat(Wechat.Scene.SESSION, $scope.detailInfo.title, 
							"蟠桃会资讯", $scope.url, $scope.detailInfo.thumb);
						break;
					}
				}
				return true
			}
		})
	}

	$scope.shareViaWechat = function(scene, title, desc, url, thumb) {
		
		var params = {
			scene: scene
		}

		params.message = {
			title: title ? title : "没有标题",
			description: desc ? desc : "没有描述信息",
			messageExt: "蟠桃会",
			messageAction: "<action>dotalist</action>",
			// url: url ? url : "#",
			// thumb: thumb ? thumb : null,
			media : { 
				type: Wechat.Type.WEBPAGE,
				image: thumb ? thumb : null,
				webpageUrl: url ? "http://183.245.210.26:8080/#" + url : "#" 
			}
		}

		Wechat.share(params, function() {
			$ionicPopup.alert({
				title: '分享成功',
				template: '感谢您的支持！',
				okText: '关闭'
			});
		}, function(reason) {
			$ionicPopup.alert({
				title: '分享失败',
				template: '错误原因' + reason,
				okText: '确定'
			})
		})
	}	
})
