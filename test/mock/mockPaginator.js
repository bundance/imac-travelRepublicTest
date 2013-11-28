angular.module('myMocks.mockPaginator', [])
    .factory('mockPaginator', ['$q', '$timeout', function($q, $timeout) {
        return function(restSvc, itemsPerPage, initialPage, sortIcons) {

            var paginator = {
                totalPagesCount: 0,
                    promise: $q,
                getPage: function(pageNum, col, sortBy){
                    var self=this;

                    this.promise =  $timeout(function() {
                        return true;
                    }, 10).then(function(){
                            self.totalPagesCount++;
                            console.log("+ self.getPage.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                        });
                    return this.promise;
                },
                getTotalItemsCount: function(){
                    var self = this;
                    return  $timeout(function() {
                        return -1;
                    }, 10).then(function(){
                            console.log("+ self.getTotalItemsCount.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                            return self.totalPagesCount;
                        })
                },
                getTotalPagesCount: function(){
                    console.log("this.getTotalPagesCount.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                    return this.totalPagesCount;
                },
                _initialise: function(){
                    var self = this;

                    this.promise = self.getTotalItemsCount()
                        .then(function(){
                            self.getTotalPagesCount();
                            console.log("+ self._initialise.then.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                        });
                    console.log("this._initialise.*after*then.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                },
                last: function(){
                    console.log("this.last.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                    return this.getPage(this.totalPagesCount, this.sortColumn, this.sortAscending);
                }
            };

            paginator._initialise();

            return paginator;
        }
    }]);

