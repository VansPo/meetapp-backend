var mongoose = require('mongoose');

var event = mongoose.model('Event', {
    userId: String,
    text : String
});


module.exports = mongoose.model('Event', event);
