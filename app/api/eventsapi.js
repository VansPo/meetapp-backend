var User = require('../models/user');
var Event = require('../models/event');
var express = require('express');

module.exports = function(app, passport, jwt, core) {

  var apiRoutes = express.Router();

  // NOTICE THE BIND HERE!!! fckin js
  apiRoutes.get('/event', core.auth.bind(core), function(req, res) {
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

  apiRoutes.post('/event', core.auth.bind(core), function(req, res) {

    if (!req.body) {
      res.status(401).send({
        success: false,
        message: 'Not enough params'
      });
      return;
    }

    console.log(req.body);
    // just to be sure :)
    req.body.userId = req.user.id;
    Event(req.body).save(function(err, event) {
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

  apiRoutes.delete('/event/:event_id', core.auth.bind(core), function(req, res) {

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
