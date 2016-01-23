'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the item view show details about an item
      .state('pouch', {
        url: '/pouch',
        templateUrl: 'components/pouchdb/pouchdb.html',
        controller: 'PouchdbCtrl',
        controllerAs: 'ctrl',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  });