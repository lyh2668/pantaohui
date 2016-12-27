angular.module('Login', [])

.service('registerService', function($q, webRequest, SERVICE_API_URL, Locals) {
	var getCode = function(mobile, type) {

		var deferred = $q.defer();

		var params = {
			username: mobile,
			type: type // 0 表示注册, 1 表示绑定
		}


		webRequest.postServiceData(SERVICE_API_URL.API_USER_REGISTER_GET_CODE, params).then( 
		function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var checkMobile = function(value) {
		var reg = /^0?1[3|4|5|8][0-9]\d{8}$/
		return reg.test(value);
	}

	var checkPwd = function(value) {
		var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-6])[!"#$%&'()*+,\-.:;<=>?@\[\\\]^_`{|}~A-Za-z0-9]{6,16}$/
		return reg.test(value);
	}

	var register = function(username, password, code) {
		var deferred = $q.defer();

		var appid = Locals.get('pantaohui_appid');

		var params = {
			appid: appid,
			username: username,
			password: password,
			code: code
		}

		webRequest.postServiceData(SERVICE_API_URL.API_USER_REGISTER, params).then( 
		function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	return {
		getCode: getCode,
		checkMobile: checkMobile,
		checkPwd: checkPwd,
		register: register
	}
})