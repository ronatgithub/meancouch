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

	    self.allDocs = function () {
	        couchdb.doc.all().then(function (data) {
	            // console.log(JSON.stringify(data));
	            console.log(data);
	            self.docs = [];
	            angular.forEach(data.rows, function (row) {
	               self.docs.push({_id: row.id, _rev: row.value.rev})
	            })
	        })
	    };

	    self.check();

self.getAll = function () {
		//////
	// the below code manages to get data from the db  
	  // set databse name for local db
	  var db = new Database('test');

	  db.all({
	    include_docs: true, 
	    attachments: true
	  }).then(function (result) {
	    // handle result
	    // console.log(result);
	self.docs = [];
	    
	    

		for (var key in result) {
		    // do stuff

							self.data = {
						        id: result[key]._id,
						        name: result[key].item_profile_name,
						        link: result[key].item_link,
						        promo: result[key].item_promo,
						        description: result[key].item_description,
						        media: result[key]._attachments
						      };
				self.docs.push(self.data);
		} // end for



	 console.log('docs ', self.docs);

	      // http://jsfiddle.net/mrajcok/5ttQA/
	      // http://stackoverflow.com/questions/14077471/conditional-logic-in-angularjs-template
	      self.hasMedia = function(item) {
	        if (item.ad_size == 'size1') {
	          return false
	        }
	        else {
	          return true
	      }}
	      self.hasSmallMedia = function(item) {
	        return item.media.hasOwnProperty('media1')
	      }
	      self.hasLargeMedia= function(item) {
	          return item.media.hasOwnProperty('media3')
	      }

	  }).catch(function (err) {
	    console.log(err);
	  });
		    /////
}
	    
	}); // end controller

})();


