(function () {
  'use strict';

  describe('Beers Route Tests', function () {
    // Initialize global variables
    var $scope,
      BeersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BeersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BeersService = _BeersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('beers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/beers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BeersController,
          mockBeer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('beers.view');
          $templateCache.put('modules/beers/client/views/view-beer.client.view.html', '');

          // create mock Beer
          mockBeer = new BeersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Beer Name'
          });

          //Initialize Controller
          BeersController = $controller('BeersController as vm', {
            $scope: $scope,
            beerResolve: mockBeer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:beerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.beerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            beerId: 1
          })).toEqual('/beers/1');
        }));

        it('should attach an Beer to the controller scope', function () {
          expect($scope.vm.beer._id).toBe(mockBeer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/beers/client/views/view-beer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BeersController,
          mockBeer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('beers.create');
          $templateCache.put('modules/beers/client/views/form-beer.client.view.html', '');

          // create mock Beer
          mockBeer = new BeersService();

          //Initialize Controller
          BeersController = $controller('BeersController as vm', {
            $scope: $scope,
            beerResolve: mockBeer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.beerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/beers/create');
        }));

        it('should attach an Beer to the controller scope', function () {
          expect($scope.vm.beer._id).toBe(mockBeer._id);
          expect($scope.vm.beer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/beers/client/views/form-beer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BeersController,
          mockBeer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('beers.edit');
          $templateCache.put('modules/beers/client/views/form-beer.client.view.html', '');

          // create mock Beer
          mockBeer = new BeersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Beer Name'
          });

          //Initialize Controller
          BeersController = $controller('BeersController as vm', {
            $scope: $scope,
            beerResolve: mockBeer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:beerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.beerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            beerId: 1
          })).toEqual('/beers/1/edit');
        }));

        it('should attach an Beer to the controller scope', function () {
          expect($scope.vm.beer._id).toBe(mockBeer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/beers/client/views/form-beer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
