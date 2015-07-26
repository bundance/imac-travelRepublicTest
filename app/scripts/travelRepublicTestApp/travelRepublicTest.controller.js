(function() {
    'use strict';

    angular
        .module('travelRepublicTestApp')
        .controller('TravelRepublicTestController', TravelRepublicTestController);

    TravelRepublicTestController.$inject = ['$scope', 'momPaginator', 'hotelsJsonData'];

    function TravelRepublicTestController($scope, momPaginator, hotelsJsonData) {

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
        // Enable filtering
        vm.setFilter = setFilter;
        vm.searchFilter = searchFilter;
        vm.filterBy = {};

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
                restSvc: hotelsJsonData,
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

        function setFilter(columnName, value){
            vm.filterBy[columnName] = value;
        }


        function searchFilter(hotel){
            return _withinPriceRange(hotel.MinCost) && _checkFilters(hotel);

            function _withinPriceRange(price){
                return (price >= vm.priceRange.sliderValue[0] && price <= vm.priceRange.sliderValue[1]);
            }

            function _checkFilters(hotel){
                return _.every(_.map(_.keys(hotel), function(key){
                        return (vm.filterBy[key]) ? hotel[key] === vm.filterBy[key] : true;
                    }));
            }
        }


        vm.priceRange = {
            min: 0,
            max: 10000,
            step: 20,
            precision: 2,
            orientation: 'horizontal',
            handle: 'round', //'square', 'triangle' or 'custom'
            tooltip: 'show', //'hide','always'
            tooltipseparator: ':',
            tooltipsplit: false,
            enabled: true,
            naturalarrowkeys: false,
            range: true,
            ngDisabled: false,
            reversed: false,
            value: 0
        };


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

