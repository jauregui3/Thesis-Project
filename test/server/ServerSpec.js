// remember to require files for testing here
var expect = require('chai').expect;

// server.js > module.exports = testVar;
var testVar = require('../../server.js');

describe('server tests', function() {
  it('should pass a sanity test', function() {
    expect(true).to.be.true;
  });

  it ('should find defined variables inside server files', function () {
    expect(testVar).to.equal('server var');
  });
});