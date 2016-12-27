angular.module('Routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
	
	// $ionicConfigProvider.templates.maxPrefetch(0);
	$ionicConfigProvider.views.swipeBackEnabled(true);
	$locationProvider.html5Mode( true ).hashPre;
	$ionicConfigProvider.tabs.style("standard");

	$stateProvider
		.state("tabs", {
			abstract: true,
			templateUrl: "templates/tabs.html",
			css: ["css/common.css"],
			resolve: {
      	loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
      		console.log('load');
        	return $ocLazyLoad.load(['src/login/loginService.js'])
      	}],
     	}
		})

		// .state("tabs.login", {
		// 	url: "/login",
		// 	templateUrl: "src/login/login.html",
		// 	resolve: {
  //     	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
  //       	return $ocLazyLoad.load(['src/login/loginCtl.js', 'src/login/login.css'])
  //     	}]
  //   	}
		// })

		.state("tabs.home", {
			url: "/home",
			views: {
				"home-tab": {
					templateUrl: "src/home/home.html",
					controller: "HomeCtl"
				}
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load(['src/home/homeCtl.js', 'src/home/home.css'])
      	}]
    	}
		})

		.state("tabs.home-meetDetail", {
			url: "/hot-meet-detail?=:id",
			cache: 'false',
			views: {
				"home-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/meet/meetService.js', 'src/login/registerService.js', 'src/meet/meetDetail.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetDetailCtl.js')
        	});
      	}]
    	}
		})

		.state("tabs.meet", {
			url: "/meet",
			cache: 'true',
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meet.html",
					controller: "MeetCtl",
				}
			},
			params: {
				cityname: "舟山市"
			},
			resolve: {

      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/meet/meetService.js', 'src/meet/meet.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetCtl.js')
        	});
      	}]
    	}
		})

		.state("tabs.meet-detail", {
			url: "/meet-detail?=:id",
			cache: 'false',
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/meet/meetService.js', 'src/login/registerService.js', 'src/meet/meetDetail.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetDetailCtl.js')
        	});
      	}]
    	}
		})

		.state("tabs.meet-citylist", {
			url: "/citylist",
			views: {
				"meet-tab": {
					templateUrl: "src/city/city.html",
					controller: "CityCtl"
				}
			},
			params: {
				posCity: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/city/cityService.js', 'src/city/city.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/city/cityCtl.js')
					})
				}]
			}
		})

		.state("tabs.meet-search", {
			url: "/meet-search",
			views: {
				"meet-tab": {
					templateUrl: "src/search/search.html",
					controller: "meetSearch"
				}
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/search/searchService.js', 'src/search/search.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/search/searchCtl.js')
					})
				}]
			}
		})

		.state("tabs.home-search", {
			url: "/home-search",
			views: {
				"home-tab": {
					templateUrl: "src/search/search.html",
					controller: "meetSearch"
				}
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
        		serie: true,
        		files: ['src/search/searchService.js', 'src/search/search.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/search/searchCtl.js')
					})
				}]
			}
		})

		// .state("tabs.meet-screen", {
		// 	url: "/meet/screen",
		// 	views: {
		// 		"meet-tab": {
		// 			templateUrl: "src/screen/screen.html",
		// 			controller: "ScreenCtl",
		// 			css: "src/screen/screen.css"
		// 		}
		// 	},
		// 	resolve: {
  //     	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
  //       	return $ocLazyLoad.load('src/screen/screenCtl.js')
  //     	}]
  //   	}
		// })

		.state("tabs.news", {
			url: "/news",
			cache: 'true',
			views: {
				"news-tab": {
					templateUrl: "src/news/news.html",
					controller: "NewsCtl"
				}
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/news/newsService.js').then( function() {
        		return $ocLazyLoad.load(['src/news/newsCtl.js', 'src/news/news.css']);
        	})
      	}]
    	}
		})

		.state("tabs.news-detail", {
			url: "/news-detail?=:id",
			cache: 'false',
			views: {
				"news-tab": {
					templateUrl: "src/news/newsDetail.html",
					controller: "NewsDetailCtl"
				}
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/news/newsService.js').then( function() {
        		return $ocLazyLoad.load(['src/news/newsDetailCtl.js', 'src/news/newsDetail.css']);
        	})
      	}]
    	}
		})

		.state("tabs.find", {
			url: "/find",
			views: {
				"find-tab": {
					templateUrl: "src/find/find.html",
					controller: "FindCtl"
				}
			},
			params: {

			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/find/findService.js').then(function() {
						return $ocLazyLoad.load(['src/find/findCtl.js', 'src/find/find.css'])
					})
				}]
			}
		})

		.state("tabs.find-detail", {
			url: "/find-detial?=:id",
			cache: false,
			views: {
				"find-tab": {
					templateUrl: "src/find/detail/findDetail.html",
					controller: "FindDetailCtl"
				}
			},
			params: {

			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/find/detail/findDetailService.js').then(function() {
						return $ocLazyLoad.load(['src/find/detail/findDetailCtl.js', 'src/find/detail/findDetail.css'])
					})
				}]
			}
		})

		.state("tabs.find-message", {
			url: "/find-message",
			views: {
				"find-tab": {
					templateUrl: "src/find/message/findMessage.html",
					controller: "FindMessageCtl"
				}
			},
			params: {

			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/find/message/findMessageService.js').then(function(AuthService) {
						return $ocLazyLoad.load(['src/find/message/findMessageCtl.js', 'src/find/message/findMessage.css'])
					})
				}]
			}
		})

		.state("tabs.find-publish", {
			url: "/find-publish",
			views: {
				"find-tab": {
					templateUrl: "src/find/publish/findPublish.html",
					controller: "FindPublishCtl"
				}
			},
			params: {

			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/find/publish/findPublishService.js').then(function() {
						return $ocLazyLoad.load(['src/find/publish/findPublishCtl.js', 'src/find/publish/findPublish.css'])
					})
				}]
			}
		})

		.state("tabs.mine", {
			url: "/mine",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/mine.html",
					controller: "MineCtl"
				}
			},
			params: {
				code: "",
				state: ""
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load(['src/mine/mineCtl.js', 'src/mine/mine.css'])
      	}]
    	}
		})

		.state("tabs.userInfo", {
			url: "/mine-userInfo",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/userInfo.html",
					controller: "UserInfoCtl"
				}
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/userInfoCtl.js', 'src/mine/userInfo.css'])
				}]
			}
		})

		.state("tabs.myPublishMeet", {
			url: "/mine-mypublishmeet",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/myPublish/myPublishMeet.html",
					controller: "myPublishMeetCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myPublish/myPublishMeetService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myPublish/myPublishMeetCtl.js', 'src/mine/myPublish/myPublishMeet.css'])
					})
				}]
			}
		})

		.state("tabs.myFavorMeet", {
			url: "/mine-myfavormeet",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/myFavor/myFavorMeet.html",
					controller: "myFavorMeetCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myFavor/myFavorMeetService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myFavor/myFavorMeetCtl.js', 'src/mine/myFavor/myFavorMeet.css'])
					})
				}]
			}
		})

		.state("tabs.myApplyMeet", {
			url: "/mine-myapplymeet",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/myApply/myApplyMeet.html",
					controller: "myApplyMeetCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myApply/myApplyMeetService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myApply/myApplyMeetCtl.js', 'src/mine/myApply/myApplyMeet.css'])
					})
				}]
			}
		})

		.state("tabs.about", {
			url: "/mine-about",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/about/about.html",
					controller: "aboutCtl"
				}
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/about/aboutCtl.js', 'src/mine/about/about.css']);
				}]
			}
		})

		.state("login", {
			url: "/login",
			// views: {
				// "mine-tab": {
					templateUrl: "src/login/login.html",
					controller: "LoginCtl",
				// }
			// },
			params: {
				fromState: "", // 来自哪个state
				fromUrl: "",
				toState: "",
				toUrl: "",
				redirectUri: "",
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
      		return $ocLazyLoad.load('src/login/loginService.js').then(function() {
						return $ocLazyLoad.load(['src/login/loginCtl.js', 'src/login/login.css'])
					})
      	}]
    	}
		})

		.state("register", {
			url: "/register",
			// views: {
			// 	"mine-tab": {
					templateUrl: "src/login/register.html",
					controller: "RegisterCtl",
			// 	}
			// },
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/login/registerService.js').then(function() {
						return $ocLazyLoad.load(['src/login/registerCtl.js', 'src/login/register.css'])
					})
				}]
			}
		})
		
		.state("order", {
			url: "/order?=:id",
			cache: false,
			templateUrl: "src/mine/myOrder/myOrder.html",
			controller: "myOrderCtl",
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myOrder/myOrderService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myOrder/myOrderCtl.js', 'src/mine/myOrder/myOrder.css'])
					})
				}]
			}
		})

		$urlRouterProvider.otherwise("/home")
})




