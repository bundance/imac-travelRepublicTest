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

        $scope.model.paginator = momPaginator(gitHubService, 3);

        $scope.model.paginator.promise.then(function(){

            $scope.model.paginator.currentPageNum = 10;
            $scope.model.paginator.currentPageItems = [1,1,1,1,1,1,1,1,1,1];
            $scope.model.paginator.totalPagesCount = 10;
            console.log("pageExists = " + $scope.model.paginator.pageExists(11).toString());
        });
/*
        $scope.model.paginator.promise.then(function(){
            $scope.model.paginator.totalItemsCount = 0;
            $scope.model.paginator.getPage().then(function(responseVal){
                console.log("responseVal = ");
                console.dir(responseVal);
            });
        });

        /*$scope.model.paginator.getPage().then(function(items){
            console.log("items");
            console.dir(items);
        });

        $scope.model.paginator.next().then(function(items){
            console.log("items");
            console.dir(items);
        });
*/
/*



 *        $scope.model.paginator.getPage().then(function(items){
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


