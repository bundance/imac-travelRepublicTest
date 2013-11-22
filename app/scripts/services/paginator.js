angular.module('momUI.momPaginator', [])
    .factory('momPaginator', ['$q', function($q) {
        return function(restSvc) {
            var paginator = {
                allItems: [],
                currentPageItems: [],
                errorMsg: {},
                pageOffset: 0,
                itemsPerPage: 10,
                totalItemsCount: 0,
                promise: $q,
                getData: function(){
                    var self = this;

                    if(self.hasMoreData()){
                        console.log("calling getData fromn paginator...");
                        self.promise = restSvc.getData("",
                            //success
                            function(items){
                                console.dir(items);
                                self.currentPageItems = items;
                                self.allItems = items;
                                return items;
                            },
                            //failure
                            function(responseVal){
                                console.dir(responseVal);
                                self.errorMsg = responseVal;
                            }).$promise;

                        return self.promise;
                    }
                    else{
                        return $q.when([]);
                    }

                },
                /**
                 * @name: getTotalItemsCount()
                 * @returns {Promise|*}
                 * @description When returned promise resolves, promise.then(count) returns the total number of items,
                 * or zero on error
                 */
                getTotalItemsCount: function(){
                    var self = this;

                    self.promise = restSvc.getTotalItemsCount();
                    return self.promise.then(
                        function(count){
                            self.totalItemsCount = count;
                            return count;
                        });
                },
                /**
                 * @name hasMoreData
                 * @returns {boolean}
                 * @description Returns true if more data is available from the server, false if not.
                 * Internally, paginator.getTotalItemsCount() must be called first before this function can bw used.
                 * Externally, code using momPaginator won't need to worry about this, as it's taken care of below
                 * as part of this paginator object's initialisation.
                 */
                hasMoreData: function(){
                    var self = this;

                    return (self.pageOffset * self.itemsPerPage) + self.currentPageItems.length < self.totalItemsCount;
                }
            };

            // initialise
            paginator.getTotalItemsCount();

            return paginator;
        }
    }]);
