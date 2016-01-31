'use strict';

angular.module('meancouchApp')
  .config(['$stateProvider', function($stateProvider) {
    // the dashboard page shows a summary of all data
    //set up the dashboard parent state, and its two child-states
    $stateProvider.state('dashboard', { 
      url: '/dashboard',
      controller: 'DashboardCtrl',
      controllerAs: 'ctrl',
      access: {
        requiresLogin: true,
        // requiredPermissions: ['Admin', 'UserManager'],
        // permissionType: 'AtLeastOne'
      },
      views: {
        // empty key to target the main ui-view in index.html
        '': { templateUrl: 'components/dashboard/dashboard.html' }
      }
    })
    .state('dashboard.profile-edit', {
      controller: 'ProfileEditCtrl',
      controllerAs: 'vm',
      access: {
        requiresLogin: true,
        // requiredPermissions: ['Admin', 'UserManager'],
        // permissionType: 'AtLeastOne'
      },
      templateUrl: 'components/dashboard/dashboard-partials/profile-edit/profile-edit.html'
    })
    .state('dashboard.profile-listing', {
      controller: 'ProfileListingCtrl',
      controllerAs: 'ctrl',
      access: {
        requiresLogin: true,
        // requiredPermissions: ['Admin', 'UserManager'],
        // permissionType: 'AtLeastOne'
      },
      templateUrl: 'components/dashboard/dashboard-partials/profile-listing/profile-listing.html'
    });
  }])

// TODO: remove state from scope
  .controller('StateController', ['$scope', '$state', function($scope, $state) {
    $scope.$state = $state; console.log($state)
  }])

      