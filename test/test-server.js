const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const app = require('../server');

chai.use(chaiHttp);

describe('URL test', function() {
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