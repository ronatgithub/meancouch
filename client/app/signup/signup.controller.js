'use strict';

angular.module('meancouchApp')
	.controller('SignupCtrl', function (Database, $state) {

	    var self = this;
		// set databse name for local db
		var db = new Database('test');
			
		self.signup = function () {
		    db.signup({
	            name: signupForm.email.value,
	            password: signupForm.password.value
        	})
        	.then(function (response) { 
        		if (response.hasOwnProperty('ok')) {
	        		db.signin({
			            name: signupForm.email.value,
			            password: signupForm.password.value
	        		})
	        		.then(function (response) { // response is user name
	        			$state.go('dashboard.profile-listing');
	        		});
	        		
        		} else {
        			// if username exist or is not allowed -> stay on page. -> notification is shown from pouchdb service
        		}
        	})
        	.catch(function(error) {
        		console.log(error);
        	});
		};
	});




