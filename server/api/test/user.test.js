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

let badPassword = {
  name: 'admin',
  password: 'notMyPassword'
}

let badUsername = {
  name: 'madeUpUser',
  password: 'madeUpPassword'
}

let token;

describe('#user', () => {

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

  describe('#authenticate', () => {
    it('should not authenticate bad password', done => {
      request(app)
        .post('/api/users/authenticate')
        .send(badPassword)
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    
    it('should not authenticate bad username', done => {
      request(app)
        .post('/api/users/authenticate')
        .send(badUsername)
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it('should authenticate good credentials', done => {
      request(app)
        .post('/api/users/authenticate')
        .send(login)
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });

});
