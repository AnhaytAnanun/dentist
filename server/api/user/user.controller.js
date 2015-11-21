'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

function validationError(res, err) {
    var status = 500;

    if (err.name && err.name == 'ValidationError') {
        status = 400;
    }

    return res.status(status).send(err);
}

exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function (err, users) {
        if(err) {
            return res.send(500, err);
        }

        res.status(200).send(users);
    });
};

/**
 * Creates a new user
 */
exports.createPatient = function (req, res, next) {
    var user = _.pick(req.body, ['email', 'name', 'password']);
    user.provider = 'local';
    user.role = 'patient';
    User.create(user, function(err, user) {
        if (err) {
            return validationError(res, err);
        }

        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.status(201).send({ token: token });
    });
};

exports.createClinic = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'clinic';
    newUser.save(function(err, user) {
        if (err) {
            return validationError(res, err);
        }

        res.status(201).send(user);
    });
};

exports.createDentist = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'dentist';
    newUser.save(function(err, user) {
        if (err) {
            return validationError(res, err);
        }

        res.status(201).send(user);
    });
};

exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(401);
        }

        res.status(200).send(user.profile);
    });
};

exports.destroy = function(req, res) {
    User.remove({_id: req.userEntity._id}, function(err) {
        if(err) {
            return res.send(500, err);
        }

        return res.send(200);
    });
};

exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) {
                    return validationError(res, err);
                }

                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword -__v', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json(401);
        }

        res.json(user);
    });
};

exports.authCallback = function(req, res, next) {
    res.redirect('/');
};