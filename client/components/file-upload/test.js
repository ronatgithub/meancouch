/* global angular */
(function() {
  
  'use strict';

  var app = angular.module('formlyExample', ['formly', 'formlyBootstrap', 'ngAnimate', 'ngAria', 'ngMessages']);
  
  app.run(function(formlyConfig, formlyValidationMessages) {
    formlyConfig.setType({
      name: 'customInput',
      extends: 'input',
      controller: ['$scope', function($scope) {
        $scope.options.data.getValidationMessage = getValidationMessage;
        
        function getValidationMessage(key) {
          var message = $scope.options.validation.messages[key];
          if (message) {
            return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
          }
        }
      }]
    });
    
    formlyConfig.setWrapper({
      name: 'validation',
      types: ['input', 'customInput'],
      templateUrl: 'my-messages.html'
    });
    
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', 'is the maximum length', 'Too long');
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'is the minimum length', 'Too short');
    formlyValidationMessages.messages.required = 'to.label + " is required"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
  });

  app.controller('MainCtrl', function MainCtrl(formlyVersion) {
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: 'Kent C. Dodds',
      url: 'https://twitter.com/kentcdodds' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Error Summary'; // add this
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };

    vm.model = {};
    vm.options = {};
    
    vm.fields = [
      {
        key: 'picky',
        type: 'customInput',
        templateOptions: {
          label: 'Picky field...',
          placeholder: 'This is required and has a maxlength of 5 and minlength of 3',
          required: true,
          maxlength: 5,
          minlength: 3
        }
      },
      {
        key: 'email',
        type: 'customInput',
        templateOptions: {
          label: 'Email address',
          type: 'email',
          placeholder: 'Email address here...',
          required: true,
          minlength: 2
        }
      },
      {
        key: 'ip',
        type: 'customInput',
        validators: {
          ipAddress: {
            expression: function(viewValue, modelValue) {
              var value = modelValue || viewValue;
              return /(\d{1,3}\.){3}\d{1,3}/.test(value);
            },
            message: '$viewValue + " is not a valid IP Address"'
          }
        },
        templateOptions: {
          label: 'IP Address',
          required: true,
          type: 'text',
          placeholder: '127.0.0.1',
        }
      }
    ];
    
    vm.originalFields = angular.copy(vm.fields);
    

    // function definition
    function onSubmit() {
      vm.options.updateInitialValue();
      alert(JSON.stringify(vm.model), null, 2);
    }
  });
  
  app.directive('formlyErrorSummary', function() {
    return {
      scope: {},
      bindToController: {
        form: '=',
        fields: '='
      },
      templateUrl: 'formly-error-summary.html',
      controllerAs: 'vm',
      controller: function() {
        var vm = this;
        
        vm.getErrorAsList = getErrorAsList;
        
        function getErrorAsList(field) {
          return Object.keys(field.formControl.$error).map(function(error) {
            // note, this only works because the customInput type we have defined.
            return field.data.getValidationMessage(error);
          }).join(', ');
        }
      }
    };
  });

})();