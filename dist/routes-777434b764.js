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
			css: ["css/common-3d9444602b.css"],
			resolve: {
      	loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
      		console.log('load');
        	return $ocLazyLoad.load(['src/login/loginService-4017bed5ee.js'])
      	}],
     	}
		})

		// .state("tabs.login", {
		// 	url: "/login",
		// 	templateUrl: "src/login/login.html",
		// 	resolve: {
  //     	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
  //       	return $ocLazyLoad.load(['src/login/loginCtl-2bd56b17bb.js', 'src/login/login-775ad513a2.css'])
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
        	return $ocLazyLoad.load(['src/home/homeCtl-3d14d0557b.js', 'src/home/home-ecbc97ad8b.css'])
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
        		files: ['src/meet/meetService-fcf99b94c7.js', 'src/login/registerService-5ad5b1604a.js', 'src/meet/meetDetail-8447ea4853.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetDetailCtl-0357cbfab1.js')
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
        		files: ['src/meet/meetService-fcf99b94c7.js', 'src/meet/meet-34aab28965.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetCtl-1615d967ea.js')
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
        		files: ['src/meet/meetService-fcf99b94c7.js', 'src/login/registerService-5ad5b1604a.js', 'src/meet/meetDetail-8447ea4853.css']
        	}).then( function() {
        		return $ocLazyLoad.load('src/meet/meetDetailCtl-0357cbfab1.js')
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
        		files: ['src/city/cityService-9d56858094.js', 'src/city/city-7f2a6a4466.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/city/cityCtl-c487c42c2a.js')
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
        		files: ['src/search/searchService-8cdc8b3bdc.js', 'src/search/search-9da17a5417.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/search/searchCtl-80429ed086.js')
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
        		files: ['src/search/searchService-8cdc8b3bdc.js', 'src/search/search-9da17a5417.css']
        	}).then( function() {
						return $ocLazyLoad.load('src/search/searchCtl-80429ed086.js')
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
		// 			css: "src/screen/screen-6726dfc3b8.css"
		// 		}
		// 	},
		// 	resolve: {
  //     	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
  //       	return $ocLazyLoad.load('src/screen/screenCtl-8739bc3b0d.js')
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
        	return $ocLazyLoad.load('src/news/newsService-3079a1b0e5.js').then( function() {
        		return $ocLazyLoad.load(['src/news/newsCtl-b4d5cc100b.js', 'src/news/news-3f00ecdb65.css']);
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
        	return $ocLazyLoad.load('src/news/newsService-3079a1b0e5.js').then( function() {
        		return $ocLazyLoad.load(['src/news/newsDetailCtl-a44001c450.js', 'src/news/newsDetail-03179c0d43.css']);
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
					return $ocLazyLoad.load('src/find/findService-4b3b8bb581.js').then(function() {
						return $ocLazyLoad.load(['src/find/findCtl-7c4f1aff90.js', 'src/find/find-5ad178d52d.css'])
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
					return $ocLazyLoad.load('src/find/detail/findDetailService-450c7fa02a.js').then(function() {
						return $ocLazyLoad.load(['src/find/detail/findDetailCtl-ac3a5621e0.js', 'src/find/detail/findDetail-5fd75a74ab.css'])
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
					return $ocLazyLoad.load('src/find/message/findMessageService-44c86c0968.js').then(function(AuthService) {
						return $ocLazyLoad.load(['src/find/message/findMessageCtl-6a743e4540.js', 'src/find/message/findMessage-91d15e987b.css'])
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
					return $ocLazyLoad.load('src/find/publish/findPublishService-8ac16e88b5.js').then(function() {
						return $ocLazyLoad.load(['src/find/publish/findPublishCtl-02893fc98b.js', 'src/find/publish/findPublish-c35d913542.css'])
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
        	return $ocLazyLoad.load(['src/mine/mineCtl-b25de5822b.js', 'src/mine/mine-281324bdfb.css'])
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
					return $ocLazyLoad.load(['src/mine/userInfoCtl-806f2e50db.js', 'src/mine/userInfo-775ff0e2cd.css'])
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
					return $ocLazyLoad.load(['src/mine/myPublish/myPublishMeetService-46dc8c06b9.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myPublish/myPublishMeetCtl-7b903724dc.js', 'src/mine/myPublish/myPublishMeet-d41d8cd98f.css'])
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
					return $ocLazyLoad.load(['src/mine/myFavor/myFavorMeetService-0f3204b9ff.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myFavor/myFavorMeetCtl-f0826de577.js', 'src/mine/myFavor/myFavorMeet-d41d8cd98f.css'])
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
					return $ocLazyLoad.load(['src/mine/myApply/myApplyMeetService-c7ee497b5a.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myApply/myApplyMeetCtl-286da4b62a.js', 'src/mine/myApply/myApplyMeet-8288e77019.css'])
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
					return $ocLazyLoad.load(['src/mine/about/aboutCtl-6d19469490.js', 'src/mine/about/about-f2770dc6cc.css']);
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
      		return $ocLazyLoad.load('src/login/loginService-4017bed5ee.js').then(function() {
						return $ocLazyLoad.load(['src/login/loginCtl-2bd56b17bb.js', 'src/login/login-775ad513a2.css'])
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
					return $ocLazyLoad.load('src/login/registerService-5ad5b1604a.js').then(function() {
						return $ocLazyLoad.load(['src/login/registerCtl-cd09a82110.js', 'src/login/register-bf859906a8.css'])
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
					return $ocLazyLoad.load(['src/mine/myOrder/myOrderService-735ca40913.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myOrder/myOrderCtl-ee41ec85ed.js', 'src/mine/myOrder/myOrder-0441a06557.css'])
					})
				}]
			}
		})

		$urlRouterProvider.otherwise("/home")
})




