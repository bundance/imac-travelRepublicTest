'use strict';

angular.module('rest.gitHubAPI', ['ngResource'])
    .factory('gitHubREST', ['$resource', function ($resource) {
        return $resource('https://api.github.com/:action/:entity',
            {
                //'id':'@id'
            },
            {
                getData: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        entity: 'users'
                    }
                },
                _getTotalItemsCount: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        entity: 'users',
                        'q': 'followers:>=1',
                        action: 'search'
                    }
                }
            }

        );
    }])
    .factory('gitHubService', ['gitHubREST', '$q', function(gitHubREST, $q){
        return {
            getData: function(){
                return gitHubREST.getData();
            },
            getTotalItemsCount: function(){
                // Call https://api.github.com/search/users?q=followers:>=1
                console.log("githubSERVICE getTotalItemsCount called");
                var promise = gitHubREST._getTotalItemsCount().$promise;
                return promise.then(
                    //success
                    function(items){
                        console.log("gitHubService, items.total_count = " + items.total_count);
                        return items.total_count;
                    },
                    //failure
                    function(responseVal){
                        console.log("getTotalItemsCount failed.");
                        console.dir(responseVal);
                        return 0;
                    }
                )

            }
        }
    }])




