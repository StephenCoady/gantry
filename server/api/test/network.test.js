'use strict';

var assert = require('assert'),
  request = require('supertest'),
  controllers = require('../controllers'),
  app = require('../../../index'),
  chai = require('chai');

process.env.NODE_ENV = 'dev';

const expect = chai.expect;

const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

let login = {
  name: 'admin',
  password: 'admin'
}

let token;

describe('#network', () => {

  before(function(done) {
    request(app)
      .post('/api/users/authenticate/')
      .send(login)
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);
        token = res.body.token;
        done();
      });
  });

  describe('#create', () => {

    it('should not create a network without a name', (done) => {
      request(app)
        .post('/api/networks/')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it('should create a network', (done) => {
      request(app)
        .post('/api/networks/')
        .set('x-access-token', token)
        .send({
          Name: "testNetwork"
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          done();
        });
    });
  });

  describe('#list', () => {

    it('should list networks', (done) => {
      request(app)
        .get('/api/networks/')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific network', (done) => {
      request(app)
        .get('/api/networks/bridge')
        .set('x-access-token', token)
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
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe('#remove', () => {
    it('non-existent network should not be removed', (done) => {
      request(app)
        .delete('/api/networks/madeUpNetwork')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Network cannot be removed");
          done();
        });
    });

    it('network should be removed', (done) => {
      request(app)
        .delete('/api/networks/testNetwork')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Network removed successfully");
          done();
        });
    });
  });

});
