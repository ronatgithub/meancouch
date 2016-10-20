'use strict';

angular.module('meancouchApp')
  .controller('NavbarController', function ($scope) {
      //start-non-standard
      var menu = [{
        'title': 'Dashboard',
        'state': 'dashboard.profile-listing'
      }];
  })

  .controller('ModalLoginFormCtrl', function ($scope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'ModalLoginFormContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: 'static',
        keyboard: true,
        resolve: {}
      });

      modalInstance.result.then(function (selectedItem) {
        
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
