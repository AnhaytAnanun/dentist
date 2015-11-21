var Feedback = require('./feedback.model');
var User = require('../user/user.model');
var _ = require('lodash');

exports.clinicFeedback = function(req, res, next) {
	getFeedback(res, {
		target: req.clinic,
		targetType: 'clinic'
	});
};

exports.dentistFeedback = function(req, res, next) {
	getFeedback(res, {
		target: req.dentist,
		targetType: 'dentist'
	});
};

exports.patientFeedback = function(req, res, next) {
	getFeedback(res, {
		author: req.patient._id
	});
};

exports.create = function(req, res, next) {
	var body = _.pick(req.body, ['feedback', 'target', 'targetType', 'rate']);
	body.author = req.user.id;

	User.findOne({
		_id: body.target,
		role: body.targetType
	}, function(err, user) {
		if (err) {
			return res.status(500).send(err);
		}
		if (user == null) {
			return res.status(404).send();
		}

		Feedback.create(body, function(err, feedback) {
			if (err) {
				var status = 500;

				if (err.name && err.name == 'ValidationError') {
					status = 400;
				}

				return res.status(status).send(err);
			}
			
			res.status(201).send(feedback);
		});
	});
};

exports.destroy = function(req, res, next) {
	Feedback.remove({_id: req.feedback._id}, function(err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.status(200).send();
	});
};

var getFeedback = function(res, filter) {
	Feedback
		.find(filter)
		.select('-__v')
		.lean()
		.exec(function(err, feedbacks) {
			if (err) {
				return res.status(500).send(err);
			}
			
			res.status(200).send(feedbacks);
		});
};