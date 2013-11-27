angular.module('momUI.momPaginator', [])
    .factory('momPaginator', ['$q', function($q) {
        return function(restSvc, itemsPerPage, initialPage, sortIcons) {

            var paginator = {
                currentPageItems: [],
                currentPageNum: initialPage || 1,
                itemsPerPage: itemsPerPage ? itemsPerPage : 10 ,
                totalItemsCount: -1,
                totalpagesCount: 0,
                promise: $q,
                sortColumn: "",
                sortAscending: null,
                sortIcons: {
                    'true': (typeof sortIcons === "undefined") ? null : sortIcons.sortIconUp,
                    'false': (typeof sortIcons === "undefined") ? null : sortIcons.sortIconDown,
                    'none': (typeof sortIcons === "undefined") ? null : sortIcons.sortIconNone
                },
                _initialise: function(){
                    var self = this;

                    this.promise = this.getTotalItemsCount()
                        .then(function(){
                            self.getTotalPagesCount();
                        });
                },
                /**
                 * @name getPage()
                 * @params {number, number, boolean}
                 * @returns {*} - Returns currentPageItems as an array of data on success;
                 *              - Returns the response object on error
                 *              - Returns an empty array if no data is received.
                 * @description getsData from the server using the restSvc service. If more data is sent than
                 *      itemsPerPage, the length of currentPageItems is adjusted accordingly.
                 *      Parameters:
                 *      - pageNum (optional) lets you specify what page number you want (defaults to 1)
                 *      - sortColumn (optional) lets you specify a column to sort on
                 *      - sortAscending (optional) lets you specify the direction to sort the results in.
                 *          - true = sortAscending, false = sortDescending (default is false).
                 */
                getPage: function(pageNum, sortColumn, sortAscending){
                    var self = this;

                    if(typeof pageNum === "undefined"){
                        pageNum = this.currentPageNum;
                    }
                    this.sortColumn = (typeof sortColumn === "undefined") ? this.sortColumn : sortColumn;
                    this.sortAscending = (sortAscending === null) ? this.sortAscending : sortAscending;

                    if(this.pageExists(pageNum)){
                        this.promise = restSvc.getData(this.itemsPerPage, pageNum, this.sortColumn, this.sortAscending)
                            .then(
                                //success
                                function(items){
                                    self.currentPageItems = items;
                                    self.currentPageNum = pageNum;
                                    self.currentPageItems.length = (items.length < self.itemsPerPage)
                                        ? items.length : self.itemsPerPage;

                                    return self.currentPageItems;
                                },
                                //failure
                                function(responseVal){

                                    return responseVal;
                                });

                        return this.promise;
                    }
                    else{
                        console.log("No more pages");
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

                    this.promise = restSvc.getTotalItemsCount()
                        .then(
                        function(count){
                            self.totalItemsCount = count;
                            return count;
                        });
                    return this.promise;

                },
                /**
                 * @name: getTotalPagesCount()
                 * @returns {Number}
                 * @description Calculates and returns the total number of pages that can be traversed by the Paginator.
                 */
                getTotalPagesCount: function(){

                    if(this.totalItemsCount < 0){
                        return 0;
                    }
                    this.totalPagesCount = parseInt(this.totalItemsCount / this.itemsPerPage);

                    if(this.totalItemsCount % this.itemsPerPage > 0){
                        this.totalPagesCount++;
                    }
                    console.log("total pages count = " + this.totalPagesCount)
                    return this.totalPagesCount;
                },
                /**
                 * @name pageExists
                 * @returns {boolean}
                 * @description Returns true if more data is available from the server, false if not.
                 * Internally, paginator.getTotalItemsCount() must be called first before this function can bw used.
                 * Externally, code using momPaginator won't need to worry about this, as it's taken care of below
                 * as part of this paginator object's initialisation.
                 */
                pageExists: function(pageNum){
                    //var self = this;
                    return ((this.totalItemsCount < 0 || pageNum <= this.totalPagesCount) && pageNum > 0);
                },
                /***
                 * @name next
                 * @returns {*} Returns a promise, which, when resolved, returns an array containing the items of
                 * currentPage + 1. Returns an empty array when there are no more pages left
                 * @description Next() will iterate through the pages of data, retrieving the next itemsPerPage worth of data
                 * each time it's called.
                 * The last page may contain less than itemsPerPage of data.
                 * For pages beyond the last page, an empty array is returned.
                 */
                next: function(){
                    //var self = this;
                    return this.getPage(this.currentPageNum + 1, this.sortColumn, this.sortAscending);
                },
                /***
                 * @name next
                 * @returns {*} Returns a promise, which, when resolved, returns an array containing the items of
                 * currentPage + 1. Returns an empty array when there are no more pages left
                 * @description The opposite of next(), prev() will iterate through the pages of data, retrieving the
                 * previous itemsPerPage worth of data each time it's called.
                 * All pages called using prev() will contain itemsPerPage of data.
                 * For pages before the first page (i.e. pages before page 1), an empty array is returned.
                 */
                prev: function(){
                    //var self = this;
                    return this.getPage(this.currentPageNum - 1, this.sortColumn, this.sortAscending);
                },
                first: function(){
                    //var self = this;
                    console.log("first called");
                    return this.getPage(1, this.sortColumn, this.sortAscending);
                },
                last: function(){
                    //var self = this;
                    return this.getPage(this.totalPagesCount, this.sortColumn, this.sortAscending);
                },
                toggleSort: function(sortColumn){
                    //var self = this;

                    this.sortAscending = (this.sortColumn === sortColumn) ? !this.sortAscending : false;
                    this.sortColumn = sortColumn;

                    return this.getPage(1, this.sortColumn, this.sortAscending);
                },
                getSortIcon: function(columnName){
                    //var self = this;

                    if(typeof this.sortColumn === "undefined"){
                        return this.icon("none");
                    }
                    return (columnName === this.sortColumn) ? this.sortIcons[this.sortAscending] : this.sortIcons['none'];

                }
            };

            // initialise
            paginator._initialise();

            return paginator;
        }
    }]);
