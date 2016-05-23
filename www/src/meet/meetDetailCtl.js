angular.module('Meet', [])

.controller('MeetDetailCtl', function ($scope, $location, readJsonService, JSON_LOCAL_FILES, 
	$sce, $ionicScrollDelegate, $ionicModal, $ionicBackdrop, WxShare) {
	$scope.showSideButton = true;
	$scope.url = $location.path();

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

	$ionicModal.fromTemplateUrl('meetApply.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: true
  }).then(function(modal) {
    $scope.modal = modal;
    // $ionicBackdrop.retain();
  });

	$scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeNewProject = function(){
    $scope.modal.hide();
	}
})