'use strict';

angular.module('angularMomPaginatorApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'rest.gitHubAPI',
        'momUI.momPaginator',
        'momUI'])
    .config(function ($routeProvider) {
         $routeProvider
         .when('/', {
             templateUrl: 'views/main.html',
             controller: 'PaginatorCtrl'
         })
         .when('/spinner', {
             templateUrl: 'views/main-spinner.html',
             controller: 'PaginatorSpinnerCtrl'
         })
         .otherwise({
             redirectTo: '/'
         });
     })
    .controller('PaginatorCtrl', ['$scope', 'momPaginator', 'gitHubService', function($scope, momPaginator, gitHubService){

        var getPageNumbers = function(lastPage){
            var arr = [];
            var currentPage = 1;

            while(currentPage <= lastPage){
                arr.push(currentPage++);
            }
            return arr;
        };
        $scope.model = {
            page: 1
        };

        $scope.model.paginator = momPaginator(gitHubService, 5, 1, {sortIconUp: 'glyphicon glyphicon-arrow-up',
            sortIconDown: 'glyphicon glyphicon-arrow-down', sortIconNone: 'glyphicon glyphicon-resize-vertical'});

        $scope.model.paginator.promise
            .then(function(){
                $scope.model.paginator.getPage()
                    .then(function(){
                        $scope.model.pages = getPageNumbers($scope.model.paginator.totalPagesCount);
                    })
            });



    }])
    .controller('PaginatorSpinnerCtrl', ['$scope', 'momPaginator', 'gitHubService', function($scope, momPaginator, gitHubService){

        var getPageNumbers = function(lastPage){
            var arr = [];
            var currentPage = 1;

            while(currentPage <= lastPage){
                arr.push(currentPage++);
            }
            return arr;
        };
        $scope.model = {
            page: 1
        };

        $scope.model.paginator = momPaginator(gitHubService, 5, 1, {sortIconUp: 'glyphicon glyphicon-arrow-up',
            sortIconDown: 'glyphicon glyphicon-arrow-down', sortIconNone: 'glyphicon glyphicon-resize-vertical'});

        $scope.model.paginator.promise
            .then(function(){
                $scope.model.paginator.getPage()
                    .then(function(){
                        $scope.model.pages = getPageNumbers($scope.model.paginator.totalPagesCount);
                    })
            });



    }]);


