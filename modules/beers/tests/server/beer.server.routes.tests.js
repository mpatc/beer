'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Beer = mongoose.model('Beer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, beer;

/**
 * Beer routes tests
 */
describe('Beer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Beer
    user.save(function () {
      beer = {
        name: 'Beer name'
      };

      done();
    });
  });

  it('should be able to save a Beer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beer
        agent.post('/api/beers')
          .send(beer)
          .expect(200)
          .end(function (beerSaveErr, beerSaveRes) {
            // Handle Beer save error
            if (beerSaveErr) {
              return done(beerSaveErr);
            }

            // Get a list of Beers
            agent.get('/api/beers')
              .end(function (beersGetErr, beersGetRes) {
                // Handle Beer save error
                if (beersGetErr) {
                  return done(beersGetErr);
                }

                // Get Beers list
                var beers = beersGetRes.body;

                // Set assertions
                (beers[0].user._id).should.equal(userId);
                (beers[0].name).should.match('Beer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Beer if not logged in', function (done) {
    agent.post('/api/beers')
      .send(beer)
      .expect(403)
      .end(function (beerSaveErr, beerSaveRes) {
        // Call the assertion callback
        done(beerSaveErr);
      });
  });

  it('should not be able to save an Beer if no name is provided', function (done) {
    // Invalidate name field
    beer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beer
        agent.post('/api/beers')
          .send(beer)
          .expect(400)
          .end(function (beerSaveErr, beerSaveRes) {
            // Set message assertion
            (beerSaveRes.body.message).should.match('Please fill Beer name');

            // Handle Beer save error
            done(beerSaveErr);
          });
      });
  });

  it('should be able to update an Beer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beer
        agent.post('/api/beers')
          .send(beer)
          .expect(200)
          .end(function (beerSaveErr, beerSaveRes) {
            // Handle Beer save error
            if (beerSaveErr) {
              return done(beerSaveErr);
            }

            // Update Beer name
            beer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Beer
            agent.put('/api/beers/' + beerSaveRes.body._id)
              .send(beer)
              .expect(200)
              .end(function (beerUpdateErr, beerUpdateRes) {
                // Handle Beer update error
                if (beerUpdateErr) {
                  return done(beerUpdateErr);
                }

                // Set assertions
                (beerUpdateRes.body._id).should.equal(beerSaveRes.body._id);
                (beerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Beers if not signed in', function (done) {
    // Create new Beer model instance
    var beerObj = new Beer(beer);

    // Save the beer
    beerObj.save(function () {
      // Request Beers
      request(app).get('/api/beers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Beer if not signed in', function (done) {
    // Create new Beer model instance
    var beerObj = new Beer(beer);

    // Save the Beer
    beerObj.save(function () {
      request(app).get('/api/beers/' + beerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', beer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Beer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/beers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Beer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Beer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Beer
    request(app).get('/api/beers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Beer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Beer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beer
        agent.post('/api/beers')
          .send(beer)
          .expect(200)
          .end(function (beerSaveErr, beerSaveRes) {
            // Handle Beer save error
            if (beerSaveErr) {
              return done(beerSaveErr);
            }

            // Delete an existing Beer
            agent.delete('/api/beers/' + beerSaveRes.body._id)
              .send(beer)
              .expect(200)
              .end(function (beerDeleteErr, beerDeleteRes) {
                // Handle beer error error
                if (beerDeleteErr) {
                  return done(beerDeleteErr);
                }

                // Set assertions
                (beerDeleteRes.body._id).should.equal(beerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Beer if not signed in', function (done) {
    // Set Beer user
    beer.user = user;

    // Create new Beer model instance
    var beerObj = new Beer(beer);

    // Save the Beer
    beerObj.save(function () {
      // Try deleting Beer
      request(app).delete('/api/beers/' + beerObj._id)
        .expect(403)
        .end(function (beerDeleteErr, beerDeleteRes) {
          // Set message assertion
          (beerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Beer error error
          done(beerDeleteErr);
        });

    });
  });

  it('should be able to get a single Beer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Beer
          agent.post('/api/beers')
            .send(beer)
            .expect(200)
            .end(function (beerSaveErr, beerSaveRes) {
              // Handle Beer save error
              if (beerSaveErr) {
                return done(beerSaveErr);
              }

              // Set assertions on new Beer
              (beerSaveRes.body.name).should.equal(beer.name);
              should.exist(beerSaveRes.body.user);
              should.equal(beerSaveRes.body.user._id, orphanId);

              // force the Beer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Beer
                    agent.get('/api/beers/' + beerSaveRes.body._id)
                      .expect(200)
                      .end(function (beerInfoErr, beerInfoRes) {
                        // Handle Beer error
                        if (beerInfoErr) {
                          return done(beerInfoErr);
                        }

                        // Set assertions
                        (beerInfoRes.body._id).should.equal(beerSaveRes.body._id);
                        (beerInfoRes.body.name).should.equal(beer.name);
                        should.equal(beerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Beer.remove().exec(done);
    });
  });
});
