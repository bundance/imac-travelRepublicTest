'use strict';


describe('Paginator Service', function() {
    beforeEach(module('momUI.momPaginator', 'rest.gitHubAPI'));

    var paginator;

    beforeEach(inject(function(momPaginator, gitHubService) {
        paginator = momPaginator(gitHubService);
    }));


});


describe('Service: gitHubAPI', function () {

    // Setup $httpBackend mocks
    var $httpBackend, $rootScope, createController, mockedJsonData, mockedTotalCountJsonData, paginatorCtrl,
        $controller, mockedJsonData_3Records, mockedTotalCount_3Records;

    // load the modules
    beforeEach(module('angularMomPaginatorApp', 'rest.gitHubAPI', 'mockedGitHubJSON', 'mockedGitHubTotalCountJson',
        'mockedGitHubJSON_3Records', 'mockedGitHubTotalCountJson_3Records', 'momUI.momPaginator'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        mockedJsonData = $injector.get('gitHubJSON');
        mockedJsonData_3Records = $injector.get('gitHubJSON_3Records');
        mockedTotalCountJsonData = $injector.get('gitHubTotalCountJson');
        mockedTotalCount_3Records = $injector.get('gitHubTotalCountJson_3Records');


    }));


    it('should contain a gitHubREST service', inject(function(gitHubREST) {
        expect(gitHubREST).toBeDefined();
    }));

    it('should contain a gitHubService service', inject(function(gitHubService) {
        expect(gitHubService).toBeDefined();
    }));


    /***
     * Test the paginator.getPage() function
     */
    describe("gitHubService.getData() function", function(){
        var paginator;

        it("should format a url with per_page=3 in the querystring when getData(3) is called", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=3&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);
            $httpBackend.expectGET("https://api.github.com/search/users?per_page=3&q=followers:%3E%3D0");

            gitHubService.getData(3);
            $httpBackend.flush();
        }));

        it("should retrieve 3 items of data from fakeData when itemsPerPage is set to 3", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=3&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);

            gitHubService.getData(3).then(function(items){
                expect(items.length).toEqual(3);
            });
            $httpBackend.flush();
        }));

    });

    describe("momPaginator.getPage() function", function(){
        var paginator;

        it("should retrieve 10 items of data from fakeData when first intialised", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);
            // getTotalItemsCount URL:

            // getData URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=10&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator(gitHubService);

            paginator.promise.then(function(){
                expect(paginator.pageExists(paginator.currentPageNum + 1)).toBeTruthy();
                paginator.getPage().then(function(items){
                    expect(paginator.currentPageItems.length).toEqual(10);
                });
            });
            $httpBackend.flush();
        }));

        it("should set currentPageItems to 3 items when only 3 items are returned (e.g. when downloading the last set of data",
            inject(function(momPaginator, gitHubService) {
                // getTotalItemsCount URL:
                $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

                // getData URL:
                $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=10&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);

                paginator = momPaginator(gitHubService);
                // Flush paginator's initial call to https://api.github.com/users (we don't care about testing this here)
                $httpBackend.flush();

                // Artifically set itemsPerPage to 10
                paginator.itemsPerPage = 10;

                // Now test the getData() function to see if currentPageItems.length is correctly set to 3.
                paginator.getPage().then(function(responseVal){
                    expect(paginator.currentPageItems.length).toEqual(3);
                });
                $httpBackend.flush();
            }));

        it("should return the response's error message when an error occurs", inject(function(momPaginator, gitHubService) {
            // getTotalItemsCount URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            paginator = momPaginator(gitHubService);

            paginator.promise.then(function(){
                $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=10&q=followers:%3E%3D0').respond(400, 'bad data');
                paginator.getPage().then(function(responseVal){
                    expect(responseVal.data).toEqual('bad data');
                });
            });
            $httpBackend.flush();
        }));

        it("should return an empty array when hasMoreData is false", inject(function(momPaginator, gitHubService) {
            // getTotalItemsCount URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);

            // getData URL:
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=10&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);

            paginator = momPaginator(gitHubService);

            paginator.promise.then(function(){
                paginator.totalItemsCount = 0;
                paginator.getPage().then(function(responseVal){
                    expect(responseVal).toEqual([]);
                });
            });
            $httpBackend.flush();
        }));
    });


    describe("momPaginator.getTotalPageCount() function", function(){
        var paginator;

        beforeEach(inject(function(momPaginator, gitHubService){
            $httpBackend.when('GET', 'https://api.github.com/search/users?per_page=1&q=followers:%3E%3D0').respond(mockedTotalCountJsonData.fakeData);
            paginator = momPaginator(gitHubService);
        }));

        it("should return 0 pages when there are 0 items", function() {
            paginator.promise.then(function(){
                paginator.totalItemsCount = 0;
                expect(paginator.getTotalPagesCount()).toEqual(0);
            });
            $httpBackend.flush();
        });

        it("should return 20 pages when there are 20 items", function() {
            paginator.promise.then(function(){
                paginator.totalItemsCount = 20;
                expect(paginator.getTotalPagesCount()).toEqual(2);
            });
            $httpBackend.flush();
        });

        it("should return 3 pages when there are 21 items", function() {
            paginator.promise.then(function(){
                paginator.totalItemsCount = 21;
                expect(paginator.getTotalPagesCount()).toEqual(3);
            });
            $httpBackend.flush();
        });

        it("should return 0 pages when there are -1 items", function() {
            paginator.promise.then(function(){
                paginator.totalItemsCount = -1;
                expect(paginator.getTotalPagesCount()).toEqual(0);
            });
            $httpBackend.flush();
        });
    });



        /***
     * Test the Paginator.getTotalItemsCount() function
     * /
    describe("Paginator.getTotalItemsCount() function", function(){
        var paginator;

        it("should have a totalItemsCount mock value of 576097 (from fakeData) when first intialised", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(mockedTotalCountJsonData.fakeData);
            $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

            paginator = momPaginator(gitHubService);
            $httpBackend.flush();
            expect(paginator.totalItemsCount).toEqual(576097);

        }));

        it("should have a totalItemsCount of zero when an error occurs in getTotalItemsCount", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(400, "bad data");
            $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

            paginator = momPaginator(gitHubService);
            $httpBackend.flush();

            expect(paginator.totalItemsCount).toEqual(0);
        }));

        it("should return a count of 0 when an error occurs in getTotalItemsCount", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(400, "bad data");
            $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

            paginator = momPaginator(gitHubService);
            paginator.getTotalItemsCount().then(function(count){
                expect(count).toEqual(0);
            });
            $httpBackend.flush();

            expect(paginator.totalItemsCount).toEqual(0);
        }));

    });



    /***
     * Test the Paginator.pageExists function
     * /
    describe("Paginator pageExists function", function(){

        var paginator;

        it("should have more data when first called", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(mockedTotalCountJsonData.fakeData);
            $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

            paginator = momPaginator(gitHubService);
            $httpBackend.flush();

            expect(paginator.hasMoreData()).toBeTruthy();
        }));


        it("should not have more data with total_count set to 0", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond({"total_count": 0});

            paginator = momPaginator(gitHubService);
            $httpBackend.flush();

            expect(paginator.hasMoreData()).toBeFalsy();
        }));

        it("should have more data with total_count set to 100, pageOffset = 3, currentPageItems.length = 10", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond({"total_count": 100});

            paginator = momPaginator(gitHubService);
            paginator.pageOffset = 3;
            paginator.currentPageItems = [1,1,1,1,1,1,1,1,1,1];
            $httpBackend.flush();

            expect(paginator.hasMoreData()).toBeTruthy();
        }));

        it("should NOT have more data with total_count set to 100, pageOffset = 9, currentPageItems.length = 10", inject(function(momPaginator, gitHubService) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond({"total_count": 100});

            paginator = momPaginator(gitHubService);
            paginator.pageOffset = 9;
            paginator.currentPageItems = [1,1,1,1,1,1,1,1,1,1];
            $httpBackend.flush();

            expect(paginator.hasMoreData()).toBeFalsy();
        }));


    });
*/

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});



