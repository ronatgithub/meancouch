'use strict';

angular.module('meancouchApp')
  .controller('ProfileFormCtrl', function ProfileFormCtrl($state, $q, Notification, couchdb, Database, sharedProperties) {
  // set database name for couchdb (angular app)
  	couchdb.db.use("test");
  // set databse name for local db (pouchdb)
    var db = new Database('adsoko_v2');
  // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    var vm = this;
  // set the object which holds the user submitted data
    vm.profile = {};

    var self = this;
  // to toogle elements
    vm.isCollapsed = true;
  // If you want to pre-populate a form with values, you simply need to set values on the model.
  /* vm.profile = {
        name: 'Grant',
        link: 'www.hello.de'
     }; */

    function checkId() {
      if ($state.params.id !== null) {
      // if its not null and we have got an id, start function editProfile
        return editProfile($state.params.id);
      } else {
      // if we dont have an id, set an empty object and start function formFields to trigger formly to load the form with empty model values
        vm.object = {};
        return formFields(vm.object);
      }
    };

    function formFields(object) {
    // set the model for the form view to hold the submited form data and to set default values for form fields
      vm.profile = object;
    // the form fields configuration using angular formly
      vm.formFields = [
        {
          // the key to be used in the model values
          // so this will be bound to vm.profile.name
          key: 'name',
          type: 'horizontalInput',
          templateOptions: {
            type: 'text',
            maxlength: 25,
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
            maxlength: 35,
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
            maxlength: 35,
            label: 'Promotional message',
            placeholder: 'Best Bike Adventures in Peru with experienced guides',
            description: 'Enter short but clear message to promote your business',
            required: true
          }
        },
        {
          key: 'description',
          type: 'horizontalTextArea',
          templateOptions: {
            type: 'textarea',
            rows: 10,
            maxlength: 1500,
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
    };

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

    function editProfile(id) {
//
      couchdb.doc.get(id).then(function (data) {
      // handle success
        vm.object = {
        // set keys to the key name in formly form fields and the value to the response from databse
          name: data.item_profile_name,
          link: data.item_link,
          promo: data.item_promo,
          description: data.item_description
        };
      })
      .then(function() {
      // start function formFields to trigger formly to load the fields with default values set in vm.profile
        return formFields(vm.object);
      })
      .catch(function (error) {
      // handle error
        console.log(error);
      })
    };
// function to start when controller loads
  checkId();

  });//end

