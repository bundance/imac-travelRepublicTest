
'use strict';


describe('Paginator Service', function() {

    var paginator;

    var $httpBackend, $rootScope, mockedTotalCountJsonData, $q,
        $controller, mockedJsonData_3Records, mockedTotalCount_3Records, gitHubREST, momPaginator, gitHubData, spies = {};

    // load the modules
    beforeEach(module('momUI.momPaginator'));
    beforeEach(module('rest.gitHubAPI'));
    beforeEach(module('mockGitHubData'));

    beforeEach(inject(function(_$httpBackend_, _$q_,  _$rootScope_, _$controller_, _momPaginator_, _gitHubREST_, _gitHubData_,
                               gitHubJSON_3Records,  gitHubTotalCountJson, gitHubTotalCountJson_3Records) {

        $httpBackend = _$httpBackend_;
        $q = _$q_;

        // Get hold of a scope (i.e. the root scope)
        $rootScope = _$rootScope_;

        // The $controller service is used to create instances of controllers
        $controller = _$controller_;

        momPaginator = _momPaginator_;
        gitHubREST = _gitHubREST_;
        gitHubData = _gitHubData_;

        mockedJsonData_3Records = gitHubJSON_3Records;
        mockedTotalCountJsonData = gitHubTotalCountJson;
        mockedTotalCount_3Records = gitHubTotalCountJson_3Records;

    }));

    beforeEach(function(){
        spies.success = jasmine.createSpy();
        spies.error = jasmine.createSpy();
    });

    function setHttpBackendInitialisation(response){
        // getTotalItemsCount URL:
        return $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
            .respond(response || mockedTotalCountJsonData.fakeData);

    }


    function setHttpBackendGetPage(response){
        // getData URL:
        return $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0')
            .respond(response || mockedTotalCountJsonData.fakeData);
    }


    /***
     * Test the momPaginator.getPage() function
     */
    describe("momPaginator.initialise() function", function() {

        it("should initialise the paginator and assess how many items it can paginate", function () {
            // getTotalItemsCount URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            // getData URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function (totalItems) {
                    expect(totalItems).toBe(1000);
                    spies.success();

                })
                .catch(spies.error);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);
        });
    });
    
    /***
     * Test the momPaginator.getPage() function
     */
    describe("momPaginator.getPage() function", function(){


        it("should retrieve 10 pages of data from fakeData", inject(function(momPaginator, gitHubData) {
            // getTotalItemsCount URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            // getData URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(totalItems){
                    paginator.getPage().then(function(items){
                        expect(paginator.getCurrentPageItems().length).toEqual(10);
                        spies.success();
                    })
                    .catch(spies.error);
                })
                .catch(spies.error);
            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        }));

        it("should set currentPageItems to 3 items when only 3 items are returned (e.g. when downloading the last set of data)",
            function() {
                // getTotalItemsCount URL:
                $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

                paginator = momPaginator({
                    restSvc: gitHubData,
                    initialPage: 1,
                    itemsPerPage: 10,
                    sortIcons: {
                        sortIconUp: 'glyphicon glyphicon-arrow-up',
                        sortIconDown: 'glyphicon glyphicon-arrow-down',
                        sortIconNone: 'glyphicon glyphicon-resize-vertical'
                    }
                });

                paginator.initialise();

                // Flush paginator's initial call to https://api.github.com/users (we don't care about testing this here)
                $httpBackend.flush();

                // getData URL:
                $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0')
                    .respond(mockedTotalCount_3Records.fakeData);

                // Now test the getData() function to see if currentPageItems.length is correctly set to 3.
                paginator.getPage()
                    .then(function(responseVal){
                        expect(paginator.getCurrentPageItems().length).toEqual(3);
                        spies.success()
                    })
                    .catch(spies.error);

                $httpBackend.flush();

                expect(spies.success.callCount).toBe(1);
                expect(spies.error.callCount).toBe(0);
        });


        it("should return the response's error message when an error occurs", inject(function(momPaginator, gitHubData) {

            // getTotalItemsCount URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
                .respond(mockedTotalCountJsonData.fakeData);

            // getData URL:
            var responder = $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0')
                .respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise().then(function(){
                    responder.respond(503, 'bad data');
                    paginator.getPage()
                        .then(spies.success)
                        .catch(function(responseVal){
                            expect(responseVal.data).toEqual('bad data');
                            spies.error();
                        });
                })
                .catch(spies.error);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(spies.success.callCount).toBe(0);
            expect(spies.error.callCount).toBe(1);
        }));


        it("should return an empty array when pageExists returns false", inject(function(momPaginator, gitHubData) {

            // getTotalItemsCount URL:
            setHttpBackendInitialisation();

            // getData URL:
            setHttpBackendGetPage([]);

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise().then(function(){

                    // Set paginator up so it thinks no more pages exist
                    paginator.pageExists = function(){
                        return false;
                    };

                    paginator.getPage().then(function(responseVal){
                            expect(responseVal).toEqual([]);
                            spies.success();
                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        }));

    });


    describe("momPaginator.getTotalPageCount() function", function() {

        var paginator;

        it("should return 0 pages when there are 0 items", function () {

            // getTotalItemsCount URL:
            setHttpBackendInitialisation({});

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise().then(function () {
                expect(paginator.getTotalPagesCount()).toEqual(0);
                spies.success();
            })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should return 100 pages when there are 1000 items and 10 items per page", function () {

            setHttpBackendInitialisation();

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise().then(function () {
                expect(paginator.getTotalPagesCount()).toEqual(100);
                spies.success();
            })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should return 2 pages when there are 50 items per page", function () {

            setHttpBackendInitialisation();

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 500,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function () {
                    expect(paginator.getTotalPagesCount()).toEqual(2);
                    spies.success();
                })
                .catch(spies.error);
            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);
        });
    });




    /***
     * Test the Paginator.getTotalItemsCount() function
     */
    describe("Paginator.getTotalItemsCount() function", function(){

        beforeEach(function(){

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

        });

        it("should have a totalItemsCount mock value of 1000 (from fakeData) when first intialised", function() {

            setHttpBackendInitialisation();

            paginator.initialise()
                .then(function(){
                    setHttpBackendInitialisation();

                    paginator.getTotalItemsCount()
                        .then(function(itemCount){
                            expect(itemCount).toEqual(1000);
                            spies.success();
                        })
                        .catch(spies.failure);
                })
                .catch(spies.failure);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });

        it("should return a count of zero when an error occurs in getTotalItemsCount", function() {

            var responder = setHttpBackendInitialisation();
            responder.respond(503, 'bad data');

            paginator.initialise()
                .then(function(){
                    paginator.getTotalItemsCount()
                        .then(function(itemCount){
                            expect(itemCount).toEqual(0);
                            spies.success();
                        })
                        .catch(spies.failure);
                    })
                    .catch(spies.failure);


            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });

    });

    /***
     * Test the Paginator.pageExists function
     */
    describe("Paginator.pageExists()", function(){

        it("should return true when first called and page does exist", function() {

            setHttpBackendInitialisation();

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    expect(paginator.pageExists(1)).toBeTruthy();
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should return false when total_count is set to 0", function() {

            var responder = setHttpBackendInitialisation({});

            responder.respond({"total_count": 0});

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    expect(paginator.pageExists(0)).toBeFalsy();
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should return true for 4th page when there are 10 pages and we start at the third page (i.e. total_count " +
        "is set to 100, initialPage = 3, itemsPerPage = 10", function() {

            var responder = setHttpBackendInitialisation({});

            responder.respond({"total_count": 100});

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 3,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    expect(paginator.pageExists(4)).toBeTruthy();
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should return false for the 11th page when there are only 10 (i.e. with total_count set to 100, " +
        "initialPage = 10, itemsPerPage = 10", function() {

            var responder = setHttpBackendInitialisation({});

            responder.respond({"total_count": 100});

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 10,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){

                    expect(paginator.pageExists(11)).toBeFalsy();
                    spies.success();

                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);
        });


    });

    /***
     * Test the Paginator.next function
     */
    describe("Paginator next()", function(){

        var paginator;

        it("should successfully call another page of data when next is called and currentPageNum = 1, and set " +
        "currentPageNum === 2", function() {

            setHttpBackendInitialisation();

            // Handle paginator.next()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=2&per_page=10&q=followers:%3E%3D0&sort=').respond(mockedTotalCountJsonData.fakeData);
            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=2&per_page=10&q=followers:%3E%3D0&sort=');

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 10,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    spies.success();
                    paginator.next()
                        .then(
                            function(){
                                expect(paginator.getCurrentPageNum()).toEqual(2);
                                spies.success();
                            }
                        )
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);
        });


        it("should return an empty array when at the end of the pages and next() is called again", function() {

            setHttpBackendInitialisation();

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 10,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    spies.success();
                    paginator.next()
                        .then(function(items){
                                expect(items).toEqual([]);
                                spies.success();
                            })
                            .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);

        });


        it("should successfully retrieve the last page of data using next()", (function() {

            setHttpBackendInitialisation();

            // Handle paginator.next()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=10&per_page=100&q=followers:%3E%3D0&sort=').respond(mockedTotalCountJsonData.fakeData);

            // Initialise the paginator on page 9
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 9,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    expect(paginator.getCurrentPageNum()).toBe(9);
                    // page 10 should still exist
                    expect(paginator.pageExists(paginator.getCurrentPageNum() + 1)).toBeTruthy();
                    spies.success();
                    // Move to page 10
                    paginator.next()
                        .then(function(items){

                            expect(paginator.getCurrentPageNum()).toBe(10);
                            spies.success();

                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);
        }));
    });


    /***
     * Test the Paginator.prev function
     */
    describe("Paginator prev function", function(){

        var paginator;

        it("should successfully call another page of data when prev is called and there are previous pages", function() {

            setHttpBackendInitialisation();

            // Handle paginator.prev()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=4&per_page=100&q=followers:%3E%3D0&sort=').respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 5,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    spies.success();
                    paginator.prev()
                        .then(function(){
                            expect(paginator.getCurrentPageNum()).toEqual(4);
                            spies.success();
                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);
        });




        it("should fail to call another page of data using prev() when on page 1", function() {

            setHttpBackendInitialisation();

            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    spies.success();
                    paginator.prev()
                        .then(function(items){
                            expect(items).toEqual([]);
                            spies.success();
                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);

        });


        it("should successfully call the first page of data when prev is called and currentPageNum = 2", function() {

            setHttpBackendInitialisation();

            // Handle paginator.prev()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=')
                .respond(mockedTotalCountJsonData.fakeData);

            // Initialise the paginator on page 9
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 2,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function(){
                    expect(paginator.getCurrentPageNum()).toBe(2);
                    // page 10 should still exist
                    expect(paginator.pageExists(paginator.getCurrentPageNum() - 1)).toBeTruthy();
                    spies.success();
                    // Move to page 10
                    paginator.prev()
                        .then(function(items){

                            expect(paginator.getCurrentPageNum()).toBe(1);
                            spies.success();

                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);

        });

    });


    /***
     * Test the Paginator.first() and Paginator.last() functions
     */
    describe("Paginator first and last functions", function() {

        var paginator;

        it("should retrieve the first page when paginator.first() is called", function () {

            setHttpBackendInitialisation();

            // Handle paginator.first()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=')
                .respond(mockedTotalCountJsonData.fakeData);

            // Initialise the paginator on page 5
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 5,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function () {
                    expect(paginator.getCurrentPageNum()).toBe(5);
                    spies.success();
                    // Move to the first page
                    paginator.first()
                        .then(function (items) {

                            expect(paginator.getCurrentPageNum()).toBe(1);
                            spies.success();

                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);


        });

        it("should retrieve the last page when paginator.last() is called", function () {

            setHttpBackendInitialisation();

            // Handle paginator.last()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=10&per_page=100&q=followers:%3E%3D0&sort=')
                .respond(mockedTotalCountJsonData.fakeData);

            // Initialise the paginator on page 5
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 5,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function () {
                    expect(paginator.getCurrentPageNum()).toBe(5);
                    spies.success();
                    // Move to the last page
                    paginator.last()
                        .then(function (items) {

                            expect(paginator.getCurrentPageNum()).toBe(10);
                            expect(paginator.pageExists(paginator.getCurrentPageNum() + 1)).toBeFalsy();
                            spies.success();

                        })
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);


        });
    });

    /***
     * Test the Paginator.toggleSort() function
     */
    describe("Paginator.toggleSort() function", function() {

        var paginator;

        it("should make an HTTP request with 'sort=joined' and 'order=desc' when toggleSort(joined) is called", function () {

            setHttpBackendInitialisation();

            // Handle paginator.toggleSort()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);


            // This is the key test of a successful toggle - do we get  this HTTP request?
            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            // Initialise the paginator on page 1
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function () {

                    spies.success();
                    // Toogle Sort
                    paginator.toggleSort('joined')
                        .then(spies.success)
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);

        });


        it("should make an HTTP request with 'sort=joined' and 'order=asc' when toggleSort(joined) is called twice", function () {

            setHttpBackendInitialisation();

            // Handle paginator.toggleSort()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.when('GET', 'https://api.github.com/search/users?order=asc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            // This is the key test of a successful toggle - do we get these HTTP requests?
            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');
            $httpBackend.expectGET('https://api.github.com/search/users?order=asc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            // Initialise the paginator on page 1
            paginator = momPaginator({
                restSvc: gitHubData,
                initialPage: 1,
                itemsPerPage: 100,
                sortIcons: {
                    sortIconUp: 'glyphicon glyphicon-arrow-up',
                    sortIconDown: 'glyphicon glyphicon-arrow-down',
                    sortIconNone: 'glyphicon glyphicon-resize-vertical'
                }
            });

            paginator.initialise()
                .then(function () {

                    spies.success();
                    // Call Toogle Sort twice
                    var promise = $q.all(paginator.toggleSort('joined'), paginator.toggleSort('joined'))
                        .then(spies.success)
                        .catch(spies.error);
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(2);
            expect(spies.error.callCount).toBe(0);

        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

