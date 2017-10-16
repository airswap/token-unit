TokenUnit = require ('./lib/index.js')

console.log(new TokenUnit(10, 'kwei').amount == 10000)
console.log(new TokenUnit(123, 'gwei').amount == 123000000000)
console.log(new TokenUnit(11.45, 'ether').amount == 11450000000000000000)
console.log(new TokenUnit(0.01, 'szabo').amount == 10000000000)
console.log(new TokenUnit(1, 'ast').toString())
console.log(new TokenUnit(100, 'kwei').to('ether')) // { amount: 0.1, name: 'picoether', unit: 'ether' }
console.log(new TokenUnit((new TokenUnit(1000, 'kwei')) + (new TokenUnit(1001, 'kwei')), 'wei').toString()) // 2
