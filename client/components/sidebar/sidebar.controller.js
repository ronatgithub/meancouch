'use strict';

class SidebarController {
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
  .controller('SidebarController', SidebarController);
