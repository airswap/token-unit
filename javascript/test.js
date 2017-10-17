TokenUnit = require ('./lib/index.js')

// console.log(new TokenUnit(10, 'kwei').amount == 10000)
// console.log(new TokenUnit(123, 'gwei').amount == 123000000000)
// console.log(new TokenUnit(11.45, 'ether').amount == 11450000000000000000)
// console.log(new TokenUnit(0.01, 'szabo').amount == 10000000000)
// console.log(new TokenUnit(1000, 'ast').toString().amount == 10000000)
// var kwei = new TokenUnit(100, 'kwei')
// console.log((kwei.to('ether')).get('scaledUnit')) // { amount: 0.1, name: 'picoether', unit: 'ether' }
// console.log(kwei.get('scaledUnit'))
// console.log((kwei.to('ast')).get('scaledUnit'))
// console.log(kwei.get('scaledUnit'))
console.log(
  // new TokenUnit(
    new TokenUnit(1, 'ether').subtract(
      //new TokenUnit(1001, 'kwei')
      new TokenUnit(1001, 'ast')
    ).toString()
    // ),
  //   'wei'
  // ).toString()
) // 2
// console.log(new TokenUnit(1, 'ether').to('ast').amount == 1000) // { amount: 0.1, name: 'picoether', unit: 'ether' }
// console.log(new TokenUnit(1000, 'ast').to('ether').amount == 1) // { amount: 0.1, name: 'picoether', unit: 'ether' }
// console.log(new TokenUnit(10000000, 'air').to('ether').amount == 1) // { amount: 0.1, name: 'picoether', unit: 'ether' }
// console.log(new TokenUnit(1750, 'ast').to('adam'))
