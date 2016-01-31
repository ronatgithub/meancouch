'use strict';

angular.module('meancouchApp')
  .controller('ProfileEditCtrl', function ProfileEditCtrl($state, $q, Notification, couchdb, Database, sharedProperties) {
  // set database name for couchdb (angular app)
  	couchdb.db.use("test");
  // set databse name for local db (pouchdb)
    var db = new Database('adsoko_v2');
  // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    var vm = this;
    var self = this;
  // the object which holds the user submitted data
    vm.profile = {};
  // to toogle elements
    vm.isCollapsed = true;
  // the form fields configuration using angular formly
    vm.formFields = [
      {
        // the key to be used in the model values
        // so this will be bound to vm.profile.name
        key: 'name',
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
        key: 'link',
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
        key: 'promo',
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
        key: 'description',
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
        templateOptions: {label: 'Image', required: true},
        // to disable form fields
        //expressionProperties: {'templateOptions.disabled': function($viewValue, $modelValue, scope) {if(scope.model.ad_size === 4) {return false;} if(scope.model.ad_size === 6) {return false;} return true;}}
        // to hide form fields
        
        }
    ];
  
    vm.onSubmit = onSubmit;
  
  
    function onSubmit() {
//
      console.log('form submitted:', vm.profile);
      // mixed with pouchdb and couchdb
      // db.create because of pouch factory i use. check the factory to see options
        return $q.when(db.create({
        // set the _id for couchdb doc using date
          _id: new Date().toISOString(),
        // get the current user name and make him the owner
          item_owner: couchdb.user.name(),
          item_profile_name: vm.profile.name,
          item_link: vm.profile.link,
          item_promo: vm.profile.promo,
          item_description: vm.profile.description,
          _attachments: sharedProperties.dataObj
        }))
        .then(function (response) {console.log(response);
        // clear sharedProperties.dataObj
          sharedProperties.dataObj = {};
          $state.go('dashboard.profile-listing');
        });
    };

  });//end

