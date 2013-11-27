'use strict';

angular.module('angularMomPaginatorApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'rest.gitHubAPI',
        'momUI.momPaginator',
        'myMocks.mockPaginator',
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

    /*
    .controller('PaginatorSpinnerCtrl', ['$scope', 'mockPaginator', 'gitHubService', function($scope, mockPaginator, gitHubService){
        $scope.model = {
            page: 1
        };

        var self = this;

        $scope.model.paginator = mockPaginator(gitHubService, 5, 1, {sortIconUp: 'glyphicon glyphicon-arrow-up',
            sortIconDown: 'glyphicon glyphicon-arrow-down', sortIconNone: 'glyphicon glyphicon-resize-vertical'});

        $scope.model.paginator.promise
            .then(function(){
                $scope.model.paginator.getPage()
                    .then(function(){
                        console.log("$scope.model.paginator.totalPagesCount=" + $scope.model.paginator.totalPagesCount + ", this= " + this);
                        console.log("$scope.model.paginator.totalPagesCount=" + $scope.model.paginator.totalPagesCount + ", self= " + self);
                    })
            });

        $scope.model.last = function(){
            console.log("$scope.model.paginator.last totalPagesCount=" + $scope.model.paginator.totalPagesCount + ", this= " + this);
            $scope.model.paginator.last().then(function(totalpagecount){
                console.log("$scope.model.paginator.last.then totalPagesCount=" + $scope.model.paginator.totalPagesCount + ", this= " + this);
            });

            console.log("$scope.model.paginator.*AFTER* last totalPagesCount=" + $scope.model.paginator.totalPagesCount + ", this= " + this);


        };

    }]);

*/

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
                $scope.model.paginator.getPage(1)
                    .then(function(){
                        $scope.model.pages = getPageNumbers($scope.model.paginator.totalPagesCount);
                        console.log("In pag.promises, Total page coutn = " + $scope.model.paginator.totalPagesCount);
                    })
            });

        $scope.model.first = function(){
            return $scope.model.paginator.first();
        };
        $scope.model.last = function(){
            console.log("In model.last, Total page coutn = " + $scope.model.paginator.totalPagesCount);
            return $scope.model.paginator.last();
        };
        $scope.model.next = function(){
            return $scope.model.paginator.next();
        };
        $scope.model.prev = function(){
            return $scope.model.paginator.prev();
        };

    }]);


