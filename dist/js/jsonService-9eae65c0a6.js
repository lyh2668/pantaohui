angular.module('JsonServices', [])

.constant('JSON_LOCAL_FILES', {
	PT_MEET_DETAIL: 'json/pt_meet.json',
	PT_MEET_DATA: 'json/pt_meet_data.json',
	PT_MEET_INDEX: 'json/pt_meet_index.json',
	PT_MEET_LIST: 'json/pt_meet_list.json',
	PT_NEWS_LIST: 'json/pt_news_list.json',
	PT_NEWS_DATA: 'json/pt_news_data.json',
	PT_CLASS: 'json/pt_class.json',
	PT_CLASS_1: 'json/pt_class_1.json',
	PT_CLASS_2: 'json/pt_class_2.json',
	PT_CLASS_3: 'json/pt_class_3.json'
})

.constant('SERVICE_API_URL', {
	COMMON_URL: 'http://www.51banhui.com',
	API_MEET_HOT_POINT: 'http://www.51banhui.com/api/meet/hot_point',
	API_MEET_HOT: 'http://www.51banhui.com/api/meet/meet_hot',
	API_MEET_GET_CLASS: 'http://www.51banhui.com/api/meet/get_class',
	// params:
	// meet_domain: 0-N 表示领域id
	// meet_stime: 0-N 表示时间id
	// meet_sort: 0-N 表示排序id
	// keyword: 关键字搜索
	API_MEET_LIST: 'http://www.51banhui.com/api/meet/meet_list',
	API_MEET_DETAIL: 'http://www.51banhui.com/api/meet/meet_detail',
	API_MEET_ENROLL: 'http://www.51banhui.com/api/meet/enroll',
	API_MEET_FAVOR: 'http://www.51banhui.com/api/meet/interest',
	API_MEET_ENROLL_PAY: 'http://www.51banhui.com/api/meet/enroll_pay',

	API_CITY_HOT: 'http://www.51banhui.com/api/city/get_hot_city',
	API_CITY_LIST: 'http://www.51banhui.com/api/city/get_city',

	API_NEWS_HOT: 'http://www.51banhui.com/api/news/news_hot',
	API_NEWS_LIST: 'http://www.51banhui.com/api/news/news_list',
	API_NEWS_DETAIL: 'http://www.51banhui.com/api/news/news_detail',

	API_FIND_LIST: 'http://www.51banhui.com/api/quan/find_list',
	API_FIND_DETAIL: 'http://www.51banhui.com/api/quan/find_detail',
	API_FIND_REPLY: 'http://www.51banhui.com/api/quan/comment',
	API_FIND_PUBLISH: 'http://www.51banhui.com/api/quan/publish',
	API_FIND_MESSAGE: 'http://www.51banhui.com/api/quan/message',

	// params: type: 0 表示注册, 1 表示绑定
	API_USER_REGISTER_GET_CODE : 'http://www.51banhui.com/api/user/get_mobile_code',
	API_USER_REGISTER_CHECK_CODE : 'http://www.51banhui.com/api/user/check_mobile_code',
	API_USER_REGISTER_CHECK_MOBILE : 'www.51banhui.com/api/user/check_mobile',
	API_USER_REGISTER : 'http://www.51banhui.com/api/user/regisiter',
	API_USER_LOGIN : 'http://www.51banhui.com/api/user/login',
	API_USER_LOGOUT : 'http://www.51banhui.com/api/user/logout',
	API_USER_AUTO_LOGIN : 'http://www.51banhui.com/api/user/auto_login',

	API_USER_GET_APPID: 'http://www.51banhui.com/api/user/get_appid',

	API_USER_CHECK_MEMBER: 'http://www.51banhui.com/api/user/is_member',
	API_USER_BIND_MEMBER: 'http://www.51banhui.com/api/user/member_bind',

	API_COMMON_THUMB_TO_SRC: 'http://www.51banhui.com/api/news/thumbnum2src',

	API_WECHAT_PAY: 'http://www.51banhui.com/api/wechat/pay',
	API_MINE_ORDER: 'http://www.51banhui.com/api/center/my_order',
	API_MINE_APPLY: 'http://www.51banhui.com/api/center/my_enroll'
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

.service('webRequest', function($http, $q, SERVICE_API_URL) {

	var getServiceData = function(SERVICE_API_URL, params) {
		var deferred = $q.defer();


		$http({method: 'GET', url: SERVICE_API_URL, params: params}).success( function(data) {
			console.log(data);
			deferred.resolve(data);
			
		}).error( function(data, status, header, config) {
			console.log("err: ", data);
			deferred.reject(data);
		})
		return deferred.promise;
	}

	var getServiceDataWithJsonp = function(SERVICE_API_URL, params, callbackFunc) {
		var deferred = $q.defer();
		// var url = SERVICE_API_URL + '?callback=JSON_CALLBACK';
		var url = SERVICE_API_URL;
		if(params) {
			params.callback = "JSON_CALLBACK";
		} else {
			params = {
				callback: "JSON_CALLBACK"
			}
		}

		console.log("url: ", url, "params: ", params);

		$http.jsonp(url, {params: params}).success( function(data) {
			if(data && 'errcode' in data) {
				if(data.errcode == 0) {
					deferred.resolve(data);
				} else {
					deferred.reject(data);
				}
			} else {
				console.log("success: ", data);
				deferred.resolve(data);
			}
			
		}).error( function(data, status, header, config) {
			console.log("err:", data);
			deferred.reject(data);
		})
		return deferred.promise;
	}

	var postServiceData = function(SERVICE_API_URL, params) {
		var deferred = $q.defer();

		console.log("params: ", params);

		$http({
      url: SERVICE_API_URL,
      method: "POST",
      data: params
    }).success( function(data) {
    	console.log(data);
    	if(data && 'errcode' in data && data.errcode == 0) {
    		deferred.resolve(data);
    	} else {
    		deferred.reject(data);
    	}
		}).error( function(data, status, header, config) {
			console.log("err:", data);
			deferred.reject(data);
		})
		return deferred.promise;
	}

	var getAppid = function() {
		var deferred = $q.defer();

		getServiceDataWithJsonp(SERVICE_API_URL.API_USER_GET_APPID).then(function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(data);
		})
		return deferred.promise;
	}

	return {
		getServiceData: getServiceData,
		getServiceDataWithJsonp: getServiceDataWithJsonp,
		postServiceData: postServiceData,
		getAppid: getAppid
	}
})

.service('commonRequest', function($http, $q, SERVICE_API_URL, webRequest) {
	var thumbToSrc = function(index, thumbId, thumbWidth, type) {
		var deferred = $q.defer();

		var params = {
			id: index,
			thumb: thumbId,
			width: thumbWidth
		}

		if(type && type == "jsonp") {
			webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_COMMON_THUMB_TO_SRC, params).then( function(data) {
				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			})
		} else {
			webRequest.getServiceData(SERVICE_API_URL.API_COMMON_THUMB_TO_SRC, params).then( function(data) {
				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			})
		}

		return deferred.promise;
	}

	return {
		thumbToSrc: thumbToSrc
	}
})