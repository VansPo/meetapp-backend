var mongoose = require('mongoose');

var todo = mongoose.model('Todo', {
        text : String
    });


module.exports = mongoose.model('Todo', todo);
