angular.module('Weixin', [])

.constant('WxConstant', {
	'Appid': 'wx9a2d4679eed0ae8b',
	'AppSecret': 'd1d3713bfdd11b0a658c192d4594d1ad',
	'url': 'http://www.51banhui.com/webapp/index.html',
	'wxConfigUrl': 'http://www.51banhui.com/wap/index/getpackage',
	'wxUserInfoUrl': "http://www.51banhui.com/wap/user/index"
})

.service('WeixinService', function(WxConstant, $http, $window, $location, $q, $ionicPopup) {
	var code = ""

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

	var getWxUserInfo = function(code) {
		var deferred = $q.defer();

		$http.get((WxConstant.wxUserInfoUrl + "?code=" + code), {'Content-Type' : 'application/json'}).success( function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		})
		return deferred.promise
	}

	return {
		getLoginCode: function() {

			var isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;
			if($window.location.search) {
				code = $window.location.search.substr(6).split("&")[0]
			} else if (isWeixin){
				$window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
				"&redirect_uri=http://www.51banhui.com/webapp/index.html" + 
				 	"&response_type=code&scope=snsapi_userinfo&&state=123#wechat_redirect"
				// $window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize" + 
				// 	"?appid=" + WxConstant.Appid + "&redirect_uri=http://www.51banhui.com/webapp/index.html" + 
				// 	"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
			}
			return code;
		},
		getNonceStr: getNonceStr,
		getTimeStamp: getTimeStamp,
		createSignature: createSignature,
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
    				'onMenuShareAppMessage'
    			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				})
			})
		}
	}
})

.service('WxShare', function($ionicActionSheet, $ionicPopup) {
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

				if (typeof Wechat === "undefined") {
					console.log('Wechat is undefined.')
					var wxTtitle = title ? title: "蟠桃会"
					var wxLink = url ? "http://183.245.210.26:8080/#" + url : "#" 
					var wxImgUrl = thumb ? "http://183.245.210.26:8080/" + thumb : null
					var wxDesc = desc ? desc : "没有描述信息"
					switch(index) {
						case 0: {
							console.log("onMenuShareTimeline");
							wx.ready(function () {
								console.log("ready");
								wx.onMenuShareTimeline({
									title: wxTtitle,
									link: wxLink,
									imgUrl: wxImgUrl,
									success: function() {

									},
									cancel: function() {

									}
									// fail: function(res) {

									// }
								})
								wx.error(function(res){
            			$ionicPopup.alert({
										title: '分享失败',
										template: 'res',
										okText: '关闭'
									})
								})
							})
							break;
						}
						case 1: {
							console.log("onMenuShareAppMessage")
							wx.onMenuShareAppMessage({
								title: wxTtitle,
								desc: wxDesc,
								link: wxLink,
								imgUrl: wxImgUrl,
								success: function() {

								},
								cancel: function() {

								}
							})
							break;
						}
					}
				}
				else {
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
		share: share
	}
})
