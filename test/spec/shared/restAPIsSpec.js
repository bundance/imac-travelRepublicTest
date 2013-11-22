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
    var $httpBackend, $rootScope, createController, mockedJsonData, mockedTotalCountJsonData, paginatorCtrl, $controller;

    // load the controller's module
    beforeEach(module('angularMomPaginatorApp', 'rest.gitHubAPI', 'mockedGitHubJSON', 'mockedGitHubTotalCountJson', 'momUI.momPaginator'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        mockedJsonData = $injector.get('gitHubJSON');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');

        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');

        mockedTotalCountJsonData = $injector.get('gitHubTotalCountJson');
        //$httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(mockedTotalCountJsonData.fakeData);
    }));


    it('should contain a gitHubREST service', inject(function(gitHubREST) {
        expect(gitHubREST).toBeDefined();
    }));

    it('should contain a gitHubService service', inject(function(gitHubService) {
        expect(gitHubService).toBeDefined();
    }));



    /***
     * Test the Paginator.getTotalItemsCount() function
     */
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
     * Test the Paginator.hasMoreData function
     */
    describe("Paginator hasMoreData function", function(){

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







    /*
        describe("REST API error", function(){
            beforeEach(inject(function($injector) {
                $httpBackend.when('GET', 'https://api.github.com/users').respond(400, 'Invalid request');
            }));


            it('should gracefully fail when the response contains an error', function(){
                var controller = createController();


                $rootScope.model.paginator.getData().then(function(items){
                    expect(items.length).toBe(0);
                },
                //Failure
                function(responseVal){
                    expect($rootScope.model.paginator.errorMsg).not.toEqual({});
                    expect($rootScope.model.paginator.errorMsg.data).toEqual('Invalid request');
                });

                //$httpBackend.expectGET('https://api.github.com/users');

                $httpBackend.flush();

            });

        });

    /*
        getTotalItemsCount();.then(function(totalCount){
            $scope.model.totalItemsCount = totalCount;
        })


        describe("Successful REST API download", function(){
            beforeEach(inject(function($injector) {
                $httpBackend.when('GET', 'https://api.github.com/users').respond(mockedJsonData.fakeData);
            }));

            it('should fetch gitHub user data', function() {
                $httpBackend.expectGET('https://api.github.com/users');

                var controller = createController();

                $rootScope.model.paginator.getData().then(function(items){
                        expect(items.length).toBe(100);
                    },
                    //Failure
                    function(responseVal){
                        expect($rootScope.model.paginator.errorMsg).not.toEqual({});
                        expect($rootScope.model.paginator.errorMsg.data).toEqual('Invalid request');
                    });

                $httpBackend.flush();

                //expect($rootScope.model.paginator.currentPageItems[0].login).toEqual('mojombo');
                expect($rootScope.model.paginator.currentPageItems.length).toEqual(100);

            });

        });

        /*
        describe("Get Total items count", function(){
            // load the mocked gitHubJSON data

            beforeEach(inject(function($injector) {
                mockedTotalCountJsonData = $injector.get('gitHubTotalCountJson');
                $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(mockedTotalCountJsonData.fakeData);
            }));

            it('should return the total number of users in git hub', function(){
                $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

                $rootScope.model.paginator.getTotalItemsCount().then(
                    function(item_count){
                        expect(item_count).toBeGreaterThan(576089);
                    }
                );
               $httpBackend.flush();
            })
        });

    */

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});



