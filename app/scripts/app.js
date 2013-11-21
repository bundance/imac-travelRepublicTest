'use strict';

angular.module('angularMomPaginatorApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'rest.gitHubAPI',
        'momUI.momPaginator'])
    .config(function ($routeProvider) {
         $routeProvider
         .when('/', {
             templateUrl: 'views/main.html',
             controller: 'PaginatorCtrl'
         })
         .otherwise({
            redirectTo: '/'
         });
     })

    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('PaginatorCtrl', ['$scope', 'momPaginator', 'gitHubService', function($scope, momPaginator, gitHubService){

        $scope.model = {
            itemsPerPage: 0,
            pageOffset: 0,
            currentPageItems: [],
            totalItemsCount: 0
        };

        $scope.model.paginator = momPaginator(gitHubService);
/*
        $scope.model.paginator.getData().then(function(items){
            $scope.model.currentPageItems = items;
            console.log("returned page itmes:");
            console.dir(items);
        });
/*
        $scope.model.paginator.getTotalItemsCount();.then(function(totalCount){
            $scope.model.totalItemsCount = totalCount;
        })
*/

    }]);


