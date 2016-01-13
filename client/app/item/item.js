'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the item view show details about an item
      .state('item', {
        url: '/item/:itemId',
        templateUrl: 'app/main/main.html',
        controller: 'ItemCtrl',
        controllerAs: 'item'
      });
  });