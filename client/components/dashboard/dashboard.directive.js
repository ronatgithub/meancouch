'use strict';

angular.module('meancouchApp')
  .directive('dashboard', function () {
    return {
      templateUrl: 'client/components/dashboard-views/dashboard-template.html',
      restrict: 'E',
      link: function(scope, element) {
        element.addClass('dashboard');
      }
    };
  });