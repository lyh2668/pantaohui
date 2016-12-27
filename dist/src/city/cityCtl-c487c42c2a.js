angular.module('City', [])

.controller('CityCtl', function($scope, $ionicScrollDelegate, $ionicHistory, filterFilter, $location, 
  $anchorScroll, Locals, $state, cityService, $stateParams) {
  var letters = $scope.letters = cityService.letters;
  var contacts = $scope.contacts = cityService.contacts;


  $scope.locationCity = null;
  cityService.getLocation().then(function(data) {
    $scope.locationCity = {
      no: data.adcode,
      id: -1,
      title: data.city
    };
  });
  

  if ($stateParams.posCity) {

    $scope.posCity = {
      title: $stateParams.posCity.city,
      no: $stateParams.posCity.adcode,
      id: -1
    }
  }
  

  cityService.getHotCityList().then( function(data) {
    $scope.hotCityList = data;

    var tmpCity = {
      title: "全国",
      no: "",
      id: 0
    }

    $scope.hotCityList.unshift(tmpCity);
  })

  if(!letters.length || !contacts.length) {
    cityService.sortCityList();
  }

  //Letters are shorter, everything else is 52 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 30 : 40;
  };

  $scope.hideOthers = false;
  $scope.citySearchChange = function() {
    $ionicScrollDelegate.scrollTop();
    if ($scope.search.length > 0) {
      $scope.hideOthers = true;
    } else {
      $scope.hideOthers = false;
    }
  };
  
  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom();
  };

  var letterHasMatch = {};
  $scope.getContacts = function() {
    letterHasMatch = {};
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return contacts.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item.pinyin.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.title.indexOf($scope.search) > -1 || 
        item.py.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //console.log(item.last_name.toString().charAt(0));
      
      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {

        var letter = item.pinyin.charAt(0).toUpperCase();
        if ( item.pinyin.charCodeAt(0) < 65 ) {
          letter = "#";
        }
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      
      return true;
    });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
    $scope.hideOthers = false;
  };

  $scope.click = function (cityObj) {
    var cityTmp = {
      cityid: cityObj.no,
      id: cityObj.id,
      title: cityObj.title
    }
    Locals.setObject("cityObj", cityTmp);
    // $ionicViewSwitcher.nextDirection("back");
    $ionicHistory.goBack();
  } 
});

window.CONTACTS = 
[{"id":1, "cityname":"舟山", "label": "ZhouShan", "abbr": "ZS"},
{"id":2, "cityname":"宁波", "label": "NingBo", "abbr": "NB"},
{"id":3, "cityname":"杭州", "label": "HangZhou", "abbr": "HZ"},
{"id":5, "cityname":"北京", "label": "BeiJing", "abbr": "BJ"},
{"id":6, "cityname":"上海", "label": "ShangHai", "abbr": "SH"},
{"id":7, "cityname":"苏州", "label": "SuZhou", "abbr": "SZ"},
{"id":8, "cityname":"天津", "label": "TianJing", "abbr": "TJ"},
{"id":9, "cityname":"成都", "label": "ChengDu", "abbr": "CD"},
{"id":10, "cityname":"厦门", "label": "XiaMen", "abbr": "XM"},
{"id":11, "cityname":"佛山", "label": "FoShan", "abbr": "FS"},
{"id":12, "cityname":"澳门", "label": "AoMen", "abbr": "AM"},
{"id":13, "cityname":"香港", "label": "XiangGang", "abbr": "XG"},
{"id":14, "cityname":"深圳", "label": "ShenZhen", "abbr": "SZ"}]