# TokenUnit Javascript Library

TokenUnit is a conversion library for Ethereum-based tokens to easily scale tokens and convert between tokens and ether. Future releases will include the ability to convert between tokens at exchange-listed prices based on passing in an Exchange class.


## Installation

```bash
$ npm install --save token-unit
```

## Usage

```javascript
const TokenUnit = require('token-unit')

var purchaseValue = new TokenUnit(10, 'ether')
var myTokenAmount = purchaseValue.to('myToken')
var newAmount = myTokenAmount.add(new TokenUnit(200, 'kwei'))
var executeOrderAmount = newAmount.get('anchorAmount')
```

## Public Object

```javascript
{
  scaledUnit (string),
  scaledAmount (string representing a number),
  anchorUnit (string),
  anchorAmount (string representing a number),
  etherEquivalent (string representing a number)
}
```

## Public Methods Available

We treat the calling object as immutable, hence all public methods return new instances of a TokenUnit with the new values from the operation.

* `new TokenUnit(amount, unit, options = {})`: Create a new TokenUnit of the specified amount and unit combination. Optional options object (unsupported as of yet). Returns a new TokenUnit.
* `to(unit)`: Convert the TokenUnit to the new specified unit. This function either does either a scaling or currency conversion. A **scaling** conversion, which is re-classifying the same unit into a new scale value (i.e. changing cents to dollars), is done when the two units share a common nominal base unit. A **currency** conversion occurs when the two units do not share a common nominal base unit (i.e. changing cents to yuan). This method returns a new TokenUnit.
* `add(tokenUnit)`: Add a TokenUnit to another TokenUnit. If the two do not share a common nominal base unit, then we do a currency conversion using the `to()` method. Returns a new TokenUnit of the same scale as the calling TokenUnit.
* `subtract(tokenUnit)`: Subtract a TokenUnit to another TokenUnit. If the two do not share a common nominal base unit, then we do a currency conversion using the `to()` method. Returns a new TokenUnit of the same scale as the calling TokenUnit.
* `sub(tokenUnit)`: A facade method for `subtract()` because how many times do developers get confused if it's `sub()` or `subtract()` in libraries?!
* `toString()`: Output the minimal information needed for console logging. It actually returns an object.
* `get(key)`: Get a specific key from the `toString()` object. Useful if you want to display the data.

## Questions or comments?

Reach out to the Airswap team at team@airswap.io with any questions or comments. We welcome well-constructed PRs into this library.
