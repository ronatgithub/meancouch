'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Dashboard',
    'state': 'profile'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('meancouchApp')
  .controller('NavbarController', NavbarController);
