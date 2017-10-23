/**
* TokenUnit v0.1.7
* Convert between token units and ether units
* (c) 2017 Airswap
* airswap.io
*
* Written by Adam Link
*/
const fs = require('fs')
const unitDirectory = '/../../units'
const _ = require('lodash')
const big = require('big.js')

var tokens = []

if (typeof fs.readdirSync === "function") { // We are running on NodeJS
  tokens = _.values(require('require-all')({
    dirname: __dirname + '/' + unitDirectory
  }))
} else { // We may be on React
  tokens = [
    require(unitDirectory + '/ether.json'),
    require(unitDirectory + '/ast.json')
  ]
}

/**
* TokenUnit(amount, unit)
* @param {number} amount The number amount of tokens in the unit specified
* @param {string} unit The unit name for the amount specified
* @constructor
*/
class TokenUnit {
  constructor(amount, unit, options = {}) {
    big.DP = 32 // We can handle 32 decimal places by default

    if (options.big && options.big.DP) {
      big.DP = options.big.DP
    }

    if (!big(amount) || !unit) {
      throw new Error("Please provide an amount and unit during construction")
    }

    // The nominal unit's data
    this.scaleAndNominalUnitData = this.getScaleAndNominalUnit(unit)

    // The scaled unit data
    this.scaledUnit = this.scaleAndNominalUnitData.name
    this.scaledAmount = big(amount)

    // The common anchor unit for this nominal measurement metric
    this.anchorUnit = this.scaleAndNominalUnitData.anchor
    this.anchorAmount =
      big(this.convertToAnchor(
        this.scaledAmount,
        this.scaleAndNominalUnitData
      ))

    // Fill in the ether equivalent for this anchor amount
    this.etherEquivalent =
      big(this.findEtherEquivalent(
        this.anchorAmount,
        this.scaleAndNominalUnitData
      ))

    // Include quote times here if applicable
    if (options.quoteFromTime && options.quoteToTime) {
      this.quoteFromTime = options.quoteFromTime
      this.quoteToTime = options.quoteToTime
    }
  }

  /**
  * getScaleAndNominalUnit(unit)
  * Searches the unit JSON files for the unit string specified
  * and returns information about that nominal unit and the
  * scaled unit
  *
  * @param {string} unit The unit name (nominal or scale)
  * @return {object} The unit information found in the JSON files
  */
  getScaleAndNominalUnit(unit) {
    if (!unit) {
      throw new Error("Please provide a unit")
    }

    //
    var nominalUnitFile = _.find(tokens, { values: [ { name: unit } ] })
    var scaleData = _.find(nominalUnitFile.values, { name: unit })

    if (!nominalUnitFile || !scaleData) {
      throw new Error("Unsupported unit provided")
    }

    return {
      name: scaleData.name,
      to_anchor: big(scaleData.to_anchor),
      anchor: nominalUnitFile.anchor,
      starting_anchor_to_ether: big(nominalUnitFile.starting_anchor_to_ether),
      unit: nominalUnitFile.unit
    }
  }

  /**
  * convertToAnchor(scaleAmount, nominalUnitData)
  * Given a scaled amount and scale unit data, scale the amount to the
  * anchor unit for the nominal unit provided
  *
  * @param {number} scaleAmount The quantity of unit in the scaled unit
  * @param {object} scaleUnitData An object with the to_anchor scaling factor
  *     to convert the scaled unit to the nominal unit
  * @return {number} The amount of nominal units
  */
  convertToAnchor(scaleAmount, scaleUnitData) {
    return big(scaleAmount).times(big(scaleUnitData.to_anchor));
  }

  /**
  * findEtherEquivalent(nominalAmount, nominalUnitData)
  * Given the nominal amount and nominal unit data, find what this is worth
  * in ether.
  *
  * @param {number} nominalAmount The quantity of nominal units
  * @param {object} nominalUnitData An object that can be passed to the
  *     anchorToEther() function
  * @return {number} The amount of ether
  */
  findEtherEquivalent(nominalAmount, nominalUnitData) {
    // find the Ether Equivalent of the currency right now for quick display
    return big(nominalAmount).times(this.anchorToEther(nominalUnitData).price) // until we add Oracle
  }

  /**
  * anchorToEther(nominalUnit)
  * Convert the nominal units to ether, based on either (currently only)
  * the starting, JSON-pegged amount of nominal units to ether or
  * (eventually) the Oracle-provided price provided by the passed in Oracle class
  *
  * @param {object} nominalUnit The object nominal unit information, likely from
  *     getScaleAndNominalUnit()
  * @return {object} An object with the conversion price and timestamp of the
  *     quote provided
  */
  anchorToEther(nominalUnit) {
    // TODO
    // This is the function that should call the current market
    // price via Oracle for the TokenUnit / ETH pair.
    // It should return the value of 1 Nominal Unit in terms of ETH's ether
    // To discuss: do we want to peg this to ether or wei?

    return {
      price: big(nominalUnit.starting_anchor_to_ether).toString(),
      time: Date.now()
    }
  }

  /**
  * to(unit)
  * The workhorse of the library that converts from one scaled unit to
  * another scaled unit, which could be across nominal units as well. We
  * refer to scaled to scaled, within the same nominal unit, conversions
  * as a "scaling conversion" while nominal unit conversions are called
  * "currency conversions" since they change the token base.
  *
  * @param {string} unit The new scaled unit we are converting into
  * @return {TokenUnit} The new TokenUnit provided by the operation
  */
  to(unit) {
    const toUnitData = this.getScaleAndNominalUnit(unit)

    if (this.scaleAndNominalUnitData.unit == toUnitData.unit) {
      // Just a scaling conversion
      return new TokenUnit(
        this.scaleFromNominal(this.anchorAmount, toUnitData.to_anchor),
        toUnitData.name
      )
    } else { // Currency conversion with a new nominal unit
      const marketQuoteFrom = this.anchorToEther(this.scaleAndNominalUnitData)
      const fromAmountToEther =
        big(this.anchorAmount).times(marketQuoteFrom.price)
      const marketQuoteTo = this.anchorToEther(toUnitData)
      const fromEtherToTokenAnchor =
        big(fromAmountToEther).div(marketQuoteTo.price)

      return new TokenUnit(
        this.scaleFromNominal(fromEtherToTokenAnchor, toUnitData.to_anchor),
        toUnitData.name,
        {
          quoteFromTime: marketQuoteFrom.time,
          quoteToTime: marketQuoteTo.time
        }
      )
    }
  }

  /**
  * scaleFromNominal(nominalAmount, to_anchor)
  * Given a nominal quantity and a scaling factor, scale the nominal units
  * to the new scaled amount according to the to_anchor factor
  *
  * @param {number} nominalAmount The quantity of nominal units
  * @param {number} to_anchor The conversion factor of nominal to the new
  *     scaled unit amount
  * @return {number} The new quantity in scaled units
  */
  scaleFromNominal(nominalAmount, to_anchor) {
    return big(nominalAmount).div(big(to_anchor)).toString()
  }

  /**
  * add(tokenUnit)
  * Add a TokenUnit to the base TokenUnit and return a new instance of TokenUnit
  *
  * @param {TokenUnit} tokenUnit The TokenUnit to add to the base
  * @return {TokenUnit} A new instance of TokenUnit with the result of the add
  */
  add(tokenUnit) {
    if (!tokenUnit instanceof TokenUnit) {
      throw new Error("Argument passed in must be a TokenUnit type")
    }

    if (this.anchorUnit != tokenUnit.anchorUnit) {
      tokenUnit = tokenUnit.to(this.anchorUnit)
    }

    return new TokenUnit(
      this.scaleFromNominal(
        this.anchorAmount.add(tokenUnit.anchorAmount),
        this.scaleAndNominalUnitData.to_anchor
      ),
      this.scaledUnit
    )
  }

  /**
  * sub(tokenUnit)
  * A facade method for subtract()
  *
  * @param {TokenUnit} tokenUnit The TokenUnit to subtract from the base
  * @return {TokenUnit} A new instance of TokenUnit with the result of the
  *     subtract
  */
  sub(tokenUnit) {
    return this.subtract(tokenUnit)
  }

  /**
  * subtract(tokenUnit)
  * Subtract a TokenUnit from the base TokenUnit and return a new instance of
  * TokenUnit
  *
  * @param {TokenUnit} tokenUnit The TokenUnit to subtract from the base
  * @return {TokenUnit} A new instance of TokenUnit with the result of the
  *     subtract
  */
  subtract(tokenUnit) {
    if (!tokenUnit instanceof TokenUnit) {
      throw new Error("Argument passed in must be a TokenUnit type")
    }

    if (this.anchorUnit != tokenUnit.anchorUnit) {
      tokenUnit = tokenUnit.to(this.anchorUnit)
    }

    return new TokenUnit(
      this.scaleFromNominal(
        this.anchorAmount.sub(tokenUnit.anchorAmount),
        this.scaleAndNominalUnitData.to_anchor
      ),
      this.scaledUnit
    )
  }

  /**
  * toString()
  * Useful for console logging just the important parts
  *
  * @return {object} It actually returns an object though
  */
  toString() {
    return {
      scaledUnit: this.scaleAndNominalUnitData.name,
      scaledAmount: this.scaledAmount.toString(),
      anchorUnit: this.scaleAndNominalUnitData.anchor,
      anchorAmount: this.anchorAmount.toString(),
      etherEquivalent: this.etherEquivalent.toString()
    }
  }

  /**
  * get(key)
  * A simple getter function to make accessing parts of the TokenUnit easier
  *
  * @param {string} key The key to get from the TokenUnit
  * @return {string|number} The value of the key
  */
  get(key) {
    return this.toString()[key]
  }
}

module.exports = TokenUnit
