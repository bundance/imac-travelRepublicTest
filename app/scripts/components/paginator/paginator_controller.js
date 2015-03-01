'use strict';

angular.module('angularMomPaginatorApp')
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

        $scope.model.paginator = momPaginator({
            rstSvc: gitHubService,
            initialPage: 5,
            itemsPerPage: 10,
            sortIcons: {
                sortIconUp: 'glyphicon glyphicon-arrow-up',
                sortIconDown: 'glyphicon glyphicon-arrow-down',
                sortIconNone: 'glyphicon glyphicon-resize-vertical'
            }
        });

        $scope.model.paginator.initialise()
            .then(function(){
                $scope.model.paginator.getPage()
                    .then(function(){
                        $scope.model.pages = getPageNumbers($scope.model.paginator.getTotalPagesCount());
                    })
            });



    }])
