'use strict';

var assert = require('assert'),
  request = require('supertest'),
  controllers = require('../controllers'),
  app = require('../app'),
  chai = require('chai');

const expect = chai.expect;

const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

var testImage = 'ubuntu:14.04';

describe('#image', () => {

  describe('#list', () => {

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
    it('should not remove image', (done) => {
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
