'use strict';

let request = require('supertest');
let app = require('../../index');
let chai = require('chai');
process.env.NODE_ENV = 'dev';

const expect = chai.expect;

let image = {
  repo: 'library',
  name: 'alpine',
  tag: '3.1'
};

describe('#image', () => {
  describe('#pull', () => {
    // one image with one tag
    it('should pull image from remote source', done => {
      request(app)
        .post('/api/images/pull')
        .send(image)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(120000);
  });
  describe('#list', () => {
    it('should list images', done => {
      request(app)
        .get('/api/images/')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific image', done => {
      request(app)
        .get('/api/images/' + image.name + ':' + image.tag)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.image.RepoTags[0]).to.be.equal(image.name + ':' + image.tag);
          done();
        });
    });

    it('should not list non-existent image', done => {
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
    it('should list history of image', done => {
      request(app)
        .get('/api/images/' + image.name + ':' + image.tag + '/history')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should not list history of non-existent image', done => {
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
    it('should not remove non-existent image', done => {
      request(app)
        .delete('/api/images/madeUpImage')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          done();
        });
    });

    it('should remove image', done => {
      request(app)
        .delete('/api/images/' + image.name + ':' + image.tag)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(10000);
  });
});
