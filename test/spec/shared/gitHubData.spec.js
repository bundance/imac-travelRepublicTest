'use strict';


describe('GiHubData Service', function() {

    var $httpBackend, mockedTotalCountJsonData, mockedJsonData_3Records,
        mockedTotalCount_3Records, gitHubREST, gitHubData, spies = {};

    // load the modules
    beforeEach(module('momUI.momPaginator'));
    beforeEach(module('rest.gitHubAPI'));
    beforeEach(module('mockGitHubData'));

    beforeEach(inject(function(_$httpBackend_, _gitHubREST_, _gitHubData_,
                               gitHubJSON_3Records,  gitHubTotalCountJson, gitHubTotalCountJson_3Records) {

        $httpBackend = _$httpBackend_;
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

    describe("gitHubREST service", function() {

        it('should contain a gitHubREST service', function () {
            expect(gitHubREST).toBeDefined();
        });

        it('should contain a gitHubData service', function () {
            expect(gitHubData).toBeDefined();
        });

    });

    /***
     * Test the gitHubData.getPage() function
     */
    describe("gitHubData.getData() function", function(){

        it("should format a url with per_page=3 in the querystring when getData(3) is called", function() {

            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0')
                .respond(mockedTotalCount_3Records.fakeData);
            $httpBackend.expectGET("https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0");

            gitHubData.getData(3);
            $httpBackend.flush();
        });

        it("should retrieve 3 items of data from fakeData when itemsPerPage is set to 3", function() {

            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0')
                .respond(mockedTotalCount_3Records.fakeData);

            gitHubData.getData(3)
                .then(function(items){
                    expect(items.length).toEqual(3);
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should make an HTTP request with 'sort=joined' when sortColumn === 'joined", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            gitHubData.getData(100, 1, 'joined')
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should make an HTTP request with 'order=asc' when sortAscending is true", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=asc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=asc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            gitHubData.getData(100, 1, 'joined', true)
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should make an HTTP request with 'order=desc' when sortAscending is false", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            gitHubData.getData(100, 1, 'joined', false)
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });

        it("should make an HTTP request with 'order=desc' when sortAscending is undefined", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=100&q=followers:%3E%3D0&sort=joined');

            gitHubData.getData(100, 1, 'joined')
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("should make an HTTP request with per_page=10 when 10 items per page have been requested", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0');

            gitHubData.getData(10, 1)
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });

        it("should make an HTTP request with page=11 when the 11th page has been requested", function () {

            // Handle giHubData()'s HTTP requests
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=11&per_page=1&q=followers:%3E%3D0')
                .respond(mockedTotalCountJsonData.fakeData);

            $httpBackend.expectGET('https://api.github.com/search/users?order=desc&page=11&per_page=1&q=followers:%3E%3D0');

            gitHubData.getData(1, 11)
                .then(spies.success)
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });

    });


    describe('totalItemsCount()', function(){

       it("Should return a promise", function(){

           $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
               .respond(mockedTotalCount_3Records.fakeData);
           $httpBackend.expectGET("https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0");


           var promise = gitHubData.getTotalItemsCount();
           promise
               .then(spies.success)
               .catch(spies.error);

           $httpBackend.flush();

           expect(spies.success.callCount).toBe(1);
           expect(spies.error.callCount).toBe(0);

       });


       it("Should return 1,000 when 1,000 items exist", function(){

           $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
               .respond({total_count: 1000});
           $httpBackend.expectGET("https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0");

           var promise = gitHubData.getTotalItemsCount();
           promise
               .then(function(itemCount){
                    expect(itemCount).toBe(1000);
                   spies.success();
               })
               .catch(spies.error);

           $httpBackend.flush();

           expect(spies.success.callCount).toBe(1);
           expect(spies.error.callCount).toBe(0);

       });


        it("Should return 2 when 2 items exist", function(){

            $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
                .respond({total_count: 2});
            $httpBackend.expectGET("https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0");

            var promise = gitHubData.getTotalItemsCount();
            promise
                .then(function(itemCount){
                    expect(itemCount).toBe(2);
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        });


        it("Should return 1,000 when 100,000 items exist", function(){

            $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
                .respond({total_count: 100000});
            $httpBackend.expectGET("https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0");

            var promise = gitHubData.getTotalItemsCount();
            promise
                .then(function(itemCount){
                    expect(itemCount).toBe(1000);
                    spies.success();
                })
                .catch(spies.error);

            $httpBackend.flush();

            expect(spies.success.callCount).toBe(1);
            expect(spies.error.callCount).toBe(0);

        })

    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});



