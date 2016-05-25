(function () {
  'use strict';

  angular
    .module('beers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('beers', {
        abstract: true,
        url: '/beers',
        template: '<ui-view/>'
      })
      .state('beers.list', {
        url: '',
        templateUrl: 'modules/beers/client/views/list-beers.client.view.html',
        controller: 'BeersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Beers List'
        }
      })
      .state('beers.create', {
        url: '/create',
        templateUrl: 'modules/beers/client/views/form-beer.client.view.html',
        controller: 'BeersController',
        controllerAs: 'vm',
        resolve: {
          beerResolve: newBeer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Beers Create'
        }
      })
      .state('beers.edit', {
        url: '/:beerId/edit',
        templateUrl: 'modules/beers/client/views/form-beer.client.view.html',
        controller: 'BeersController',
        controllerAs: 'vm',
        resolve: {
          beerResolve: getBeer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Beer {{ beerResolve.name }}'
        }
      })
      .state('beers.view', {
        url: '/:beerId',
        templateUrl: 'modules/beers/client/views/view-beer.client.view.html',
        controller: 'BeersController',
        controllerAs: 'vm',
        resolve: {
          beerResolve: getBeer
        },
        data:{
          pageTitle: 'Beer {{ articleResolve.name }}'
        }
      });
  }

  getBeer.$inject = ['$stateParams', 'BeersService'];

  function getBeer($stateParams, BeersService) {
    return BeersService.get({
      beerId: $stateParams.beerId
    }).$promise;
  }

  newBeer.$inject = ['BeersService'];

  function newBeer(BeersService) {
    return new BeersService();
  }
})();
