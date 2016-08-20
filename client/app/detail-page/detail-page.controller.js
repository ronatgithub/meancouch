'use strict';

angular.module('meancouchApp')
  .controller('DetailPageCtrl', function ($scope, $sanitize, moment, googleDocument, couchdb, $state, $stateParams) {
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

