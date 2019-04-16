'use strict';

const {describe, it, before, after, afterEach} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/user', function() {
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
    afterEach(function() {
        return User.deleteOne();
    });
    describe('/api/users', function() {
        describe('POST', function() {
            it('should reject request with missing username', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field missing');
                    expect(res.body.location).to.equal('username');
                });
            });
            it('should reject request with missing password', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field missing');
                    expect(res.body.location).to.equal('password');
                });
            });
            it('should reject request with non-string username', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username: 11,
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Incorrect field type: string expected');
                    expect(res.body.location).to.equal('username');
                });
            });
            it('should reject request with non-string password', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password: 11,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Incorrect field type: string expected');
                    expect(res.body.location).to.equal('password');
                });
            });
            it('should reject request with non-string first name', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstName: 11,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Incorrect field type: string expected');
                    expect(res.body.location).to.equal('firstName');
                });
            });
            it('should reject request with non-string last name', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstName,
                    lastName: 11
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Incorrect field type: string expected');
                    expect(res.body.location).to.equal('lastName');
                });
            });
            it('should reject request with untrimmed username', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username: ` ${username} `,
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field cannot start or end with whitespace');
                    expect(res.body.location).to.equal('username');
                });
            });
            it('should reject request with untrimmed password', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password: ` ${password} `,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field cannot start or end with whitespace');
                    expect(res.body.location).to.equal('password');
                });
            });
            it('should reject request with empty username', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username: '',
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field must have at least 1 characters');
                    expect(res.body.location).to.equal('username');
                });
            });
            it('should reject request with password of fewer than 10 characters', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password: '123456789',
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field must have at least 10 characters');
                    expect(res.body.location).to.equal('password');
                });
            });
            it('should reject request with password of more than 72 characters', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password: new Array(73).fill('1').join(''),
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Field must have at most 72 characters');
                    expect(res.body.location).to.equal('password');
                });
            });
            it('should reject request with duplicate username', function() {
                User.create({
                    username,
                    password,
                    firstName,
                    lastName
                });
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Username already taken');
                    expect(res.body.location).to.equal('username');
                });
            });
            it('should create new user', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstName,
                    lastName
                })
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('username', 'firstName', 'lastName');
                    expect(res.body.username).to.equal(username);
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    return User.findOne({username});
                })
                .then(function(user) {
                    expect(user).to.not.be.null;
                    expect(user.password).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                    return user.validatePassword(password);
                })
                .then(function(validatedPassword) {
                    expect(validatedPassword).to.be.true;
                });
            });
            it('should trim first name and last name', function() {
                return chai.request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstName: ` ${firstName} `,
                    lastName: ` ${lastName} `
                })
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('username', 'firstName', 'lastName');
                    expect(res.body.username).to.equal(username);
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    return User.findOne({username});
                })
                .then(function(user) {
                    expect(user).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                });
            });
        });
    });
});