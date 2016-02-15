// http://docs.angular-formly.com/v6.3.2/docs/field-configuration-object
'use strict';

angular.module('meancouchApp')
  .config(function($stateProvider) {
    $stateProvider
      // upload page shows a sample form
      .state('upload', {
        url: '/upload',
        templateUrl: 'components/file-upload/file-upload.html',
        controller: 'FileUploadCtrl',
        controllerAs: 'vm',
        access: {
            requiresLogin: false,
            // requiredPermissions: ['Admin', 'UserManager'],
            // permissionType: 'AtLeastOne'

                }
      });
  })
  // for nya.bootstrap.select to work with formly
  .config(['formlyConfigProvider', function(formlyConfigProvider) {
        //nya-bs-select : grouped select template : 
       var groupedSelectTemplate = '  <ol data-size="5" style="padding: 0px;" class="nya-bs-select col-sm-12 col-xs-12 col-md-12 col-lg12" ' +
                                   '    ng-model="model[options.key || index]" ' +
                                   '       data-live-search="true" ' +
                                   '       disabled="options.templateOptions.options.length === 0">' +
                                   '       <li nya-bs-option="option in  options.templateOptions.options"  ' +
                                   '       >' +
                                   '         <a>' +
                                   '           <span>{{option}}</span>' +
                                   '           <span class="glyphicon glyphicon-ok check-mark"></span>' +
                                   '         </a>' +
                                   '       </li>' +
                                   '     </ol>';
                                   
       formlyConfigProvider.setType(
          {
            name: 'groupedSelect',
            template: groupedSelectTemplate
          }
       );  
  }])
  // setWrapper for loading status to be displayed when json select list is loading data. the loading.html file is in same file as the form itself
  .run(function(formlyConfig) {
    formlyConfig.setWrapper({
      name: 'loading',
      templateUrl: 'loading.html'
    });
  })
  // setType for ng-file-upload implementation into formly fields
  // https://angular-file-upload.appspot.com/
  // https://gist.github.com/kentcdodds/8bfdbf832b3cebfb050f or https://gist.github.com/benoror/6d70a1d81caa0ce08523
  .run(function(formlyConfig) {
          formlyConfig.setType({
              name: 'upload-file',
              template: '<input type="file" ngf-select="onSelect($file)" ngf-resize="{width: 1500, height: 843, centerCrop: true}" ngf-select multiple ngf-max-files="1" ng-model="files" name="files" accept="image/*" required="" ngf-multiple="false"><img ng-if="files" class="img-thumbnail img-responsive" style="margin-top:15px;" ngf-src="files[0]">',
              wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError'],
              extends: 'input',
              defaultOptions: {
                  //templateOptions: {label: 'File Upload',}
              },
              controller: /* @ngInject */ function ($scope, Upload, sharedProperties) {
                // when edit and we select a new image, we need to remove the current image from view
                // file comes from: ngf-select="onSelect($file)"
                $scope.onSelect = function (file) {
                  // console.log(file)
                  Upload.resize(file, 711, 400, 100)
                    .then(function(resizedFile) {
                      Upload.rename(resizedFile, 'image_small');
                      // console.log(resizedFile);
                      sharedProperties.dataObj.image_small = {
                        content_type: resizedFile.type,
                        data: resizedFile
                      }
                    })
                    .then(function() {
                      console.log(sharedProperties.dataObj)
                    });
                  // to remove a element by its id -> document.getElementById("image").outerHTML='';
                  document.getElementById("image").outerHTML = '';
                };
                // to get the selected image to sharedProperties.dataObj to be able to share it between controllers
                $scope.$watch('files', function () { 
              
                    if( $scope.files && $scope.files.length) {
                      sharedProperties.dataObj[$scope.options.key] = {// $.scope.options.key comes from formly field-key (reference to formly fields) see also http://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object-literal
                          content_type: $scope.files[0].type,// prepare an object to use as pouchdb attachment with the files from file uploader. use the sharedProperties service to share data between controllers
                          data: $scope.files[0]
                      }
                    } // end of if
                    // console.log(sharedProperties.dataObj);
                });
                    // set default directive values
                    // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
              } // end of function
          }) // end formly config
  })
  // configure Formly Validations Messages
  .run(function(formlyConfig, formlyValidationMessages) {
    formlyConfig.extras.ngModelAttrsManipulatorPreferBound = true;
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'characters is the minimum length required', 'Too short');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', 'characters is the maximum length allowed', 'Too long');
    formlyValidationMessages.messages.url = '$viewValue + " is not a valid url. e.g. http://www.yourdomain.com"';
    formlyValidationMessages.messages.required = 'to.label + " is required"';
  })
    // to configer formly bootstrap templates to use bootstrap horizontal form and ng-messages for validation notefication
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
                
                '<div class="label validation"',
                  'ng-if="options.validation.errorExistsAndShouldBeVisible"',
                  'ng-messages="options.formControl.$error">',
                  '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
                    '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
                  '</div>',
                '</div>',

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
            name: 'horizontalTextArea',
            extends: 'textarea',
            wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
          });

          formlyConfigProvider.setType({
            name: 'horizontalCheckbox',
            extends: 'checkbox',
            wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
          });
          
        };