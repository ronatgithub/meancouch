'use strict';

angular.module('meancouchApp')
  .controller('DetailPageCtrl', function ($scope, $sanitize, moment, googleDocument, couchdb, $state, $stateParams, $document) {
    $scope.message = 'Hello';
	
  	// get the item id from the URL paramater using $stateParams
  	var id = $stateParams.itemId;
  	var self = this;
    couchdb.db.use("dev-3-diana");

      self.showDoc = function (id) {
          couchdb.doc.get(id).then(function (data) {
            // check the data.itinerary if it has a google key in the form of {{Gh67ghZi...}}
            if (data.itinerary.indexOf('{{') === -1) {
               // if false
               // prepare a from to date
                var travelDays = data.overnight;
                var fromToDate = moment(data.startDate).format('LL') + ' ... ' + moment(data.startDate).add(travelDays, 'day').format('LL');
                data.fromToDate = fromToDate;
                // convert the startDate to a nice date
                var niceDate = moment(data.startDate).format('LL');
                data.startDate = niceDate;
                // return data to the view
                self.return = data;
            } else {
              // if true
              // Find String between Character
              // data.itinerary is a string in the form of {{Gh67ghZi...}}
              var myString = data.itinerary;
              var start_pos = myString.indexOf('{{') + 2;
              var end_pos = myString.indexOf('}}',start_pos);
              var googleDocId = myString.substring(start_pos,end_pos);
              // after we have extracted the google document id from the string, use it to get the google document content
              googleDocument.getContent(googleDocId, 'html').then(function(response) {
                // now put the response (content of the google doc) as itinerary
                data.itinerary = response;
                // prepare a from to date
                var travelDays = data.overnight;
                var fromToDate = moment(data.startDate).format('LL') + ' ... ' + moment(data.startDate).add(travelDays, 'day').format('LL');
                data.fromToDate = fromToDate;
                // convert the startDate to a nice date
                var niceDate = moment(data.startDate).format('LL');
                data.startDate = niceDate;
                // return data to the view
                self.return = data;
              })
            };
          })
      };

      self.showDoc(id);

      // angular-slick-carousel
      $scope.slickConfig1 = {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          arrows: true,
          fade: true,
          asNavFor: '.gallery-nav',
          method: {},
          event: {
              beforeChange: function (event, slick, currentSlide, nextSlide) {
              },
              afterChange: function (event, slick, currentSlide, nextSlide) {
              }
          }
      };

      $scope.slickConfig2 = {
          slidesToShow: 7,
          slidesToScroll: 1,
          speed: 500,
          arrows: false,
          asNavFor: '.gallery-slideshow',
          dots: false,
          centerMode: true,
          focusOnSelect: true,
          infinite: true,
          responsive: [
            {
            breakpoint: 1199,
            settings: {
              slidesToShow: 7,
              }
            }, 
            {
            breakpoint: 991,
            settings: {
              slidesToShow: 5,
              }
            }, 
            {
            breakpoint: 767,
            settings: {
              slidesToShow: 5,
              }
            }, 
            {
            breakpoint: 480,
            settings: {
              slidesToShow: 3,
              }
            }
          ],
          method: {},
          event: {
              beforeChange: function (event, slick, currentSlide, nextSlide) {
              },
              afterChange: function (event, slick, currentSlide, nextSlide) {
              }
          }
      };

      // back to top scroll from https://github.com/oblador/angular-scroll
      $scope.toTheTop = function() {
          $document.scrollTopAnimated(0, 1500).then(function() {
            console && console.log('You just scrolled to the top!');
          });
        };

      // display an anchor link when scrolled below 500px
      $document.on('scroll', function() {
          var anchorLink = angular.element(document.getElementById('back-to-top'));

          if($document.scrollTop() > 500){
            anchorLink.fadeIn(200);
          } else{
            anchorLink.fadeOut(200);
          }
        });

      // display scrolled pixel in console
      //  $document.on('scroll', function() {
      //    console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
      //  });

      // bootstrap collapse with angular ui.bootstrap (http://stackoverflow.com/questions/21436237/using-bootstrap-collapse-with-angularjs)
        // show all at the same time or only one at a time
        /*$scope.oneAtATime = true;

        $scope.groups = [
          {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
          },
          {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
          }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
          var newItemNo = $scope.items.length + 1;
          $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
          isCustomHeaderOpen: false,
          isFirstOpen: true,
          isFirstDisabled: false
        };*/

        // add item html
          // from http://jsfiddle.net/choroshin/U89bW/3/ and http://stackoverflow.com/questions/21436237/using-bootstrap-collapse-with-angularjs
          /*<accordion close-others="oneAtATime">
              <accordion-group heading="Dynamic Body Content">
                <p>The body of the accordion group grows to fit the contents</p>
                    <button class="btn btn-small" ng-click="addItem()">Add Item</button>
                  <div ng-repeat="item in items">{{item}}</div>
              </accordion-group>
            </accordion>*/

          // add item js
          /*$scope.items = ['Camera 1', 'Camera 2', 'Camera 3'];

          $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Camera ' + newItemNo);
          };*/
      
  })

.controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = false;
  $scope.groups = [
    {
      title: "Visit: Sipan/Trstenik - 1",
      content: "Among going manor who did. Do ye is celebrated it sympathize considered. May ecstatic did surprise elegance the ignorant age. Own her miss cold last. It so numerous if he outlived disposal. How but sons mrs lady when. Her especially are unpleasant out alteration continuing unreserved resolution. Hence hopes noisy may china fully and. Am it regard stairs branch thirty length afford. - 1",
      open: false
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group Body - 2",
      open: false
    }
  ];
  
  $scope.opened = function (group, i) {
    console.log("Opened group with offset: "+ i);
  };
  $scope.$watch('groups', function(groups){
    angular.forEach(groups, function(group, idx){
      if (group.open) {
        console.log("Opened group with idx: "+idx);
      }
    })   
  }, true);
})

  .controller('ModalBookingFormCtrl', function ($scope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'ModalBookingFormContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: 'static',
        keyboard: true,
        resolve: {}
      });

      modalInstance.result.then(function (selectedItem) {
        
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });


