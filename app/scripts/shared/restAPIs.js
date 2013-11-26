'use strict';

angular.module('rest.gitHubAPI', ['ngResource'])
    .factory('gitHubREST', ['$resource', function ($resource) {
        return $resource('https://api.github.com/:action/:entity',
            {
                // @id=1
            },
            {
                // Call https://api.github.com/search/users?q=followers:>=0
                getData: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        entity: 'users',
                        'q': 'followers:>=0',
                        action: 'search'
                    }
                }
            }
        );
    }])
    .factory('gitHubService', ['gitHubREST', '$q', function(gitHubREST, $q){
        return {
            getData: function(itemsPerPage, pageNum, sortColumn, sortAscending){

                // Setup QueryString params for itemsPerPage and pageNum
                var params = {
                    per_page : (typeof itemsPerPage === "undefined") ? 10 : itemsPerPage,
                    page : (typeof pageNum === "undefined") ? 1 : pageNum
                };

                // Setup QueryString params for sortColumn and sort direction (but don't include them if they're not
                // defined
                if(typeof sortColumn !== "undefined" && sortColumn){
                    params.sort = sortColumn;
                }
                if(typeof sortAscending !== "undefined" && sortAscending !== null){
                    params.order = sortAscending ? 'asc' : 'desc';
                }

                // Get the data
                var promise = gitHubREST.getData(params).$promise;
                return promise.then(
                    //success
                    function(items){
                        return items.items;
                    },
                    function(responseVal){
                        console.log("getData failed.");
                        console.dir(responseVal);
                        return responseVal;
                    })
            },
            getTotalItemsCount: function(){
                var promise = gitHubREST.getData({per_page: 1, page: 1}).$promise;
                return promise.then(
                    //success
                    function(items){
                        // The return value from this function should be a number, so replace the line below with
                        // whatever property from items represents the total count of items in your paginated data.

                        // Note: GitHub will return a maximum of 1,000 items for any search
                        return (items.total_count > 1000) ? 1000 : items.total_count;
                    },
                    //failure
                    function(responseVal){
                        console.log("getTotalItemsCount failed.");
                        console.dir(responseVal);
                        return 0;
                    })
            }
        }
    }])




