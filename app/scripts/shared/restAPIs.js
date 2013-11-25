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
            getData: function(itemsPerPage, pageNum){
                itemsPerPage = itemsPerPage || 10;
                pageNum = pageNum || 1;

                var promise = gitHubREST.getData({per_page: itemsPerPage, page: pageNum}).$promise;
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
                        return items.total_count;
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




