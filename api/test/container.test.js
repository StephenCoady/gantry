'use strict';

let assert = require('assert');
let request = require('supertest');
let app = require('../../index');
let chai = require('chai');

process.env.NODE_ENV = 'dev';

const expect = chai.expect;

const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

describe('#container', function () {
  var testContainer;

  before(function (done) {
    docker.createContainer({
      Image: 'ubuntu',
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
      OpenStdin: false,
      StdinOnce: false
    }, function (err, container) {
      if (err) {
        done(err);
      }
      testContainer = container.id;
      done();
    });
  });

  describe('#list', function() {

    it('should list containers', (done) => {
      request(app)
        .get('/api/containers/all')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal(testContainer, res.body.containers[0].Id);
          done();
        });
    });

    it('should list specific container', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal(testContainer, res.body.container.Id);
          done();
        });
    });

    it('should not list non-existent container', (done) => {
      request(app)
        .get('/api/containers/someMadeUpContainer')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          assert.equal(404, res.status, 'status should be 404');
          assert.equal(null, res.body.container);
          done();
        });
    });
  });

  describe('#start', function() {
    it('container should not be running', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("created", res.body.container.State.Status);
          done();
        });
    });

    it('container should start', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/start')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container started successfully");
          done();
        });
    });

    it('should list running containers', (done) => {
      request(app)
        .get('/api/containers/running')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('containers[0].Id', testContainer);
          done();
        });
    });

    it('non existent container should not start', (done) => {
      request(app)
        .post('/api/containers/madeUpContainer/start')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be started");
          done();
        });
    });
  });

  describe('#stop', function() {
    it('container should be running', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("running", res.body.container.State.Status);
          done();
        });
    });

    it('container should stop', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/stop')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container stopped successfully");
          done();
        });
    });

    it('non existent container should not stop', (done) => {
      request(app)
        .post('/api/containers/madeUpContainer/stop')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be stopped");
          done();
        });
    });
  });

  describe('#restart', function() {
    it('container should be stopped', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("exited", res.body.container.State.Status);
          done();
        });
    });

    it('container should restart', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/restart')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container restarted successfully");
          done();
        });
    });

    it('container should be started', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("running", res.body.container.State.Status);
          done();
        });
    });

    it('container should pause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/pause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container paused successfully");
          done();
        });
    });

    it('container should not restart', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/restart')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be restarted");
          done();
        });
    });

    it('container should unpause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/unpause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container unpaused successfully");
          done();
        });
    });

    it('container should stop', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/stop')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container stopped successfully");
          done();
        });
    });
  });

  describe('#pause', function() {
    
    it('container should not pause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/pause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be paused");
          done();
        });
    });
    
    it('container should start', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/start')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container started successfully");
          done();
        });
    });

    it('container should pause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/pause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container paused successfully");
          done();
        });
    });

    it('container should be paused', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("paused", res.body.container.State.Status);
          done();
        });
    });
  });

  describe('#unpause', function() {

    it('container should unpause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/unpause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container unpaused successfully");
          done();
        });
    });

    it('container should be running', (done) => {
      request(app)
        .get('/api/containers/' + testContainer)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          assert.equal("running", res.body.container.State.Status);
          done();
        });
    });
    
    it('container should not unpause', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/unpause')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be unpaused");
          done();
        });
    });
  });


  describe('#remove', () => {
    
    it('container should not be removed', (done) => {
      request(app)
        .delete('/api/containers/' + testContainer + '/remove')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Container cannot be removed");
          done();
        });
    });
    
    it('container should stop', (done) => {
      request(app)
        .post('/api/containers/' + testContainer + '/stop')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container stopped successfully");
          done();
        });
    });

    it('container should be removed', (done) => {
      request(app)
        .delete('/api/containers/' + testContainer + '/remove')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Container removed successfully");
          done();
        });
    });
  })


});
