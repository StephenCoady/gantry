'use strict';

var assert = require('assert'),
  request = require('supertest'),
  controllers = require('../controllers'),
  app = require('../app'),
  chai = require('chai');
  
process.env.NODE_ENV = 'dev';

const expect = chai.expect;

const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

var testImage = 'alpine:3.1';

describe('#image', () => {

  describe('#list', () => {
  
    // one image with one tag
    var repoTag = testImage;

    function locateImage(image, callback) {
      docker.listImages(function(err, list) {
        if (err) return callback(err);

        // search for the image in the RepoTags
        var image;
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].RepoTags.indexOf(repoTag) !== -1) {
            // ah ha! repo tags
            return callback(null, docker.getImage(list[i].Id));
          }
        }

        return callback();
      });
    }

    it('should pull image from remote source', function(done) {
      function handler() {
        locateImage(repoTag, function(err, image) {
          if (err) return done(err);
          // found the image via list images
          expect(image).to.be.ok;
          done();
        });
      }

      docker.pull(repoTag, function(err, stream) {
        if (err) return done(err);
         stream.pipe(process.stdout);
         stream.once('end', handler);
      });
    }).timeout(120000);

    it('should list images', (done) => {
      request(app)
        .get('/api/images/')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific image', (done) => {
      request(app)
        .get('/api/images/' + testImage)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.image.RepoTags[0]).to.be.equal(testImage);
          done();
        });
    });

    it('should not list non-existent image', (done) => {
      request(app)
        .get('/api/images/madeUpImage')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe('#history', () => {
    it('should list history of image', (done) => {
      request(app)
        .get('/api/images/' + testImage + '/history')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should not list history of non-existent image', (done) => {
      request(app)
        .get('/api/images/madeUpImage/history')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe('#remove', () => {
    it('should not remove non-existent image', (done) => {
      request(app)
        .delete('/api/images/madeUpImage')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          done();
        });
    });

    it('should remove image', (done) => {
      request(app)
        .delete('/api/images/' + testImage)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(10000);

  });

});
