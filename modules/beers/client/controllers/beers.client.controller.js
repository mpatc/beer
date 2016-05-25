(function () {
  'use strict';

  // Beers controller
  angular
    .module('beers')
    .controller('BeersController', BeersController);

  BeersController.$inject = ['$scope', '$state', 'Authentication', 'beerResolve'];

  function BeersController ($scope, $state, Authentication, beer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.beer = beer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Beer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.beer.$remove($state.go('beers.list'));
      }
    }

    // Save Beer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.beerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.beer._id) {
        vm.beer.$update(successCallback, errorCallback);
      } else {
        vm.beer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('beers.view', {
          beerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
