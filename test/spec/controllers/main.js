'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('angularMomPaginatorApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});



describe('Controller: PaginatorCtrl', function () {

    // load the controller's module
    beforeEach(module('angularMomPaginatorApp'));

    var PaginatorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        PaginatorCtrl = $controller('PaginatorCtrl', {
            $scope: scope
        });
    }));

    it('Paginator should be defined', function () {
        expect(scope.model.paginator).toBeDefined();
    });
/*
    beforeEach(function(_$httpBackend_, gitHubJSON){
        $httpBackend.when('GET','yourAPI/call/here').respond(gitHubJSON.fakeData);
        //Your controller setup

    });

    it('should test my fake stuff',function(){
        $httpBackend.flush();
        //your test expectation stuff here

    })

*/
});



