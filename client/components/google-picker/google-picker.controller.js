'use strict';

angular.module('meancouchApp')

	// using a service .factory to get content of published google doc via ajax request
	.controller('googleDocCtrl', function($scope, myService, shareDataService) {
		// using a .service (shareDataService) in article directory to get google document key
		$scope.setKey = shareDataService.getKey();
		myService.getFoos($scope.setKey).then(function(foos) {
		    $scope.foos = foos; // responses from ajax request

		    var el = document.createElement( 'div' );
		    el.innerHTML = foos;
		    var doc = el.querySelector('#contents'); 
		    doc.removeChild(doc.lastChild);
		    doc.removeChild(doc.firstChild);
		    doc.removeChild(doc.firstChild);

		    var domToString = doc.innerHTML;
		    $scope.googleDocContent = domToString;
		});
	})

	.controller('GooglePickerCtrl', ['lkGoogleSettings', function (lkGoogleSettings, sharedProperties) {
		var vm 			 = this;
	  		vm.files     = [];
			vm.languages = [
				{ code: 'en', name: 'English' },
				{ code: 'de', name: 'Deutsch' },
		]

		// Check for the current language depending on lkGoogleSettings.locale
		vm.initialize = function() {
		    angular.forEach(vm.languages, function(language, index) {
		    	if (lkGoogleSettings.locale === language.code) {
		        	vm.selectedLocale = vm.languages[index];
		      	}
		    });
		}

		// Define the locale to use
		vm.changeLocale = function(locale) {
		    lkGoogleSettings.locale = locale.code;
		}

	}])

	.config(['lkGoogleSettingsProvider', function (lkGoogleSettingsProvider) {

	  	// Configure the API credentials here
	  	lkGoogleSettingsProvider.configure({
			apiKey   : 'AIzaSyAi7ftauy3i2UoXMzyKHyLGHauTPLdQrPo',
			clientId : '1098461962064-0j8a2l937giqdgffedp4lduspp6gqesc.apps.googleusercontent.com',
			scopes   : ['https://www.googleapis.com/auth/drive']
	  	});
	}])

	.filter('getExtension', function () {
	  	return function (url) {
	    	return url.split('.').pop();
	  	};
	})


	.filter("sanitize", ['$sce', function($sce) {
	  return function(htmlCode){
	    return $sce.trustAsHtml(htmlCode);
	  }
	}])

	.factory('Googleform', [
	  	function() {
	    	return {
	      		name: 'googleform'
	    	};
	  	}
	])

	.factory('myService', function($http) {
	   	return {
	        getFoos: function(key) {
	            //return the promise directly.
	            return $http.get('https://docs.google.com/document/d/' + key + '/pub')
	            .then(function(result) {
	                //resolve the promise as the data
	                return result.data;
	            });
	        }
	   	}
	})

	// service to get google document key and share between different controllers via indepency injection
	.service('shareDataService', function() {
	  	var key = '';

	  	var setKey = function(newObj) {
	      	key = newObj;
	  	}

	  	var getKey = function(){
	      	return key;
	  	}

	  	return {
	    	setKey: setKey,
	    	getKey: getKey
	  	}
	});

	
