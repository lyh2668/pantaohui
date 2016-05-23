angular.module('Routes', [])

.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
		.state("tabs", {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html",
			resolve: {
				// loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
    //     	return $ocLazyLoad.load('js/jsonService.js')
    //   	}]
    //   	,
      	loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/login/loginService.js')
      	}]
     	}
		})

		.state("tabs.home", {
			url: "/home",
			views: {
				"home-tab": {
					templateUrl: "src/home/home.html",
					controller: "HomeCtl",
					css: "src/home/home.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/home/homeCtl.js')
      	}]
    	}
		})

		.state("tabs.home-meetDetail", {
			url: "/home/meetDetail/:id",
			views: {
				"home-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl",
					css: "src/meet/meetDetail.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/meet/meetDetailCtl.js')
      	}]
    	}
		})

		.state("tabs.meet", {
			url: "/meet",
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meet.html",
					controller: "MeetCtl",
					css: 'src/meet/meet.css'
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/meet/meetCtl.js')
      	}]
    	}
		})

		.state("tabs.meet-detail", {
			url: "/meet/detail/:id",
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl",
					css: "src/meet/meetDetail.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/meet/meetDetailCtl.js')
      	}]
    	}
		})

		.state("tabs.meet-citylist", {
			url: "/meet/citylist",
			views: {
				"meet-tab": {
					templateUrl: "src/city/city.html",
					controller: "CityCtl",
					css: "src/city/city.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/city/cityCtl.js')
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
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/screen/screenCtl.js')
      	}]
    	}
		})

		.state("tabs.news", {
			url: "/news",
			views: {
				"news-tab": {
					templateUrl: "src/news/news.html",
					controller: "NewsCtl",
					css: 'src/news/news.css'
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/news/newsCtl.js')
      	}]
    	}
		})

		.state("tabs.news-detail", {
			url: "/news/detail/:id",
			views: {
				"news-tab": {
					templateUrl: "src/news/newsDetail.html",
					controller: "NewsDetailCtl",
					css: "src/news.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/news/newsCtl.js')
      	}]
    	}
		})

		.state("tabs.mine", {
			url: "/mine",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/mine.html",
					controller: "MineCtl",
					css: ["src/mine/mine.css", "src/login/login.css"]
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/mine/mineCtl.js')
      	}]
    	}
		})

		.state("tabs.login", {
			url: "/mine/login",
			views: {
				"mine-tab": {
					templateUrl: "src/login/login.html",
					controller: "LoginCtl",
					css: "src/login/login.css"
				}
			},
			resolve: {
      	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        	return $ocLazyLoad.load('src/login/loginCtl.js')
      	}]
    	}
		})

		.state("tabs.userInfo", {
			url: "/mine/userInfo",
			views: {
				"mine-tab": {
					templateUrl: "src/mine/userInfo.html",
					controller: "UserInfoCtl",
					css: "src/mine/userInfo.css"
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('src/mine/userInfoCtl.js')
				}]
			}
		})

		$urlRouterProvider.otherwise("/tab/home")
})