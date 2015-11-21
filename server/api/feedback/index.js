'use strict';

var express = require('express');
var controller = require('./feedback.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/clinic/:clinic', controller.clinicFeedback);
router.get('/dentist/:dentist', controller.dentistFeedback);
router.get('/patient/:patient', auth.isAuthenticated(), auth.hasRole('admin'), controller.patientFeedback);
router.post('/', auth.isAuthenticated(), auth.hasRole('patient'), controller.create);
router.delete('/:feedback', auth.hasRole('admin'), controller.destroy);

require('../params').initParams(router);

module.exports = router;