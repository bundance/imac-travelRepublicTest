'use strict';

/**
 * @momUI.momPaginator service
 * @name momPaginator
 * @author: Mike Evans
 *
 * @description
 * The momPaginator is an AngularJS service that pulls in data from a ReST API, paginates it, and provides functions
 * for navigating through the pages, sorting them and ordering them however you wish.
 *
 * @example
 *  <table>
 *  ...
 *      <tr ng-repeat="item in model.paginator.currentPageItems">
 *          <td>{{item.property1}}</td>
 *          <td>{{item.property2}}</td>
 *          <td>{{item.property3}}</td>
 *      </tr>
 *  </table>
 *
 *  <div class="m-pagination-btns">
 *      <button class="btn btn-mini btn-primary sdr-pagination-prev-btn" ng-click="model.paginator.first()">
 *          << First
 *      </button>
 *      <button class="btn btn-mini btn-primary sdr-pagination-prev-btn" ng-click="model.paginator.prev()">
 *          < Prev
 *      </button>
 *      <button class="btn btn-mini btn-primary sdr-pagination-prev-btn" ng-click="model.paginator.next()">
 *          Next >
 *      </button>
 *      <button class="btn btn-mini btn-primary sdr-pagination-next-btn" ng-click="model.paginator.last()">
 *          Last >>
 *      </button>
 *  </div>
 *
 *
 */
angular.module('momUI.momPaginator', [])
    .factory('momPaginator', ['$q', function($q) {
        return function(opts) {

            var optsClone = angular.copy(opts) || {};

            var restSvc = optsClone.rstSvc,
                currentPageItems = [],
                currentPageNum = optsClone.initialPage || 1,
                DEFAULT_ITEMS_PER_PAGE = 10,
                itemsPerPage = optsClone.itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
                totalItemsCount = -1,
                totalPagesCount = 0,
                sortColumn = "",
                sortAscending = null,
                sortIcons = _getSortIconLookupTable(optsClone.sortIcons);

            var service = {

                getPage: getPage,
                getTotalItemsCount: getTotalItemsCount,
                getCurrentPageItems: getCurrentPageItems,
                getTotalPagesCount: getTotalPagesCount,
                calculateTotalPagesCount: calculateTotalPagesCount,
                pageExists: pageExists,
                next: next,
                prev: prev,
                first: first,
                last: last,
                toggleSort: toggleSort,
                getSortIcon: getSortIcon,
                initialise: initialise
            };


            return service;

            ///////////////////////////


            /**
             * @name _initialise()
             * @private
             * @description - initialises the paginator service's properties by calling getTotalItemsCount()
             * and calculateTotalPagesCount()
             */
            function initialise(){

                return service.getTotalItemsCount()
                    .then(function(){
                        service.calculateTotalPagesCount();
                    });
            }


            function _getSortIconLookupTable(sortIcons){

                return {
                    'true': sortIcons.sortIconUp,
                    'false': sortIcons.sortIconDown,
                    'none': sortIcons.sortIconNone
                };
            }

            /**
             * @name getPage()
             * @params {number, number, boolean}
             * @returns {*} - Returns currentPageItems as an array of data on success;
             *              - Returns the response object on error
             *              - Returns an empty array if no data is received.
             * @description
             *  gets data from the server using the restSvc service. If more data is sent than
             *  itemsPerPage, the length of currentPageItems is adjusted accordingly.
             *  Parameters:
             *      - pageNum (optional) - specify what page number you want (defaults to 1)
             *      - sortColumn (optional) - specify a column to sort on
             *      - sortAscending (optional) - specify the direction to sort the results in.
             *          - true = sortAscending, false = sortDescending (default is false).
             */
            function getPage(pageNum, sortColumn, sortAscending){

                if(typeof pageNum === "undefined"){
                    pageNum = currentPageNum;
                }
                service.sortColumn = (typeof sortColumn === "undefined") ? service.sortColumn : sortColumn;
                service.sortAscending = (sortAscending === null) ? service.sortAscending : sortAscending;

                if(service.pageExists(pageNum)){
                    return restSvc.getData(itemsPerPage, pageNum, sortColumn, sortAscending)
                        .then(
                            //success
                            function(items){
                                currentPageItems = items;
                                currentPageNum = pageNum;
                                currentPageItems.length = (items.length < itemsPerPage)
                                    ? items.length : itemsPerPage;

                                return currentPageItems;
                            },
                            //failure
                            function(responseVal){

                                return $q.reject(responseVal);
                            });
                }
                else{
                    console.log("No more pages");
                    return $q.when([]);
                }

            }



            /**
             * @name: getTotalItemsCount()
             * @returns {Promise|*}
             * @description When returned promise resolves, promise.then(count) returns the total number of items,
             * or zero on error
             */
            function getTotalItemsCount(){

                return restSvc.getTotalItemsCount()
                    .then(function(count){
                            totalItemsCount = count;
                            return count;
                        });

            }


            function getTotalPagesCount(){

                return (totalPagesCount >= 0) ? totalPagesCount : calculateTotalPagesCount();
            }



            function getCurrentPageItems(){
                return currentPageItems;
            }


            /**
             * @name: calculateTotalPagesCount()
             * @returns {Number}
             * @description Calculates and returns the total number of pages that can be traversed by the Paginator.
             */
            function calculateTotalPagesCount(){

                if(totalItemsCount < 0){
                    return 0;
                }
                totalPagesCount = parseInt(totalItemsCount / (itemsPerPage || DEFAULT_ITEMS_PER_PAGE));

                return (totalItemsCount % itemsPerPage > 0) ? totalPagesCount++ : totalPagesCount;
            }



            
            /**
             * @name pageExists
             * @returns {boolean}
             * @description Returns true if more pages are available from the server, false if not.
             * Internally, paginator.getTotalItemsCount() must be called first before this function can be used.
             * Externally, code using momPaginator won't need to worry about this, as it's taken care of below
             * as part of this paginator object's initialisation.
             */
            function pageExists(pageNum){
               return ((totalItemsCount < 0 || pageNum <= totalPagesCount) && pageNum > 0);
            }
            
            
            
            
            /***
             * @name next
             * @returns {*} Returns a promise, which, when resolved, returns an array containing the items of
             * currentPage + 1. Returns an empty array when there are no more pages left
             * @description Next() will iterate through the pages of data, retrieving the next itemsPerPage worth of data
             * each time it's called.
             * The last page may contain less than itemsPerPage of data.
             * For pages beyond the last page, an empty array is returned.
             */
            function next(){
                return service.getPage(currentPageNum + 1, sortColumn, sortAscending);
            }
            
            
            
            /***
             * @name next
             * @returns {*} Returns a promise, which, when resolved, returns an array containing the items of
             * currentPage - 1. Returns an empty array when there are no more pages left
             * @description The opposite of next(), prev() will iterate through the pages of data, retrieving the
             * previous itemsPerPage worth of data each time it's called.
             * All pages called using prev() will contain itemsPerPage of data.
             * For pages before the first page (i.e. pages before page 1), an empty array is returned.
             */
            function prev(){
                return service.getPage(currentPageNum - 1, sortColumn, sortAscending);
            }
            
            
            
            /***
             * @name: first
             * @returns {*}
             * @description
             * Helper function that returns the first page of data as an array (once getData's promise resolves)
             */
            function first(){
                return service.getPage(1, sortColumn, sortAscending);
            }
            
            
            
            
            /***
             * @name: first
             * @returns {*}
             * @description
             * Helper function that returns the last page of data as an array (once getData's promise resolves).
             */
            function last(){
                return service.getPage(totalPagesCount, sortColumn, sortAscending);
            }
            
            
            
            
            /***
             * @name: toggleSort
             * @params sortColum - name of the column on which to sort the dataset
             * @returns {*}
             * @description
             * Enables sorting the dataset on sortColumn. Each call to this function with the same value for
             * sortColumn will toggle the direction of sorting (ASCending or DESCending (default))
             */
            function toggleSort(newSortColumn){

                sortAscending = (sortColumn === newSortColumn) ? !sortAscending : false;
                sortColumn = newSortColumn;

                return service.getPage(1, sortColumn, sortAscending);
            }
            
            
            
            /***
             * @name getSortIcon
             * @params sortColumn - name of the column to test if the data is being sorted on
             * @returns string
             * @description
             * Helper function that tests if columnName is being used to sort the data, and in which direction.
             * Depending on the result, the function will return the value you entered for sortIconUp (for ASC),
             * sortIconDown (for DESC) or sortIconNone (if columnName isn't being used to sort).
             */
            function getSortIcon(columnName){

                if(typeof sortColumn === "undefined"){
                    return sortIcons['none'];
                }
                return (columnName === sortColumn) ? sortIcons[sortAscending] : sortIcons['none'];

            }
        };


    }]);
