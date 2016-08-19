'use strict';

angular.module('meancouchApp')
  .directive('resgrid', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        angular.element(element).responsivegrid(scope.$eval(attrs.resgrid));
        // console.log(angular.element(element));

        scope.$on("$destroy", function(){
          // Remove jQuery plugin from element to prevent memory leaks
          // If your plugin doesn't have a remove function its probably not well suited to persistent javascript environments
          element.responsivegrid("destroy");
        });
      }
    };
  });
