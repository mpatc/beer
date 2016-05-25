(function () {
  'use strict';

  angular
    .module('beers')
    .controller('BeersListController', BeersListController);

  BeersListController.$inject = ['BeersService'];

  function BeersListController(BeersService) {
    var vm = this;

    vm.beers = BeersService.query();
  }
})();
