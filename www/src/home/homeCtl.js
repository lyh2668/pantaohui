angular.module('Home', [])

.controller('HomeCtl', function($scope, readJsonService, JSON_LOCAL_FILES) {
	$scope.myActiveSlide = 1;

	readJsonService.getLocalJsonData(JSON_LOCAL_FILES.PT_MEET_INDEX).then( function(data) {
		$scope.jsonDatas = data;
	}, function(data) {
		$scope.jsonDatas = data;
	})
})