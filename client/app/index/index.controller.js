// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
'use strict';

(function() {

angular.module('meancouchApp')
	.controller('IndexController', function (couchdb, Database, $scope) {
		
	    var self = this;

	    self.user = couchdb.user.name();
	    self.roles = couchdb.user.roles();
	    couchdb.db.use("dev-3-diana");
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
						media: result[key]._attachments
					};
					self.docs.push(self.data);
				}
				// console.log('docs ', self.docs);
			}).catch(function (err) {
				console.log(err);
			});
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
	    self.values = [{
	        'key': 1,
	        'value': '2016'
	    }, {
	        'key': 2,
	        'value': '2017'
	    }];
	    self.selected;

	}); // end controller
})();


