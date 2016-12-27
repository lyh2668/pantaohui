// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

// angular.module()

angular.module('starter', ['ionic', 'Routes', 'oc.lazyLoad', 'angularCSS', 'ngCookies',
  'starter.locals', 'JsonServices', 'Weixin', 'Login'])

.run(function($ionicPlatform, $templateCache, $rootScope, $state, AuthService, weixinConfig, WxPay, urlRedirect) {

  urlRedirect.redirect();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    weixinConfig.config();

    // 运行时先读取一次登录状态
    AuthService.initAuth();

    WxPay.getPayConfig();

    // 通过登录状态进行登录界面的跳转
    var needLoginToViews = ["tabs.find", "tabs.userInfo", "tabs.myPublishMeet", "tabs.myFavorMeet"];
    var needLoginFromViews = ["tabs.mine"];
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options) { 

      if(needLoginToViews.indexOf(toState.name) >= 0 && $rootScope.isLogin != true) { //判断当前是否登录
        console.log("fromState: ", fromState);

        var redirectUri = window.location.origin + window.location.pathname + "#" + toState.url;

        $state.go("login", {fromState: fromState.name, fromUrl: fromState.url, 
          toState: toState.name, toState: toState.url, redirectUri: redirectUri}); //跳转到登录页
        event.preventDefault(); //阻止默认事件，即原本页面的加载
      } 
      // else if(toState.name == "login" && needLoginFromViews.indexOf(fromState.name) >= 0 && $rootScope.isLogin != true) {
      //   var redirectUri = window.location.origin + window.location.pathname + "#" + fromState.url;

      //   $state.go("login", {fromState: fromState.name, fromUrl: fromState.url, 
      //     toState: toState.name, toState: toState.url, redirectUri: redirectUri}); //跳转到登录页
      //   event.preventDefault();
      // }
    })

    $rootScope.$on('notice:show', function(event, text) {
      $ionicLoading.show({template: text})
      $rootScope.loadingShowDisabled = true;
    })
    $rootScope.$on('notice:hide', function() {
      $ionicLoading.hide();
    })

    $rootScope.loadingShowDisabled = false;

    console.log(urlRedirect.state, urlRedirect.id);

    console.log("当前url", window.location);
  });
})

.config(['$ionicConfigProvider', '$httpProvider', '$compileProvider', function($ionicConfigProvider, $httpProvider, $compileProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $httpProvider.interceptors.push('httpInterceptor'); 
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|wxLocalResource):/i);
  // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
}])

.factory('httpInterceptor', [ '$q', '$injector', '$timeout', '$rootScope', function($q, $injector, $timeout, $rootScope) { 
  var httpInterceptor = { 
    'responseError' : function(response) { 
      if(response.config.url.indexOf('http://') === 0 ) {
        $timeout(function() {
          $injector.get('$ionicLoading').hide();
        }, 300);
      }
      return $q.reject(response); 
    }, 
    'response' : function(response) { 
      if(response.config.url.indexOf('http://') === 0 ) {
        $timeout(function() {
          $injector.get('$ionicLoading').hide();
        }, 300);
      }
      return response; 
    }, 
    'request' : function(config) { 
      if (config.url.toString().indexOf('http://') === 0) {
        if ($rootScope.loadingShowDisabled) {
          $rootScope.loadingShowDisabled = false;
        } else {
          $timeout(function() {
            $injector.get('$ionicLoading').show({
              template: '加载中...'
            });
          }, 300);
        }

        // 请求超时，3000ms
        $timeout(function() {
          $injector.get('$ionicLoading').hide();
        }, 3000);
      }
      // console.log("request", config);
      return config; 
    }, 
    'requestError' : function(config){ 
      // console.log("requestError", config);
      // 网络问题请求失败
      if(response.config.url.indexOf('http://') === 0 ) {
        $timeout(function() {
          $injector.get('$ionicLoading').hide();
        }, 300);
      }
      return $q.reject(config); 
    } 
  } 
  return httpInterceptor; 
}])

.filter("trustHtml",function($sce) {
  return function (input) {
    return $sce.trustAsHtml(input); 
  }
})

.filter("trim", function() {
  return function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
})

.filter("highlight", function($sce, $log){

    var fn = function(text, search){
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        var regex = new RegExp(search, 'gi')
        var result = text.replace(regex, '<span class="highlightedText">$&</span>');
        return $sce.trustAsHtml(result);
    };

    return fn;
})

.directive('setFocus', function($timeout){
  return {
    scope: { trigger: '=setFocus' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
          console.log('trigger',value);
          $timeout(function() {
            scope.trigger = false;
            element[0].focus();
          }, 0);
        }
      });
    }
    // link: function(scope, element, attrs) {
    //   scope.$watch(attrs.setFocus, function(value) {
    //     if(value === true) { 
    //       console.log('value=',value);
    //       $timeout(function() {
    //         element[0].focus();
    //         scope[attrs.setFocus] = false;
    //       });
    //     }
    //   });
    // }
  }
})

.directive('focusOn', function() {
  return function(scope, elem, attr) {
    return scope.$on('focusOn', function(e, name) {
      if (name === attr.focusOn) {
        console.log("focus: ", name);
        return elem[0].focus();
      }
    });
  };
})

.factory('focus', [
  '$rootScope', '$timeout', (function($rootScope, $timeout) {
    return function(name) {
      return $timeout(function() {
        return $rootScope.$broadcast('focusOn', name);
      });
    };
  })
])

.service('urlRedirect', function($location, $state, $rootScope) {

  // 由于把路由模式做了更改，URL规则也做了修改，需要对一些分享的页面做重定向操作
  this.redirect = function() {
    var path = decodeURIComponent(window.location.href);

    var reg = /tab\/(.+)\/detail\/(\d+)/g;

    path.replace(reg, function(m, type, reg_id) {
      console.log(m, reg_id);
      var pathname = window.location.pathname.replace('index.html', '');
      var url = window.location.origin + pathname + type + "-detail?id=" + reg_id;
      window.location.href = url;
    })

    // 如果url中还包含＃号，则把＃号之后的数据去掉；
    // var urls = location.href.split('#');
    // if(urls.length > 1) {
    //   window.location.href= urls[0]; 
    // }
  }
})

// .service('urlRedirect', function($location, $state, $rootScope) {

//   var state = undefined;
//   var id = undefined;

//   // 由于把路由模式做了更改，URL规则也做了修改，需要对一些分享的页面做重定向操作
//   this.redirect = function() {
//     console.log('Location: ', $location);

//     var path = $location.path();

//     var reg = /tab\/meet\/detail\/(\d+)/g;

//     path.replace(reg, function(m, reg_id) {
//       console.log(m, reg_id);
//       // $rootScope.$emit("urlRedirect", {type: 'meet-detail', id: id});
//       // $state.go('tabs.meet-detail', {id: id});
//       // event.preventDefault();
//       state = 'tabs.meet-detail';
//       id = reg_id;
//     })
//   }

//   this.toState = function() {
//     $state.go(state, {id: id});
//   }
// })

// });
