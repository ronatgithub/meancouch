'use strict';

angular.module('meancouchApp')
  
// Service to Share Data Between Controllers
    // http://stackoverflow.com/questions/12008908/how-can-i-pass-variables-between-controllers
    .service('sharedProperties', function() {
      // private variable
      var _dataObj = {};
      this.dataObj = _dataObj;
    })

// Service to query CarQueryApi and get Json data returned to use as select options in formly form
    // http://angular-formly.com/#/example/other/async-select-options-with-controller
    // http://www.carqueryapi.com/documentation/api-usage/
    .factory('jsonService', function jsonService($http){
        return {
          getJSON: getJSON
        };

        function getJSON(cmd) {
          //var cmd = 'getMakes';
          var source_url = 'http://www.carqueryapi.com/api/0.3/?callback=JSON_CALLBACK&cmd=' + cmd;
          return $http.jsonp(source_url) // http://mysafeinfo.com/api/data?list=autocompanies&format=json
          .success(function(data){ console.log(data); })
          .error(function(data){ console.log( "nope" ); }); ;
        }
    })