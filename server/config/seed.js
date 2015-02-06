/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create({
    name: 'Vec #1',
    desc: 'Popis Veci #1',
    active: true,
    current : { 
      name : 'Test User', 
      contact : '', 
      email : 'test@test.com' 
    }, 
    maintainer : { 
      name : 'Test User', 
      email : 'test@test.com' 
    }
  }, {
    name: 'Vec #2',
    desc: 'Popis Veci #2',
    active: true,
    current : { 
      name : 'Admin', 
      contact : '', 
      email: 'admin@admin.com'
    }, 
    maintainer : { 
      name : 'Admin', 
      email : 'admin@admin.com' 
    }
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  },{
    provider: 'local',
    name: 'Test User #2',
    email: 'test2@test2.com',
    password: 'test2'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});