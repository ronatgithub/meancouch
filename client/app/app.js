'use strict';

angular.module('meancouchApp', [
  'meancouchApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'IvoNetCouchDB',
  'formly',
  'formlyBootstrap'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  // to configer formy bootstrap templates
  .config(config);

      config.$inject = ['formlyConfigProvider'];

      function config(formlyConfigProvider){
        // set templates here
        formlyConfigProvider.setWrapper({
          name: 'horizontalBootstrapLabel',
          template: [
            '<label for="{{::id}}" class="col-sm-2 control-label">',
              '{{to.label}} {{to.required ? "*" : ""}}',
            '</label>',
            '<div class="col-sm-8">',
              '<formly-transclude></formly-transclude>',
            '</div>'
          ].join(' ')
        });
        
        formlyConfigProvider.setWrapper({
          name: 'horizontalBootstrapCheckbox',
          template: [
            '<div class="col-sm-offset-2 col-sm-8">',
              '<formly-transclude></formly-transclude>',
            '</div>'
          ].join(' ')
        });
        
        formlyConfigProvider.setType({
          name: 'horizontalInput',
          extends: 'input',
          wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
        });
        
        formlyConfigProvider.setType({
          name: 'horizontalCheckbox',
          extends: 'checkbox',
          wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
        });
        
        formlyConfigProvider.setType({
            name: 'lx-file-input',
            templateUrl: 'static/file_input_formly.html'
        });
      };


