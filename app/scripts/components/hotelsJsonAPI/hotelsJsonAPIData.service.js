(function() {
    'use strict';

    angular
        .module('rest.hotelsJsonApi')
        .factory('hotelsJsonData', hotelsJsonData);

    hotelsJsonData.$inject = ['hotelsJsonREST'];

    function hotelsJsonData(hotelsJsonREST){

        var DEFAULT_ITEMS_PER_PAGE = 10;

        var service = {
            getData: getData,
            getTotalItemsCount: getTotalItemsCount
        };

        return service;

        ///////////////////

        function getData(itemsPerPage, pageNum, sortColumn, sortAscending, filters) {

            var params = _formatParams(itemsPerPage, pageNum, sortColumn, sortAscending, filters);

            return hotelsJsonREST.getData(params)
                .then(function (items) {
                    return items;
                })
                .catch(function(err){
                    console.log("Error retrieving data");
                    console.dir(err);
                });

            /////// helper Functions ///////

            function _formatParams(itemsPerPage, pageNum, sortColumn, sortAscending, filters) {
                return (_.every(arguments, function(arg){
                    return typeof arg === 'undefined';
                }))
                    ? undefined
                    : {
                            per_page: itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
                            page: pageNum || 1,
                            sort: sortColumn,
                            order: (sortAscending === true) ? 'asc' : 'desc',
                            filters: filters
                      };
            }
        }


        function getTotalItemsCount() {

            return service.getData()
                .then(_calculateTotalItems)
                .catch(_handleError);

        }

        ////////////////////

        /********  Helper function ***********/


        function _calculateTotalItems(items) {
            return (items) ? items.length : 0;
        }

        function _handleError() {
            return 0;
        }
    }

})();
