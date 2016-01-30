'use strict';

angular.module('meancouchApp')
  /*.config(function($stateProvider) {
    $stateProvider
      // the dashboard page shows a summary of all data
      // HOME STATES AND NESTED VIEWS ========================================
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl',
        templateUrl: 'components/dashboard/dashboard.html'
      });       
  })*/
      .config(['$stateProvider', function($stateProvider) {
        //set up the dashboard parent state, and its two child-states
        $stateProvider.state('dashboard', {
          
          url: '/dashboard',
          controller: 'DashboardCtrl',
          controllerAs: 'ctrl',
          views: {
            // empty key to target the main ui-view in index.html
            '': { templateUrl: 'components/dashboard/dashboard.html' }
          }
        })
        .state('dashboard.profile-edit', {
          controller: 'ProfileEditCtrl',
          controllerAs: 'vm',
          templateUrl: 'components/dashboard/dashboard-partials/profile-edit/profile-edit.html'
        })
        .state('dashboard.profile-listing', {
          controller: 'ProfileListingCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'components/dashboard/dashboard-partials/profile-listing/profile-listing.html'
        });
      }])  

      .controller('StateController', ['$scope', '$state', function($scope, $state) {
        $scope.$state = $state; console.log($state)
      }])

      