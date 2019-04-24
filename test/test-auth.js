'use strict';

const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Auth API endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePassword';
    const firstName = 'exampleFirst';
    const lastName = 'exampleLast';
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    after(function() {
        return closeServer();
    });
    beforeEach(function() {
        return User.hashPassword(password)
        .then(password => 
            User.create({
                username,
                password,
                firstName,
                lastName
            })
        );
    });
    afterEach(function() {
        return User.deleteOne();
    });
    describe('/api/auth/login', function() {
        it('should reject request lacking credentials', function() {
            return chai.request(app)
            .post('/api/auth/login')
            .then(function(res) {
                expect(res).to.have.status(400);
            });
        });
        it('should reject request with incorrect username', function() {
            return chai.request(app)
            .post('/api/auth/login')
            .send({
                username: 'incorrectUsername',
                password
            })
            .then(function(res) {
                expect(res).to.have.status(401);
            });
        });
        it('should reject request with incorrect password', function() {
            return chai.request(app)
            .post('/api/auth/login')
            .send({
                username,
                password: 'incorrectPassword'
            })
            .then(function(res) {
                expect(res).to.have.status(401);
            });
        });
        it('should return valid auth token', function() {
            return chai.request(app)
            .post('/api/auth/login')
            .send({
                username,
                password
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(Object.keys(res.body).length).to.equal(1);
                expect(res.body).to.include.keys('authToken');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {algorithm: ['HS256']});
                expect(payload.user).to.deep.equal({
                    username,
                    firstName,
                    lastName
                });
            });
        });
    });
    describe('/api/auth/refresh', function() {
        it('should reject request lacking credentials', function() {
            return chai.request(app)
            .post('/api/auth/refresh')
            .then(function(res) {
                expect(res).to.have.status(401);
            });
        });
        it('should reject request with invalid auth token', function() {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
                    }
                },
                'incorrectSecret',
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return chai.request(app)
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                expect(res).to.have.status(401);
            });
        });
        it('should reject request with expired auth token', function() {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
                    },
                    exp: Math.floor(Date.now()/1000) - 10
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username
                }
            );
            return chai.request(app)
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                expect(res).to.have.status(401);
            });
        });
        it('should return valid auth token with newer expiration date', function() {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const decodedToken = jwt.decode(token);
            return chai.request(app)
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(Object.keys(res.body).length).to.equal(1);
                expect(res.body).to.include.keys('authToken');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {algorithm: ['HS256']});
                expect(payload.user).to.deep.equal({
                    username,
                    firstName,
                    lastName
                });
                expect(payload.exp).to.be.at.least(decodedToken.exp);
            });
        });
    });
});