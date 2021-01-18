const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
   
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialize
        delete ret._id;
        //delete ret.passwordHash;
    }
});

module.exports = mongoose.model('User', schema);