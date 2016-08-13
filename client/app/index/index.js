'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the index view will have listing of all items
      .state('index', {
        url: '/index',
        templateUrl: 'app/index/index.html',
        controller: 'IndexController',
        controllerAs: 'indexCtrl',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  });
