'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    producer: String,
    image: String
});

module.exports = mongoose.model('Article', ArticleSchema);
