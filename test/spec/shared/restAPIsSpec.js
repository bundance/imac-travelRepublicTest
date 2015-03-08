'use strict';
/*

describe('Paginator Service', function() {
    beforeEach(module('momUI.momPaginator', 'rest.gitHubAPI'));

    var paginator;

    beforeEach(inject(function(momPaginator, gitHubData) {
        paginator = momPaginator(gitHubData);
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

    it('should contain a gitHubData service', inject(function(gitHubData) {
        expect(gitHubData).toBeDefined();
    }));


    /***
     * Test the gitHubData.getPage() function
     * /
    describe("gitHubData.getData() function", function(){
        var paginator;

        it("should format a url with per_page=3 in the querystring when getData(3) is called", inject(function(momPaginator, gitHubData) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);
            $httpBackend.expectGET("https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0");

            gitHubData.getData(3);
            $httpBackend.flush();
        }));

        it("should retrieve 3 items of data from fakeData when itemsPerPage is set to 3", inject(function(momPaginator, gitHubData) {
            $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=3&q=followers:%3E%3D0').respond(mockedTotalCount_3Records.fakeData);

            gitHubData.getData(3).then(function(items){
                expect(items.length).toEqual(3);
            });
            $httpBackend.flush();
        }));

    });




    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});


*/
