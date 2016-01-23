'use strict';

angular.module('meancouchApp')
  .directive('login', function () {
    return {
      templateUrl: 'components/login/login.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	element.addClass('login');
      }
    };
  });
