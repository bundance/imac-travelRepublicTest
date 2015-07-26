(function() {
    'use strict';

    angular
        .module('rest.hotelsJsonApi')
        .factory('hotelsJsonREST', hotelsJsonREST);

    hotelsJsonREST.$inject = ['$http', '$q'];

    function hotelsJsonREST($http, $q) {

        var allData,
            formattedData,
            lastSortedColumn = 'Name';

        var service = {
            getData: getData
        };

        return service;

        ///////////

        function getData(params){
            return _getDataFromSource()
                    .then(function(data){
                        return _formatData(data, params);
                    });

            function _formatData(data, params){
                return (params)
                        //? data.slice((params.page * params.per_page) - params.per_page, (params.page) * params.per_page)
                        ? _slice(_sort(data, params.sort, params.order), params.page, params.per_page)
                        : data;
            }

            function _slice(data, pageNum, itemsPerPage){
                return data.slice((pageNum * itemsPerPage) - itemsPerPage, (pageNum * itemsPerPage));
            }

            function _sort(data, sortColumn, sortOrder){
                return (sortOrder === 'desc')
                    ? _.sortBy(data, sortColumn).reverse()
                    : _.sortBy(data, sortColumn);
            }

        }

        function _getDataFromSource(){
            return $http
                .get('http://127.0.0.1/app/static/data/hotels.json')
                .then(function(response){
                    return response.data.Establishments;
                });
        }
    }

})();

