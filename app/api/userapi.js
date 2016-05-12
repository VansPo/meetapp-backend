var User = require('../models/user');
var express = require('express');

module.exports = function (app, passport, jwt, core) {

    var apiRoutes = express.Router();

    apiRoutes.post('/signup', function (req, res) {

        console.log(req.body);

        var email = req.body.email;
        var password = req.body.password;

        if (!email || !password) {
            res.json({
                success: false,
                message: 'Not enough parameters'
            });
            return;
        }

        User.findOne({
            'local.email': email
        }, function (err, user) {
            // if there are any errors, return the error
            if (err)
                return res.json({
                    success: false,
                    message: err
                });

            // check to see if theres already a user with that email
            if (user) {
                return res.json({
                    success: false,
                    message: 'That email is already taken.'
                });
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                var token = jwt.sign(newUser, app.get('superSecret'), {
                    expiresInMinutes: 0 // never expires
                });

                var userShort = newUser.userShort(token);

                // save the user
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    res.json({
                        success: true,
                        data: userShort
                    });
                });
            }

        });
    });

    apiRoutes.post('/login', function (req, res) {

        // find the user
        console.log(req.body);
        if (!req.body.email || !req.body.password) {
            res.json({
                success: false,
                message: 'Not enough parameters'
            });
            return;
        }

        User.findOne({
            'local.email': req.body.email
        }, function (err, user) {

            console.log(user);

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                if (!user.validPassword(req.body.password)) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresInMinutes: 0 // never expires
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        data: user.userShort(token)
                    });
                }

            }

        });
    });

    apiRoutes.get('/user', function(req, res) {
        User.find({}, function(err, users) {
            if (err) throw err;

            var userList = [];
            users.forEach(function(user) {
               userList.push(user.userShort(null));
            });

            res.json(core.message(true, null, userList))
        })
    });

    app.use('/api', apiRoutes);
}
