'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the result-list view will have listing of all items
      .state('result-list', {
        url: '/result-list',
        templateUrl: 'app/result-list/result-list.html',
        controller: 'resultListController',
        controllerAs: 'ctrl',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  });
