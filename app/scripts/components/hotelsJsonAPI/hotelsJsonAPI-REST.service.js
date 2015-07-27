/**
 *
 * The hotelsJsonREST service would normally be an interface to a server-side REST API. However, as this is just
 * a demo, the usual data sorting and filtering commands have been replicated here on the client-side instead.
 * This inevitably impacts performance on devices with limited resources, but there's no noticeable performance
 * impact on any of the devices it's been tested on.
 *
 * For an example of how an equivalent service normally interacts with a server-based API, see gitHub-REST.service.js
 * in scripts/components/gitHubAPI
 *
 */
(function() {
    'use strict';

    angular
        .module('rest.hotelsJsonApi')
        .factory('hotelsJsonREST', hotelsJsonREST);

    hotelsJsonREST.$inject = ['$http'];

    function hotelsJsonREST($http) {

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
                return data.slice((pageNum * itemsPerPage) - itemsPerPage, (pageNum * itemsPerPage));
            }

            function _sort(data, sortColumn, sortOrder){
                return (sortOrder === 'desc')
                    ? _.sortBy(data, sortColumn).reverse()
                    : _.sortBy(data, sortColumn);
            }

            function _filter(data, filters){
                return (filters)
                    ? _.filter(data, function(hotel){
                        // ToDo: refactor _filter to curry the function so it accepts the filters as an extensible
                        // list of arguments
                        return _withinPriceRange(hotel.MinCost, filters.priceMin, filters.priceMax)
                            && _atLeast(hotel.Stars, filters.stars)
                            && _atLeast(hotel.UserRating, filters.userRating)
                            && _checkFilters(hotel, filters);
                        })
                        : data;

                function _withinPriceRange(price, priceMin, priceMax){
                    priceMin = priceMin || price;
                    priceMax = priceMax || price;

                    return (price >= priceMin && price <= priceMax);
                }

                function _atLeast(value, requiredValue){
                    return (requiredValue)
                        ? value >= requiredValue
                        : true;
                }

                // Matches filters to property names in a hotel object. If a filter name doesn't match a hotel
                // object property name, it won't be checked here
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

