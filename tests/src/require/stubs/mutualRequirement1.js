Siviglia.require('stubs/mutualRequirement2.js').then(() => {
  signingBook.push('mutual requirement A')
  console.log('running mutual requirement A')

  function requiredFunctionAlpha () {
    console.log('I am function Alpha')
  }

  function requiredFunctionGamma () {
    console.log('I am function Gamma')
    requiredFunctionBeta()
  }
})