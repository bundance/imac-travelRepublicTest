'use strict';

angular.module('travelRepublicTestApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'rest.hotelsJsonApi',   // change this to whatever ReST service you're using
        'momUI.momPaginator',
        'momUI',
        'ui.bootstrap-slider'
    ])
    .config(function ($routeProvider) {
         $routeProvider
         .when('/', {
             templateUrl: 'static/views/main.html',
             controllerAs: 'travelRepublic',
             controller: 'TravelRepublicTestController'
         })
         .when('/spinner', {
             templateUrl: 'static/views/main-spinner.html',
             controllerAs: 'travelRepublic',
             controller: 'TravelRepublicTestController'

         })
         .otherwise({
             redirectTo: '/'
         });
     });



