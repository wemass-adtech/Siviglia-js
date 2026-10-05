Siviglia.require("/tests/core/require/stubs/lastButOneDependency.js").then(
  () => {
    signingBook.push("third dependency from last");
    console.log("running third dependency from last");

    const thirdFunctionFromLast = function () {
      console.log("I am the third function from last");
      lastButOneFunction();
    };
  },
);
