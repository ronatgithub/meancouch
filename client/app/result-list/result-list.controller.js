// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
'use strict';

(function() {

angular.module('meancouchApp')
  .controller('resultListController', function (couchdb, Database, $scope, $document) {
    
      var self = this;

      self.user = couchdb.user.name();
      self.roles = couchdb.user.roles();
      couchdb.db.use("dm-tours_v1");
      self.msg = '';
      self.docs = [];

      self.check = function () {
          couchdb.user.isAuthenticated().then(function (data) {
                  console.log("isAuthenticated: " + data);
                  self.user = couchdb.user.name();
                  self.roles = couchdb.user.roles();
                  self.getAll();
          }, function (data) {
                  self.user = null;
                  self.msg = data.reason;
            }
          );
      };

      self.check();

    self.getAll = function () {
    // the below code manages to get data from the db using pouch.js (Database service)
      // set databse name for local db
      var db = new Database('test');

      db.all({
        include_docs: true, 
          attachments: false
      }).then(function (result) {
      // handle result
      // console.log(result);
        self.docs = [];

        for (var key in result) {
        // do stuff
          self.data = {
            id: result[key]._id,
            title: result[key].title,
            startDate: result[key].startDate,
            overnight: result[key].overnight,
            promo2: result[key].promo2,
            description: result[key].description,
            media: result[key]._attachments,
            price: result[key].price
          };
          self.docs.push(self.data);
        }
        // console.log('docs ', self.docs);
      }).catch(function (err) {
        console.log(err);
      });
    };

    // ion-range slider angular
      $scope.model = {
        price: {
            min: 18,
            max: 99
        },
        star: {
            min: 3,
            max: 5
        }
      };
      
    // ui-select options for destination
      self.destinationArray = [
            {id: 1, name: 'Maasai Mara'},
            {id: 2, name: 'Tsavo'},
            {id: 3, name: 'Amboseli'},
            {id: 4, name: 'Lake Nakuru'},
            {id: 5, name: 'Shimba Hills'},
        ];

        self.selected = { value: self.destinationArray[0] };

    // ui-select options for month
      self.monthArray = [
            {id: 1, name: 'January'},
            {id: 2, name: 'February'},
            {id: 3, name: 'March'},
            {id: 4, name: 'April'},
            {id: 5, name: 'May'},
            {id: 6, name: 'June'},
            {id: 7, name: 'July'},
            {id: 8, name: 'August'},
            {id: 9, name: 'September'},
            {id: 10, name: 'October'},
            {id: 11, name: 'November'},
            {id: 12, name: 'December'},
        ];

        self.selected2 = { value: self.monthArray[0] };

    // ui-select options for year
        self.isLoaded = false;
        self.years = [{
            'key': 1,
            'value': '2016'
        }, {
            'key': 2,
            'value': '2017'
        }];
        self.selected;

    // Bootstrap-ui rating
      self.rate = 3;
      self.max = 5;
      self.isReadonly = true;

      self.hoveringOver = function(value) {
        self.overStar = value;
        self.percent = 100 * (value / self.max);
      };

      self.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
        {stateOn: 'glyphicon-heart'},
        {stateOff: 'glyphicon-off'}
      ];

    // back to top scroll from https://github.com/oblador/angular-scroll
      $scope.toTheTop = function() {
          $document.scrollTopAnimated(0, 1500).then(function() {
            console && console.log('You just scrolled to the top!');
          });
        }

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
    //    $document.on('scroll', function() {
    //      console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
    //    });

    // the below is just as a note in case i need the code snipped again
      /* var container = angular.element(document.getElementById('container'));
        var section2 = angular.element(document.getElementById('section-2'));
        $scope.toTheTop = function() {
          container.scrollTop(0, 5000);
        }
        $scope.toSection2 = function() {
          container.scrollTo(section2, 0, 1000);
        } */

  }); // end controller
})();


    