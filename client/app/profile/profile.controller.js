'use strict';

angular.module('meancouchApp')
  .controller('ProfileCtrl', function MyFormCtrl(couchdb, sharedProperties) {
  	// set variables
  	couchdb.db.use("test");
  var vm = this; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
  var self = this;
  vm.user = {};
  //to toogle elements
  vm.isCollapsed = true;

  vm.userFields = [
    {
      // the key to be used in the model values
      // so this will be bound to vm.user.profile_name
      key: 'item_profile_name',
      type: 'horizontalInput',
      templateOptions: {
      	type: 'text',
        label: 'Profile Name',
        placeholder: 'Peru Bike Adventures',
        description: 'Enter the name of your profile/business here',
        required: true
      }
    },
    {
      key: 'item_link',
      type: 'horizontalInput',
      templateOptions: {
        type: 'text',
        label: 'Link',
        placeholder: 'Enter your website address here',
        description: 'http://www.your-site.com',
        required: true
      },
      expressionProperties: {
        /*'templateOptions.disabled': '!model.item_name' // disabled when username is blank*/
      }
    },
    {
      key: 'item_promo',
      type: 'horizontalInput',
      templateOptions: {
      	type: 'text',
        label: 'Promotional message',
        placeholder: 'Best Bike Adventures in Peru with experienced guides',
        description: 'Enter short but clear message to promote your business',
        required: true
      }
    },
    {
      key: 'item_description',
      type: 'horizontalInput',
      templateOptions: {
      	type: 'text',
        label: 'Description',
        placeholder: 'Enter a description about what you offer and what people will experience. Kepp it simple and informative.',
        description: '1500 characters',
        required: true
      }
    },
    {
      
      key: 'media1',
      type: 'upload-file',
      templateOptions: {label: 'Photo Large (385x205)', required: true},
      // to disable form fields
      //expressionProperties: {'templateOptions.disabled': function($viewValue, $modelValue, scope) {if(scope.model.ad_size === 4) {return false;} if(scope.model.ad_size === 6) {return false;} return true;}}
      // to hide form fields
      
      }
  ];
  
  vm.onSubmit = onSubmit;
  
  
  function onSubmit() {
  	// set the _id for couchdb doc using date
  	vm.user._id = new Date().toISOString();
    vm.user._attachments = sharedProperties.dataObj;
    console.log('form submitted:', vm.user);

    couchdb.doc.put(vm.user);
  };

  self.check = function () {
    couchdb.user.isAuthenticated().then(function (data) {
        console.log("Ivonet: isAuthenticated: " + data);
        self.user = couchdb.user.name();
        self.roles = couchdb.user.roles();
        self.allDocs();
    }, function (data) {
    		self.user = null;
    		self.msg = data.reason;
        }
    )
  };

});//end



