'use strict';

describe('Controller: DemoAppController', function () {

    var DemoAppController,
        paginator,
        scope,
        $controller,
        momPaginator,
        gitHubData,
        mockedTotalCountJsonData,
        $httpBackend;

    /**
     * Jasmine custom matcher for deep matching objects
     * @param k
     * @param v
     * @returns {*}
     */
    function replacer(k, v) {
        if (typeof v === 'function') {
            v = v.toString();
        } else if (window['File'] && v instanceof File) {
            v = '[File]';
        } else if (window['FileList'] && v instanceof FileList) {
            v = '[FileList]';
        }
        return v;
    }

    beforeEach(function(){
        this.addMatchers({
            toBeJsonEqual: function(expected){
                var one = JSON.stringify(this.actual, replacer).replace(/(\\t|\\n)/g,''),
                    two = JSON.stringify(expected, replacer).replace(/(\\t|\\n)/g,'');

                return one === two;
            }
        });
    });


    // load the controller's module
    beforeEach(module('travelRepublicTestApp'));
    beforeEach(module('momUI.momPaginator'));
    beforeEach(module('rest.gitHubAPI'));
    beforeEach(module('mockGitHubData'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, _$controller_, $rootScope, _momPaginator_, _gitHubData_, gitHubTotalCountJson) {

        scope = $rootScope.$new();
        $controller = _$controller_;
        momPaginator = _momPaginator_;
        gitHubData = _gitHubData_;
        mockedTotalCountJsonData = gitHubTotalCountJson;
        $httpBackend = _$httpBackend_;

    }));

    it('Should define paginator on the scope', function () {

        DemoAppController = $controller('DemoAppController', {
            $scope: scope,
            momPaginator: momPaginator,
            gitHubData: gitHubData
        });

        expect(DemoAppController.paginator).toBeDefined();
    });

    it("Should define model on the scope", function(){

        DemoAppController = $controller('DemoAppController', {
            $scope: scope,
            momPaginator: momPaginator,
            gitHubData: gitHubData
        });

        expect(DemoAppController.model).toBeJsonEqual({
            page: 1,
            pages: []
        });
    });

    it("Should call momPaginator's initialise() and getPage() functions", function(){

        // Expect HTTP request made from the initialise function call
        $httpBackend.when('GET', 'https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0')
            .respond(mockedTotalCountJsonData.fakeData);

        $httpBackend.expect('GET','https://api.github.com/search/users?page=1&per_page=1&q=followers:%3E%3D0');

        // Expect HTTP request made from the getPage() function call
        $httpBackend.when('GET', 'https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0')
            .respond(mockedTotalCountJsonData.fakeData);

        $httpBackend.expect('GET','https://api.github.com/search/users?order=desc&page=1&per_page=10&q=followers:%3E%3D0');

        // Check that getTotalItemsCount() was called
        spyOn(gitHubData ,'getTotalItemsCount').andCallThrough();

        DemoAppController = $controller('DemoAppController', {
            $scope: scope,
            momPaginator: momPaginator,
            gitHubData: gitHubData
        });

        $httpBackend.flush();

        expect(gitHubData.getTotalItemsCount).toHaveBeenCalled();

    });


});

