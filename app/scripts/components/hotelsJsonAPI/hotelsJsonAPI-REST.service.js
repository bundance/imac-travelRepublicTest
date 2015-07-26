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
            getData: getData,
            priceMin: 0,
            priceMax: 10000,
            filterBy: {}
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
//                        ? _slice(_sort(data, params.sort, params.order), params.page, params.per_page)
                    ? _slice(
                        _sort(
                            _filter(data, params.filters),
                            params.sort,
                            params.order
                        ),
                        params.page,
                        params.per_page
                    )
                    : data;

            }

            function _slice(data, pageNum, itemsPerPage){
                console.log("Slicing");
                return data.slice((pageNum * itemsPerPage) - itemsPerPage, (pageNum * itemsPerPage));
            }

            function _sort(data, sortColumn, sortOrder){
                console.log("Sorting: col:" + sortColumn + ", order:" + sortOrder);
                return (sortOrder === 'desc')
                    ? _.sortBy(data, sortColumn).reverse()
                    : _.sortBy(data, sortColumn);
            }

            function _filter(data, filters){
                console.log("filtering. filtres:");
                console.dir(filters);

                return (filters)
                    ? _.filter(data, function(hotel){
                        return _withinPriceRange(hotel.MinCost, filters.priceMin, filters.priceMax) && _checkFilters(hotel, filters);
                    })
                    : data;

                function _withinPriceRange(price, priceMin, priceMax){
                    priceMin = priceMin || price;
                    priceMax = priceMax || price;

                    return (price >= priceMin && price <= priceMax);
                }

                function _checkFilters(hotel, filters){
                    return _.every(_.map(_.keys(hotel), function(key){
                        return (filters[key]) ? hotel[key] === filters[key] : true;
                    }));
                }
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

