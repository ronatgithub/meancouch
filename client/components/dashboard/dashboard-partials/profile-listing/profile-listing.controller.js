// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
'use strict';

(function() {

angular.module('meancouchApp')
	.controller('ProfileListingCtrl', function ProfileListingCtrl(couchdb, Database, Notification, Modal) {
		
	    var self = this;
	    // set databse name for local db
		var db = new Database('test');

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

			db.all({
				include_docs: true, 
			    attachments: false
			}).then(function (result) {
			// handle result
			console.log(result);
				self.docs = [];

				for (var key in result) {
				// do stuff
					self.data = {
						_id: result[key]._id,
						_rev: result[key]._rev,
						name: result[key].item_profile_name,
						link: result[key].item_link,
						promo: result[key].item_promo,
						description: result[key].item_description,
						media: result[key]._attachments
					};
					self.docs.push(self.data);
				}
				console.log('docs ', self.docs);
			}).catch(function (err) {
				console.log(err);
			});
		};

		
		// delete doc with modal confirm dialog using angular app couchdb
		self.delete = Modal.confirm.delete(function(doc) {
		// Our callback function is called if/when the delete modal is confirmed
		  // console.log(doc);
			// TODO: use pouchdb instate of angular app
		    couchdb.doc.delete(doc).then(function (data) {
		    // handle success
		    	// console.log(data);
		        return Notification.success(doc.name + ' successful deleted');
		    }, function (data) {
		    // handle error
		    	// console.log(data);
		        return Notification.error('there was an error deleting the document ' + data.reason);
		    })
		});
	}); // end controller
})();


