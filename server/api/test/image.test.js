'use strict';

let request = require('supertest');
let app = require('../../../index');
let chai = require('chai');
process.env.NODE_ENV = 'dev';

const expect = chai.expect;

let image = {
  repo: 'library',
  name: 'alpine',
  tag: '3.1'
};

let login = {
  name: 'admin',
  password: 'admin'
}

let token;

describe('#image', () => {

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

  describe('#pull', () => {
    // one image with one tag
    it('should pull image from remote source', done => {
      request(app)
        .post('/api/images/pull')
        .set('x-access-token', token)
        .send(image)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(120000);

    it('should pull image from remote source without a tag', done => {
      request(app)
        .post('/api/images/pull')
        .set('x-access-token', token)
        .send({
          repo: 'library',
          name: 'alpine',
          tag: ''
        })
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
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific image', done => {
      request(app)
        .get('/api/images/' + image.name + ':' + image.tag)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          image.Id = res.body.image.Id;
          expect(res.status).to.be.equal(200);
          expect(res.body.image.RepoTags[0]).to.be.equal(image.name + ':' + image.tag);
          done();
        });
    });

    it('should not list non-existent image', done => {
      request(app)
        .get('/api/images/madeUpImage')
        .set('x-access-token', token)
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
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should not list history of non-existent image', done => {
      request(app)
        .get('/api/images/madeUpImage/history')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe('#tag', () => {
    it('should not tag non-existent image', done => {
      request(app)
        .post('/api/images/madeUpImage/tag')
        .set('x-access-token', token)
        .send({
          repo: 'nginx',
          tag: 'latest'
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it('should tag image', done => {
      request(app)
        .post('/api/images/' + image.Id + '/tag')
        .set('x-access-token', token)
        .send({
          repo: 'test-repo',
          tag: 'test-tag'
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should list specific image', done => {
      request(app)
        .get('/api/images/' + image.name + ':' + image.tag)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.image.RepoTags[1]).to.be.equal('test-repo:test-tag');
          done();
        });
    });

  });

  describe('#remove', () => {
    it('should not remove non-existent image', done => {
      request(app)
        .delete('/api/images/madeUpImage')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(409);
          done();
        });
    });

    it('should remove image', done => {
      request(app)
        .delete('/api/images/' + image.name + ':' + image.tag)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(10000);

    it('should remove image tagged latest', done => {
      request(app)
        .delete('/api/images/' + image.name + ':latest')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    }).timeout(10000);
  });
});
