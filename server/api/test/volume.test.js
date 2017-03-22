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

let volume = {};

let login = {
  name: 'admin',
  password: 'admin'
}

let token;

describe('#volume', () => {

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

    it('should not create a volume without a name', (done) => {
      request(app)
        .post('/api/volumes/')
        .set('x-access-token', token)
        .send({
          Name: "my-network-@"
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          done();
        });
    });

    it('should create a volume', (done) => {
      request(app)
        .post('/api/volumes/')
        .set('x-access-token', token)
        .send({
          Name: "testvolume"
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          done();
        });
    });
  });

  describe('#list', () => {

    it('should list volumes', (done) => {
      request(app)
        .get('/api/volumes/')
        .set('x-access-token', token)
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
        .set('x-access-token', token)
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
        .set('x-access-token', token)
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
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Volume cannot be removed");
          done();
        });
    });

    it('volume should be removed', (done) => {
      request(app)
        .delete('/api/volumes/testvolume')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Volume removed successfully");
          done();
        });
    });
  });

});
