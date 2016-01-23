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
  'ui-notification'
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
          $location.path('/login');
        }
      });
    });
  })
  // configure Notification
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





