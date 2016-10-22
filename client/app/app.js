/* http://angular-tips.com/blog/2015/11/setting-up-individual-views-with-ui-router-and-ui-router-extras/
   https://github.com/christopherthielen/ui-router-extras
  'ct.ui.router.extras.core',
  'ct.ui.router.extras.sticky'
*/

'use strict';

angular.module('meancouchApp', [
  'meancouchApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'IvoNetCouchDB',
  'formly',
  'formlyBootstrap',
  'ngFileUpload',
  'nya.bootstrap.select',
  'ui-notification',
  'angularMoment',
  'ngMessages',
  'lk-google-picker',
  'ui.select',
  'duScroll',
  'slickCarousel',
  'mgcrea.bootstrap.affix',
  'ion.rangeslider'
])

  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  // Redirect to login if route requires authentication and you're not logged in
  // http://www.jonahnisenson.com/angular-js-ui-router-redirect-after-login-to-requested-url/
  .run(function ($rootScope, $location, couchdb) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var authorization = toState.access.requiresLogin;
      couchdb.user.isAuthenticated().then(function(data) {
        if (authorization && !data) {
          // Redirect to login
          $rootScope.returnToState = toState.url;
          $rootScope.returnToStateParams = toParams.Id;
          $location.path('/');
        }
      });
    });
  })
  // configure Notification
  // https://github.com/alexcrack/angular-ui-notification
  .config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'left',
      positionY: 'bottom'
    });
  })
  // angular-scroll set default speed to scroll
  .value('duScrollDuration', 2000)

  // angular formly config
  // http://angular-formly.com/#/example/advanced/repeating-section
  // used to add and remove form fields on button click
  .config(function config(formlyConfigProvider) {
    var unique = 1;
    formlyConfigProvider.setType({
      name: 'repeatSection1',
      templateUrl: 'repeatSection1.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
  })
  .config(function config(formlyConfigProvider) {
    var unique = 1;
    formlyConfigProvider.setType({
      name: 'repeatSection2',
      templateUrl: 'repeatSection2.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
  });

