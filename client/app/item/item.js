'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the item view show details about an item
      .state('item', {
        url: '/adsoko/:itemId',
        templateUrl: 'app/item/item.html',
        controller: 'ItemCtrl',
        controllerAs: 'item'
      });
  });