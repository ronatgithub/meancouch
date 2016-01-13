'use strict';

angular.module('meancouchApp')
  .controller('ItemCtrl', function ($scope, couchdb, $state, $stateParams) {
    $scope.message = 'Hello';
	
	// get the item id from the URL paramater using $stateParams
	var id = $stateParams.itemId;
		console.log(id);
	
	var self = this;

    self.showDoc = function (id) {
        couchdb.doc.get(id).then(function (data) {
            self.doc = data;
        })
    };

    self.showDoc(id);
  });


