// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
'use strict';

(function() {

angular.module('meancouchApp')
	.controller('ProfileListingCtrl', function ProfileListingCtrl($state, couchdb, Database, Notification, Modal) {
		
	    var self = this;
	    // set databse name for local db
		var db = new Database('test');
		// set databse name for couchdb
		couchdb.db.use("test");
		// current user
	    self.user = couchdb.user.name();
		// the object which holds the data coming from database
	    self.docs = [];
		
		// check if user is authenticated using couchdb-angular-app and if yes invoke function getAll()
	    self.check = function () {
		    couchdb.user.isAuthenticated().then(function (data) {
		        // handle success
		            self.getAll();
		    	}, function (data) {
		        // handle error
		            self.user = null;
		            return Notification.error('something went wrong ' + data.reason);
		       	}
		    );
	    };
		
		// the below code manages to get data from the db using pouch.js (Database service)
		self.getAll = function () {
			// clear the objects from array so the view will update after delete
			self.docs = [];
			db.all({
				include_docs: true, 
			    attachments: false
			}).then(function (result) {
			// handle result
				// console.log(result);
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
				// console.log('docs ', self.docs);
			}).catch(function (error) {
			// handle error
				// console.log(err);
				return Notification.error('something went wrong ' + error);
			});
		};

		// edit doc
		self.edit = function(doc_id) {
			$state.go('dashboard.profile-edit/:id', { id: doc_id });
		};

		
		// delete doc with modal confirm dialog using angular-app-couchdb
		self.delete = Modal.confirm.delete(function(doc) {
		  // Our callback function is called if/when the delete modal is confirmed
		  // console.log(doc);
			// TODO: use pouchdb instate of couchdb-angular-app
		    couchdb.doc.delete(doc).then(function (data) {
		    // handle success
		    	// console.log(data);
		    	self.getAll();
		        return Notification.success(doc.name + ' successful deleted');
		    }, function (data) {
		    // handle error
		    	// console.log(data);
		        return Notification.error('there was an error deleting the document ' + data.reason);
		    })
		});
		
		// function to start when controller loads
		self.check();

	}); // end controller
})();


