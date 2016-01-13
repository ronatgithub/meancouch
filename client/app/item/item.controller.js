'use strict';

angular.module('meancouchApp')
  .controller('ItemCtrl', function ($scope, couchdb, $state, $stateParams) {
    $scope.message = 'Hello';
	
  	// get the item id from the URL paramater using $stateParams
  	var id = $stateParams.itemId;
  	var self = this;
    couchdb.db.use("test");

      self.showDoc = function (id) {
          couchdb.doc.get(id).then(function (data) {
              self.doc = data;
          })
      };

      self.showDoc(id);
  });


