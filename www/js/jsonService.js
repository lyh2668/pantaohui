angular.module('JsonServices', [])

.constant('JSON_LOCAL_FILES', {
	PT_MEET_DETAIL: '/json/pt_meet.json',
	PT_MEET_DATA: '/json/pt_meet_data.json',
	PT_MEET_INDEX: 'json/pt_meet_index.json',
	PT_MEET_LIST: 'json/pt_meet_list.json',
	PT_NEWS_LIST: 'json/pt_news_list.json',
	PT_NEWS_DATA: 'json/pt_news_data.json'
})

.service('readJsonService', function($http, $q, JSON_LOCAL_FILES) {

	var getLocalJsonData = function(JSON_LOCAL_FILES) {
		var deferred = $q.defer(); // 声明延后执行， 表示要去监控后面的执行
		$http.get(JSON_LOCAL_FILES).success( function(data) {
			deferred.resolve(data); // 声明执行成功， 即http请求数据成功，可以返回数据了
			console.log(data);
			// return data;
		}).error( function(data, status, header, config) {
			deferred.reject(data); // 声明执行失败，即服务器返回错误
		})
		return deferred.promise; // 返回承诺，这里不是最终数据，而是访问最终数据的API
	};

	return {
		getLocalJsonData: getLocalJsonData
	};
})