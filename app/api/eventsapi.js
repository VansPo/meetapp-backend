var User = require('../models/user');
var Event = require('../models/event');
var express = require('express');

module.exports = function (app, passport, jwt, core) {

    var apiRoutes = express.Router();

    // NOTICE THE BIND HERE!!! fckin js
    apiRoutes.get('/event', core.auth.bind(core), function (req, res) {
        //console.log(req.user._doc._id);
        Event.paginate({
            "user._id": req.user._doc._id
        }, {
            populate: {
                path: 'user',
                select: '_id local.name local.avatarUrl'
            },
            page: req.query.page,
            limit: req.query.limit,
            sort: { createdAt: -1 }
        }, function (err, events) {
            if (err) res.send(err);
            res.json(core.message(true, null, events))
        });
    });


    //get all events (paginated)
    apiRoutes.get('/events', function (req, res) {
        //var options = {
        //  select:   'id title description',
        //  sort:     { date: -1 },
        //  populate: 'author',
        //  lean:     true,
        //  offset:   20,
        //  limit:    10
        //};
        //
        //Event.paginate(query, options).then(function(result) {

        Event.paginate({}, {
            populate: {
                path: 'user',
                select: '_id local.name local.avatarUrl'
            },
            page: req.query.page,
            limit: req.query.limit,
            sort: { createdAt: -1 }
        }, function (err, events) {
            if (err) res.send(err);
            res.json(core.message(true, null, events))
        });
    });

    apiRoutes.post('/event', core.auth.bind(core), function (req, res) {

        if (!req.body) {
            res.status(401).send({
                success: false,
                message: 'Not enough params'
            });
            return;
        }

        var event = new Event(req.body);
        event.user = req.user._doc._id;
        event.save(function (err, event) {
            if (err)
                res.send(err);

            else if (!event)
                res.send({
                    success: false,
                    message: 'Could not create event'
                });

            else res.json(core.message(true, null, event));
        });
    });

    apiRoutes.delete('/event/:event_id', core.auth.bind(core), function (req, res) {

        Event.remove({
            _id: req.params.event_id
        }, function (err, event) {
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
