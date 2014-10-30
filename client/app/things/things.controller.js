'use strict';

angular.module('veciApp')
  .controller('ThingsCtrl', function ($scope, Modal, $http, Auth, User) {

    $scope.things = [];
    $scope.addThingModal = {};

    $scope.me = User.get();

    function getThings() {
      $http.get('/api/things').success(function(things) {
        $scope.things = things;
      });
    }

    getThings();

    //show modal where thing can be added
    $scope.showAddThing = function() {
      $scope.addThingModal = Modal.openModalForm({
        modal: {
          dismissable: true,
          title: 'Add thing',
          html: '/app/things/addthing.html',
          submitText: 'Add thing',
          formName: 'addThingForm',
          formSubmitFn: $scope.addThing,
          buttons: [{
            classes: 'btn-default',
            text: 'Close',
            click: function(e) {
              $scope.addThingModal.close(e);
            }
          }]
        }
      });
    };

    // add thing to db
    $scope.addThing = function() {
      var that = this;
      $http.post('/api/things', {
        name: that.data.name,
        desc: that.data.desc,
        active: true,
        maintainer: {
          name: $scope.me.name,
          id: $scope.me._id
        },
        current: {
          name: $scope.me.name,
          contact: '',
          id: $scope.me._id
        }
      }).success(function() {
        console.log('Thing %s added', that.data.name);
        $scope.addThingModal.close();
        $scope.things = getThings();
      });
    };

    $scope.removeThing = Modal.confirm.delete(function(thing) { // callback when modal is confirmed
      $http.delete('/api/things/' + thing._id, {
        params: {}
      }).success(function() {
        getThings();
      });
    });

    $scope.showEditThing = function(thing) {
      var eThing = angular.copy(thing);
      $scope.editThingModal = Modal.openModalForm({
        modal: {
          dismissable: true,
          title: 'Edit thing',
          html: '/app/things/addthing.html',
          submitText: 'Edit thing',
          formName: 'editThingForm',
          formSubmitFn: $scope.editThing,
          data : eThing,
          buttons: [{
            classes: 'btn-default',
            text: 'Close',
            click: function(e) {
              $scope.editThingModal.dismiss(e);
            }
          }]
        }
      });
    };

    // add thing to db
    $scope.editThing = function(data) {
      console.log('lol');
      var that = this;
      $http.get('/api/users/me').success(function(me) {
        $http.put('/api/things/' + data._id, {
          name: that.data.name,
          desc: that.data.desc,
          active: true,
          maintainer: {
            name: $scope.me.name,
            id: $scope.me._id
          },
          current: {
            name: $scope.me.name,
            contact: '',
            id: $scope.me._id
          }
        }).success(function() {
          console.log('Thing %s added', that.data.name);
          $scope.editThingModal.close();
          $scope.things = getThings();
        });
      });
    };

  })
  .controller('AddThingCtrl', function($scope) {

  });
