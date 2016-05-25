'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  rating: {
    type: String,
    default: '',
    trim: true
  },
  sampled: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


// ArticleSchema.pre('save', function(next, done) {
//   var self = this;
//   mongoose.models['Article'].findOne({
//     name: self.email
//   }, function(err, results) {
//     if (err) {
//       done(err);
//     } else if (results) { //there was a result found, so the email address exists
//       self.invalidate('email', 'email must be unique');
//       done(new Error('email must be unique'));
//     } else {
//       done();
//     }
//   });
//   next();
// });


mongoose.model('Article', ArticleSchema);
