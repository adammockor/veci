'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean,
  maintainer: {
    name: String,
    id: String
  },
  current: {
    name: String,
    contact: String,
    id: String
  }
});

module.exports = mongoose.model('Thing', ThingSchema);
