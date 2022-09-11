import * as mongoose from 'mongoose';

export var MediaSchema = new mongoose.Schema({
    id: { type: Number } ,
    name: { type: String },
    url: { type: String },
    path: { type: String },
    filename: { type: String },
    size: { type: String },
    mimetype: { type: String },
    encoding: { type: String },
    base64data: { type: String },
    type: { type: String }
}, {
    timestamps: true,
    collection: 'media',
    strict: false
});