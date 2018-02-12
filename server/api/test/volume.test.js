'use strict';

const request = require('supertest');
const app = require('../../../index');
const chai = require('chai');

process.env.NODE_ENV = 'dev';

const expect = chai.expect;

// const Docker = require('dockerode');
// const docker = new Docker({
//   socketPath: '/var/run/docker.sock'
// });

let volume = {};

describe('#volume', () => {

  before(function(done) {
    done();
  });

  describe('#create', () => {

    it('should not create a volume without a name', done => {
      request(app)
        .post('/api/volumes/')
        .send({
          Name: "my-network-@"
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          done();
        });
    });

    it('should create a volume', done => {
      request(app)
        .post('/api/volumes/')
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

    it('should list volumes', done => {
      request(app)
        .get('/api/volumes/')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          volume = res.body.volumes.Volumes[0];
          done();
        });
    });

    it('should list specific volume', done => {
      request(app)
        .get(`/api/volumes/${volume.Name}`)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.volume.Name).to.be.equal(volume.Name);
          done();
        });
    });

    it('should not list non-existent volume', done => {
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
    it('volume should not be removed', done => {
      request(app)
        .delete('/api/volumes/madeUpVolume')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.equal("Volume cannot be removed");
          done();
        });
    });

    it('volume should be removed', done => {
      request(app)
        .delete('/api/volumes/testvolume')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.equal("Volume removed successfully");
          done();
        });
    });
  });

});
