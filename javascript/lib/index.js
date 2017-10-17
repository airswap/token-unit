/**
* Convert between tokens units and ether units
*/
const fs = require('fs')
const unitDirectory = '/../../units'
const _ = require('lodash')
const tokens = _.values(require('require-all')({
  dirname: __dirname + unitDirectory
}))
const big = require('big.js')

class TokenUnit {
  constructor(amount, unit) {
    if (!amount || !unit) {
      throw new Error("Please provide an amount and unit during construction")
    }

    this.unitData = this.getUnit(unit)
    this.prettyUnit = this.unitData.name
    this.prettyAmount = big(amount)
    this.unit = this.unitData.anchor
    this.amount = big(this.convertToAnchor(this.prettyAmount, this.unitData))
    this.etherEquivalent = big(this.findEtherEquivalent(this.amount, this.unitData))
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
      to_anchor: big(unitData.to_anchor),
      anchor: tokenFile.anchor,
      starting_anchor_to_ether: big(tokenFile.starting_anchor_to_ether),
      unit: tokenFile.unit
    }
  }

  convertToAnchor(amount, unitData) {
    return amount * unitData.to_anchor;
  }

  findEtherEquivalent(amount, unitData) {
    // find the Ether Equivalent of the currency right now for quick display
    return amount * this.unitAnchorToEther(unitData).price // until we add Oracle
  }

  unitAnchorToEther(unit) {
    return {
      price: big(unit.starting_anchor_to_ether).toString(),
      time: Date.now()
    }
    // TODO
    // This is the function that should call the current market
    // price for the TokenUnit / ETH exchange.
    // It should return the value of 1 Anchor Unit in terms of ETH's ether
    // To discuss: do we want to peg this to ether or wei?
  }

  to(unit) {
    const toUnitData = this.getUnit(unit)

    if (this.unitData.unit == toUnitData.unit) {
      // we are just scaling the current unit
      return {
        amount: this.scaleUnit(this.amount, toUnitData.to_anchor),
        name: toUnitData.name,
        unit: toUnitData.unit
      }
    } else {
      // this is a price transformation as well as scale
      // const to_anchor_to_ether_to_wei =
      //   this.scaleUnit(1, this.getUnit('ether').to_anchor) * this.unitAnchorToEther(toUnitData)
      // console.log('TO ANCHOR TO ETHER TO WEI', to_anchor_to_ether_to_wei)
      // const from_anchor_to_ether_to_wei =
      //   this.scaleUnit(1, this.unitData.to_anchor) * this.unitAnchorToEther(this.unitData)
      // console.log('FROM ANCHOR TO ETHER TO WEI', from_anchor_to_ether_to_wei)
      // var anchorValue =
      //   this.amount *
      //   from_anchor_to_ether_to_wei /
      //   to_anchor_to_ether_to_wei
      var marketQuoteFrom = this.unitAnchorToEther(this.unitData)
      var fromAmountToEther = big(this.amount).times(marketQuoteFrom.price)
      var marketQuoteTo = this.unitAnchorToEther(toUnitData)
      var fromEtherToTokenAnchor = big(fromAmountToEther).div(marketQuoteTo.price)
      // console.log(this.unitAnchorToEther(toUnitData).toString())
      // console.log(fromEtherToTokenAnchor.toString())

      return {
        amount: this.scaleUnit(fromEtherToTokenAnchor, toUnitData.to_anchor),
        name: toUnitData.name,
        unit: toUnitData.unit,
        quoteFromTime: marketQuoteFrom.time,
        quoteToTime: marketQuoteTo.time
      }
    }
  }

  scaleUnit(amount, to_anchor) {
    return big(amount).div(big(to_anchor)).toString()
  }

  toString() {
    return {
      prettyUnit: this.unitData.name,
      prettyAmount: this.prettyAmount.toString(),
      unit: this.unitData.anchor,
      amount: this.amount.toString(),
      etherEquivalent: this.etherEquivalent.toString()
    }
  }
}

module.exports = TokenUnit
