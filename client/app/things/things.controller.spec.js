'use strict';

describe('Controller: ThingsCtrl', function () {

  // load the controller's module
  beforeEach(module('veciApp'));

  var ThingsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThingsCtrl = $controller('ThingsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
