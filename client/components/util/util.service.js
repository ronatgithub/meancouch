'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function UtilService($window) {
  var Util = {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    safeCb(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;
      return a;
    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = (origins && [].concat(origins)) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        return url.hostname === o.hostname &&
          url.port === o.port &&
          url.protocol === o.protocol;
      });
      return (origins.length >= 1);
    },
  };

  return Util;
}

angular.module('meancouchApp')
  .factory('Util', UtilService)

  /**
   * Get content of published google doc via ajax request
   *
   * @param  {String}           key       - google document key
   * @param  {String}           format    - google document export format (html, txt, pdf, rtf, odt, doc)
   * @return {Object}                     - content of google document
   */
  .factory('googleDocument', function($http) {
      return {
          getContent: function(key, format) {
              //return the promise directly.
              return $http.get('https://docs.google.com/feeds/download/documents/export/Export?id=' + key + '&exportFormat=' + format)
              .then(function(result) {
                  //resolve the promise as the data
                  return result.data;
              });
          }
      };
  });

})();

// https://docs.google.com/feeds/download/documents/export/Export?id=' + key + '&exportFormat=txt
// https://docs.google.com/document/d/' + key + '/pub
// https://docs.google.com/feeds/download/documents/export/Export?id=' + key + '&exportFormat=html