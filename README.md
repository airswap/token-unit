# TokenUnit Library

For X unit of token, show the corresponding value in wei, gwei, finney, ether, etc.
For Y ETH, show the corresponding value of token in unit A, unit B, unit C, etc.
Tie to the ETH standard based on a X Token Unit = Y ETH Unit

Support commonly used languages

- Javascript (done)
- Python (not started)
- Elixir (not started)

### Suggested Function Signature

`TokenUnit(int value, string fromUnit, string toUnit)`

## Suggested Usage

```
TokenUnit(123, 'AST', 'ether') # Results in 123 AST being shown in ETH Ether equivalent
TokenUnit(123, 'AST') # Results in 123 AST being shown in wei
TokenUnit(123, 'AST', 'AIR') # Results in 123 AST being shown as AIR
TokenUnit(123, 'ether', 'wei') # Results in 123 ETH being shown in wei
TokenUnit(TokenUnit(123, 'AST', 'AIR'), 'AIR') # Gives the value of 123 AST in wei, but with an intermediate AIR translation, for example if the inner value is being transmitted via an API call
```

## Javascript Usage

The Javascript README for the `token-unit` npm package is [here](https://github.com/airswap/token-unit/tree/master/javascript).

The NPM package is [here](https://www.npmjs.com/package/token-unit)

## Library goals

Ease of inputting values and denominations
Shortest path between units
Real time exchange extensions
