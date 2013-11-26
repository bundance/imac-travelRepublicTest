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

        var icon = {
            'true': 'glyphicon glyphicon-arrow-down',
            'false': 'glyphicon glyphicon-arrow-up',
            'none' : 'glyphicon glyphicon-resize-vertical'
        };

        $scope.model = {
            getIcon: function(sortColumn){
                if(typeof $scope.model.paginator.sortColumn === "undefined"){
                    return this.icon("none");
                }
                return (sortColumn === $scope.model.paginator.sortColumn) ? icon[$scope.model.paginator.sortAscending] : icon['none'];
            }
        };

        $scope.model.paginator = momPaginator(gitHubService, 5);

        $scope.model.paginator.promise
            .then(function(){
                console.log("total page count = " + $scope.model.paginator.totalPagesCount);
                return $scope.model.paginator.getPage();

            });

    }]);


