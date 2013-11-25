'use strict';



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
});

