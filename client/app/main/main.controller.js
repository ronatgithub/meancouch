'use strict';

(function() {

angular.module('meancouchApp')
	.controller('MainController', function (couchdb) {

	    var self = this;

	    self.intro = "Please login with appropriate credentials...";
	    self.user = couchdb.user.name();
	    self.roles = couchdb.user.roles();
	    self.msg = '';
	    self.server = couchdb.server.getUrl();
	    couchdb.db.use("test");
	    self.db = couchdb.db.getName();
	    self.docs = [];

	    self.check = function () {
	        couchdb.user.isAuthenticated().then(function (data) {
	                console.log("isAuthenticated: " + data);
	                self.user = couchdb.user.name();
	                self.roles = couchdb.user.roles();
	                self.allDocs();
	        }, function (data) {
	                self.user = null;
	                self.msg = data.reason;
	        	}
	        );
	    };

	    self.allDocs = function () {
	        couchdb.doc.all().then(function (data) {
	            console.log(JSON.stringify(data));
	            self.docs = [];
	            angular.forEach(data.rows, function (row) {
	               self.docs.push({_id: row.id, _rev: row.value.rev})
	            })
	        })
	    };

	    self.check();
	});

})();


