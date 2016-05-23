angular.module("Login", [])

.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

.service('AuthService', function ($http, $q, webRequest, Locals, WeixinService) {

	var userInfo
	var isLogin = false;


	return {
		autoWechatLogin: function() {
			var deferred = $q.defer();
			var promise = deferred.promise;

			var code = WeixinService.getLoginCode()
			if (code != "") {
				WeixinService.getWxUserInfo(code).then( function(data) {
					userInfo = data;
					isLogin = true
					console.log(data);
					deferred.resolve(data)
				}, function(data) {
					deferred.reject(data)
					isLogin = false
				})
				return promise;
			}
		},
		wechatLogin: function() {
			var deferred = $q.defer();
			var promise = deferred.promise;

			Wechat.auth("snsapi_userinfo", function (response) {
				webRequest.getWechatUserInfo(response.code).then( function(data) {
					userInfo = data;
					isLogin = true
					deferred.resolve(data)
				}, function(data) {
					deferred.reject(data)
					isLogin = false
				})
			}, function (reason) {
				deferred.reject(reason)
				isLogin = false
			})
			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}
			return promise;
		},
		setUserInfo: function(data) {
			userInfo = data;
		},
		getUserInfo: function() {
			return userInfo
		},
		isLogin: function() {
			return isLogin
		}
	}
})