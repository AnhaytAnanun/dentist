var request = require('supertest')('http://localhost:9000/api/users');
var should = require('should');
var app = require('../../app');
var User = require('../user/user.model');
var authTestUtils = require('../../test/utils/auth.utils');
var authTestData = require('../../test/data/auth.data');

describe('User', function() {
	var patientToken;
	var patientId;
	var adminToken;
	var adminId;

	before(function(done) {
		User.remove(done);
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

	describe('Sign Up', function() {
		it('should return 400 if no email', function(done) {
			request
				.post('/')
				.send(authTestData.patientInvalidEmail)
				.expect(400, done);
		});

		it('should return 400 if no password', function(done) {
			request
				.post('/')
				.send(authTestData.patientInvalidPassword)
				.expect(400, done);
		});

		it('should return 201 and valid token if user created', function(done) {
			request
				.post('/')
				.send(authTestData.secondPatient)
				.expect(201, function(err, res) {
					if (err) {
						return done(err);
					}

					var token = res.body.token;

					request
						.get('/me')
						.set('Authorization', 'Bearer ' + token)
						.expect(200, function(err, res) {
							if (err) {
								return done(err);
							}

							User.findOne({email: authTestData.secondPatient.email}, function(err, patient) {
								if (err) {
									return done(err);
								}

								patient.should.have.property('email', authTestData.secondPatient.email);
								patient.should.have.property('name', authTestData.secondPatient.name);
								patient.should.have.property('provider', 'local');
								patient.should.have.property('role', authTestData.secondPatient.role);

								done();
							});
						});
				});
		});

		it('should return 400 if email already in use', function(done) {
			request
				.post('/')
				.send(authTestData.secondPatient)
				.expect(400, done);
		});
	});

	describe('Create Clinic User', function() {
		it('should return 401 if not authenticated', function(done) {
			request
				.post('/clinic')
				.send(authTestData.clinic)
				.expect(401, done);
		});

		it('should return 403 if not admin', function(done) {
			request
				.post('/clinic')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(authTestData.clinic)
				.expect(403, done);
		});

				it('should return 400 if no email', function(done) {
			request
				.post('/clinic')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.patientInvalidEmail)
				.expect(400, done);
		});

		it('should return 400 if no password', function(done) {
			request
				.post('/clinic')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.patientInvalidPassword)
				.expect(400, done);
		});

		it('should return 201 and valid token if user created', function(done) {
			request
				.post('/clinic')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.secondClinic)
				.expect(201, function(err, res) {
					if (err) {
						return done(err);
					}

					var token = res.body.token;

					User.findOne({email: authTestData.secondClinic.email}, function(err, clinic) {
						if (err) {
							return done(err);
						}

						clinic.should.have.property('email', authTestData.secondClinic.email);
						clinic.should.have.property('name', authTestData.secondClinic.name);
						clinic.should.have.property('provider', 'local');
						clinic.should.have.property('role', authTestData.secondClinic.role);

						done();
					});
				});
		});
	});

	describe('Create Dentist User', function() {
		var clinicId;

		before(function(done) {
			User.create(authTestData.clinic, function(err, clinic) {
				if (err) {
					return done(err);
				}

				clinicId = clinic.id;

				done();
			});
		});

		it('should return 401 if not authenticated', function(done) {
			request
				.post('/' + clinicId + '/dentist')
				.send(authTestData.dentist)
				.expect(401, done);
		});

		it('should return 403 if not admin', function(done) {
			request
				.post('/' + clinicId + '/dentist')
				.set('Authorization', 'Bearer ' + patientToken)
				.send(authTestData.dentist)
				.expect(403, done);
		});

		it('should return 400 if no password', function(done) {
			request
				.post('/' + clinicId + '/dentist')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.patientInvalidPassword)
				.expect(400, done);
		});

		it('should return 404 if no clinic', function(done) {
			request
				.post('/111111111111111111111111/dentist')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.patientInvalidPassword)
				.expect(404, done);
		});

		it('should return 500 if clinic id not an object id', function(done) {
			request
				.post('/NotAnObjectId/dentist')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.patientInvalidPassword)
				.expect(500, done);
		});

		it('should return 201 and valid token if user created', function(done) {
			request
				.post('/' + clinicId + '/dentist')
				.set('Authorization', 'Bearer ' + adminToken)
				.send(authTestData.dentist)
				.expect(201, function(err, res) {
					if (err) {
						return done(err);
					}

					var token = res.body.token;

					User.findOne({email: authTestData.dentist.email}, function(err, dentist) {
						if (err) {
							return done(err);
						}

						dentist.should.have.property('email', authTestData.dentist.email);
						dentist.should.have.property('name', authTestData.dentist.name);
						dentist.should.have.property('provider', 'local');
						dentist.should.have.property('role', authTestData.dentist.role);

						done();
					});
				});
		});

		after(function(done) {
			User.remove({_id: clinicId}, done);
		});
	});

	describe('Get User Data', function() {
		it('should return 401 if not authenticated', function(done) {
			request
				.get('/me')
				.expect(401, done);
		});

		it('should return 200 and the proper user', function(done) {
			request
				.get('/me')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					res.body.should.have.property('email', authTestData.admin.email);
					res.body.should.have.property('name', authTestData.admin.name);
					res.body.should.have.property('role', authTestData.admin.role);
					res.body.should.not.have.property('salt');
					res.body.should.not.have.property('hashedPassword');
					res.body.should.not.have.property('__v');

					done();
				});
		});
	});

	describe('Delete User', function() {
		it('should return 401 if not authenticated', function(done) {
			request
				.delete('/' + patientId)
				.expect(401, done);
		});

		it('should return 403 if not admin', function(done) {
			request
				.delete('/' + patientId)
				.set('Authorization', 'Bearer ' + patientToken)
				.expect(403, done);
		});

		it('should return 404 if user do not exist', function(done) {
			request
				.delete('/111111111111111111111111')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(404, done);
		});

		it('should return 500 if user id is not an object id', function(done) {
			request
				.delete('/NotAnObjectId')
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(500, done);
		});

		it('should return 200 and delete user', function(done) {
			request
				.delete('/' + patientId)
				.set('Authorization', 'Bearer ' + adminToken)
				.expect(200, function(err, res) {
					if (err) {
						return done(err);
					}

					User.findById(patientId, function(err, user) {
						if (err) {
							return done(err);
						}

						should.not.exist(user);

						done();
					});
				});
		});
	});

	after(function(done) {
		User.remove(done);
	});
});