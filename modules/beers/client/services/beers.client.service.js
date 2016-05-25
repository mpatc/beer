//Beers service used to communicate Beers REST endpoints
(function () {
  'use strict';

  angular
    .module('beers')
    .factory('BeersService', BeersService);

  BeersService.$inject = ['$resource'];

  function BeersService($resource) {
    return $resource('api/beers/:beerId', {
      beerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
