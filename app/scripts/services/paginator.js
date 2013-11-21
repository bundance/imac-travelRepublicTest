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
                getTotalItemsCount: function(){
                    console.log("In gettotalitmes counts");
                    var self = this;

                    self.promise = restSvc.getTotalItemsCount().$promise;
                    return self.promise.then(
                        function(item){
                            self.totalItemsCount = item.total_count;
                            console.log("in p.then, success. total count = " + self.totalItemsCount);
                            console.dir(item);
                            return item;
                        },
                        function(responseVal){
                            console.log("in p.then Error retrieving totalItemsCount");
                            console.dir(responseVal);
                            return responseVal;
                        });


                    //https://api.github.com/search/users?q=followers:%3E=1
                },
                hasMoreData: function(){
                    var self = this;
                    console.log("has more data called");
                    console.log("self.pageOffset = " + self.pageOffset + ", self.itemsPerPage=" + self.itemsPerPage +
                        ", self.currentPageItems.length=" + self.currentPageItems.length + ", self.totalItemsCount = " + self.totalItemsCount);


                    return (self.pageOffset * self.itemsPerPage) + self.currentPageItems.length < self.totalItemsCount;
                }
            };

            // initialise
            paginator.getTotalItemsCount();

            return paginator;
        }
    }]);
