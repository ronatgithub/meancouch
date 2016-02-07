// using couchdb-angular-app and pouchdb.js together
// couchdb service - angular app
// Database service - pouchdb
// couchdb view _design document for map function in couchdb
	/* _design/doc_name/by_user
	map
	function(doc, user) {
	  if(doc.user && doc.name) {
	    		emit(doc.user, doc.name);
		
	  }
	} */


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
		           // start function useQuery with the current user as key to retrieve all documents belonging only to that user
		           self.useQuery(self.user);
		    	}, function (data) {
		        // handle error
		            self.user = null;
		            return Notification.error('something went wrong ' + data.reason);
		       	}
		    );
	    };

	    // using couchdb views to retrieve only current user documents
	    self.useQuery = function (user) {
	    	// empty docs array
	    	self.docs = [];
	    	// use the current user the get all documents belonging to that user. See pouchdb service factory for details
	    	db.query(user)
	    	.then(function (result) {
	    	  // handle result
	    		// console.log(result);
	    		for (var key in result.rows) {
				// do stuff
					self.data = {
						_id: result.rows[key].id,
						_rev: result.rows[key].doc._rev,
						user: result.rows[key].key,
						name: result.rows[key].value
					};
					self.docs.push(self.data);
				}
	    	})
	    	.catch(function (error) {
	    		// handle error
	    		console.log(error);
	    	});
	    };
		
		// NOT USED -> use query instate
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
						user: result[key].user,
						name: result[key].name,
						link: result[key].link,
						promo: result[key].promo,
						description: result[key].description,
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
		    db.remove(doc).then(function (data) {
		     // handle success
		    	// console.log(data);
		    	if (data.hasOwnProperty('ok')) {
		    		// go back to document list and show only the users own documents
		    		self.check();
		        	return Notification.success(doc.name + ' successful deleted');
		    	};
		    	
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


