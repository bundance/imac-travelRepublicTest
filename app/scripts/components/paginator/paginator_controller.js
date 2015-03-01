'use strict';

angular.module('angularMomPaginatorApp')
    .controller('PaginatorCtrl', ['$scope', 'momPaginator', 'gitHubService', function($scope, momPaginator, gitHubService){

        $scope.model = {
            page: 1
        };

        $scope.paginator = momPaginator({
            rstSvc: gitHubService,
            initialPage: 5,
            itemsPerPage: 10,
            sortIcons: {
                sortIconUp: 'glyphicon glyphicon-arrow-up',
                sortIconDown: 'glyphicon glyphicon-arrow-down',
                sortIconNone: 'glyphicon glyphicon-resize-vertical'
            }
        });

        $scope.paginator.initialise()
            .then(function(){
                $scope.paginator.getPage()
                    .then(function(){
                        $scope.model.pages = $scope.paginator.getPageNumbers();
                    })
            });



    }])
