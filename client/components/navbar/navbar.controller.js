'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Dashboard',
    'state': 'dashboard.profile-listing'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('meancouchApp')
  .controller('NavbarController', NavbarController)

  .controller('ModalBookingFormCtrl', function ($scope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'ModalBookingFormContent.html',
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
  });;
