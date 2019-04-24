'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const {User} = require('./users');

const tagSchema = mongoose.Schema({tag: String});

const entrySchema = mongoose.Schema({
    entryName: {type: String, unique: true},
    category: String,
    tags: [tagSchema],
    description: String,
    contributors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    created: {type: Date, default: Date.now},
    // related: 
    // lastModified: 
    // comments: 
});

// entrySchema.pre('findOne', function(next) {
//     this.populate('tag');
//     next();
// });

// entrySchema.pre('find', function(next) {
//     this.populate('tag');
//     next();
// });

const Entry = mongoose.model('Entry', entrySchema);
// const Tag = mongoose.model('Tag', tagSchema);

module.exports = {Entry};

// {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}