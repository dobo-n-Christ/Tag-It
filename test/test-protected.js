// 'use strict';

// const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');
// const {app, runServer, closeServer} = require('../server');
// const {User} = require('../users');
// const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
// const expect = chai.expect;
// chai.use(chaiHttp);

// describe('protected dashboard endpoint', function() {
//     const username = 'exampleUser';
//     const password = 'examplePassword';
//     const firstName = 'exampleFirst';
//     const lastName = 'exampleLast';
//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });
//     after(function() {
//         return closeServer();
//     });
//     beforeEach(function() {
//         return User.hashPassword(password)
//         .then(password => 
//             User.create({
//                 username,
//                 password,
//                 firstName,
//                 lastName
//             })
//         );
//     });
//     afterEach(function() {
//         return User.deleteOne();
//     });
//     describe('/dashboard', function() {
//         it('should reject request lacking credentials', function() {
//             return chai.request(app)
//             .get('/dashboard')
//             .then(function(res) {
//                 expect(res).to.have.status(401);
//             });
//         });
//         it('should reject request with invalid auth token', function() {
//             const token = jwt.sign(
//                 {
//                     user: {
//                         username,
//                         firstName,
//                         lastName
//                     }
//                 },
//                 'incorrectSecret',
//                 {
//                     algorithm: 'HS256',
//                     subject: username,
//                     expiresIn: '7d'
//                 }
//             );
//             return chai.request(app)
//             .get('/dashboard')
//             .set('Authorization', `Bearer ${token}`)
//             .then(function(res) {
//                 expect(res).to.have.status(401);
//             });
//         });
//         it('should reject request with expired auth token', function() {
//             const token = jwt.sign(
//                 {
//                     user: {
//                         username,
//                         firstName,
//                         lastName
//                     },
//                     exp: Math.floor(Date.now()/1000) - 10
//                 },
//                 JWT_SECRET,
//                 {
//                     algorithm: 'HS256',
//                     subject: username
//                 }
//             );
//             return chai.request(app)
//             .get('/dashboard')
//             .set('Authorization', `Bearer ${token}`)
//             .then(function(res) {
//                 expect(res).to.have.status(401);
//             });
//         });
//         it('should return protected data', function() {
//             const token = jwt.sign(
//                 {
//                     user: {
//                         username,
//                         firstName,
//                         lastName
//                     }
//                 },
//                 JWT_SECRET,
//                 {
//                     algorithm: 'HS256',
//                     subject: username,
//                     expiresIn: '7d'
//                 }
//             );
//             return chai.request(app)
//             .get('/dashboard')
//             .set('Authorization', `Bearer ${token}`)
//             .then(function(res) {
//                 expect(res).to.have.status(200);
//                 expect(res).to.be.json;
//                 expect(res.body).to.be.a('object');
//                 expect(res.body.data).to.equal('the Lion King 4KHD');
//             });
//         });
//     });
// });