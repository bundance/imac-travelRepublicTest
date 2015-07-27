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
            pages: [],
            filters: {}
        };

        // Setup the Paginator
        vm.paginator = getPaginator();
        // Enable sorting
        vm.toggleSort = toggleSort;
        // Enable filtering
        vm.applyFilters = applyFilters;
        vm.setFilter = setFilter;
        vm.filterBy = {};
        // Initialise the price range sorter
        vm.priceRangeSlider = {
            min: 0,
            max: 10000,
            step: 20,
            precision: 2,
            orientation: 'horizontal',
            handle: 'round',
            tooltip: 'show',
            tooltipseparator: ':',
            tooltipsplit: false,
            enabled: true,
            naturalarrowkeys: false,
            range: true,
            ngDisabled: false,
            reversed: false,
            value: 0,
            sliderValue: [this.min, this.max]
        };

        // Initialisation
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

            $scope.$watch(function(){
                    return vm.priceRangeSlider.sliderValue[0];
                },
                function(newValue){
                    if(newValue){
                        vm.model.filters.priceMin = vm.priceRangeSlider.sliderValue[0];
                        vm.paginator.getPage(1, vm.model.sortColumn, vm.model.sortAscending, vm.model.filters);
                    }
                });

            $scope.$watch(function(){
                    return vm.priceRangeSlider.sliderValue[1];
                },
                function(newValue){
                    if(newValue){
                        vm.model.filters.priceMax = vm.priceRangeSlider.sliderValue[1];
                        vm.paginator.getPage(1, vm.model.sortColumn, vm.model.sortAscending, vm.model.filters);
                    }
                });

            /*  Helper function  */
            function _getPage(pageNum) {
                return vm.paginator.getPage(pageNum)
                    .then(function () {
                        vm.model.pages = vm.paginator.getPageNumbers();
                    })
            }
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
            return vm.paginator.toggleSort(sortParams.columnName, vm.model.filters)
                .then(function () {
                    return {icon: vm.paginator.getSortIcon(sortParams.columnName)};
                })
        }

        function applyFilters(columnName, value){
            //vm.model.filters[columnName] = value;
            vm.paginator.getPage(1, vm.model.sortColumn, vm.model.sortAscending, vm.model.filters);
        }

        function setFilter(columnName, value){
            vm.model.filters[columnName] = value;
        }

    }
})();

