var assert = require('assert');
var sinon = require('sinon');
var phonemeSequencer = require('../phonemesequencer');

describe('Create domain', function createDomainSuite() {
  it('should create a domain object with the expected methods',
    function createTest(testDone) {
      var chooseNextStub = sinon.stub();
      var choosePrevStub = sinon.stub();

      var domain = phonemeSequencer.createSyllableDomain({
        chooseFromNextTable: chooseNextStub,
        chooseFromPrevTable: choosePrevStub
      });

      assert.equal(domain.chooseFromNextTable, chooseNextStub);
      assert.equal(domain.chooseFromPrevTable, choosePrevStub);

      testDone();
    }
  );
});
