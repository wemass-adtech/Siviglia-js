Siviglia.require("require/stubs/lastDependency.js").then(() => {
  signingBook.push("last but one chained dependency");
  console.log("running last but one chained dependency");

  const lastButOneFunction = function () {
    console.log("I am the last but one function");
    lastFunction();
  };
});
