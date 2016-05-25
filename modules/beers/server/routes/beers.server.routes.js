'use strict';

/**
 * Module dependencies
 */
var beersPolicy = require('../policies/beers.server.policy'),
  beers = require('../controllers/beers.server.controller');

module.exports = function(app) {
  // Beers Routes
  app.route('/api/beers').all(beersPolicy.isAllowed)
    .get(beers.list)
    .post(beers.create);

  app.route('/api/beers/:beerId').all(beersPolicy.isAllowed)
    .get(beers.read)
    .put(beers.update)
    .delete(beers.delete);

  // Finish by binding the Beer middleware
  app.param('beerId', beers.beerByID);
};
