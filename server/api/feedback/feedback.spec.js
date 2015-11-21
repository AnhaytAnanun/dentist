var request = require('supertest')('http://localhost:9000/api/feedbacks');
var should = require('should');
var app = require('../../app');
var Feedback = require('./feedback.model');
var User = require('../user/user.model');
var authTestUtils = require('../../test/utils/auth.utils');
var authTestData = require('../../test/data/auth.data');
var feedbackTestData = require('../../test/data/feedback.data');

describe('Feedback', function() {
	var patientToken;
	var patientId;
	var adminToken;
	var adminId;
	var clinicId;
	var dentistId;

	before(function(done) {
		Feedback.remove(done);
	});

	before(function(done) {
		User.remove(done);
	});

	before(function(done) {
		User.create(authTestData.clinic, function(err, clinic) {
			if (err) {
				return done(err);
			}

			clinicId = clinic.id;

			done();
		});
	});

	before(function(done) {
		User.create(authTestData.dentist, function(err, dentist) {
			if (err) {
				return done(err);
			}

			dentistId = dentist.id;

			done();
		});
	});

	before(function(done) {
		User.create(authTestData.patient, function(err, patient) {
			if (err) {
				return done(err);
			}

			patientId = patient.id;

			done();
		});
	});

	before(function(done) {
		User.create(authTestData.admin, function(err, admin) {
			if (err) {
				return done(err);
			}

			adminId = admin.id;

			done();
		});
	});

	before(function(done) {
		authTestUtils.signIn(authTestData.patient, function(err, token, status) {
			if (err) {
				return done(err);
			}

			patientToken = token;

			done();
		});
	});

	before(function(done) {
		authTestUtils.signIn(authTestData.admin, function(err, token, status) {
			if (err) {
				return done(err);
			}

			adminToken = token;

			done();
		});
	});

	describe('Create Feedback', function() {
		it('should respond with 401 if not authenticated', function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';

			request
				.post('')
				.send(feedbackTestData.properFeedback)
				.expect(401, done);
		});

		it('should respond with 403 if not patient', function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(feedbackTestData.properFeedback)
				.expect(403, done);
		});

		it('should respond with 400 if feedback is too short', function(done) {
			feedbackTestData.feedbackTooShort.target = clinicId;
			feedbackTestData.feedbackTooShort.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.feedbackTooShort)
				.expect(400, done);
		});

		it('should respond with 400 if feedback is too long', function(done) {
			feedbackTestData.feedbackTooLong.target = clinicId;
			feedbackTestData.feedbackTooLong.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.feedbackTooLong)
				.expect(400, done);
		});

		it('should respond with 400 if rate is too small', function(done) {
			feedbackTestData.rateTooSmall.target = clinicId;
			feedbackTestData.rateTooSmall.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.rateTooSmall)
				.expect(400, done);
		});

		it('should respond with 400 if rate is too small', function(done) {
			feedbackTestData.rateTooBig.target = clinicId;
			feedbackTestData.rateTooBig.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.rateTooBig)
				.expect(400, done);
		});

		it('should respond with 404 if invalid target type', function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'patient';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.properFeedback)
				.expect(404, done);
		});

		it('should respond with 404 if taget id does not exist', function(done) {
			feedbackTestData.properFeedback.target = '111111111111111111111111';
			feedbackTestData.properFeedback.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.properFeedback)
				.expect(404, done);
		});

		it('should respond with 500 if taget id is not an object id', function(done) {
			feedbackTestData.properFeedback.target = 'NotAnObjectId';
			feedbackTestData.properFeedback.targetType = 'clinic';

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.properFeedback)
				.expect(500, done);
		});

		it('shoult create feedback if everything ok', function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';
			feedbackTestData.properFeedback.author = patientId;

			request
				.post('')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(feedbackTestData.properFeedback)
				.expect(201, function(err, res) {
					if (err) {
						return done(err);
					}

					res.body.should.have.property('feedback', feedbackTestData.properFeedback.feedback);
					res.body.should.have.property('author', feedbackTestData.properFeedback.author);
					res.body.should.have.property('target', feedbackTestData.properFeedback.target);
					res.body.should.have.property('targetType', feedbackTestData.properFeedback.targetType);
					res.body.should.have.property('rate', feedbackTestData.properFeedback.rate);

					Feedback.findById(res.body._id, function(err, feedback) {
						if (err) {
							return done(err);
						}

						should.exist(feedback);
					});

					done();
				});
		});

		after(function(done) {
			Feedback.remove(done);
		});
	});

	describe('Get Feedbacks done by Patient', function() {
		var feedbackId;

		before(function(done) {
			Feedback.remove(done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = dentistId;
			feedbackTestData.properFeedback.targetType = 'dentist';
			feedbackTestData.properFeedback.author = '111111111111111111111111';

			Feedback.create(feedbackTestData.properFeedback, done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, function(err, feedback) {
				if (err) {
					return done(err);
				}

				feedbackId = feedback.id;

				done();
			});
		});

		it('should return 401 if not authenticated', function(done) {
			request
				.get('/patient/' + patientId)
				.expect(401, done);
		});

		it('should return 403 if not admin', function(done) {
			request
				.get('/patient/' + patientId)
				.set('Authorization', 'Bearer ' + patientToken)
				.expect(403, done);
		});

		it('should return 200 if admin', function(done) {
			request
				.get('/patient/' + patientId)
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200, done);
		});

		it('should return only patients feedbacks', function(done) {
			request
				.get('/patient/' + patientId)
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					var feedbacks = res.body;
					feedbacks.should.be.instanceOf(Array).and.have.lengthOf(1);
					var feedback = feedbacks[0];
					feedback.should.have.property('feedback', feedbackTestData.properFeedback.feedback);
					feedback.should.have.property('author', feedbackTestData.properFeedback.author);
					feedback.should.have.property('target', feedbackTestData.properFeedback.target);
					feedback.should.have.property('targetType', feedbackTestData.properFeedback.targetType);
					feedback.should.have.property('rate', feedbackTestData.properFeedback.rate);
					feedback.should.have.property('_id', feedbackId);
					feedback.should.not.have.property('__v');

					done();
				});
		});

		after(function(done) {
			Feedback.remove(done);
		});
	});

	describe('Get Feedback for Clinic', function() {
		var feedbackId;

		before(function(done) {
			Feedback.remove(done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = dentistId;
			feedbackTestData.properFeedback.targetType = 'dentist';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = '111111111111111111111111';
			feedbackTestData.properFeedback.targetType = 'clinic';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, function(err, feedback) {
				if (err) {
					return done(err);
				}

				feedbackId = feedback.id;

				done();
			});
		});

		it('should return only clinic feedbacks', function(done) {
			request
				.get('/clinic/' + clinicId)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					var feedbacks = res.body;
					feedbacks.should.be.instanceOf(Array).and.have.lengthOf(1);
					var feedback = feedbacks[0];
					feedback.should.have.property('feedback', feedbackTestData.properFeedback.feedback);
					feedback.should.have.property('author', feedbackTestData.properFeedback.author);
					feedback.should.have.property('target', clinicId);
					feedback.should.have.property('targetType', 'clinic');
					feedback.should.have.property('rate', feedbackTestData.properFeedback.rate);
					feedback.should.have.property('_id', feedbackId);
					feedback.should.not.have.property('__v');

					done();
				});
		});

		after(function(done) {
			Feedback.remove(done);
		});
	});

	describe('Get Feedback for Dentist', function() {
		var feedbackId;

		before(function(done) {
			Feedback.remove(done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = clinicId;
			feedbackTestData.properFeedback.targetType = 'clinic';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = '111111111111111111111111';
			feedbackTestData.properFeedback.targetType = 'dentist';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = dentistId;
			feedbackTestData.properFeedback.targetType = 'dentist';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, function(err, feedback) {
				if (err) {
					return done(err);
				}

				feedbackId = feedback.id;

				done();
			});
		});

		it('should return only clinic feedbacks', function(done) {
			request
				.get('/dentist/' + dentistId)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					var feedbacks = res.body;
					feedbacks.should.be.instanceOf(Array).and.have.lengthOf(1);
					var feedback = feedbacks[0];
					feedback.should.have.property('feedback', feedbackTestData.properFeedback.feedback);
					feedback.should.have.property('author', feedbackTestData.properFeedback.author);
					feedback.should.have.property('target', dentistId);
					feedback.should.have.property('targetType', 'dentist');
					feedback.should.have.property('rate', feedbackTestData.properFeedback.rate);
					feedback.should.have.property('_id', feedbackId);
					feedback.should.not.have.property('__v');

					done();
				});
		});

		after(function(done) {
			Feedback.remove(done);
		});
	});

	describe('Delete Feedback', function() {
		var feedbackId;

		before(function(done) {
			Feedback.remove(done);
		});

		before(function(done) {
			feedbackTestData.properFeedback.target = dentistId;
			feedbackTestData.properFeedback.targetType = 'dentist';
			feedbackTestData.properFeedback.author = patientId;

			Feedback.create(feedbackTestData.properFeedback, function(err, feedback) {
				if (err) {
					return done(err);
				}

				feedbackId = feedback.id;

				done();
			});
		});

		it('should return 401 if not authenticated', function(done) {
			request
				.delete('/' + feedbackId)
				.expect(401, done);
		});

		it('should return 403 if not admin', function(done) {
			request
				.delete('/' + feedbackId)
				.set('Authorization', 'Bearer ' + patientToken)
				.expect(403, done);
		});

		it('should delete if admin', function(done) {
			request
				.delete('/' + feedbackId)
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					Feedback.findById(feedbackId, function(err, feedback) {
						if (err) {
							return done(err);
						}

						should(feedback).not.exist;

						done();
					});
				});
		});

		after(function(done) {
			Feedback.remove(done);
		});
	});

	after(function(done) {
		Feedback.remove(done);
	});

	after(function(done) {
		User.remove(done);
	});
});