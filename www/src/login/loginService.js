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

.constant('WX_LOGIN_PARAMS', {
	wx_access_token: "wx_access_token",
	wx_openid: "wx_openid"
})

.service('AuthService', function ($http, $q, $timeout, $ionicPopup, $location, webRequest, Locals, WeixinService, WX_LOGIN_PARAMS, SERVICE_API_URL) {

	var wxUserInfo = null;
	var userInfo = null;
	var isLogin = false;
	var uid = "";



	var requestWxUserInfo = function() {
		var deferred = $q.defer();
		var promise = deferred.promise;
		
		var access_token = Locals.get(WX_LOGIN_PARAMS.wx_access_token)
		var openid = Locals.get(WX_LOGIN_PARAMS.wx_openid);
		if (access_token && openid) {
			WeixinService.getWxUserInfo(access_token, openid).then( function(data) {
				

				if ("errcode" in data) {
					exitLogin() // 如果access_token请求不到用户数据，则退出登录状态
				} else {
					wxUserInfo = data;
					wxUserInfo.sex = !wxUserInfo.sex;
					isLogin = true
					console.log(data);
				}

				deferred.resolve(data)
			}, function(data) {
				deferred.reject(data)
				exitLogin();
			})
			return promise;
		}

		var code = WeixinService.getLoginCode()
		if (code != "") {
			WeixinService.getWxAccessToken(code).then( function(data) {
				if("errcode" in data) {
					deferred.reject(data);
				} else {
					Locals.set(WX_LOGIN_PARAMS.wx_access_token, data.access_token);
					Locals.set(WX_LOGIN_PARAMS.wx_openid, data.openid);
					WeixinService.getWxUserInfo(data.access_token, data.openid).then( function(data) {
	
						if ("errode" in data) {
							deferred.reject(data)
						} else {
							wxUserInfo = data;
							wxUserInfo.sex = !wxUserInfo.sex;
							isLogin = true
							console.log(data);
							deferred.resolve(data)
						}
					}, function(data) {
						deferred.reject(data)
						isLogin = false
					})
				}
			}, function(data) {
				deferred.reject(data)
				isLogin = false
			})
			return promise;
		}
		return promise;
	}

	var exitLogin = function() {
		Locals.remove(WX_LOGIN_PARAMS.wx_access_token);
		Locals.remove(WX_LOGIN_PARAMS.wx_openid);
		Locals.remove('pantaohui_token');
		isLogin = false
		wxUserInfo = null
		userInfo = null
	}

	var login = function(username, password, msg) {
		var deferred = $q.defer();

		var appid = Locals.get('pantaohui_appid');

		var params = {
			appid: appid,
			username: username,
			password: password
		}

		var popup1 = $ionicPopup.show({
					title: msg
				})

				$timeout(function() {
					popup1.close();
				}, 2500);

		webRequest.postServiceData(SERVICE_API_URL.API_USER_LOGIN, params).then( 
		function(data) {
			Locals.set("pantaohui_token", data.token);
			autoLogin().then(function(data) {
				popup1.close();
				var popup = $ionicPopup.show({
					title: '登录成功'
				})

				$timeout(function() {
					popup.close();

					deferred.resolve(data);
					
				}, 1500);

				
			}, function(err) {
				popup1.close();
				var popup = $ionicPopup.show({
					title: err.errmsg
				})

				$timeout(function() {
					popup1.close();
				}, 1500);

				deferred.reject(err);
			})
		}, function(err) {
			popup1.close();
			var popup = $ionicPopup.show({
					title: err.errmsg
				})

				$timeout(function() {
					popup.close();
				}, 1500);
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var autoLogin = function() {
		var deferred = $q.defer();
		var token = Locals.get("pantaohui_token");
		var appid = Locals.get('pantaohui_appid');

		if (token) {
			var params = {
				appid: appid,
				token: token
			}
			console.log("静默登录token: ", token);
			webRequest.postServiceData(SERVICE_API_URL.API_USER_AUTO_LOGIN, params).then( 
			function(data) {
				
				userInfo = data.userinfo;
				isLogin = true;
				uid = userInfo.uid;
				isCenterMember = true;

				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			})
		}
		return deferred.promise;
	}

	var isCenterMember = false;
	var checkWxIsMember = function() {
		var deferred = $q.defer();
		var appid = Locals.get('pantaohui_appid');

		if(appid && wxUserInfo) {
			var params = {
				appid: appid,
				userinfo: wxUserInfo
			}
			console.log("checkWxIsMember params:", params);

			webRequest.postServiceData(SERVICE_API_URL.API_USER_CHECK_MEMBER, params).then( function(data) {
				console.log("checkWxIsMember response:", data);
				isCenterMember = true;
				removeWxUserInfo();
				userInfo = data.userinfo;
				Locals.set('pantaohui_token', data.token);

				deferred.resolve(data);
			}, function(err) {
				isCenterMember = false;
				deferred.reject(err);
			})
		}

		return deferred.promise;
	}

	var bindWxMember = function(tel, code) {
		var deferred = $q.defer();
		var appid = Locals.get('pantaohui_appid');

		if(appid && wxUserInfo) {
			var params = {
				appid: appid,
				userinfo: wxUserInfo,
				mobile: tel,
				code: code
			}

			webRequest.postServiceData(SERVICE_API_URL.API_USER_BIND_MEMBER, params).then( function(data) {
				console.log("bindWxMember response: ", data);
				userInfo = data.userinfo;
				Locals.set('pantaohui_token', data.token);

				deferred.resolve(data);
			}, function(err) {

				deferred.reject(err);
			})
		}

		return deferred.promise;
	}

	var removeWxUserInfo = function() {
		Locals.remove(WX_LOGIN_PARAMS.wx_access_token);
		Locals.remove(WX_LOGIN_PARAMS.wx_openid);
		wxUserInfo = null;
	}

	// 自动获取用户信息
	if (!userInfo) {
		requestWxUserInfo().then(function(data) {
			checkWxIsMember();
		})
		autoLogin();
	}

	return {
		// autoWechatLogin: autoWechatLogin,
		requestWxUserInfo: requestWxUserInfo,
		exitLogin: exitLogin,
		wechatLogin: function(url) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			if(WeixinService.isWeixin) {
				WeixinService.wxLogin(url)
				// deferred.resolve("login in weixin.")
			} else {
				Wechat.auth("snsapi_userinfo", function (response) {
					webRequest.getWechatUserInfo(response.code).then( function(data) {
						wxUserInfo = data;
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
			}
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
		setWxUserInfo: function(data) {
			wxUserInfo = data;
		},
		getWxUserInfo: function() {
			return wxUserInfo;
		},
		setUserInfo: function(data) {
			userInfo = data;
		},
		getUserInfo: function() {
			return userInfo;
		},
		isLogin: function() {
			return isLogin
		},
		login: login,
		autoLogin: autoLogin,
		getUid: function() {
			return userInfo ? userInfo.uid : "0";
		},
		checkWxIsMember: checkWxIsMember,
		isMember: function() {
			return isCenterMember;
		},
		setMember: function(state) {
			isCenterMember = state;
		},
		bindWxMember: bindWxMember,
		setToken: function(token) {
			Locals.set("pantaohui_token", token);
		},
		removeWxUserInfo: removeWxUserInfo
	}
})