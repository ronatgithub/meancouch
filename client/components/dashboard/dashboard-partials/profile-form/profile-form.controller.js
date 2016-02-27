// If you want to pre-populate a form with values, you simply need to set values on the model.
 /* vm.profile = {
      name: 'Grant',
      link: 'www.hello.de'
    }; */
'use strict';

angular.module('meancouchApp')
  .controller('ProfileFormCtrl', function ProfileFormCtrl($state, $q, moment, Notification, couchdb, Database, sharedProperties) {
    // set database name for couchdb (angular app)
    	couchdb.db.use("test");
    // set databse name for local db (pouchdb)
      var db          = new Database('adsoko_v2');
    // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
      var vm          = this;
    // set the empty object which holds the user submitted data
      vm.profile      = {};
    // set the empty array which will hold the files from google file picker
      vm.files        = [];
      var self        = this;
    // to toogle elements
      vm.isCollapsed  = true;

      function checkId() {
        if ($state.params.id === undefined) {
        // if (new) we dont have an id, set an empty object then set _id to a timestamp then start function formFields to trigger formly to load the form with _id set to data
          vm.object = {};
          vm.object._id = new Date().toISOString();
          // get the current user name and make him the owner
          vm.object.user = couchdb.user.name();
          // if its new, we dont have an image. set it to false so we can use it later in an if function
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
          // if we edit, we also have values, so we can pre-populate the form fields with this values
          vm.object = { 
          // set keys to the key name in formly form fields and the value to the response from databse to allow pre-populate a form with values
            _id: response._id,
            _rev: response._rev,
            name: response.name,
            link: response.link,
            promo1: response.promo1,
            promo2: response.promo2,
            description: response.description,
            user: response.user,
            image: 'http://localhost:5984/test/' + response._id + '/image_small'
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
            key: 'title',
            type: 'horizontalInput',
            templateOptions: {
              focus: 'true',
              type: 'text',
              maxlength: 50,
              minlength: 3,
              label: 'Reise Ziel',
              addonRight: {
                class: 'fa fa-file-text fa-1x'
              },
              placeholder: 'Tour Name',
              description: 'Die Eingabe in diesem Feld wird als Titel der Reise verwendet.',
              required: true
            },
          },
          {
            key: 'price',
            type: 'horizontalInput',
            templateOptions: {
              type: 'number',
              maxlength: 4,
              label: 'Reise Preis',
              addonRight: {
                class: 'fa fa-eur fa-1x'
              },
              placeholder: '',
              description: 'Reisepreis pro Person im Doppelzimmer',
              required: true
            },
          },
          {
            key: 'startDate',
            type: 'horizontalDatepicker',
            templateOptions: {
              type: 'date',
              label: 'Reise Termin',
              datepickerPopup: 'MMMM, dd yyyy',
              datepickerOptions: {
                format: 'MMMM, dd yyyy'
              },
              description: 'Das Datum in diesem Feld wird als Abreise Termin verwendet.',
              required: true
            },
            /*expressionProperties: {
              'templateOptions.disabled': 'model.checkbox'
            }*/
          },
          {
            key: 'overnight',
            type: 'horizontalInput',
            templateOptions: {
              type: 'number',
              maxlength: 2,
              label: 'Anzahl der Übernachtung',
              addonRight: {
                class: 'fa fa-bed fa-1x'
              },
              placeholder: 'Anzahl der Nächte',
              description: 'Die Eingabe in diesem Feld wird zur Berechnung der Reise Dauer und des Rückreise Termins verwendet.',
              required: true
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
              rows: 3,
              maxlength: 100,
              minlength: 5,
              label: 'Kurzbeschreibung',
              placeholder: 'Eine kurze Beschreibung der Reise.',
              description: 'Die Eingabe in diesem Feld wird als Reisebeschreibung verwendet.',
              required: true
            }
          },
          {
            key: 'videoId',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 100,
              minlength: 5,
              label: 'Reise Video',
              placeholder: 'YouTube Video id',
              description: 'Die YouTube id findest Du in the Adresszeile des Browsers.',
              required: false
            }
          },
          {
            key: 'image_large',
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
              // console.log('template invoked');
              if(vm.profile.image !== false) {
                // console.log('we got an image');
                return  ['<div class="col-sm-offset-2 col-sm-8">',
                            '<img id="image" class="img-thumbnail img-responsive" style="margin-bottom: 15px;" data-ng-src="' + vm.profile.image + '" alt="">',
                          '</div>'
                        ].join(' ')
              } else {
                // console.log('we dont have an image');
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
        if (vm.form.$valid) {
          vm.options.updateInitialValue();
          db.create({
            // _id and _rev are pre-set in another function, otherwise they need to be set here
            _id: vm.profile._id,
            _rev: vm.profile._rev,
            user: vm.profile.user,
            name: vm.profile.name,
            link: vm.profile.link,
            promo1: vm.profile.promo1,
            promo2: vm.profile.promo2,
            description: vm.profile.description,
            // _attachments: if new -> sharedProperties.dataObj comes from file-input - if edit -> sharedProperties.dataObj is defined in editProfile function
            _attachments: sharedProperties.dataObj
          })
          .then(function (response) { // console.log(response);
            // clear sharedProperties.dataObj
            sharedProperties.dataObj = {};
            $state.go('dashboard.profile-listing');
          });
        }
      };

      // Callback triggered after Picker is shown
      vm.onLoaded = function () {
        console.log('Google Picker loaded!');
      }

      // Callback triggered after selecting files
      vm.onSelected = function (docs) {
          angular.forEach(docs, function (file, index) {
              vm.files.push(file);
          });
          console.log(vm.files);
        }

        // Callback triggered after clicking on cancel
        vm.onCancel = function () {
          console.log('Google picker close/cancel!');
        }

      // when google document is select, get values and put them into sharedPropertiesObj, so we ca use it in another controller
        vm.onPicked = function(files) {
          // console.log(files);
            for(var key in files) {
              if(files.hasOwnProperty(key)) {
                  var value = files[key];

                  vm.files.doc_id = value.id;
                  vm.files.doc_title = value.name;
                  vm.files.tour_startDate = moment(value.name.split("N")[0]).format('YYYY-MM-DD');         
                  vm.files.tour_title = value.name.split("-")[3].split(",")[0];
                  vm.files.tour_overnight = value.name.split("N")[1].split("-")[0].split("#")[0];
                  vm.files.tour_price = value.name.split("#")[1].split("-")[0];
                  vm.files.tour_description = value.description;
              }
            };
            console.log(vm.files);

            vm.object = {};
            // if its new, we dont have an image. set it to false so we can use it later in an if function
            vm.object.image = false;
            
            vm.object = {
              _id: new moment().toISOString(),
              // get the current user name and make him the owner
              user: couchdb.user.name(),
              title: vm.files.tour_title,
              description: vm.files.tour_description,
              price: parseInt(vm.files.tour_price),
              startDate: new moment(vm.files.tour_startDate, 'YYYY-MM-DD').format('LL'),
              overnight: parseInt(vm.files.tour_overnight)

            };console.log(vm.object);
            return formFields(vm.object)
        }

    // function to start when controller loads
    checkId();
    // function to start when submit button is clicked
    vm.onSubmit = onSubmit;

  });//end controller
// end module

