(function () {
  //callbackInit
  def =
    //definitionInit
    {
      FIELDS: {
        f4: {
          TYPE: "String",
        },
        f3: {
          TYPE: "Integer",
          SOURCE: {
            TYPE: "Url",
            URL: "/tests/stubs/data/[%#../f4%].json",
            LABEL: "a",
            VALUE: "b",
          },
        },
      },
    };
  //definitionEnd

  //codeInit
  var t1 = new Siviglia.model.BaseTypedObject(def);

  var p = $.Deferred();
  var status = true;
  var s = t1["*f3"].__getSource();
  var nValid = 0;
  var nChanged = 0;
  var expectOk;
  s.addListener("CHANGE", function (ev, params) {
    nChanged++;
    if (params.valid) {
      nValid++;
    }
    if (expectOk == 1) {
      p.resolve(nValid === 1);
    }
  });
  s.fetch();
  status = status && nChanged === 1 && nValid === 0;
  if (!status) return status;
  expectOk = 1;
  t1.f4 = "data1";
  p.then(function () {
    t1.destruct();
  });
  return p;

  //codeEnd
  //callbackEnd
});
