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
            page: 1,
            first : function(){
                return $scope.model.paginator.first();
            },
            last : function(){
                return $scope.model.paginator.last();
            },
            next : function(){
                return $scope.model.paginator.next();
            },
            prev : function(){
                return $scope.model.paginator.prev();
            },
            getPage : function(getPageParams){
                return $scope.model.paginator.getPage(getPageParams.pageNum);
            }
        };

        $scope.model.paginator = momPaginator(gitHubService, 5, 1, {sortIconUp: 'glyphicon glyphicon-arrow-up',
            sortIconDown: 'glyphicon glyphicon-arrow-down', sortIconNone: 'glyphicon glyphicon-resize-vertical'});

        $scope.model.paginator.promise
            .then(function(){
                $scope.model.paginator.getPage(1)
                    .then(function(){
                        $scope.model.pages = getPageNumbers($scope.model.paginator.totalPagesCount);
                    })
            });

        $scope.model.toggleSort = function(sortParams){
            return $scope.model.paginator.toggleSort(sortParams.columnName)
                .then(function(){
                    var icon = $scope.model.paginator.getSortIcon(sortParams.columnName);
                    return {icon: $scope.model.paginator.getSortIcon(sortParams.columnName)};
                })
        };



    }]);


