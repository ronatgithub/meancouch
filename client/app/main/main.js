'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // the main view will have listing of all items
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
  });
  