'use strict';

angular.module('meancouchApp')
  .directive('ivonet', function () {
    return {
      templateUrl: 'components/ivonet-couchdb/ivonet-couchdb.html',
      restrict: 'E',
      link: function(scope, element) {
        element.addClass('ivonet');
      }
    };
  });
