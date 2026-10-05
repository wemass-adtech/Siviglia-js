Siviglia.require("require/stubs/thirdDependencyFromLast.js").then(() => {
  signingBook.push("chainTest");
  console.log("running chain test");

  lastFunction();
});
