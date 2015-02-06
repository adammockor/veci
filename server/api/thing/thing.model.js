'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean,
  maintainer: {
    name: String,
    email: String
  },
  current: {
    name: String,
    email: String
  }
});

module.exports = mongoose.model('Thing', ThingSchema);
