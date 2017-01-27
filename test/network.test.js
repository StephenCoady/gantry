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

describe('#network', () => {

  describe('#list', () => {

    it('should list networks', (done) => {
      request(app)
        .get('/api/networks/')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific network', (done) => {
      request(app)
        .get('/api/networks/bridge')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
					expect(res.body.network.Name).to.be.equal('bridge');
          done();
        });
    });

    it('should not list non-existent network', (done) => {
      request(app)
        .get('/api/networks/madeUpNetwork')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

});
