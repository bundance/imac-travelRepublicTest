'use strict';

/**
 * @name momPaginator
 * @author: Mike Evans
 *
 * @description
 * The momPaginator is a factory for creating momPaginator objects, which will enable you to paginate a table
 * of data, seamlessly moving between pages as needed.
 *
 * You pass in an Angular $resource object, which already contains the url and parameters needed to connect to the
 * server from which you wish to retrieve data.

 *
 * @usage
 * <mom-spinner
 *      mom-start-icon="startIcon"
 *      mom-spinner-icon="spinnerIcon"
 *      mom-spinner-fn="asynchronousFunction"
 *      mom-spinner-fn-params="{name1: value1, name2: value2...nameN: valueN}"
 *      mom-spinner-tag="spinnerTag"
 *      mom-spinner-id="spinnerId">
 * </mom-spinner>
 *
 * @scope
 * @priority 800
 * @default Default spinner icon: "icon-spin icon-refresh" (requires font-awesome stylesheet:
 *                          http://netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css)
 * @listens module:mom-spinner#startSpinner
 * @paramDescription
 * On the mom-spinner element add:
 *
 * * `mom-start-icon`: the icon that should appear before the asynchronous function is called. The name should be
 *   a Twitter Bootstrap icon name.
 * *  'mom-spinner-icon': the icon to use when the asynchronous function has been called but not yet returned. The name
 *   should be a Twitter Bootstrap icon name.
 * * `mom-spinner-fn`: the asynchronous function to call when this mom-spinner element is clicked.
 * * 'mom-spinner-fn-params': an object of name:value pairs that can be used to pass parameters to the asynchronous
 *   function. The naming, meaning and number of parameters is up to you and depends on the requirements of the
 *   asynchronous function you specify.
 * * 'mom-spinner-tag': tag this mom-spinner element with this value. Many mom-spinner elements can be given the same
 *   tag. When the tag is triggered via the startSpinner event, all mom-spinners with the same tag will execute their
 *   asynchronous functions and display their respective spinning icons. Note that despite having the same tag, each
 *   such mom-spinner element can have a different asynchronous function and spinning icon.
 * * 'mom-spinner-id': identifies this element uniquely. A startSpinner event can trigger this mom-spinner element
 *   and only this mom-spinner element.
 *
 * @example
 <mom-spinner
 mom-start-icon="'glyphicon glyphicon-ok'"
 mom-spinner-fn="model.asyncFn"
 mom-spinner-fn-params="{'icon-end':'glyphicon glyphicon-ok-sign', 'cell-name': 'Joe Bloggs'}"
 mom-spinner-tag="'icon-spin icon-refresh'">
 </mom-spinner>
 */

// Despite being a factory, the user of the service gets a new
// Paginator every time he calls the service. This is because
// we return a function that provides an object when executed
angular.module('momPaginator', [])

    // Service object function - pass in dependencies
    .factory('momPaginator', function($http) {

        // Service constructor - pass in service parameters
        return function(restSvc, pageSize, url, sortColumn) {

            var paginator = {
                hasNextVar: false,
                currentPageItems: [],
                qs : {},
                url: url,
                lastOperation: "load",
                sortColumn: sortColumn,
                sortAscending: true,
                setItems: function(items){
                    var self = this;

                    self.currentPageItems = items.slice(0, pageSize);
                    self.hasNextVar = items.length === pageSize + 1;
                },
                getItems: function(){
                    var self = this;
                    return self.currentPageItems;
                },

                resetQueryString: function(){
                    var self = this;

                    self.qs.page =  1;
                    self.qs.limit = 6;
                    self.qs.order_asc = sortColumn;
                },
                assembleQueryString: function(querystring){
                    var self = this;

                    if(typeof querystring !== "undefined"){
                        for (var attrname in querystring) {
                            self.qs[attrname] = querystring[attrname];
                        }
                    }
                    if(typeof self.sortColumn === "undefined"){
                        self.qs.orderAsc = self.sortColumn;
                    }
                },
                // Call the last requested operation with the current query string
                fetch: function(successCallback, failureCallback){
                    var self = this;

                    self[self.lastOperation](self.qs, successCallback, failureCallback);
                },
                load: function(querystring, successCallback, failureCallback){
                    var self = this;
                    self.assembleQueryString(querystring);

                    restSvc.query(
                        self.qs,
                        // Success
                        function(items) {
                            self.lastOperation =  "load";
                            self.currentPageItems = items.slice(0, pageSize);
                            self.hasNextVar = (items.length > pageSize);
                            if(successCallback && typeof(successCallback) === 'function'){
                                successCallback(items);
                            }
                        },
                        // Failure
                        function(responseVal){
                            if(failureCallback && typeof(failureCallback) === 'function'){
                                failureCallback(responseVal);
                            }
                        });
                },
                loadJsonp: function(querystring, successCallback, failureCallback){
                    var self = this;

                    self.assembleQueryString(querystring);
                    self.qs.callback = 'JSON_CALLBACK';
                    var config = {
                        params: self.qs
                    };
                    $http.jsonp(self.url, config)
                        .success(function(items, status, headers, config){
                            self.lastOperation =  "loadJsonp";
                            self.currentPageItems = items.slice(0, pageSize);
                            self.hasNextVar = items.length === pageSize + 1;
                            if(successCallback && typeof(successCallback) === 'function'){
                                successCallback(items);
                            }
                        })
                        .error(function(data, status, headers){
                            console.log("service data=" + data)
                            failureCallback(status);
                        })
                },
                search: function(querystring, successCallback, failureCallback){
                    var self = this;
                    self.assembleQueryString(querystring);

                    restSvc.search({tableName: 'dpdatasets'},
                        self.qs,
                        // Success
                        function(items) {
                            self.lastOperation =  "search";
                            self.currentPageItems = items.slice(0, pageSize);
                            self.hasNextVar = items.length === pageSize + 1;
                            if(successCallback && typeof(successCallback) === 'function'){
                                successCallback(items);
                            }
                        },
                        // Failure
                        function(responseVal){
                            if(failureCallback && typeof(failureCallback) === 'function'){
                                failureCallback(responseVal);
                            }
                        });
                },

                next: function(pageParamName, pageParamValue, successCallback, failureCallback) {
                    var self = this;

                    if (self.hasNextVar) {
                        self.qs.page += 1;
                        self.fetch(successCallback, failureCallback);
                    }
                },

                previous: function(successCallback, failureCallback) {
                    var self = this;
                    if(self.hasPrevious()) {
                        self.qs.page-= 1;
                        self.fetch(successCallback, failureCallback);
                    }
                },

                hasNext: function() {
                    var self = this;
                    return self.hasNextVar;
                },

                hasPrevious: function() {
                    var self = this;
                    return self.qs.page !== 0;
                },

                toggleSort : function(colName, successCallback, failureCallback){
                    var self = this;

                    self.resetQueryString();

                    self.sortColumn = colName;
                    self.sortAscending = !self.sortAscending;

                    if(self.sortAscending){
                        self.qs.order_asc = colName;
                        if('order_desc' in self.qs){
                            delete self.qs.order_desc;
                        }
                    }
                    else{
                        self.qs.order_desc = colName;
                        if('order_asc' in self.qs){
                            delete self.qs.order_asc;
                        }
                    }
                    self.fetch(successCallback, failureCallback);
                },
                getOrderBy : function(colName){
                    var self = this;

                    if(self.sortColumn === colName){
                        return self.sortAscending  ? 'up' : 'down';
                    }
                    else{
                        return 'neutral';
                    }
                }

            };

            // Initialise QueryString
            paginator.resetQueryString();

            return paginator;
        };

    });

