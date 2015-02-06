'use strict';

angular.module('veciApp')
  .controller('ThingsCtrl', function ($scope, Modal, $http, Auth, User) {
    
    // initialise
    $scope.things = [];
    $scope.addThingModal = {};
    
    $scope.suggestedUsers = undefined;
    
    $scope.radioModel = 'all';
    
    // get me
    $scope.me = User.get();

    $scope.isMy = function(thing) {
      return thing.maintainer.email === $scope.me.email;
    };
    
    $scope.isAdmin = Auth.isAdmin;
    
    $scope.isBorrowedByMe = function(thing) {
      return ((thing.current.email === $scope.me.email) && (thing.maintainer.email !== $scope.me.email));
    };

    function getThings() {
      $http.get('/api/things').success(function(things) {
        $scope.things = things;
      });
    }

    getThings();
    
    
    function getMyThings() {
      console.log(User.get().$promise.then(function(data) {
        $http.get('/api/things/my/' + data.email) 
        .success(function(things) {
          $scope.things = things;
        });
      }));
    }
    
    
    function getBorrowedThings() {
      console.log(User.get().$promise.then(function(data) {
        $http.get('/api/things/borrowed/' + data.email) 
        .success(function(things) {
          $scope.things = things;
        });
      }));
    }
    
    
    $scope.toggleMode = function() {
      if ($scope.radioModel === 'all') {
        getThings();
      }
      else if ($scope.radioModel === 'my') {
        getMyThings();
      }
      else if ($scope.radioModel === 'borrowed') {
        getBorrowedThings();
      }
    };
    
    $scope.isOpen = [];

    $scope.toggleOpen = function (id) {
      console.log(id);
      $scope.isOpen[id] = $scope.isOpen[id] ==='is-open' ? '' :'is-open';
    };
    

    //show modal where thing can be added
    $scope.showAddThing = function() {
      $scope.addThingModal = Modal.openModalForm({
        modal: {
          dismissable: true,
          title: 'Add thing',
          html: 'app/things/addthing.html',
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
        },
        isAdmin : $scope.isAdmin,
        searchUsers : $scope.searchUsers
      });
    };

    // add thing to db
    $scope.addThing = function() {
      var that = this;
      
      var addObj = {
        name: that.data.name,
        desc: that.data.desc,
        maintainer: {
          name: $scope.me.name,
          email: $scope.me.email
        },
        current: {
          name: $scope.me.name,
          email: $scope.me.email
        }
      };
      
      if (Auth.isAdmin()) {
        addObj.maintainer = {
          name: that.data.maintainer.name,
          email: that.data.maintainer.email
        };
        addObj.current = {
          name: that.data.current.name,
          email: that.data.current.email
        };
      }
      
      $http.post('/api/things', addObj)
      .success(function() {
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
          html: 'app/things/editThing.html',
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
        },
        isAdmin : $scope.isAdmin,
        searchUsers : $scope.searchUsers
      });
    };

    // add thing to db
    $scope.editThing = function(data) {
      var that = this;
      
      var editObj = {
        name: that.data.name,
        desc: that.data.desc,
      };
      
      if (Auth.isAdmin) {
        angular.extend(editObj, {
          maintainer: {
            name: that.data.maintainer.name,
            email: that.data.maintainer.email
          },
          current: {
            name: that.data.current.name,
            email: that.data.current.email
          }
        });
      }

      $http.put('/api/things/' + data._id, editObj)
      .success(function() {
        console.log('Thing %s edited');
        $scope.editThingModal.close();
        $scope.things = getThings();
      });
    };
    
    $scope.showLendThing = function(thing) {
      var eThing = angular.copy(thing);
      $scope.lendThingModal = Modal.openModalForm({
        modal: {
          dismissable: true,
          title: 'Lend thing',
          html: 'app/things/lendThing.html',
          submitText: 'Lend thing',
          formName: 'lendThingForm',
          formSubmitFn: $scope.lendThing,
          data : {
            thing: eThing,
            suggestedUser: undefined
          },
          buttons: [{
            classes: 'btn-default',
            text: 'Close',
            click: function(e) {
              $scope.editThingModal.dismiss(e);
            }
          }]
        },
        searchUsers : $scope.searchUsers,
      });
    };
    
    $scope.lendThing = function(data) {
      var that = this;
      
      
      if (typeof data.suggestedUser === 'object') {
        console.log(data);
        
        $http.put('/api/things/' + data.thing._id, {
          current : {
            name: data.suggestedUser.name,
            email: data.suggestedUser.email
          }
        }).success(function() {
          console.log('Thing %s edited');
          $scope.lendThingModal.close();
          $scope.things = getThings();
        });
      }
    };
    
    
    function returnThing(thing) {
      console.log(thing);
    }
    
    $scope.returnThing = function(thing) {
      $scope.returnThingModal = Modal.openModal({
        modal: {
          dismissable: true,
          title: 'Return ' + thing.name,
          html: 'Are you sure you want to return <b>' + thing.name + '</b> to <b>' + thing.maintainer.name + '</b>?',
          data: thing,
          buttons: [{
            classes: 'btn-default',
            text: 'Close',
            click: function(e) {
              $scope.returnThingModal.close(e);
            }
          }, {
            classes: 'btn-primary',
            text: 'Yes',
            click: function() {
              $http.put('/api/things/' + thing._id, {
                current : {
                  name: thing.maintainer.name,
                  email: thing.maintainer.email
                }
              }).success(function() {
                console.log('Thing returned');
                $scope.returnThingModal.close();
                $scope.things = getThings();
              });
            }
          }]
        }
      });
    };
    
    
    
    
    $scope.searchUsers = function(val) {
      console.log(val);
      return $http.get('/api/users/search/' + val).then(function(response) {
        return response.data.map(function(user) {
          return {
            name : user.name,
            email : user.email
          };
        });
      });
    };

  })
  .controller('AddThingCtrl', function($scope) {

  });
