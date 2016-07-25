angular.module('Weixin', [])

.constant('WxConstant', {
	'Appid': 'wx9a2d4679eed0ae8b',
	'url': 'http://www.51banhui.com/webapp/index.html',
	'wxConfigUrl': 'http://www.51banhui.com/wap/index/getpackage',
	'wxUserInfoUrl': "http://www.51banhui.com/wap/user/index"
})

.constant('BaiduConstant', {
	'Appid': '8169585',
	'Apikey': 'ljNzZIS8iiBzuggRfonviShj',
	'Secretkey': '7F0ibLsXcsgx23kvPK3O8NyGWWUENsz2',
	'Ak': '978ae7c0223b393d592b23ffa9e7a8ed'
})

.service('WeixinService', function(WxConstant, $http, $window, $location, $q, $rootScope, $ionicPopup, BaiduConstant, Locals, webRequest) {
	var isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;

	var getNonceStr = function() {
		return Math.random().toString(36).substr(2, 15)
	}

	var getTimeStamp = function() {
		return parseInt(new Date().getTime() / 1000)
	}

	var createSignature = function(ticket, nonceStr, timeStamp, url) {

		var str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr +
							'&timestamp=' + timeStamp + '&url=' + url;
		var shaObj = new jsSHA(str, 'TEXT')
		return shaObj.getHash('SHA-1', 'HEX')
	}

	var getJssdkPackage = function() {
		var deferred = $q.defer();
		$http.get(WxConstant.wxConfigUrl, {'Content-Type' : 'application/json'}).success( function(data) {
			deferred.resolve(data);
			console.log(data);
		}).error(function(data) {
			deferred.reject(data);
		})
		return deferred.promise
	}

	var getWxUserInfo = function(access_token, openid) {
		var deferred = $q.defer();

		$http.get((WxConstant.wxUserInfoUrl + "?access_token=" + access_token + "&openid=" + openid), 
			{'Content-Type' : 'application/json'}).success( function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		})
		return deferred.promise
	}

	var getWxAccessToken = function(code) {
		var deferred = $q.defer();

		$http.get((WxConstant.wxUserInfoUrl + "?code=" + code), {'Content-Type' : 'application/json'}).success( function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		})
		return deferred.promise
	}

	window.renderReverse = function(data) {
		console.log(data);
		var city = data.result.addressComponent;
		if (city) {
			Locals.setObject("cityPosObj", city);
		}
	}

	var getCityName = function(latitude, longitude) {
		var deferred = $q.defer();

		var url = 'http://api.map.baidu.com/geocoder/v2/?ak=' + BaiduConstant.Ak +
				'&location=' + latitude + ',' + longitude + '&output=json&pois=1'
		webRequest.getServiceDataWithJsonp(url).then(function(data) {
			deferred.resolve(data.result.addressComponent);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
		// $http.jsonp(url, {'Content-Type' : 'application/json'});
	}

	return {
		isWeixin: isWeixin,
		getLoginCode: function() {
			var code = ""
			var reg = /(\w+)=(\w+)/ig
			var params = {}
			$location.absUrl().replace(reg, function(a, b, c){ params[b] = c; });

			console.log("url params:", params);
			// alert("params: ", params, ", code: ", code);
			// alert("code: ", code);
			// alert($location.absUrl());
			if("code" in params) {
				// code = $window.location.search.substr(6).split("&")[0]
				code = params.code;
			}
			return code;
		},
		wxLogin: function(redirect_uri) {
			if (isWeixin){
				$window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
				"&redirect_uri=" + encodeURIComponent(redirect_uri) + 
				 	"&response_type=code&scope=snsapi_userinfo&&state=123#wechat_redirect"
				// $window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize" + 
				// 	"?appid=" + WxConstant.Appid + "&redirect_uri=http://www.51banhui.com/webapp/index.html" + 
				// 	"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
			}
		},
		getNonceStr: getNonceStr,
		getTimeStamp: getTimeStamp,
		createSignature: createSignature,
		getWxAccessToken: getWxAccessToken,
		getWxUserInfo: getWxUserInfo,
		config: function() {
			var timeStamp = getTimeStamp()
			var nonceStr = getNonceStr()
			var url = location.href.split('#')[0];

			getJssdkPackage().then( function(data) {
				var signature = createSignature(data.jsapiTicket, nonceStr, timeStamp, url)
				var appId = data.appId;
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    			appId: appId, // 必填，公众号的唯一标识
    			timestamp: timeStamp, // 必填，生成签名的时间戳
    			nonceStr: nonceStr, // 必填，生成签名的随机串
    			signature: signature,// 必填，签名，见附录1
    			jsApiList: [
    				'onMenuShareTimeline',
    				'onMenuShareAppMessage',
    				'onMenuShareQQ',
    				'onMenuShareWeibo',
    				'onMenuShareQZone',
    				'getLocation'
    			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				})
			})
		},
		getLocation: function() {
			var deferred = $q.defer();
			wx.ready(function () {
				wx.getLocation({
    			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    			success: function (res) {
        		var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        		var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        		var speed = res.speed; // 速度，以米/每秒计
        		var accuracy = res.accuracy; // 位置精度


						getCityName(latitude, longitude).then(function(data) {
							deferred.resolve(data);
						}, function(err) {
							deferred.reject(err);
						})
   				},
   				cancel: function (res) {
        		$ionicPopup.alert({
							title: '获取地理位置',
							template: '用户拒绝授权获取地理位置' + res,
							okText: '关闭'
						})
						deferred.reject(res);
   				}
				})
			})
			return deferred.promise;
		},
	}
})

.service('WxShare', function($ionicActionSheet, $ionicPopup) {

	var isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;

	var wxShare = function(title, desc, thumb, url) {
		wx.onMenuShareTimeline({
    	title: title, // 分享标题
    	link: url, // 分享链接
    	imgUrl: thumb, // 分享图标
    	success: function () { 
        // 用户确认分享后执行的回调函数
    	},
    	cancel: function () { 
        // 用户取消分享后执行的回调函数
    	}
		});

		wx.onMenuShareAppMessage({
    	title: title, // 分享标题
    	desc: desc, // 分享描述
    	link: url, // 分享链接
    	imgUrl: thumb, // 分享图标
    	success: function () { 
    	    // 用户确认分享后执行的回调函数
    	},
    	cancel: function () { 
    	    // 用户取消分享后执行的回调函数
    	}
		});

		wx.onMenuShareQQ({
    	title: title, // 分享标题
    	desc: desc, // 分享描述
    	link: url, // 分享链接
    	imgUrl: thumb, // 分享图标
    	success: function () { 
    	   // 用户确认分享后执行的回调函数
    	},
    	cancel: function () { 
    	   // 用户取消分享后执行的回调函数
    	}
		});

		wx.onMenuShareWeibo({
    	title: title, // 分享标题
    	desc: desc, // 分享描述
    	link: url, // 分享链接
    	imgUrl: thumb, // 分享图标
    	success: function () { 
    	   // 用户确认分享后执行的回调函数
    	},
    	cancel: function () { 
    	    // 用户取消分享后执行的回调函数
    	}
		});

		wx.onMenuShareQZone({
    	title: title, // 分享标题
    	desc: desc, // 分享描述
    	link: url, // 分享链接
    	imgUrl: thumb, // 分享图标
    	success: function () { 
    	   // 用户确认分享后执行的回调函数
    	},
    	cancel: function () { 
    	    // 用户取消分享后执行的回调函数
    	}
		});

	}

	var share = function(title, desc, thumb, url) {
		console.log(title, desc, thumb, url)
		$ionicActionSheet.show({
			buttons: [
				{ text: '<b>分享至微信朋友圈</b>' },
				{ text: '分享给微信好友' }
			],
			titleText: '分享',
			cancelText: '取消',
			cancel: function() {

			},
			buttonClicked: function(index) {
				switch(index) {
					case 0: {
						shareViaWechat(Wechat.Scene.TIMELINE, title, desc, url, thumb);
						break;
					}
					case 1: {
						shareViaWechat(Wechat.Scene.SESSION, title, url, thumb);
						break;
					}
				}
				return true
			}
		})
	}

	var shareViaWechat = function(scene, title, desc, url, thumb) {
		
		var params = {
			scene: scene
		}

		params.message = {
			title: title ? title : "没有标题",
			description: desc ? desc : "没有描述信息",
			messageExt: "蟠桃会",
			messageAction: "<action>dotalist</action>",
			media : { 
				type: Wechat.Type.WEBPAGE,
				image: thumb ? "http://183.245.210.26:8080/" + thumb : null,
				webpageUrl: url ? "http://183.245.210.26:8080/#" + url : "#" 
			}
		}

		Wechat.share(params, function() {
			$ionicPopup.alert({
				title: '分享成功',
				template: '感谢您的支持！',
				okText: '关闭'
			});
		}, function(reason) {
			$ionicPopup.alert({
				title: '分享失败',
				template: '错误原因' + reason,
				okText: '确定'
			})
		})
	}

	return {
		share: share,
		wxShare: wxShare
	}
})
