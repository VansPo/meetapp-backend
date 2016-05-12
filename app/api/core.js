var jwt = require('jsonwebtoken');

function Core(app) {
    this.app = app;
}

Core.prototype.auth = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var app = this.app;
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
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

Core.prototype.message = function (success, message, data) {
    return {
        success: true,
        message: message,
        data: data
    }
};

module.exports = function (app) {
    return new Core(app);
};