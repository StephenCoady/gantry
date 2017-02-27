'use strict';

var assert = require('assert'),
  request = require('supertest'),
  controllers = require('../controllers'),
  app = require('../../index'),
  chai = require('chai');
  
process.env.NODE_ENV = 'dev';

const expect = chai.expect;

const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

let volume = {};

describe('#volume', () => {

  describe('#list', () => {

    it('should list volumes', (done) => {
      request(app)
        .get('/api/volumes/')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          volume = res.body.volumes.Volumes[0];
          done();
        });
    });

    it('should list specific volume', (done) => {
      request(app)
        .get('/api/volumes/' + volume.Name)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
					expect(res.body.volume.Name).to.be.equal(volume.Name);
          done();
        });
    });

    it('should not list non-existent volume', (done) => {
      request(app)
        .get('/api/volumes/madeUpNetwork')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });
  
  describe('#remove', () => {
    it('volume should not be removed', (done) => {
      request(app)
        .delete('/api/volumes/madeUpVolume')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Volume cannot be removed");
          done();
        });
    });
  });

});
