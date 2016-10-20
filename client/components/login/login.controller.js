'use strict';

angular.module('meancouchApp')
	.controller('LoginCtrl', function ($scope, $state, $location, Database) {
	    $scope.message = 'Hello';
		
		var self = this;
		// set databse name for local db
		var db = new Database('dm-tours_v1');

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
        	$state.go('main', {}, {reload: true});
        	});
		};

		self.check();

		

	}); // end of PouchdbCtrl