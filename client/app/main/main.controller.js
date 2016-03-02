// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
'use strict';

(function() {

angular.module('meancouchApp')
	.controller('MainController', function (couchdb, Database) {
		
	    var self = this;

	    self.user = couchdb.user.name();
	    self.roles = couchdb.user.roles();
	    couchdb.db.use("test");
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
		}
	}); // end controller
})();


