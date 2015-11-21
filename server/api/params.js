var Feedback = require('./feedback/feedback.model');
var User = require('./user/user.model');

exports.initParams = function (router) {
	router.param('feedback', function(req, res, next, id) {
		Feedback.findById(id, function(err, feedback) {
			if (err) {
				return res.status(500).send(err);
			}
			
			if (feedback == null) {
				return res.status(404).send();
			}
			
			req.feedback = feedback;
			next();
		});
	});

	router.param('clinic', function(req, res, next, id) {
		User.findOne({
			_id: id,
			role: 'clinic'
		}, function(err, clinic) {
			if (err) {
				return res.status(500).send(err);
			}
			
			if (clinic == null) {
				return res.status(404).send();
			}
			
			req.clinic = clinic;
			next();
		});
	});

	router.param('dentist', function(req, res, next, id) {
		User.findOne({
			_id: id,
			role: 'dentist'
		}, function(err, dentist) {
			if (err) {
				return res.status(500).send(err);
			}
			
			if (dentist == null) {
				return res.status(404).send();
			}
			
			req.dentist = dentist;
			next();
		});
	});

	router.param('patient', function(req, res, next, id) {
		User.findOne({
			_id: id,
			role: 'patient'
		}, function(err, patient) {
			if (err) {
				return res.status(500).send(err);
			}
			
			if (patient == null) {
				return res.status(404).send();
			}
			
			req.patient = patient;
			next();
		});
	});

	router.param('userEntity', function(req, res, next, id) {
		User.findById(id, function(err, userEntity) {
			if (err) {
				return res.status(500).send(err);
			}
			
			if (userEntity == null) {
				return res.status(404).send();
			}

			req.userEntity = userEntity;
			next();
		});
	});
};