'use strict';

require('dotenv').config();
const {describe, it, before, after} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe('index page', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    after(function() {
        return closeServer();
    });
    it('should exist', function() {
        return chai.request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});

describe('login page', function() {
    it('should exist', function() {
        return chai.request(app)
        .get('/login')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});

describe('registration page', function() {
    it('should exist', function() {
        return chai.request(app)
        .get('/register')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});