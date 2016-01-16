'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the profile form to collect all data
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'vm',
        access: {
            requiresLogin: true,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  })
  

  .run(function ($rootScope, $location, couchdb) {
    // Redirect to login if route requires authentication and you're not logged in
    // http://www.jonahnisenson.com/angular-js-ui-router-redirect-after-login-to-requested-url/
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var authorization = toState.access.requiresLogin;
      couchdb.user.isAuthenticated().then(function(data) { console.log(data);
        if (authorization && !data) {
          // Redirect to login
          $rootScope.returnToState = toState.url;
          $rootScope.returnToStateParams = toParams.Id;
          $location.path('/login');
        }
      });
    });
  });


