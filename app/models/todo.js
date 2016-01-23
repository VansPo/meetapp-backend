var mongoose = require('mongoose');

var todo = mongoose.model('Todo', {
        userId: String,
        text : String
    });


module.exports = mongoose.model('Todo', todo);
