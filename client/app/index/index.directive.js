'use strict';

angular.module('meancouchApp')
  /**
     * responsivegrid - layout grid
     */
  .directive('resgrid', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        // angular.element(element).responsivegrid(scope.$eval(attrs.resgrid));
        // console.log(angular.element(element));

        angular.element(element).responsivegrid({
          gutter : '0',
          itemSelector : '.grid-item',
          'breakpoints': {
            'desktop' : {
              'range' : '1200-',
              'options' : {
                'column' : 20,
              }
            },
            'tablet-landscape' : {
              'range' : '1000-1200',
              'options' : {
                'column' : 20,
              }
            },
            'tablet-portrate' : {
              'range' : '767-1000',
              'options' : {
                'column' : 20,
              }
            },
            'mobile-landscape' : {
              'range' : '-767',
              'options' : {
                'column' : 10,
              }
            },
            'mobile-portrate' : {
              'range' : '-479',
              'options' : {
                'column' : 10,
              }
            },
          }
        });

        scope.$on("$destroy", function(){
          // Remove jQuery plugin from element to prevent memory leaks
          // If your plugin doesn't have a remove function its probably not well suited to persistent javascript environments
          element.responsivegrid("destroy");
        });
      }
    };
  })
  /**
     * introLoader - Preloader
     */
  .directive('intro', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        // angular.element(element).introLoader(scope.$eval(attrs.intro));
        // console.log(angular.element(element));

        angular.element(element).introLoader({
          animation: {
              name: 'gifLoader',
              options: {
                  ease: "easeInOutCirc",
                  style: 'dark bubble',
                  delayBefore: 500,
                  delayAfter: 0,
                  exitTime: 300
              }
          }
        });

        scope.$on("$destroy", function(){
          // Remove jQuery plugin from element to prevent memory leaks
          // If your plugin doesn't have a remove function its probably not well suited to persistent javascript environments
          element.introLoader("destroy");
        });
      }
    };
  });
