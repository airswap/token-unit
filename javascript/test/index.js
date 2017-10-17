const assert = require('assert')
const TokenUnit = require('./../lib/index.js')

describe('TokenUnit', () => {
  describe('Set Up Tests', () => {
    it('should show 0 ether works', () => {
      var testToken = new TokenUnit(0, 'ether')
      assert.equal(testToken.get('scaledAmount'), '0')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '0')
    })
    it('should show 10 ether is 10 ether', () => {
      var testToken = new TokenUnit(10, 'ether')
      assert.equal(testToken.get('scaledAmount'), '10')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '10000000000000000000')
    })
    it('should show 1 wei is 1 wei', () => {
      var testToken = new TokenUnit(1, 'wei')
      assert.equal(testToken.get('scaledAmount'), '1')
      assert.equal(testToken.get('scaledUnit'), 'wei')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1')
    })
    it('should show 1 ast is 10000 air', () => {
      var testToken = new TokenUnit(1, 'ast')
      assert.equal(testToken.get('scaledAmount'), '1')
      assert.equal(testToken.get('scaledUnit'), 'ast')
      assert.equal(testToken.get('anchorUnit'), 'air')
      assert.equal(testToken.get('anchorAmount'), '10000')
    })
    it('should handle negative numbers', () => {
      var testToken = new TokenUnit(-23, 'ether')
      assert.equal(testToken.get('scaledAmount'), '-23')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '-23000000000000000000')
    })
    it('should handle floats', () => {
      var testToken = new TokenUnit(0.12, 'ether')
      assert.equal(testToken.get('scaledAmount'), '0.12')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '120000000000000000')
    })
  })
  describe('Scaling Tests', () => {
    it('should show 0 ether is 0 kwei', () => {
      var testToken = new TokenUnit(0, 'ether').to('kwei')
      assert.equal(testToken.get('scaledAmount'), '0')
      assert.equal(testToken.get('scaledUnit'), 'kwei')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '0')
    })
    it('should show that 1 ether is 1 ether', () => {
      var testToken = new TokenUnit(1, 'ether').to('ether')
      assert.equal(testToken.get('scaledAmount'), '1')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')
    })
    it('should show that 1 ether is 1000000000000000000 wei', () => {
      var testToken = new TokenUnit(1, 'ether').to('wei')
      assert.equal(testToken.get('scaledAmount'), '1000000000000000000')
      assert.equal(testToken.get('scaledUnit'), 'wei')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')
    })
    it('should show that 1 ether is 1000 finney/milliether/milli', () => {
      var testToken = new TokenUnit(1, 'ether').to('finney')
      assert.equal(testToken.get('scaledAmount'), '1000')
      assert.equal(testToken.get('scaledUnit'), 'finney')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')

      testToken = testToken.to('milliether')
      assert.equal(testToken.get('scaledAmount'), '1000')
      assert.equal(testToken.get('scaledUnit'), 'milliether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')

      testToken = testToken.to('milli')
      assert.equal(testToken.get('scaledAmount'), '1000')
      assert.equal(testToken.get('scaledUnit'), 'milli')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')
    })
    it('should show that 0.12 kwei is 120 wei', () => {
      var testToken = new TokenUnit(0.12, 'kwei')
      assert.equal(testToken.get('scaledAmount'), '0.12')
      assert.equal(testToken.get('scaledUnit'), 'kwei')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '120')
    })
    it('should show that 0.00012 wei is 0.00000000000000000000000000000000012 tether', () => {
      var testToken = new TokenUnit(0.00012, 'wei', {big: {DP: 100}}).to('tether')
      assert.equal(testToken.get('scaledAmount'), '1.2e-34')
      assert.equal(testToken.get('scaledUnit'), 'tether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '0.00012')
    })
    it('should show that -10 kether is -10000000000000000 mwei/babbage/picoether', () => {
      var testToken = new TokenUnit(-10, 'kether').to('mwei')
      assert.equal(testToken.get('scaledAmount'), '-10000000000000000')
      assert.equal(testToken.get('scaledUnit'), 'mwei')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '-1e+22')

      testToken = testToken.to('babbage')
      assert.equal(testToken.get('scaledAmount'), '-10000000000000000')
      assert.equal(testToken.get('scaledUnit'), 'babbage')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '-1e+22')

      testToken = testToken.to('picoether')
      assert.equal(testToken.get('scaledAmount'), '-10000000000000000')
      assert.equal(testToken.get('scaledUnit'), 'picoether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '-1e+22')
    })
  })
  describe('Currency Conversion Tests', () => {
    it('should show 0 ether is 0 ast', () => {
      var testToken = new TokenUnit(0, 'ether').to('ast')
      assert.equal(testToken.get('scaledAmount'), '0')
      assert.equal(testToken.get('scaledUnit'), 'ast')
      assert.equal(testToken.get('anchorUnit'), 'air')
      assert.equal(testToken.get('anchorAmount'), '0')
    })
    it('should show 1000 ast is 1 eth', () => {
      var testToken = new TokenUnit(1000, 'ast')
      assert.equal(testToken.get('scaledAmount'), '1000')
      assert.equal(testToken.get('scaledUnit'), 'ast')
      assert.equal(testToken.get('anchorUnit'), 'air')
      assert.equal(testToken.get('anchorAmount'), '10000000')

      testToken = testToken.to('ether')
      assert.equal(testToken.get('scaledAmount'), '1')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '1000000000000000000')
    })
    it('should show 575 ast is 0.575 eth is 575000 air is 575000 szabo', () => {
      var testToken = new TokenUnit(575, 'ast')
      assert.equal(testToken.get('scaledAmount'), '575')
      assert.equal(testToken.get('scaledUnit'), 'ast')
      assert.equal(testToken.get('anchorUnit'), 'air')
      assert.equal(testToken.get('anchorAmount'), '5750000')

      testToken = testToken.to('ether')
      assert.equal(testToken.get('scaledAmount'), '0.575')
      assert.equal(testToken.get('scaledUnit'), 'ether')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '575000000000000000')

      testToken = testToken.to('air')
      assert.equal(testToken.get('scaledAmount'), '5750000')
      assert.equal(testToken.get('scaledUnit'), 'air')
      assert.equal(testToken.get('anchorUnit'), 'air')
      assert.equal(testToken.get('anchorAmount'), '5750000')

      testToken = testToken.to('szabo')
      assert.equal(testToken.get('scaledAmount'), '575000')
      assert.equal(testToken.get('scaledUnit'), 'szabo')
      assert.equal(testToken.get('anchorUnit'), 'wei')
      assert.equal(testToken.get('anchorAmount'), '575000000000000000')
    })
  })
  describe('Failure cases', () => {
    it('should show "abc" ether fails', () => {
      assert.throws(() => { new TokenUnit("abc", 'ether')},
        Error,
        "Please provide an amount and unit during construction")
    })
    it('should show unit "abc" fails', () => {
      assert.throws(() => { new TokenUnit(2, 'abc')},
        Error,
        "Please provide an amount and unit during construction")
    })
    it('should show converting to unit "abc" fails', () => {
      assert.throws(() => { (new TokenUnit(2, 'ether')).to('abc')},
        Error,
        "Please provide an amount and unit during construction")
    })
    it('should show no unit fails', () => {
      assert.throws(() => { new TokenUnit(2)},
        Error,
        "Please provide an amount and unit during construction")
    })
  })
})
