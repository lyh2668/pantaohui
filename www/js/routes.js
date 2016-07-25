angular.module('Routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
	
	// $ionicConfigProvider.templates.maxPrefetch(0);
	$ionicConfigProvider.views.swipeBackEnabled(true);
	// $locationProvider.html5Mode(true);
	$ionicConfigProvider.views.swipeBackEnabled(true);
	$ionicConfigProvider.tabs.style("standard");

	$stateProvider
		.state("tabs", {
			url: "/tab",
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
			url: "/home/meetDetail/:id",
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
			url: "/meet/detail/:id",
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
			url: "/meet/citylist",
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
			url: "/meet/search",
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
			url: "/home/search",
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

		.state("tabs.meet-screen", {
			url: "/meet/screen",
			views: {
				"meet-tab": {
					templateUrl: "src/screen/screen.html",
					controller: "ScreenCtl",
					css: "src/screen/screen.css"
				}
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/screen/screenCtl.js')
      	}]
    	}
		})

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
			url: "/news/detail/:id",
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

		.state("tabs.login", {
			url: "/mine/login",
			views: {
				"mine-tab": {
					templateUrl: "src/login/login.html",
					controller: "LoginCtl"
				}
			},
			resolve: {
      	loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load(['src/login/loginCtl.js', 'src/login/login.css'])
      	}]
    	}
		})

		.state("tabs.register", {
			url: "/login/register",
			views: {
				"mine-tab": {
					templateUrl: "src/login/register.html",
					controller: "RegisterCtl"
				}
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/login/registerService.js').then(function() {
						return $ocLazyLoad.load(['src/login/registerCtl.js', 'src/login/register.css'])
					})
				}]
			}
		})

		.state("tabs.userInfo", {
			url: "/mine/userInfo",
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
			url: "/mine/myPublishMeet",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/myPublishMeet.html",
					controller: "myPublishMeetCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myPublishMeetService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myPublishMeetCtl.js', 'src/mine/myPublishMeet.css'])
					})
				}]
			}
		})

		.state("tabs.myFavorMeet", {
			url: "/mine/myFavorMeet",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/myFavorMeet.html",
					controller: "myFavorMeetCtl"
				}
			},
			params: {
				uid: null
			},
			resolve: {
				loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load(['src/mine/myFavorMeetService.js']).then(function() {
						return $ocLazyLoad.load(['src/mine/myFavorMeetCtl.js', 'src/mine/myFavorMeet.css'])
					})
				}]
			}
		})

		.state("tabs.about", {
			url: "/mine/about",
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

		

		$urlRouterProvider.otherwise("/tab/home")
})