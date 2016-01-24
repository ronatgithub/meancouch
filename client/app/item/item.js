'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the item view show details about an item
      .state('item', {
        url: '/item/:itemId',
        templateUrl: 'app/item/item.html',
        controller: 'ItemCtrl',
        controllerAs: 'ctrl',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  });