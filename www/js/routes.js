angular.module('Routes', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("tabs", {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html"
		})

		.state("tabs.home", {
			url: "/home",
			views: {
				"home-tab": {
					templateUrl: "src/home/home.html",
					controller: "HomeCtl"
				}
			}
		})

		.state("tabs.home-meetDetail", {
			url: "/home/meetDetail/:id",
			views: {
				"home-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl"
				}
			}
		})

		.state("tabs.meet", {
			url: "/meet",
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meet.html",
					controller: "MeetCtl"
				}
			}
		})

		.state("tabs.meet-detail", {
			url: "/meet/detail/:id",
			views: {
				"meet-tab": {
					templateUrl: "src/meet/meetDetail.html",
					controller: "MeetDetailCtl"
				}
			}
		})

		.state("tabs.meet-citylist", {
			url: "meet/citylist",
			views: {
				"meet-tab": {
					templateUrl: "src/city/city.html",
					controller: "CityCtl"
				}
			}
		})

		.state("tabs.news", {
			url: "/news",
			views: {
				"news-tab": {
					templateUrl: "src/news/news.html",
					controller: "NewsCtl"
				}
			}
		})

		.state("tabs.news-detail", {
			url: "/news/detail/:id",
			views: {
				"news-tab": {
					templateUrl: "src/news/newsDetail.html",
					controller: "NewsDetailCtl"
				}
			}
		})

		$urlRouterProvider.otherwise("/tab/home")
})