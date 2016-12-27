angular.module('FindPublish', [])

.controller('FindPublishCtl', function($scope, $rootScope, findPublishService, $ionicPopup, $ionicHistory) {
	var maxChooseImages = 9;

	$scope.user = findPublishService.getUserInfo();
	$scope.addPictures = [];

	// $rootScope.$on('wxImages', function(event, data) {
	// 	$scope.addPictures = $scope.addPictures.concat(data);
	// 	console.log($scope.addPictures);
	// 	alert(data);
	// })

	$scope.choosePicture = function() {
		findPublishService.choosePicture(maxChooseImages - $scope.addPictures.length).then(function(data) {
			console.log("choosePicture： ", data);
			$scope.addPictures = $scope.addPictures.concat(data);
		});
	}

	$scope.previewImage = function(current, urls) {
		findPublishService.previewImage(current, urls);
	}

	$scope.deleteImage = function(item) {
		var index = $scope.addPictures.indexOf(item);
		console.log(item, index);
		if(index != -1) {
			$scope.addPictures.splice(index, 1);
		}
	}

	$scope.data = {
		title: "",
		content: ""
	}

	$scope.confirm = function() {

		// 此处先对输入的标题和详情作验证

		// 友情提示，是否确认发布
   	var confirmPopup = $ionicPopup.confirm({
     	title: '确认发布吗？',
     	cancelText: '取消',
     	okText: '确认'
   	});

   	confirmPopup.then(function(res) {
     	if(res) {
     		// 确认发布，提交表单并跳转到会友圈列表页面。
     		
     		var params = {
					uid: findPublishService.getUid(),
					title: $scope.data.title,
					content: $scope.data.content
				}

       	findPublishService.syncUpload($scope.addPictures, params).then(function(datas) {
       		$ionicHistory.goBack();
       	}, function(err) {

       	})
     	} else {
     		// 取消发布，不做任何操作，保留在发布页面。
       	
     	}
   	});
 	};
})