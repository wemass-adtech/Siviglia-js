var dependencyList = [
  'stubs/lastDependency.js',
  'stubs/lastButOneDependency.js',
  'stubs/thirdDependencyFromLast.js'
]

Siviglia.require(dependencyList).then(() => {
  signingBook.push('chainedMultipleTest')
  console.log('running chained multiple test')

  lastFunction()
})