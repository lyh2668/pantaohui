angular.module('City', [])

.controller('CityCtl', function($scope, $ionicScrollDelegate, filterFilter, $location, $anchorScroll, Locals) {
  var letters = $scope.letters = [];
  var contacts = $scope.contacts = [];
  var currentCharCode = ' '.charCodeAt(0) - 1;

  //window.CONTACTS is defined below
  window.CONTACTS
    .sort(function(a, b) {
      return a.label > b.label ? 1 : -1;
    })
    .forEach(function(city) {
      //put the letter in the array
      var cityCharCode = city.label.toUpperCase().charCodeAt(0);
      
      if (cityCharCode < 65) {
         cityCharCode = 35; 
      }
   
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = cityCharCode - currentCharCode;

      for (var i = 1; i <= difference; i++) {
        // console.log(String.fromCharCode(currentCharCode));
        addLetter(currentCharCode + i);
      }
      currentCharCode = cityCharCode;
      contacts.push(city);
    });

  //If names ended before Z, add everything up to Z
  for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }

  function addLetter(code) {
    var letter = String.fromCharCode(code);

    contacts.push({
      isLetter: true,
      letter: letter
    });
   
    letters.push(letter);
  }

  //Letters are shorter, everything else is 52 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 30 : 40;
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
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
        item.label.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.cityname.indexOf($scope.search) > -1 || 
        item.abbr.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //console.log(item.last_name.toString().charAt(0));
      
      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {

        var letter = item.label.charAt(0).toUpperCase();
        if ( item.label.charCodeAt(0) < 65 ) {
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
  };

  $scope.click = function (cityname) {    
    $scope.$emit('to-parent', 'parent');
    Locals.set("city", cityname);
    window.history.back();
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