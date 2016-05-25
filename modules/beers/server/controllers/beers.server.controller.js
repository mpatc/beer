'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Beer = mongoose.model('Beer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Beer
 */
exports.create = function(req, res) {
  var beer = new Beer(req.body);
  beer.user = req.user;

  beer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beer);
    }
  });
};

/**
 * Show the current Beer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var beer = req.beer ? req.beer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  beer.isCurrentUserOwner = req.user && beer.user && beer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(beer);
};

/**
 * Update a Beer
 */
exports.update = function(req, res) {
  var beer = req.beer ;

  beer = _.extend(beer , req.body);

  beer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beer);
    }
  });
};

/**
 * Delete an Beer
 */
exports.delete = function(req, res) {
  var beer = req.beer ;

  beer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beer);
    }
  });
};

/**
 * List of Beers
 */
exports.list = function(req, res) { 
  Beer.find().sort('-created').populate('user', 'displayName').exec(function(err, beers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beers);
    }
  });
};

/**
 * Beer middleware
 */
exports.beerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Beer is invalid'
    });
  }

  Beer.findById(id).populate('user', 'displayName').exec(function (err, beer) {
    if (err) {
      return next(err);
    } else if (!beer) {
      return res.status(404).send({
        message: 'No Beer with that identifier has been found'
      });
    }
    req.beer = beer;
    next();
  });
};
