hljs.initHighlightingOnLoad();

const urlParams = new URLSearchParams(window.location.search);
const TEST_FOLDER_PATH = "/packages/Siviglia/ui/tests/";

let testPath;
let testRequestType = "all";
let pathParameter;
let setName;
if (urlParams.has("path")) {
  pathParameter = urlParams.get("path");
  testPath = TEST_FOLDER_PATH + pathParameter;
  const splitPath = pathParameter.split("/");
  if (splitPath.length > 0 && splitPath[0] !== "") {
    testRequestType = "set";
    setName = pathParameter.split("/")[0];
  }
  const lastPathElement = splitPath.at(-1);
  if (hasKnownExtension(lastPathElement)) {
    testRequestType = "single";
  }
}
var testStack = [];

function hasKnownExtension(str) {
  const knownExtensions = ["js", "css", "html", "php"];
  if (str.includes(".")) {
    for (const extension of knownExtensions) {
      if (str.split(".").pop() === extension) {
        return true;
      }
    }
  }
  return false;
}

function getStringBetween(str, start, end) {
  const result = str.match(new RegExp(start + "(.*)" + end, "s"));

  return result[1];
}

function fetchTestContent(path, index) {
  var testPromise = $.Deferred();
  /* Parece que no hace falta incluir el path completo del test
   *  Se deja el código por si en un futuro se quiere cambiar
   * */
  /*var uiTestPath = '/packages/Siviglia/ui/tests/'
  var url = Siviglia.config.staticsUrl + uiTestPath + path
  $.get(url).then(function(res) {*/
  $.get(path).then(function (res) {
    testStack[index].definition = getStringBetween(
      res,
      "//definitionInit",
      "//definitionEnd",
    ).replace(/(\r\n|\n|\r)/gm, "");
    testStack[index].code = Function(
      getStringBetween(res, "//codeInit", "//codeEnd"),
    );
    testStack[index].callback = Function(
      getStringBetween(res, "//callbackInit", "//callbackEnd"),
    );
    testPromise.resolve();
  });

  return testPromise;
}

function createTestStack(listToBuild) {
  const stackPromise = $.Deferred();
  const testPromises = [];
  let testIndex = 0;
  for (const test of listToBuild) {
    testStack.push({
      index: testIndex + 1,
      name: test.name,
      description: test.description,
      expected: typeof test.expected !== "undefined" ? test.expected : true,
    });
    testPromises.push(fetchTestContent(test.path, testIndex));

    testIndex++;
  }
  $.when.apply($, testPromises).done(function () {
    stackPromise.resolve();
  });

  return stackPromise;
}

function countListeners() {
  return Object.keys(Siviglia.Dom.existingListeners).length;
}

function countManagers() {
  return Object.keys(Siviglia.Dom.existingManagers).length;
}

function createHTMLElement(tagName, className, parent, content) {
  var htmlElement = document.createElement(tagName);
  if (className) htmlElement.className = className;
  if (content) htmlElement.innerHTML = content;
  if (parent) parent.appendChild(htmlElement);

  return htmlElement;
}

function createHTMLTestStructure(test) {
  var className = "result resultError";
  var message = "ERROR";
  if (!test.exception) {
    if (JSON.stringify(test.expected) == JSON.stringify(test.result)) {
      className = "result resultOk";
      message = "OK!";
    }
  } else {
    message =
      "A ocurrido una excepción en la ejecución del test: " + test.exception;
  }

  const testContainer = createHTMLElement(
    "div",
    "testDiv " + className,
    document.body,
  );
  const titleDiv = createHTMLElement(
    "div",
    "testTitle",
    testContainer,
    "Test " +
      test.index +
      " (" +
      test.name +
      ") : " +
      message +
      " <i style='font-size:10px'>[listeners:" +
      countListeners() +
      " Managers:" +
      countManagers() +
      "]</i>",
  );
  const descriptionDiv = createHTMLElement(
    "div",
    "testDoc",
    testContainer,
    test.description,
  );
  const contentContainer = createHTMLElement("div", "testCont", testContainer);
  // contentContainer.style.height = "50px";
  const definitionContainer = createHTMLElement(
    "div",
    "testDef",
    contentContainer,
  );
  definitionContainer.style.overflowY = "scroll";
  $(definitionContainer).jsonView(JSON.parse(test.definition));
  const codeContainer = createHTMLElement(
    "div",
    "testCode",
    contentContainer,
    "<pre>" + hljs.highlightAuto(test.code.toString()).value + "</pre>",
  );
  const clearDiv = createHTMLElement("div", "", testContainer);
  clearDiv.style.clear = "both";
}

function buildTests() {
  /*  if (runningTests == true) {
      return;
    }*/
  while (testStack.length > 0) {
    const currentTest = testStack.shift();
    try {
      const rs = currentTest.callback.apply(null, [currentTest.def]);
      if (rs && rs.then) {
        // Es una promesa.
        runningTests = true;
        rs.then(function (r) {
          currentTest.result = r;
          createHTMLTestStructure(currentTest);
          runningTests = false;
          buildTests();
        });
        return;
      } else {
        currentTest.result = rs;
        createHTMLTestStructure(currentTest);
      }
    } catch (e) {
      console.dir(e);
      currentTest.result = rs;
      current.exception = e;
      createHTMLTestStructure(currentTest);
    }
  }
}

Siviglia.Utils.buildClass({
  context: "Test",
  classes: {
    SimpleTypedObject: {
      inherits: "Siviglia.model.BaseTypedObject",
      construct: function (def) {
        this.__one = null;
        this.__two = null;
        this.__three = null;
        this.__four = null;
        this.__five = null;
        this.__testedOk = false;
        this.__testedNok = false;
        this.__enteringCalled = false;
        this.BaseTypedObject(def);
      },
      methods: {
        check_five: function (value) {
          if (value == "five") return true;
          return false;
        },
        process_five: function (value) {
          return "six";
        },
        callback_one: function () {
          this.__one = "one";
        },
        callback_two: function () {
          this.__two = "set";
        },
        callback_three: function () {
          this.__three = "three";
        },
        callback_four: function () {
          this.__four = "four";
        },
        test_ok: function () {
          this.__testedOk = true;
          return true;
        },
        test_nok: function () {
          this.__testedNok = true;
          return false;
        },
        get_seven: function () {
          return "seven";
        },
        check_eight: function (value) {
          return value.length > 3;
        },
        process_eight: function (value) {
          return value + "##";
        },
        enteringState: function () {
          this.__enteringCalled = true;
          return true;
        },
      },
    },
  },
});

Siviglia.require(["dependencies/js/testsList.js"]).then(function () {
  let selectedTests = [];
  switch (testRequestType) {
    case "single": {
      selectedTests.push(
        testsList.find(function (test) {
          return test.path === pathParameter;
        }),
      );
      break;
    }
    case "set": {
      for (const test of testsList) {
        if (test.path.split("/")[0] === setName) {
          selectedTests.push(test);
        }
      }
      break;
    }
    default: {
      selectedTests = testsList;
    }
  }

  createTestStack(selectedTests).then(function () {
    buildTests();
  });
});
