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

        this.icon = {
            'true': 'glyphicon glyphicon-arrow-down',
            'false': 'glyphicon glyphicon-arrow-up',
            'none' : 'glyphicon glyphicon-resize-vertical'
        };

        $scope.model = {};

        $scope.model.paginator = momPaginator(gitHubService, 5);

        $scope.model.paginator.promise.then(function(){
            console.log("total page count = " + $scope.model.paginator.totalPagesCount);
            $scope.model.paginator.getPage();

        });



/*
        $scope.model = {
            getIcon: function(sortColumn){
                if(typeof $scope.model.paginator === "undefined"){
                    return;
                }
                var retVal = (sortColumn === $scope.model.paginator.sortColumn) ? icon[$scope.model.paginator.sortAscending] : this.icon['none']
                console.log("sortColumn = " + sortColumn + " , pag.sortCol = " + $scope.model.paginator.sortColumn);
                if($scope.model.paginator.sortAscending !== null){
                    console.log(", sortAsc = " + $scope.model.paginator.sortAscending.toString()) ;
                }
                console.log (", icon returned = " + retVal);
                return retVal;
            }

        };

*/

    }]);


