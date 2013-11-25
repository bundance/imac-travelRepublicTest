angular.module('momUI.momPaginator', [])
    .factory('momPaginator', ['$q', function($q) {
        return function(restSvc, itemsPerPage) {
            var paginator = {
                currentPageItems: [],
                pageOffset: 0,
                itemsPerPage: itemsPerPage ? itemsPerPage : 10 ,
                totalItemsCount: -1,
                promise: $q,
                /**
                 * @name getData()
                 * @returns {*} Returns currentPageItems as an array of data on success;
                 *              Returns the response object on error
                 *              Returns an empty array if no data is received.
                 * @description getsData from the server using the restSvc service. If more data is sent than
                 *      itemsPerPage, the length of currentPageItems is adjusted accordingly.
                 */
                getData: function(){
                    var self = this;

                    if(self.hasMoreData()){
                        self.promise = restSvc.getData(self.itemsPerPage);
                        self.promise.then(
                            //success
                            function(items){
                                self.currentPageItems = items;

                                self.currentPageItems.length = (items.length < self.itemsPerPage)
                                    ? items.length : self.itemsPerPage;

                                return self.currentPageItems;
                            },
                            //failure
                            function(responseVal){
                                return responseVal;
                            });

                        return self.promise;
                    }
                    else{
                        console.log("No more data");
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
                            console.log("Total items returned:" + count)
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

                    if(self.totalItemsCount < 0){
                        return true;
                    }
                    console.log("offset:" + self.pageOffset + ", itemsoeroage:" + self.itemsPerPage + ", pageitemslength:" + self.currentPageItems.length + ", totalitems count: " + self.totalItemsCount);

                    var retVal = (self.pageOffset * self.itemsPerPage) + self.currentPageItems.length < self.totalItemsCount;
                    console.log("retVal = " + retVal.toString());
                    return retVal;
                }
            };

            // initialise
            paginator.getTotalItemsCount();

            return paginator;
        }
    }]);
