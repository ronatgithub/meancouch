'use strict';

angular.module('meancouchApp')
  // The Item factory returns item objects which are a prototype of how I want the item document to be saved in my database.
  .factory('Item', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
        '_id':null,
        'setId' : function() { 
            this._id = encodeURIComponent((this.brand + '_' + this.name).replace(' ', '_'));
        },
        'brand' : '',
        'name' : '',
        'about' : '',
        'contact' : [],
        'links' : [],
        'categories' : [],
        'social' : [],
    };
  });
