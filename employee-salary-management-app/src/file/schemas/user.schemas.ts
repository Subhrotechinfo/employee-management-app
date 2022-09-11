import * as mongoose from 'mongoose';
export var UserSchema = new mongoose.Schema({
    user_id:{type:Number},
    login_id:{type:String},
    name: { type: String },
    salary:{type:Number}
}, {
    timestamps: true,
    collection: 'users',
    strict: false
});