// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

// angular.module()

angular.module('starter', ['ionic', 'Routes', 'oc.lazyLoad', 'ngCordova', 'angularCSS', 'ngAnimate',
  'starter.locals', 'JsonServices', 'Weixin'])

.run(function($ionicPlatform, $templateCache) {
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
  });
})

.config(['$ionicConfigProvider', '$httpProvider', function($ionicConfigProvider, $httpProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
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

   .directive('customScrollHeight',function($window) {
      return{
        restrict:'AE',
        link:function(scope,element,attr){
          console.log("customScrollHeight", $window.innerHeight-44-49);
          element[0].style.height=($window.innerHeight-44-49)+'px';
        }
      }
    })

// });
