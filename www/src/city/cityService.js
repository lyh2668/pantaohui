angular.module('City', [])

.service('cityService', function($q, webRequest, SERVICE_API_URL, WeixinService) {

	var getLocation = function() {
		var deferred = $q.defer();
		WeixinService.getLocation().then(function(data) {
    	console.log("getLocation:", data);
    	deferred.resolve(data);
  	}, function(err) {
  		deferred.reject(err);
  	})
  	return deferred.promise;
	}

	var getHotCityList = function() {
		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_CITY_HOT).then( function(data) {
			deferred.resolve(data);
			
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var getCityList = function(cityid) {
		var deferred = $q.defer();

		var params = {
			cityid: cityid
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_CITY_LIST).then( function(data) {
			deferred.resolve(data);
			
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var contacts = [];
	var letters = [];
	var currentCharCode = ' '.charCodeAt(0) - 1;

	var addLetter = function(code) {
    var letter = String.fromCharCode(code);

    contacts.push({
      isLetter: true,
      letter: letter
    });
   
    letters.push(letter);
  }

	var sortCityList = function() {
		getCityList().then( function(data) {
  	  data.sort(function(a, b) {
  	    return a.pinyin > b.pinyin ? 1 : -1;
  	  })
  	  .forEach(function(city) {
  	    //put the letter in the array
  	    var cityCharCode = city.pinyin.toUpperCase().charCodeAt(0);
  	    
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
  	})
	}

	

	return {
		getHotCityList: getHotCityList,
		getCityList: getCityList,
		sortCityList: sortCityList,
		contacts: contacts,
		letters: letters,
		getLocation: getLocation
	}
})