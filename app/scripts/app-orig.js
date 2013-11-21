'use strict';

angular.module('angularMomPaginatorApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'rest.gitHubAPI',
  'momUI.momPaginator'
])
  /*.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'PaginatorCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  */

.config(['$routeProvider', function ($routeProvider) {
    console.log("In config");
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'PaginatorCtrl',

            redirectTo: function(routeParams, path, search){
                console.log("Location found. Params=");
                console.dir(routeParams);
                console.log("Path entered=");
                console.dir(path);

                return "views/main.html";
            }
            //controller: 'MomDatatableCtrl'
        })
        .otherwise({
            redirectTo: function(routeParams, path, search){
                console.log("Error, cant find location. Params=");
                console.dir(routeParams);
                console.log("Path entered=");
                console.dir(path);
                return "views/main.html";
            }
        })
    }]);
