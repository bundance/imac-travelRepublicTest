(function() {
    'use strict';

    angular
        .module('rest.gitHubAPI')
        .factory('gitHubREST', gitHubREST);

    gitHubREST.$inject = ['$resource'];

    function gitHubREST($resource) {
        return $resource('https://api.github.com/:action/:entity',
            null,
            {
                // REST call to make: https://api.github.com/search/users?q=followers:>=0
                getData: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        entity: 'users',
                        'q': 'followers:>=0',
                        action: 'search'
                    }
                }
            });
    }

})();

