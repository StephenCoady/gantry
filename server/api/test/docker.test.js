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

let TEST_CONTAINER = {
  Image: 'ubuntu',
  AttachStdin: false,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
  OpenStdin: false,
  StdinOnce: false
};

let token;

let login = {
  name: 'admin',
  password: 'admin'
}

describe('#docker', () => {

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

  describe('#info', () => {
    it('should get host info', (done) => {
      request(app)
        .get('/api/docker/info')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });

  describe('#events', () => {
    it('should get docker events', (done) => {
      request(app)
        .get('/api/docker/events')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });

  describe('#logs', () => {
    let container_id = '';

    it('logs should not be retrieved for non-existent container', (done) => {
      request(app)
        .get('/api/docker/logs/madeUpContainer')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          expect(res.body.response).to.equal("Container not found");
          done();
        });
    });

    it('container should be created', (done) => {
      request(app)
        .post('/api/containers/create')
        .set('x-access-token', token)
        .send(TEST_CONTAINER)
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          container_id = res.body.data.id;
          expect(res.body.message).to.equal("Container created successfully");
          done();
        });
    });

    it('logs should be returned for container', (done) => {
      request(app)
        .get('/api/docker/logs/' + container_id)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('container should be removed', (done) => {
      request(app)
        .delete('/api/containers/' + container_id + '/remove')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container removed successfully");
          done();
        });
    });
  })
  describe('#upload', () => {

    it('error should be returned for missing file', (done) => {
      request(app)
        .post('/api/docker/upload/')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).to.be.equal(500);
          expect(res.body.error).to.equal("No file found in request");
          done();
        });
    });
    
    it('should upload file', (done) => {
      request(app)
        .post('/api/docker/upload/')
        .set('x-access-token', token)
        .attach('Dockerfile', 'Dockerfile')
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          done();
        });
    });
  })
});
