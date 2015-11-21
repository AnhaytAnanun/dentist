'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.createPatient);
router.post('/clinic', auth.isAuthenticated(), auth.hasRole('admin'), controller.createClinic);
router.post('/:clinic/dentist', auth.isAuthenticated(), auth.hasRole('admin'), controller.createDentist);
router.put('/:userEntity/password', auth.isAuthenticated(), controller.changePassword);
router.delete('/:userEntity', auth.hasRole('admin'), controller.destroy);

require('../params').initParams(router);

module.exports = router;