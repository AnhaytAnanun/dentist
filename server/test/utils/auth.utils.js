var request = require('supertest')('http://localhost:9000/auth');

exports.signIn = function(user, cb) {
    request
        .post('/local')
        .send({
            email: user.email,
            password: user.password
        })
        .end(function(err, res) {
            cb(err, res.body.token, res.statusCode);
        });
};