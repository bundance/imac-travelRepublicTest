(function() {
    'use strict';

    angular
        .module('angularMomPaginatorApp')
        .controller('DemoAppController', DemoAppController);

    DemoAppController.$inject = ['$scope', 'momPaginator', 'gitHubData'];

    function DemoAppController($scope, momPaginator, gitHubData) {

        var vm = this;

        // Initialise controller's model
        vm.model = {
            page: 1,
            pages: []
        };

        // Setup the Paginator
        vm.paginator = getPaginator();
        // Enable sorting
        vm.toggleSort = toggleSort;

        activate();

        ////////////////////

        function activate(){
            // Initialise the paginator
            vm.paginator.initialise()
                .then(_getPage);

            // Set watches
            $scope.$watch(function() {
                    return vm.model.page;
                },
                function (newPageNum) {
                    _getPage(newPageNum);
                });

        }

        function getPaginator() {
            return momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });
        }

        function toggleSort(sortParams) {
            return vm.paginator.toggleSort(sortParams.columnName)
                .then(function () {
                    return {icon: vm.paginator.getSortIcon(sortParams.columnName)};
                })
        }


        //////////////////

        /*  Helper functions  */

        function _getPage(pageNum) {
            return vm.paginator.getPage(pageNum)
                .then(function () {
                    vm.model.pages = vm.paginator.getPageNumbers();
                })
        }

    }
})();

