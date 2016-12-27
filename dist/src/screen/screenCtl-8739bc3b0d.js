angular.module('Screen', [])

.controller('ScreenCtl', function($scope, readJsonService, JSON_LOCAL_FILES, $ionicScrollDelegate) {

	$scope.data = {
		first: ""
	}

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_CLASS).then( function(datas) {
		$scope.meetClass = datas;
		if ($scope.meetClass && $scope.meetClass.length > 0 && "title" in $scope.meetClass) {
			$scope.data.first = $scope.meetClass[0].title;
		}
	}, function(err) {

	})

	$scope.meetSubClass = {}

	$scope.clickMeetClass = function(item) {
		$ionicScrollDelegate.scrollTop();
		console.log("clicked: ", item.title);

		if("id" in item) {
			$scope.mainClassIndex = item.id;

			switch(item.id) {
				case "1": {
					readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_CLASS_1).then( function(datas) {
						$scope.meetSubClass = datas;
					}, function(err) {

					})

					break;
				}
				case "2": {
					readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_CLASS_2).then( function(datas) {
						$scope.meetSubClass = datas;
					}, function(err) {

					})

					break;
				}
				case "3": {
					readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_CLASS_3).then( function(datas) {
						$scope.meetSubClass = datas;
					}, function(err) {

					})

					break;
				}
				default:

					break;
			}
		}
	}

	$scope.commit = function() {
		window.history.back();
	}

})