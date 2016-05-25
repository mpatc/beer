'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, $http, Authentication, Articles) {

    $http.get('http://cors.io/?u=http://api.brewerydb.com/v2/beer/random?key=0cb9881da5081cf5060b13ba2e30bd69').
  success(function(data, status, headers, config) {


    $scope.list = Articles.query();
    $scope.list.$promise.then(function (res){
      console.log('art. list:', res);
      $scope.list = res;
    });
    console.log('art. list:', $scope.list);

    console.log('beerData: ', data.data);

    if (!data.data.description) {
      if(!data.data.style.description) {
        $scope.desc = 'no description avaliable';
      }
      $scope.desc = data.data.style.description;
    } else {
      $scope.desc = data.data.description;
    }

    $scope.beers = data.data;
  }).
  error(function(data, status, headers, config) {
    // log error
  });

    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;
      for (var i = 0; i < $scope.list.length; i++) { // this checks if beer has already been added
        if ($scope.list[i].name === $scope.beers.name) {
          alert('you already reviewed that beer click ok to reload');
          location.reload(); // if it has been reviewed, reload the page to offer new beer
        }
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }
      var beername = $scope.beers.name;

      // Create new Article object
      var article = new Articles({
        title: this.title,
        name: beername,
        sampled: this.sampled,
        rating: this.rating,
        content: this.content

      });
      // console.log('article to be saved: ', article)
      // if (article.sampled === false) {
      //   article.title = 'Not Sampled';
      //   article.rating = 'No rating yet';
      //   article.content = 'Not reviewed yet';
      // }

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;
      if (article.sampled === false) {
        article.title = 'Not Sampled';
        article.rating = 'No rating yet';
        article.content = 'Not reviewed yet';
      }

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
      console.log('list of arts: ', $scope.articles);
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
