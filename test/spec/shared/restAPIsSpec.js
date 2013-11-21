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
        $httpBackend.when('GET', 'https://api.github.com/search/users?q=followers:%3E%3D1').respond(mockedTotalCountJsonData.fakeData);
    }));


    it('should contain a gitHubREST service', inject(function(gitHubREST) {
        expect(gitHubREST).toBeDefined();
    }));

    it('should contain a gitHubService service', inject(function(gitHubService) {
        expect(gitHubService).toBeDefined();
    }));

    var paginator;
    it("should have more data", inject(function(momPaginator, gitHubService) {
        $httpBackend.expectGET('https://api.github.com/search/users?q=followers:%3E%3D1');

        paginator = momPaginator(gitHubService);
        $httpBackend.flush();

        expect(paginator.hasMoreData()).toBeTruthy();
    }));







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



