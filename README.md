# Token to Wei Converter Library

For X unit of token, show the corresponding value in wei, gwei, finney, ether, etc.
For Y ETH, show the corresponding value of token in unit A, unit B, unit C, etc.
Allow any number of subdemoninations in the token
Tie to the ETH standard based on a X Token Unit = Y ETH Unit

Support commonly used languages

- Python
- Javascript
- Elixir

### Function Signature

`TokenConvert(int value, string fromUnit, string toUnit)`

## Example Usage

```
TokenConvert(123, 'AST', 'ether') # Results in 123 AST being shown in ETH Ether equivalent
TokenConvert(123, 'AST') # Results in 123 AST being shown in wei
TokenConvert(123, 'AST', 'AIR') # Results in 123 AST being shown as AIR
TokenConvert(123, 'ether', 'wei') # Results in 123 ETH being shown in wei
TokenConvert(TokenConvert(123, 'AST', 'AIR'), 'AIR') # Gives the value of 123 AST in wei, but with an intermediate AIR translation, for example if the inner value is being transmitted via an API call
```

## Library goals

Ease of inputting values and denominations
Shortest path between units
String matching based on UPPER value
