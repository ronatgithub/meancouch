'use strict';

angular.module('meancouchApp')
  .directive('login', function () {
    return {
      templateUrl: 'app/login/login.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	element.addClass('login');
      }
    };
  });
