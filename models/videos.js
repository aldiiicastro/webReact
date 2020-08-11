'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideosSchema = Schema({
    title: String,
    content: String,
    video: String,
    image: String
});

module.exports = mongoose.model('Videos', VideosSchema);
