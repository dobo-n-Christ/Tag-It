const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const app = require('../server');

chai.use(chaiHttp);

describe('index page', function() {
    // before(function() {
    //     return runServer;
    // });
    // after(function() {
    //     return closeServer;
    // });
    it('should return a 200 status and HTML', function() {
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

describe('dashboard page', function() {
    it('should exist', function() {
        return chai.request(app)
        .get('/dashboard')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});