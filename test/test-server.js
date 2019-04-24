'use strict';

const {describe, it} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Static endpoints', function() {
    describe('/', function() {

        it('should exist', function() {
            return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
        });
    });
    describe('/login', function() {
        it('should exist', function() {
            return chai.request(app)
            .get('/login')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
        });
    });
    describe('/register', function() {
        it('should exist', function() {
            return chai.request(app)
            .get('/register')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
        });
    });
    describe('/dashboard', function() {
        it('should exist', function() {
            return chai.request(app)
            .get('/dashboard')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
        });
    });
});
