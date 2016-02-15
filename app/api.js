var User = require('../app/models/user');
var Event = require('../app/models/event');
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

  // route middleware to verify a token
  var auth = function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.user = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  };



  apiRoutes.get('/event', auth, function(req, res) {
    //fing all todos and send them in json format
    console.log(req.user);
    Event.find({
        userId: req.user.id
      },
      function(err, events) {
        if (err)
          res.send(err);

        res.json(events);
      });
  });

  apiRoutes.post('/event', auth, function(req, res) {

    if (!req.body.text) {
      res.status(401).send({
        success: false,
        message: 'Not enough params'
      });
      return;
    }

    Event.create({
      userId: req.user.id,
      text: req.body.text,
      done: false
    }, function(err, event) {
      if (err)
        res.send(err);

      if (!event)
        res.send({
          success: false,
          message: 'Could not create event'
        });

      res.json(event);
    });
  });

  apiRoutes.delete('/event/:event_id', auth, function(req, res) {

    Event.remove({
      _id: req.params.event_id
    }, function(err, event) {
      if (err)
        res.send(err);

      if (!event)
        res.send({
          success: false,
          message: 'Could not delete event'
        });

      res.send({
        success: true
      });
    })
  });

  app.use('/api', apiRoutes);
};
