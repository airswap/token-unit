/**
* Convert between tokens units and ether units
*/
const fs = require('fs')
const unitDirectory = '/../../units'
const _ = require('lodash')
const tokens = _.values(require('require-all')({
  dirname: __dirname + unitDirectory
}))

class TokenUnit {
  constructor(amount, unit) {
    if (!amount || !unit) {
      throw new Error("Please provide an amount and unit during construction")
    }

    this.unitData = this.getUnit(unit)
    this.prettyUnit = this.unitData.name
    this.prettyAmount = amount
    this.unit = this.unitData.anchor
    this.amount = this.convertToAnchor(this.prettyAmount, this.unitData)
    this.ether_equivalent = this.findEtherEquivalent(this.amount, this.unitData)
  }

  getUnit(unit) {
    if (!unit) {
      throw new Error("Please provide a unit")
    }

    // Find the unit's directory and open the unit JSON structure
    // Return the unit object for the requested unit
    var tokenFile = _.find(tokens, { values: [ { name: unit } ] })
    var unitData = _.find(tokenFile.values, { name: unit })

    return {
      name: unitData.name,
      to_anchor: unitData.to_anchor,
      anchor: tokenFile.anchor,
      starting_anchor_to_ether: tokenFile.starting_anchor_to_ether,
      unit: tokenFile.unit
    }
  }

  convertToAnchor(amount, unitData) {
    return amount * unitData.to_anchor;
  }

  findEtherEquivalent(amount, unitData) {
    return 0
  }

  to(unit) {
    const asUnitData = this.getUnit(unit)

    if (this.unitData.unit == asUnitData.unit) {
      // we are just scaling the current unit
      return {
        amount: this.scaleUnit(this.amount, asUnitData.to_anchor),
        name: asUnitData.name,
        unit: asUnitData.unit
      }
    } else {
      // this is a price transformation as well as scale
    }
  }

  scaleUnit(amount, to_anchor) {
    return amount / to_anchor
  }

  valueOf() {
    return this.amount || null
  }

  toString() {
    return {
      unitData: this.unitData,
      prettyUnit: this.unitData.name,
      prettyAmount: this.prettyAmount,
      unit: this.unitData.anchor,
      amount: this.amount,
      ether_equivalent: this.ether_equivalent
    }
  }
}

module.exports = TokenUnit
