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
          requiresLogin: true
        }
      });
  })
  .run(function ($rootScope, couchdb) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var access = next.access.requiresLogin;
      if (access) {
        
        couchdb.user.isAuthenticated().then(function (data) {
                 console.log("isAuthenticated: " + data);
                 if (data) {
                    event.preventDefault()
                  }
              }, function (data) {
                // if error check data.reason
                 console.log(data.reason);
              }
         )
        
        } else {
          // else, user is allowed to view, so you can go on
          console.log('no need to login, go ahead');
        }
    })
  });










  /* route which requires the user to be logged in and have the 'Admin' or 'UserManager' permission
    $routeProvider.when('/admin/users', {
        controller: 'userListCtrl',
        templateUrl: 'js/modules/admin/html/users.tmpl.html',
        access: {
            requiresLogin: true,
            requiredPermissions: ['Admin', 'UserManager'],
            permissionType: 'AtLeastOne'
        });*/