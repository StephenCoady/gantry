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

describe('#docker', () => {

  describe('#info', () => {

    it('should get host info', (done) => {
      request(app)
        .get('/api/docker/info')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
