angular.module('myMocks.mockPaginator', [])
    .factory('mockPaginator', ['$q', '$timeout', function($q, $timeout) {
        return function(restSvc, itemsPerPage, initialPage, sortIcons) {

            var paginator = {
                totalPagesCount: 0,
                    promise: $q,
                getPage: function(pageNum, col, sortBy){
                    var self=this;

                    self.promise =  $timeout(function() {
                        return true;
                    }, 10).then(function(){
                            self.totalPagesCount++;
                            console.log("- this.getPage.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                            console.log("+ self.getPage.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                        });
                    return self.promise;
                },
                getTotalItemsCount: function(){
                    var self = this;
                    return  $timeout(function() {
                        return -1;
                    }, 10).then(function(){
                            // ALWAYS us eself in a .then()
                            console.log("- this.getTotalItemsCount.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                            console.log("+ self.getTotalItemsCount.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                            return self.totalPagesCount;
                        })
                },
                getTotalPagesCount: function(){
                    var self = this;
                    console.log("this.getTotalPagesCount.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                    console.log("self.getTotalPagesCount.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                    return self.totalPagesCount;
                },
                _initialise: function(){
                    var self = this;

                    self.promise = self.getTotalItemsCount()
                        .then(function(){
                            //ALWAYS use self in a .then(). 'this' resolves to the calling object
                            self.getTotalPagesCount();
                            console.log("- this._initialise.then.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                            console.log("+ self._initialise.then.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                        });
                    console.log("this._initialise.*after*then.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                    console.log("self._initialise.*after*then.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                },
                last: function(){
                    var self = this;
                    console.log("this.last.totalPagesCount=" + this.totalPagesCount + ", this= " + this);
                    console.log("self.last.totalPagesCount=" + self.totalPagesCount + ", self= " + self);
                    return this.getPage(this.totalPagesCount, this.sortColumn, this.sortAscending);
                }
            };

            paginator._initialise();

            console.log("----------- start paginator object --------------");
            //this.paginator and self.paginator don't work
            //console.log("this.paginator.totalPagesCount=" + this.paginator.totalPagesCount + ", this= " + this);
            //console.log("self.paginator.totalPagesCount=" + self.paginator.totalPagesCount + ", self= " + self);
            console.log("paginator.totalPagesCount=" + paginator.totalPagesCount);
            console.log("----------- end paginator object --------------");
            return paginator;
        }
    }]);

