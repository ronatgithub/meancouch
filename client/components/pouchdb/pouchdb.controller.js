'use strict';

angular.module('meancouchApp')
	.controller('PouchdbCtrl', function ($scope, $location, Database) {
	    $scope.message = 'Hello';
		
		// set databse name for local db
		var db = new Database('adsoko_v2');
		
		var self = this;
		
		

	    self.signin = function () {
		    db.signin({
	            name: signupForm.email.value,
	            password: signupForm.password.value
        	})
        	.then(function (data) {
        		self.user = data;
        		console.log(data);
        	});
		};

	}); // end of PouchdbCtrl


