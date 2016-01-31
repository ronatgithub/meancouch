'use strict';

angular.module('meancouchApp')
	.controller('LoginCtrl', function ($scope, $location, Database) {
	    $scope.message = 'Hello';
		
		var self = this;
		// set databse name for local db
		var db = new Database('adsoko_v2');

	    self.login = function () {
		    db.signin({
	            name: loginForm.email.value,
	            password: loginForm.password.value
        	})
        	.then(function (data) {
        		self.user = data;
        		$location.path('/dashboard');
        	});
		};

		self.check = function () {
			db.isAuthenticated().then(function (data) {
        	self.user = data;
        	});
		};

		self.logout = function () {
			db.logout().then(function (data) {
        	console.log(data);
        	$location.path('/');
        	});
		};

		self.check();

		

	}); // end of PouchdbCtrl