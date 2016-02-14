// If you want to pre-populate a form with values, you simply need to set values on the model.
 /* vm.profile = {
      name: 'Grant',
      link: 'www.hello.de'
    }; */
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

      function checkId() {
        if ($state.params.id === undefined) {
        // if (new) we dont have an id, set an empty object then set _id to a timestamp then start function formFields to trigger formly to load the form with _id set to data
          vm.object = {};
          vm.object._id = new Date().toISOString();
          // get the current user name and make him the owner
          vm.object.user = couchdb.user.name();
          vm.object.image = false;
          return formFields(vm.object);
        } else {
        // if (edit) $state.params.id is not undefined means we have an id, start function editProfile
          return editProfile($state.params.id);
        }
      };

      function editProfile(id) { 
        // using couchdb-angular-app
        couchdb.doc.get(id).then(function (response) { // console.log(response);
        // handle success
          // if we edit, we should have an attachment -> set it to sharedProperties.dataObj so we can retrieve it in the submit function
          sharedProperties.dataObj = response._attachments;
          // to pre-populate the form values
          vm.object = { 
          // set keys to the key name in formly form fields and the value to the response from databse to allow pre-populate a form with values
            _id: response._id,
            _rev: response._rev,
            name: response.name,
            link: response.link,
            promo: response.promo,
            description: response.description,
            user: response.user,
            image: 'http://localhost:5984/test/' + response._id + '/media1'
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

      function formFields(object) { // console.log(object)
        // set the model for the form view to hold the submited form data and to set default values for form fields
        vm.profile = object; // console.log(vm.profile);
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
              minlength: 5,
              label: 'Profile Name',
              addonRight: {
                class: 'fa fa-file-text fa-1x'
              },
              placeholder: 'Peru Bike Adventures',
              description: 'Enter the name of your profile/business here',
              required: true
            },
          },
          {
            key: 'promo',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 35,
              label: 'Promotional message',
              addonRight: {
                class: 'fa fa-commenting fa-1x'
              },
              placeholder: 'Best Bike Adventures in Peru with experienced guides',
              description: 'Enter short but clear message to promote your business',
              required: true
            },
          },
          {
            key: 'link',
            type: 'horizontalInput',
            templateOptions: {
              type: 'url',
              maxlength: 50,
              label: 'Your Website',
              addonRight: {
                class: 'fa fa-globe fa-1x'
              },
              placeholder: 'Enter your website address here',
              description: 'NOTE: please enter your website adress like this http://www.yourdomain.com',
              required: false
            },
            expressionProperties: {
              /*'templateOptions.disabled': '!model.item_name' // disabled when username is blank*/
            },
          },
          {
            key: 'description',
            type: 'horizontalTextArea',
            templateOptions: {
              type: 'textarea',
              rows: 10,
              maxlength: 1500,
              minlength: 30,
              label: 'Description',
              placeholder: 'Enter a description about what you offer and what people will experience. Kepp it simple and informative.',
              description: '1500 characters',
              required: true
            }
          },
          {
            key: 'media1',
            type: 'upload-file',
            templateOptions: {label: 'Image', required: true}
            // to disable form fields
            //expressionProperties: {'templateOptions.disabled': function($viewValue, $modelValue, scope) {if(scope.model.ad_size === 4) {return false;} if(scope.model.ad_size === 6) {return false;} return true;}}
            // to hide form fields
          },
          { // add a formly field with only html. here we display the image when we edit a profile. -> http://docs.angular-formly.com/docs/field-configuration-object
            noFormControl: true,
            className: 'image',
            template: function() {
              console.log('template invoked');
              if(vm.profile.image !== false) {
                console.log('we got an image');
                return  ['<div class="col-sm-offset-2 col-sm-8">',
                            '<img id="image" class="img-thumbnail img-responsive" style="margin-bottom: 15px;" data-ng-src="' + vm.profile.image + '" alt="">',
                          '</div>'
                        ].join(' ')
              } else {
                console.log('we dont have an image');
                return ['<span id="image"></span>']
              };
              
            }
          }
        ]; // END vm.formFields
      };
    
      function onSubmit() { // console.log(vm.profile);
        // console.log('form submitted:', vm.profile);
        // mixed with pouchdb and couchdb
        // db.create because of pouch factory i use. check the factory to see options
          db.create({
            // _id and _rev are pre-set in another function, otherwise they need to be set here
            _id: vm.profile._id,
            _rev: vm.profile._rev,
            user: vm.profile.user,
            name: vm.profile.name,
            link: vm.profile.link,
            promo: vm.profile.promo,
            description: vm.profile.description,
            // _attachments: if new -> sharedProperties.dataObj comes from file-input - if edit -> sharedProperties.dataObj is defined in editProfile function
            _attachments: sharedProperties.dataObj
          })
          .then(function (response) { // console.log(response);
            // clear sharedProperties.dataObj
            sharedProperties.dataObj = {};
            $state.go('dashboard.profile-listing');
          });
      };

    // function to start when controller loads
    checkId();
    // function to start when submit button is clicked
    vm.onSubmit = onSubmit;

  });//end controller
// end module

