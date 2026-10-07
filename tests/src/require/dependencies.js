var dependencyList = [
  'dependencies/js/testEngine.js',
  "packages/Siviglia/ui/Input",
  'packages/Siviglia/ui/List',
  "packages/Siviglia/ui/Types",
  "packages/Siviglia/ui/View",
]

Siviglia.require(dependencyList).then(function () {console.log('terminadas dependencias')});