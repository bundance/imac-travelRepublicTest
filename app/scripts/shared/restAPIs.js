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
                getTotalItemsCount: {
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
    .factory('gitHubService', ['gitHubREST', function(gitHubREST){
        return {
            getData: function(){
                return gitHubREST.getData();
            },
            getTotalItemsCount: function(){
                return gitHubREST.getTotalItemsCount(
                    //success
                    function(items){
                        return items.total_count;
                    },
                    //failure
                    function(responseVal){
                        console.log("getTotalItemsCount failed.");
                        console.dir(responseVal);
                    }
                )

            }
        }
    }])



// Mike - you're here. You need this service to have a getTotalItemsCount function that returns the item_count and nothing more.
// Change this service into a similar one to paginator (i,.e. "var paginator = {...}; return paginator);



//https://api.github.com/search/users?q=followers:%3E=1