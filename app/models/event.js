var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    limit: 100
};

Schema = mongoose.Schema;

var Variant = new Schema({
    lat: Number,
    lon: Number,
    title: String,
    additional: {
        phone: String,
        openFrom: String,
        openTill: String
    },
    voteCount: Number
});

var eventSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    createdAt: { type:Date, required:false },
    updatedAt: { type:Date, required:false },
    dateFrom: { type:Date, required:false },
    dateTo: { type:Date, required:false },
    place: {
        voteClosed: Boolean,
        variants: [Variant]
    },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    invites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [String],
    type: String,
    done: {type: Boolean, default: false}
});
eventSchema.plugin(mongoosePaginate);

eventSchema.pre('save', function(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
