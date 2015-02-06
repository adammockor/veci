'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/my/:email', controller.indexMy);
router.get('/borrowed/:email', controller.indexBorrowed);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;