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
  .controller('NavbarController', NavbarController);
