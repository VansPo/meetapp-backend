var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
        name: String,
        phone: String,
        skype: String,
        avatarUrl: String,
        about: String,
        token: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.userShort = function(jwt) {
    return {
        id: this._id,
        email: this.local.email,
        name: this.local.name,
        phone: this.local.phone,
        skype: this.local.skype,
        avatarUrl: this.local.avatarUrl,
        about: this.local.about,
        token: jwt
    };
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);