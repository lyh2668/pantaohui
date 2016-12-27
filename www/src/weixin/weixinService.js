angular.module('Weixin', [])

.constant('WxConstant', {
	'Appid': 'wx84a7ab88e23e569c',
	'wxConfigUrl': 'http://www.51banhui.com/wap/index/getpackage',
	'wxUserInfoUrl': "http://www.51banhui.com/wap/user/index"
})

.constant('BaiduConstant', {
	'Ak': '978ae7c0223b393d592b23ffa9e7a8ed'
})

.service('weixinConfig', function(WxConstant, $q, $http, $ionicPopup) {

	var timestamp;
  var nonceStr;
  var signature;
  var appid;

  var setTimestamp = function(value) {
  	timestamp = value;
  }

  var setNonceStr = function(value) {
  	nonceStr = value;
  }

  var setSignatur = function(value) {
  	signature = value;
  }

  var setAppid = function(value) {
  	appid = value;
  }

	var getNonceStr = function() {
		return nonceStr;
	}

	var getTimestamp = function() {
		return timestamp;
	}

	var getSignature = function() {
		return signature;
	}

	var getAppid = function() {
		return appid;
	}

	var createTimestamp = function() {
		timestamp = parseInt(new Date().getTime() / 1000);
		return timestamp;
	}

	var createNonceStr = function() {
		nonceStr = Math.random().toString(36).substr(2, 15);
		return nonceStr;
	}

	var createSignature = function(ticket, nonceStr, timestamp, url) {

		var str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr +
							'&timestamp=' + timestamp + '&url=' + url;
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

	return {
		getNonceStr: getNonceStr,
		getTimestamp: getTimestamp,
		getSignature: getSignature,
		getAppid: getAppid,
		createTimestamp: createTimestamp,
		createNonceStr: createNonceStr,
		createSignature: createSignature,
		config: function() {
			var timestamp = createTimestamp();
			var nonceStr = createNonceStr();
			var url = location.href.split('#')[0];
			// url = url.split('?')[0];
			// alert(url);
			console.log("sdk配置URL：", url);

			getJssdkPackage().then( function(data) {

				var signature = createSignature(data.jsapiTicket, nonceStr, timestamp, url)
				var appId = data.appId;

				setAppid(appId);

				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    			appId: appId, // 必填，公众号的唯一标识
    			timestamp: timestamp, // 必填，生成签名的时间戳
    			nonceStr: nonceStr, // 必填，生成签名的随机串
    			signature: signature,// 必填，签名，见附录1
    			jsApiList: [
    				'onMenuShareTimeline',
    				'onMenuShareAppMessage',
    				'onMenuShareQQ',
    				'onMenuShareWeibo',
    				'onMenuShareQZone',
    				'getLocation',
    				'chooseImage',
    				'previewImage',
    				'uploadImage',
    				'downloadImage',
    				'chooseWXPay'
    			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				})

				wx.error(function(res) {
					console.debug(res);

					$ionicPopup.alert({
						title: '微信SDK配置失败，请重新打开APP' + JSON.stringify(res)
					})
				})
			})
		}
	}
})

.service('WeixinService', function(WxConstant, $http, $window, $location, $q, $rootScope, $ionicPopup, BaiduConstant, Locals, webRequest) {
	var isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;

	var wechatOpenid;
	
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
			// var code = ""
			// var reg = /(\w+)=(\w+)/ig
			// var params = {}
			// var url = $location.absUrl();

			// // alert(url);
			// $location.absUrl().replace(reg, function(a, b, c){ params[b] = c; });

			// console.log($location);
			// console.debug($location.search().code);
			// if("code" in params) {
				
			// 	code = params.code;
			// }
			return $location.search().code;
		},
		wxLogin: function(redirect_uri, wxScope, state) {

			// alert(redirect_uri);
			if(!wxScope) {
				wxScope = "snsapi_userinfo";
			} 

			if(!state) {
				state = "0";
			}
			
			$window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
			"&redirect_uri=" + encodeURIComponent(redirect_uri) + 
			 	"&response_type=code&scope=" + wxScope + "&state=" + state + "#wechat_redirect"
		},		
		getWxAccessToken: getWxAccessToken,
		getWxUserInfo: getWxUserInfo,	
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
		getCode: function(redirect_uri, wxScope, state) {
			if("code" in $location.search()) {
				return $location.search().code;
			} else {
				if(!redirect_uri) {
					redirect_uri = $location.absUrl();
				}

				if(!wxScope) {
					wxScope = "snsapi_base";
				} 

				if(!state) {
					state = "1";
				}
				
				$location.path("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
				"&redirect_uri=" + encodeURIComponent(redirect_uri) + 
				 	"&response_type=code&scope=" + wxScope + "&state=" + state + "#wechat_redirect");

				// $window.location.replace = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
				// "&redirect_uri=" + encodeURIComponent(redirect_uri) + 
				//  	"&response_type=code&scope=" + wxScope + "&state=" + state + "#wechat_redirect";
			}
		},
		getOpenid: function(code) {
			getWxAccessToken(code).then(function(data) {
				wechatOpenid = data.openid;
				console.debug("openid: ", wechatOpenid);
			})
		},
		wechatOpenid: wechatOpenid
	}
})

.service('WxImage', function($rootScope, $q) {

	var imageIds = [];

	var wxSyncUpload = function(localIds) {
		var deferred = $q.defer();
		var serverIds = [];
		var tmpImageIds = localIds.slice(0);
		
		var syncUpload = function(tmpImageIds){
  		var localId = tmpImageIds.pop();
  		wx.uploadImage({
  	  	localId: localId,
  	  	isShowProgressTips: 0,
  	  	success: function (res) {
  	  		var serverId = res.serverId; // 返回图片的服务器端ID
  	  		serverIds.unshift(serverId);
	
  	  		//其他对serverId做处理的代码
  	  		if(tmpImageIds.length > 0) {
  	    		syncUpload(tmpImageIds);
  	  		} else {
  	  			deferred.resolve(serverIds);
  	  		}
  	  	}
  		});
		};

		syncUpload(localIds);

		return deferred.promise;
	}

	var wxChooseImage = function(cnt) {

		var deferred = $q.defer();

		wx.ready(function() {
			wx.chooseImage({
    		count: cnt, // 默认9
    		// sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    		// sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    		success: function (res) {
    		  var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    		  // imageIds = localIds.slice(0);
    		  deferred.resolve(localIds);

    	// 	  setTimeout( function() {
    	// 	  	syncUpload(localIds);
					// }, 100)
    		}
			});
		})

		return deferred.promise;
	}

	var wxPreviewImage = function(current, urls) {
		wx.ready(function() {
			wx.previewImage({
				current: current, // 当前显示图片的http链接
    		urls: urls // 需要预览的图片http链接列表
			})
		})
	}


	return {
		wxChooseImage: wxChooseImage,
		wxPreviewImage: wxPreviewImage,
		wxSyncUpload: wxSyncUpload
	}
})

.service('WxPay', function($q, webRequest, SERVICE_API_URL, $window, $location, $cookies, $state) {

	var wxPay = function(id, type) {
		// var deferred = $q.defer();

		var params = {
			id: id
		}

		console.debug($location.absUrl());
		var href = SERVICE_API_URL.API_WECHAT_PAY + "?id=" + params.id + "&redirect_uri=" + 
			encodeURIComponent("http://www.51banhui.com/webapp/mine");
		$window.location.href = href;
	}

	var getCode = function(redirect_uri, wxScope, state, $rootScope, $timeout) {
		if(!redirect_uri) {
			redirect_uri = $location.absUrl();
		}

		if(!wxScope) {
			wxScope = "snsapi_base";
		} 

		if(!state) {
			state = "10";
		}
		
		var href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WxConstant.Appid +
		"&redirect_uri=" + encodeURIComponent(redirect_uri) + 
		 	"&response_type=code&scope=" + wxScope + "&state=" + state + "#wechat_redirect";

		$window.location.href = href;
	}

	var getPayConfig = function() {

		var datas = $cookies.getObject('weipaydata');

		console.log("getPayConfig datas: ", datas);

		if(datas) {
			wx.ready(function() {
				wx.chooseWXPay({
    			timestamp: datas.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    			nonceStr: datas.nonceStr, // 支付签名随机串，不长于 32 位
    			package: datas.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    			signType: datas.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    			paySign: datas.paySign, // 支付签名
    			success: function (res) {
    	    	// 支付成功后的回调函数
    	    	$rootScope.$broadcast('notice:show', "支付成功");
    	    	$state.go('tabs.mine');

    	    	$timeout(function() {
    	    		$rootScope.$broadcast('notice:hide');
    	    	}, 1288);
    			}
				});
				
			})
		}
	}

	return {
		wxPay: wxPay,
		getPayConfig: getPayConfig
	}

})

.service('WxShare', function($ionicActionSheet, $ionicPopup, weixinConfig) {

	var isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;
	var isQQ = navigator.userAgent.toLowerCase().match(/QQ/i) == "qq";
	// alert(isWeixin);

	var share = function(title, desc, thumb, url) {
		if(isWeixin) {
			wxShare(title, desc, thumb, url);
		} else if(isQQ) {
			qqShare(title, desc, thumb, url);
		} 
	}

	var qqShare = function(title, desc, thumb, url) {

		var signature = weixinConfig.createSignature();

		setShareInfo({
      title:          title,
      summary:        desc,
      pic:            thumb,
      url:            url,
      WXconfig:       { //如果想微信里分享必选加，否之可去掉
         swapTitleInWX: true,
         appId : weixinConfig.getAppid(),
         timestamp : weixinConfig.getTimestamp(),
         nonceStr : weixinConfig.getNonceStr(),
         signature : signature
      }
    });
	}


	var wxShare = function(title, desc, thumb, url) {
		wx.ready(function() {
			// alert(url);
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
		})
	}
	
	// var share = function(title, desc, thumb, url) {
	// 	console.log(title, desc, thumb, url)
	// 	$ionicActionSheet.show({
	// 		buttons: [
	// 			{ text: '<b>分享至微信朋友圈</b>' },
	// 			{ text: '分享给微信好友' }
	// 		],
	// 		titleText: '分享',
	// 		cancelText: '取消',
	// 		cancel: function() {

	// 		},
	// 		buttonClicked: function(index) {
	// 			switch(index) {
	// 				case 0: {
	// 					shareViaWechat(Wechat.Scene.TIMELINE, title, desc, url, thumb);
	// 					break;
	// 				}
	// 				case 1: {
	// 					shareViaWechat(Wechat.Scene.SESSION, title, url, thumb);
	// 					break;
	// 				}
	// 			}
	// 			return true
	// 		}
	// 	})
	// }

	// var shareViaWechat = function(scene, title, desc, url, thumb) {
		
	// 	var params = {
	// 		scene: scene
	// 	}

	// 	params.message = {
	// 		title: title ? title : "没有标题",
	// 		description: desc ? desc : "没有描述信息",
	// 		messageExt: "蟠桃会",
	// 		messageAction: "<action>dotalist</action>",
	// 		media : { 
	// 			type: Wechat.Type.WEBPAGE,
	// 			image: thumb ? "http://183.245.210.26:8080/" + thumb : null,
	// 			webpageUrl: url ? "http://183.245.210.26:8080/#" + url : "#" 
	// 		}
	// 	}

	// 	Wechat.share(params, function() {
	// 		$ionicPopup.alert({
	// 			title: '分享成功',
	// 			template: '感谢您的支持！',
	// 			okText: '关闭'
	// 		});
	// 	}, function(reason) {
	// 		$ionicPopup.alert({
	// 			title: '分享失败',
	// 			template: '错误原因' + reason,
	// 			okText: '确定'
	// 		})
	// 	})
	// }

	return {
		share: share,
		wxShare: wxShare
	}
})
