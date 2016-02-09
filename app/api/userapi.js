var User = require('../app/models/user');
var express = require('express');

module.exports = function(app, passport, jwt) {

  var apiRoutes = express.Router();

  apiRoutes.post('/login', function(req, res) {

    // find the user
    console.log(req.body);
    if (!req.body.email ||
        !req.body.password) {
      res.json({
        success: false,
        message: 'Not enough parameters'
      });
      return;
    }

    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {

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
            message: 'Success',
            token: token
          });
        }

      }

    });
  });

  app.use('/api', apiRoutes);
}
