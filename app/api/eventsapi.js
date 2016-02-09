var User = require('../app/models/user');
var Event = require('../app/models/event');
var express = require('express');
var Core = require('../app/api/core.js');

module.exports = function(app, passport, jwt) {

  var apiRoutes = express.Router();

  apiRoutes.get('/event', Core.auth, function(req, res) {
    //fing all todos and send them is json format
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

  apiRoutes.post('/event', Core.auth, function(req, res) {

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

  apiRoutes.delete('/event/:event_id', Core.auth, function(req, res) {

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
}
