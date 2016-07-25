angular.module('Meet', [])

.controller('MeetDetailCtl', function ($scope, $location, readJsonService, JSON_LOCAL_FILES, commonRequest, $state, $ionicHistory, $ionicLoading,
	$ionicScrollDelegate, $ionicModal, $ionicPopup, $timeout, $ionicBackdrop, WxShare, $stateParams, meetService, registerService, Locals, $document) {
	$scope.showSideButton = true;
	$scope.url = $location.path();

	$scope.loaded = false;
  $ionicLoading.show({
    template: '加载中...',
  });

	meetService.getMeetDetail($stateParams.id, meetService.getUid()).then( function(data) {
		console.log("getMeetDetail: id=", $stateParams.id, "uid=", meetService.getUid())
		$scope.meetDetailData = data;
		
		$scope.loaded = true;
		$ionicLoading.hide();

		commonRequest.thumbToSrc(0, $scope.meetDetailData.thumb, 560, "jsonp").then(function(data) {
			$scope.meetDetailData.thumb = data.thumb;
			WxShare.wxShare($scope.meetDetailData.title, "蟠桃会－免费会议策划与营销专家", 
				"http://" + $location.host() + $scope.meetDetailData.thumb, $location.absUrl());
		})

		if("relate_meet" in $scope.meetDetailData) {
			for (var index = 0; index < $scope.meetDetailData.relate_meet.length; ++index) {
				if("thumb" in $scope.meetDetailData.relate_meet[index]) {
					commonRequest.thumbToSrc(index, $scope.meetDetailData.relate_meet[index].thumb, 110, "jsonp").then(function(data) {
						$scope.meetDetailData.relate_meet[data.id].thumb = data.thumb;
					})
				}
			}
		}

		if ($scope.meetDetailData && "MeetInterest" in $scope.meetDetailData) {
			favor = true;
		}

		console.log("wxShare", $location);
		
		var items = [];
		var pswpElement = document.querySelectorAll('.pswp')[0];

		var options = {
        index: 0,
        shareEl: false,
        // tapToClose: true  
    };

    function imgOnload(img, index) {
			return function() {
				console.log("imgOnload: [index, img]", index, img);
				// 只有实际图片宽度大于250时，才需要放大图片，否则可能时图标或者无需放大的图片。
				if (img.naturalWidth > 250) {
					var item = {
						src: img.src,
						w: img.naturalWidth,
						h: img.naturalHeight
					}
					items.push(item);
	
					angular.element(img).bind("click", bindImg(index));
				}
			}
		}
	
		function bindImg(index) {
			return function() {
				console.log("bindImg: [index, items]", index, items);

				options.index = index;
				var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
				gallery.init();
				gallery.goTo(index);

			}
		}
    
    var myDocument = angular.element($document.find("pre"));
    console.log("myDocument", myDocument, "  By ID", document.getElementById("meetDetailContent"));
		myDocument.ready(function() {
			var imgs = myDocument.find("img");
			console.log(imgs);
			
			for(var index = 0; index < imgs.length; ++index) {
				
				var img = imgs[index];
				if(img.naturalWidth == 0 && img.naturalHeight == 0) {
					// 绑定图片加载完成事件，加载完以后才能获取图片Size
					angular.element(img).bind("load", imgOnload(img, index))
				} else {
					imgOnload(img, index)();
				}

			}
		})
	}, function(err) {

	})



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

	$scope.share = function() {
		WxShare.share($scope.jsonData.title, "蟠桃会会议", $scope.url);
	}

	$scope.hasWechat = function() {
		if (typeof Wechat === "undefined") {
			return false;
		} else {
			return true;
		}
	}

	$scope.backHome = function() {
  	$ionicHistory.clearHistory();
		$state.go("tabs.home");
	}

	/***************************
	/ 报名相关
	/****************************/

	$ionicModal.fromTemplateUrl('meetApply.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
    // $ionicBackdrop.retain();
  });

	$scope.meetLoginData = {
		username: "",
		password: ""
	}

	var meetLogin = function() {
		var myPopup = $ionicPopup.show({
     	templateUrl: 'meetLogin.html',
      scope: $scope
    });

		$scope.submitLogin = function() {

			if($scope.meetLoginData.username == "" ||
				 $scope.meetLoginData.password == "") {
				$ionicPopup.alert({
					title: '错误',
					template: '<p style="text-align: center">用户名或密码不能为空</p>'
				})
			}

			meetService.login($scope.meetLoginData.username, $scope.meetLoginData.password).then(function(data) {
				myPopup.close();

				$stateParams.uid = data.userinfo.uid;
			})
		}

    $scope.cancelLogin = function() {
			myPopup.close();
		}
	}

	// 根据 uid 和 会议id 生成key
	var key = "SaveApplyDataKey_" + meetService.getUid() + $stateParams.id;
  var saveApplyData = function(key) {
  	console.log("saveApplyData key:", key);
  	Locals.setObject(key, $scope.applyData);
  }

  var getApplyData = function(key) {

  	$scope.applyData = Locals.getObject(key);
  	if (!$scope.applyData) {
  		$scope.applyData = {
				username: "",
				mobile: "",
				email: "",
				company: "",
				position: ""
			}
  	}
  }
  getApplyData(key);

  function clearApplyData(key) {
		$scope.applyData = {
			username: "",
			mobile: "",
			email: "",
			company: "",
			position: ""
		}
		Locals.setObject(key, $scope.applyData);
	}

	$scope.openModal = function() {
		// if (!meetService.isLogin()) {
		// 	meetLogin();
		// }
		// else if (meetService.isMember()) {
		// 	clearApplyData();
			getApplyData(key);
    	$scope.modal.show()
    // } else {
    // 	bindTel();
    // }
  };

  $scope.closeApply = function() {

  	saveApplyData(key);
    $scope.modal.hide();
	}

	$scope.submitApplyBtn = true;
	$scope.apply = function() {

		if(!$scope.applyData.username) {
			meetService.showInvalidMsg("姓名不能为空");
			return;
		}

		if(!$scope.applyData.mobile) {
			meetService.showInvalidMsg("手机号码格式不正确");
			return;
		}

		var reg = /^0?1[3|4|5|8][0-9]\d{8}$/
		if(!reg.test($scope.applyData.mobile)) {
			meetService.showInvalidMsg("请输入正确的手机号码");
			return;
		}

		$scope.submitApplyBtn = false;
		var params = {
			meet_id: $scope.meetDetailData.id,
			uid: meetService.getUid(),
			username: $scope.applyData.username,
			mobile: $scope.applyData.mobile,
			email: $scope.applyData.email,
			company: $scope.applyData.company,
			position: $scope.applyData.position
		}

		console.log("apply params: ", params);

		meetService.meetApply(params).then( function(data) {
			clearApplyData(key);
			var popup = $ionicPopup.show({
				title: '<p style="text-align: center">报名成功！</p>'
			})

			$scope.modal.hide();

			$timeout(function() {
				$scope.submitApplyBtn = true;
				popup.close();
				
			}, 1000);

			
		}, function(err) {
			var popup = $ionicPopup.show({
				title: '<p style="text-align: center">报名失败！（' + err.errmsg + '）</p>'
			})
			$timeout(function() {
				popup.close();
			}, 1000);

			$scope.submitApplyBtn = true;
		});
	}

	var favor = false;
	$scope.isFavored = function() {
		return favor;
	}

	$scope.clickFavor = function() {
		if (!meetService.isLogin()) {
			meetLogin()
		} else if (meetService.isMember()) {

			var params = {
				uid: meetService.getUid(),
				meet_id: $scope.meetDetailData.id
			}

			meetService.toFavor(params).then( function(data) {
				if (data.status == 1) {
					favor = true;
				} else {
					favor = false;
				}
			}, function(err) {

			})

		} else {
			bindTel();
		}
	}
})