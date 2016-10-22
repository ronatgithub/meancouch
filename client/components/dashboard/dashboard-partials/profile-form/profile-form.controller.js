// If you want to pre-populate a form with values, you simply need to set values on the model.
 /* vm.profile = {
      name: 'Grant',
      link: 'www.hello.de'
    }; */
'use strict';

angular.module('meancouchApp')
  .controller('ProfileFormCtrl', function ProfileFormCtrl($state, $q, $timeout, googleDocument, moment, Notification, couchdb, Database, sharedProperties) {
    // set database name for couchdb (angular app)
    	couchdb.db.use("dm-tours_v1");
    // set databse name for local db (pouchdb)
      var db          = new Database('dm-tours_v1');
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
        // if (new) we dont have an id, set an empty object then set _id to a timestamp then start function formFields to trigger formly to load the form with _id set to date
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
        couchdb.doc.get(id).then(function (response) {  console.log(response);
        // handle success
          // if we edit, we should have an attachment -> set it to sharedProperties.dataObj so we can retrieve it in the submit function
          sharedProperties.dataObj = response._attachments;
          // if we edit, we also have values, so we can pre-populate the form fields with this values
          vm.object = { 
          // set keys to the key name in formly form fields and the value to the response from databse to allow pre-populate a form with values
            _id: response._id,
            _rev: response._rev,
            title: response.title,
            price: response.price,
            startDate: response.startDate,
            overnight: response.overnight,
            description: response.description,
            itinerary: response.itinerary,
            videoId: response.videoId,
            user: response.user,
            image: 'http://104.155.57.49:5984/dm-tours_v1/' + response._id + '/image_small',
            imagePresent: true,
            tour_stopover: response.tour_stopover,
            tour_include: response.tour_include,
            tour_exclude: response.tour_exclude,
            tour_rating: response.tour_rating,
            tour_start_location: response.tour_start_location,
            tour_end_location: response.tour_end_location,
            tour_vehicle: response.tour_vehicle
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
            // so this will be bound to vm.profile.title
            key: 'title',
            type: 'horizontalInput',
            templateOptions: {
              focus: 'true',
              type: 'text',
              maxlength: 50,
              minlength: 3,
              label: 'Safari Name',
              addonRight: {
                class: 'fa fa-file-text fa-1x'
              },
              placeholder: 'Safari Tour Name',
              description: 'The content from this field will be used as the tour title.',
              required: true
            },
          },
          {
            key: 'price',
            type: 'horizontalInput',
            templateOptions: {
              type: 'number',
              maxlength: 4,
              label: 'Safari Price',
              addonRight: {
                class: 'fa fa-eur fa-1x'
              },
              placeholder: '',
              description: 'Safari price per person in double room',
              required: true
            },
          },
          {
            key: 'description',
            type: 'horizontalTextArea',
            templateOptions: {
              type: 'textarea',
              rows: 5,
              maxlength: 800,
              minlength: 5,
              label: 'Highlights',
              placeholder: 'A brief description highlighting the unique selling points of this safari tour.',
              description: 'The content from this field will be used as general tour description.',
              required: true
            }
          },
          {
            "className": "section-label",
            "template": "<h2>Safari Tour Itinerary</h2><strong>Setup accommodation details and daily activities.</strong><hr />"
          },
          {
            key: 'itinerary',
            type: 'horizontalTextArea',
            templateOptions: {
              type: 'textarea',
              rows: 5,
              minlength: 5,
              label: 'Introduction',
              placeholder: 'Descriptive summary of the Safari itinerary.',
              description: 'The content you enter here will be used as itinerary description.',
              required: true
            },
            /*expressionProperties: {
              'templateOptions.disabled': function($viewValue, $modelValue) {
                if($viewValue === undefined) {
                  return false;
                } return true;
              }
            } */
          },
        //-START-//////////////////////////////
          // ITINERARY add formly fields on button click
          {
            "type": "repeatSection1",
            "key": "days",
            "templateOptions": {
              "btnText": "Add Day Activity",
              "fields": [
                {
                  "className": "row",
                  "fieldGroup": [
                    /*{
                      "className": "section-label",
                      "template": "<h2>Itinerary</h2>"
                    },*/
                    {
                      key: 'day_accommodation',
                      type: 'horizontalInput',
                      templateOptions: {
                        type: 'text',
                        maxlength: 100,
                        minlength: 5,
                        label: 'Stay At',
                        placeholder: 'accommodation name',
                        description: 'Enter Safari camp or lodge name.',
                        required: true
                      }
                    },
                    {
                      key: 'day_location',
                      type: 'horizontalInput',
                      templateOptions: {
                        type: 'text',
                        maxlength: 100,
                        minlength: 5,
                        label: 'Visit',
                        placeholder: 'safari park',
                        description: 'Enter name of Safari park to vist.',
                        required: true
                      }
                    },
                    {
                      key: 'day_activity',
                      type: 'horizontalTextArea',
                      templateOptions: {
                        type: 'textarea',
                        rows: 5,
                        minlength: 5,
                        label: 'Itinerary',
                        placeholder: 'day trip activity',
                        description: 'Enter full day activity description.',
                        required: true
                      }
                    }
                  ]
                }
              ]
            }
          },
        //-END-/////////////////////////////
          {
            "className": "section-label",
            "template": "<h2>Media</h2><strong>Setup Video ID and upload images.</strong><hr />"
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
            templateOptions: {label: 'Image'},
            expressionProperties: {
              'templateOptions.required': '!options.data.imagePresent'
            },
            data: {
              imagePresent: false
            }
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
          },
        //-START-//////////////////////////////
          // AVAILABILITY add formly fields on button click
          {
            "className": "section-label",
            "template": "<h2>Availability</h2><strong>Setup Special price, Start Date and remaining available seats.</strong><hr />"
          },
          {
            "type": "repeatSection2",
            "key": "availability",
            "templateOptions": {
              "btnText": "Add Price, Date and Availability here",
              "fields": [
                {
                  "className": "row",
                  "fieldGroup": [
                    {
                      key: 'start_date',
                      type: 'horizontalDatepicker',
                      templateOptions: {
                        type: 'date',
                        label: 'Start Date',
                        datepickerPopup: 'MMMM, dd yyyy',
                        datepickerOptions: {
                          format: 'MMMM, dd yyyy'
                        },
                        description: 'The date you enter here will be used as safari tour start date.',
                        required: true
                      },
                      /*expressionProperties: {
                        'templateOptions.disabled': 'model.checkbox'
                      }*/
                    },
                    {
                      key: 'avail',
                      type: 'horizontalInput',
                      templateOptions: {
                        type: 'number',
                        maxlength: 2,
                        label: 'Seats left',
                        placeholder: 'available seats',
                        description: 'Enter number of available seats.',
                        required: true
                      }
                    },
                    {
                      key: 'price',
                      type: 'horizontalInput',
                      templateOptions: {
                        type: 'number',
                        maxlength: 4,
                        label: 'Safari Price',
                        addonRight: {
                          class: 'fa fa-eur fa-1x'
                        },
                        placeholder: '',
                        description: 'Safari price per person in double room',
                        required: true
                      },
                    }
                  ]
                }
              ]
            }
          },
        //-END-//////////////////////////////
          {
            "className": "section-label",
            "template": "<h2>Tour Information</h2><strong>Setup additional information.</strong><hr />"
          },
          {
            key: 'tour_include',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 100,
              minlength: 5,
              label: 'Whats Included',
              placeholder: 'comma seperated list of included services',
              description: 'Enter each service seperated by comma like so: Hotel pickup, meals, extra lunch',
              required: true
            }
          },
          {
            key: 'tour_exclude',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 100,
              minlength: 5,
              label: 'Whats Exluded',
              placeholder: 'comma seperated list of excluded services',
              description: 'Enter each service seperated by comma like so: drinks, tips, pocket money',
              required: true
            }
          },
          {
            key: 'tour_rating',
            type: 'horizontalInput',
            templateOptions: {
              type: 'number',
              maxlength: 1,
              minlength: 1,
              label: 'Tour Rating',
              placeholder: '1 - 5 star rating',
              description: 'Enter a number from 1 to 5 to show a star rating',
              required: true
            }
          },
          {
            key: 'tour_start_location',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 50,
              minlength: 5,
              label: 'Safari Starting Point',
              placeholder: 'Tour start location',
              description: 'Enter the location where this Safari tour starts.',
              required: true
            }
          },
          {
            key: 'tour_end_location',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 50,
              minlength: 5,
              label: 'Safari End Point',
              placeholder: 'Tour end location',
              description: 'Enter the location where the Safari will end.',
              required: true
            }
          },
          {
            key: 'tour_vehicle',
            type: 'horizontalInput',
            templateOptions: {
              type: 'text',
              maxlength: 50,
              minlength: 5,
              label: 'Safari Vehicle',
              placeholder: 'Vehicle type',
              description: 'Enter the Safari vehicle like so: Landcruiser.',
              required: true
            }
          },
        ]; // END vm.formFields
        // check if we have an imge so we can trigger true or false on the required field on file select
        $timeout(function() {
        }, 100).then(function() {
          // vm.formFields[7] is the key: image_large in formly fields
            var field = vm.formFields[7];
            // console.log(vm.formFields[7]);
            field.data.imagePresent = vm.profile.imagePresent;
            field.runExpressions(); // re-run the expression properties
        });
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
            title: vm.profile.title,
            price: vm.profile.price,
            startDate: vm.profile.startDate,
            overnight: vm.profile.overnight,
            description: vm.profile.description,
            itinerary: vm.profile.itinerary,
            videoId: vm.profile.videoId,
            // _attachments: if new -> sharedProperties.dataObj comes from file-input - if edit -> sharedProperties.dataObj is defined in editProfile function
            _attachments: sharedProperties.dataObj,
            tour_include: vm.profile.tour_include,
            tour_exclude: vm.profile.tour_exclude,
            tour_rating: vm.profile.tour_rating,
            tour_start_location: vm.profile.tour_start_location,
            tour_end_location: vm.profile.tour_end_location,
            tour_avail_seat: vm.profile.availability,
            tour_vehicle: vm.profile.tour_vehicle,
            tour_detail: vm.profile.days
          })
          .then(function (response) { // console.log(response);
            // clear sharedProperties.dataObj
            sharedProperties.dataObj = {};
            $state.go('dashboard.profile-listing', {}, {reload: true});
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

      // when google document is select, get values and put them into the files object, so we ca use it to pre-populate the formly fields
      vm.onPicked = function(files) {
        //console.log(files);
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
        //console.log(vm.files);
        // take the document id and get the content of the doc using googleDocument Service Factory in util.service.js
        googleDocument.getContent(vm.files.doc_id, 'txt').then(function(response) {
          // response from $http request in googleDocument Service Factory in util.service.js
          //console.log(response);
          // show an alert popup window to confirm its the correct document
          alert(response);
          // prepare the formfields to pre-populate data
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
            overnight: parseInt(vm.files.tour_overnight),
            itinerary: '{{' + vm.files.doc_id + '}}'
          };
          //console.log(vm.object);
          // start the formFields function with data to pre-populate formly fields
          return formFields(vm.object)
        });
      }

    // function to start when controller loads
    checkId();
    // function to start when submit button is clicked
    vm.onSubmit = onSubmit;

  });//end controller
// end module

