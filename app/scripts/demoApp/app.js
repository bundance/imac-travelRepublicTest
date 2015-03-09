'use strict';

angular.module('angularMomPaginatorApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'rest.gitHubAPI',   // change this to whatever ReST service you're using
        'momUI.momPaginator',
        'momUI'])
    .config(function ($routeProvider) {
         $routeProvider
         .when('/', {
             templateUrl: 'views/main.html',
             controllerAs: 'demo',
             controller: 'DemoAppController'
         })
         .when('/spinner', {
             templateUrl: 'views/main-spinner.html',
             controllerAs: 'demo',
             controller: 'DemoAppController'

         })
         .otherwise({
             redirectTo: '/'
         });
     });



