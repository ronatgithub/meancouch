'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the item view show details about an item
      .state('detail-page', {
        url: '/detail/:itemId',
        templateUrl: 'app/detail-page/detail-page.html',
        controller: 'DetailPageCtrl',
        controllerAs: 'ctrl',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  });