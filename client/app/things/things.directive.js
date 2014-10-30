'use strict';

angular.module('veciApp')
  .directive('things', function () {
    return {
      templateUrl: 'app/things/things.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: 'ThingsCtrl'
    };
  });
