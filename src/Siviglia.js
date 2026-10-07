if (typeof Siviglia === 'undefined') {
    Siviglia = {};
}
// Exception hook para jQuery
jQuery.Deferred.exceptionHook = function( error, stack ) {

    // Support: IE 8 - 9 only
    // Console exists when dev tools are open, which can happen at any time
    if ( window.console && window.console.warn && error  ) {
        window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    }
};
// PinkySwear : https://github.com/timjansen/pinkyswear.js
(function (e) {

    function g(h) {
        return "function" == typeof h
    }

    function k(h) {
        //"undefined" != typeof setImmediate ? setImmediate(h) : "undefined" != typeof process && process.nextTick ? process.nextTick(h) : setTimeout(h, 0)
        h();
    }


    e[0][e[1]] = function n(f) {
        function a(a, g) {
            null == b && null != a && (b = a, l = g, c.length && k(function () {
                for (var a = 0; a < c.length; a++) c[a]()
            }));
            return b
        }

        var b, l = [], c = [];
        a.resolve = function (e) {
            a(true, e);
        }
        a.reject = function () {
            a(false);
        }
        a.then = function (a, e) {
            function m() {
                try {
                    var c = b ? a : e;
                    if (g(c)) {
                        var f = function (a) {
                            var c, b = 0;
                            try {
                                if (a && ("object" == typeof a || g(a)) && g(c = a.then)) {
                                    if (a === d) throw new TypeError;
                                    c.call(a, function () {
                                        b++ || f.apply(void 0, arguments)
                                    }, function (a) {
                                        b++ || d(!1, [a])
                                    })
                                } else d(!0, arguments)
                            } catch (e) {
                                b++ || d(!1, [e])
                            }
                        };
                        f(c.apply(void 0, Siviglia.isset(l) ? (Siviglia.isArray(l) ? l : [l]) : []))
                    } else d(b, l)
                } catch (k) {
                    console.error(k);
                    d(!1, [k])
                }
            }

            var d = n(f);
            null != b ? k(m) : c.push(m);
            return d
        };
        f && (a = f(a));
        return a
    }
})("undefined" == typeof module ? [window, "SMCPromise"] : [module, "exports"]);
SMCPromise.when=function(p)
{
    if(p.then)
        return p;
    return {then:function(a,b){
            a.apply(p);
        }}
}
Siviglia.all = function (promiseArray) {
    var allPromise = $.Deferred();

    if (!Siviglia.isset(promiseArray) || promiseArray.length == 0) {
        allPromise(true, []);
    } else {
        var n = promiseArray.length;
        var result = new Array(n);
        promiseArray.map(function (p, i) {
            p.then(function (res) {
                result[i] = res;
                n--;
                if (n == 0) {
                    allPromise(true, [result])
                }
                ;
            }, function () {
                allPromise(false);
            })
        })
    }
    return allPromise;
};

// Se crea la funcion "map" para navegadores que no lo soporten
if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }

        return res;
    };
}

// Se crea la funcion "forEach" para navegadores que no lo soporten
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

Siviglia.isset = function (value) {
    return typeof value !== "undefined";
};
Siviglia.issetOr = function (value, defValue) {
    return Siviglia.isset(value) ? value : defValue;
};
Siviglia.empty=function(value)
{
    return !Siviglia.isset(value) || value==null;
}

Siviglia.issetPathOr = function (value, path, defaultV) {
    var parts = path.split(".");
    var c = value;
    for (var k = 0; k < parts.length; k++) {
        if (typeof c[parts[k]] == "undefined")
            return defaultV;
        c = c[parts[k]];
    }
    return c;
};
Siviglia.typeOf = function (value) {

    if (value === null)
        return "null";
    return Object.prototype.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

}
Siviglia.type = function (obj) {
    var checker = {};
    var types = "Boolean Number String Function Array Date RegExp Object".split(" ");
    for (var i in types) {
        checker["[object " + types[i] + "]"] = types[i].toLowerCase();
    }
    return obj == null ?
      String(obj) :
      checker[Object.prototype.toString.call(obj)] || "object";
}
Siviglia.isFunction = function (obj) {
    return Siviglia.type(obj) === "function";
}
Siviglia.isString = function (obj) {
    return Siviglia.type(obj) === "string";
}
Siviglia.isInt = function (obj) {
    return Siviglia.type(obj) === "number" && obj == parseInt(obj);
}

Siviglia.isPlainObject = function (obj) {
    var hasOwn = Object.prototype.hasOwnProperty;
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
        return false;
    }

    try {
        // Not own constructor property must be Object
        if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for (key in obj) {
    }
    return key === undefined || hasOwn.call(obj, key);
}
Siviglia.isArray = function (obj) {
    return Siviglia.type(obj) === "array";
}
Siviglia.isWindow = function ( obj ) {
    return obj != null && obj === obj.window;
};
Siviglia.idCounter = 0
Siviglia.createID = function () {
    Siviglia.idCounter ++
    return (Date.now()+Siviglia.idCounter).toString(36);
}
Siviglia.__store__= {
    classes: {}
}

Siviglia.Utils = Siviglia.Utils || {};

/*
 Conversion de una cadena de texto,a una referencia al elemento apuntado por la cadena.
 Resuelve una cadena tipo "Siviglia.Dom.Object" , a una referencia a ese elemento.

 */
Siviglia.Utils.stringToContext = function (str, defContext) {
    var contexts = str.split(".");
    if (contexts.length == 1) {
        if (typeof defContext[contexts[0]] == "undefined")
            defContext[contexts[0]] = {};
        return defContext[contexts[0]];
    }

    if (!defContext)
        curContext = window;
    else
        curContext = defContext;
    var k;
    for (k = 0; k < contexts.length; k++) {
        if (!curContext[contexts[k]])
            curContext[contexts[k]] = {};
        curContext = curContext[contexts[k]];
    }

    return curContext;
}
/*
 Conversion de una cadena de texto, a un objeto padre y una propiedad del objeto.
 Resuelve una cadena tipo "Siviglia.Dom.Object" , a una referencia al elemento padre, y el nombre
 de la propiedad (Siviglia.Dom y Object)

 */

Siviglia.Utils.stringToContextAndObject = function (str, startContext, defContext, throwException) {
    var contexts = str.split(".");
    var l = contexts.length;
    if (l == 1 && defContext) return {
        context: defContext,
        object: str
    };

    if (!startContext)
        curContext = window;
    else
        curContext = startContext;

    var k;
    for (k = 0; k < l - 1; k++) {
        if (!curContext[contexts[k]]) {
            if (typeof throwException !== "undefined" && throwException)
                throw "Not found";
            curContext[contexts[k]] = {};
        }
        curContext = curContext[contexts[k]];
    }
    return {
        context: curContext,
        object: contexts[l - 1]
    };
}

/*

 Funcion de adaptacion de clases existentes, al modelo Siviglia, para
 poder derivar de ellas.

 */

/*

 Funcion de construccion de clases

 */

Siviglia.Utils.buildClass = function (definition) {
    var context = definition.context;
    if (!context) {
        context = "window";
        contextObj = window;
    } else
        var contextObj = Siviglia.Utils.stringToContext(context, window);

    var k, j, i, h, inherits;
    for (k in definition.classes) {
        inherits = null;


        if (definition.classes[k].inherits)
            inherits = definition.classes[k].inherits.split(",");

        // En cualquier caso, el constructor debe ser este
        // GigyaAuthenticator.prototype=Object.create(UserProvider.prototype);

        // Ahora hay 4 escenarios, dependiendo de 1) el objeto hereda o no hereda,
        // y 2) especifica o no especifica un constructor.
        // Si hereda y especifica, deben aniadirse tanto su constructor, como los de otros objetos.
        // Si hereda y no especifica, su constructor es el del primer objeto del que herede.
        // Si no hereda y especifica, hay que aniadirlo a su prototype
        // Si no hereda y no especifica, hay que crearle uno dummy


        if (!inherits)
            contextObj[k] = Siviglia.issetOr(definition.classes[k].construct, function () {});

        var baseClass;
        var inheritClasses = [];
        var baseClasses = [];


        if (inherits && inherits.length > 0) {

            // Se copian los prototype de otras clases.
            for (i = 0; i < inherits.length; i++) {

                var c = Siviglia.Utils.stringToContextAndObject(inherits[i], null, contextObj);

                inheritClasses.push(c.object);

                var curClass = c.context[c.object];

                inheritClasses = inheritClasses.concat(curClass.prototype.__inherits);
                if (!curClass) {
                    alert("Error de herencia:No se encuentra:" + c.object);
                }


                var parts = inherits[i].split(".");
                var baseClassName;
                if (parts.length == 1)
                    baseClassName = context + "." + inherits[i];
                else
                    baseClassName = inherits[i];
                baseClasses.push(baseClassName);

                if (i == 0) {
                    baseClass = c.object;
                    var curBaseClass = c.context[c.object];
                    if (Siviglia.isset(definition.classes[k].construct))
                        contextObj[k] = definition.classes[k].construct;
                    else {
                        contextObj[k]=(function(curClass){return function(){curClass.apply(this,arguments)}})(curBaseClass);
                        //contextObj[k]=new Function(baseClassName+".apply(arguments);");
                        //eval(context + "." + k + "=function(){" + baseClassName + ".apply(this,arguments);};");
                    }
                    constructor = contextObj[k];
                    contextObj[k].prototype = (function (st) {
                        var c = Siviglia.Utils.stringToContextAndObject(st, null, contextObj);
                        return Object.create(c.context[c.object].prototype)
                    })(inherits[i]);
                }

                contextObj[k].prototype[c.object] = curClass.prototype.__construct;
                contextObj[k].prototype[c.object + "$destruct"] = curClass.prototype.__destruct;
                Siviglia.__store__.classes[context+'.'+k] = baseClasses;
                contextObj[k].prototype.__getBaseClasses = function(){
                    return baseClasses;
                }

                if (i == 0) continue;

                for (h in curClass.prototype) {
                    //if(h.indexOf("__")>-1 || h.indexOf("destruct")==0)continue;
                    if (h.indexOf("destruct") == 0) continue;

                    //if ((definition.classes[k].methods && definition.classes[k].methods[h])) {
                    contextObj[k].prototype[c.object + "$" + h] = curClass.prototype[h];
                    contextObj[k].prototype[h] = curClass.prototype[h];

                }
            }
        }

        contextObj[k].prototype.__className = context+'.'+k;
        contextObj[k].prototype.__construct = contextObj[k];
        contextObj[k].prototype.constructor = contextObj[k];

        contextObj[k].prototype.destruct = function (ignoreInherit) {
            if(typeof this.__destroyed__=="undefined")
            {

                this.__destruct();
                this.__commonDestruct(ignoreInherit);
                this.__destroyed__=true;
            }
            else
            {
                console.log("Warn: Double destruction!");
            }
        }

        if (definition.classes[k].destruct)
            contextObj[k].prototype.__destruct = definition.classes[k].destruct;
        else
            contextObj[k].prototype.__destruct = function () {
            };

        if (!contextObj[k].prototype.__commonDestruct) {
            contextObj[k].prototype.__commonDestruct = function (ignoreInherit) {
                var k;
                if (this.__inherits && !ignoreInherit) {
                    for (k = 0; k < this.__inherits.length; k++) {
                        if (this[this.__inherits[k] + "$destruct"] != this.__commonDestruct)
                            this[this.__inherits[k] + "$destruct"](true);
                    }
                }
            }
        }

        // se copian los miembros y los metodos especificados en la definicion.
        var members = definition.classes[k].members || {};

        for (j in members)
            contextObj[k].prototype[j] = members[j];
        var constants = definition.classes[k].constants || {};
        for (j in constants) {
            contextObj[k][j] = constants[j];
        }
        var methods = definition.classes[k].methods || {};

        for (j in methods) {
            if (contextObj[k].prototype[j]) {
                // Si ya existe este metodo, es porque se ha copiado de la primera clase base.
                contextObj[k].prototype[baseClass + "$" + j] = contextObj[k].prototype[j];
            }
            contextObj[k].prototype[j] = methods[j];
        }

        contextObj[k].prototype.__inherits = inheritClasses;
    }
}

Siviglia.Utils.isSubclass = function (obj, className) {
    function checkSubclassesRecursively(current, target) {
        var baseClasses = Siviglia.__store__.classes[current];
        if (typeof baseClasses !== 'undefined') {
            for (var baseClassIndex = 0, maxIndex = baseClasses.length - 1; baseClassIndex <= maxIndex; baseClassIndex++) {
                var baseClass = baseClasses[baseClassIndex]
                if (baseClass === target) return true;
                if (checkSubclassesRecursively(baseClass, target)) return true;
            }
        }
        return false
    }
    return checkSubclassesRecursively(obj.__className, className);
}

/* Add prepend capabilities function */
Element.prototype.prependChild = function (child) {
    this.insertBefore(child, this.firstChild);
};

/*
 Sistema de gestion de ventos (listeners)

 */

Siviglia.Dom = {
    listenerCounter: 0,
    managerCounter: 0,
    existingManagers: {},
    existingListeners: {},
    eventStack: []
};
Siviglia.Utils.buildClass({
    context: 'Siviglia.Dom',
    classes: {
        EventManager: {

            construct: function () {
                this._ev_id = Siviglia.Dom.managerCounter;
                if(Siviglia.debug===true) {
                    var e=new Error();
                    Siviglia.Dom.existingManagers[this._ev_id] ={obj: this,stack:e.stack};
                    Siviglia.Dom.managerCounter++;
                }
                this._ev_firing = null;
                // Ojo, por como funciona la herencia, es posible que a un objeto que deriva de EventManager,
                // se le haya llamado a addListener, lo cual crea el objeto _ev_listeners, posiblemente, antes
                // de que se llame a este constructor.Es por eso que comprobamos que aun no exista, antes de ponerlo a null.
                if(!this.hasOwnProperty("_ev_listeners"))
                    this._ev_listeners = null;
                this.disabledEvents=false;
            },
            destruct: function () {

                // If this destructor was called while this object was notifying its listeners,
                // simply set a flag and return.
                if (this._ev_notifying) {
                    this._ev_mustDestruct = true;
                    return;
                }
                this.destroyListeners();
                delete Siviglia.Dom.existingManagers[this._ev_id];
            },
            methods: {
                addListener: function (evType, object, method, description) {
                    if (!this._ev_listeners) this._ev_listeners = {};
                    if (!this._ev_listeners[evType])
                        this._ev_listeners[evType] = [];

                    var k;
                    for (k = 0; k < this._ev_listeners[evType].length; k++) {
                        if (this._ev_listeners[evType][k].obj == object && this._ev_listeners[evType][k].method == method) {
                            return;
                        }
                    }
                    var newListener = {
                        obj: object,
                        method: method,
                        id: Siviglia.Dom.listenerCounter,
                        description: description
                    }
                    if(Siviglia.debug===true) {
                        var e=new Error();

                        Siviglia.Dom.existingListeners[newListener.id] = {obj:newListener,stack:e.stack};
                        Siviglia.Dom.listenerCounter++;
                    }

                    this._ev_listeners[evType].push(newListener);

                },

                removeListener: function (evType, object, method, target) {
                    if (!this._ev_listeners) return;
                    if (!this._ev_listeners[evType]) return;
                    var k, curL;
                    for (k = 0; k < this._ev_listeners[evType].length; k++) {
                        curL = this._ev_listeners[evType][k];
                        if (curL.obj == object && (!method || (method == curL.method))) {
                            if (target) {
                                if (curL.target != target)
                                    continue;
                            }
                            delete Siviglia.Dom.existingListeners[curL.id];
                            this._ev_listeners[evType].splice(k, 1);
                            return;
                        }
                    }
                },
                removeListeners: function (object) {
                    if (!this._ev_listeners) return;
                    var k, j;
                    for (k in this._ev_listeners) {
                        for (j = 0; j < this._ev_listeners[k].length; j++) {
                            if (this._ev_listeners[k][j].obj == object) {
                                // console.debug("Removing listener " + this._ev_listeners[k][j].id);
                                delete Siviglia.Dom.existingListeners[this._ev_listeners[k][j].id];
                                this._ev_listeners[k].splice(j, 1);
                                j--;
                            }
                        }
                    }
                },
                _ev_notify: function (evType, data, target) {

                },
                destroyListeners: function () {

                    for (var k in this._ev_listeners) {
                        for (var j = 0; j < this._ev_listeners[k].length; j++) {
                            //  console.debug("DELETING LISTENER " + this._ev_listeners[k][j].id);
                            delete Siviglia.Dom.existingListeners[this._ev_listeners[k][j].id];
                        }
                    }
                    this._ev_listeners = null;
                },
                disableEvents:function(disable)
                {
                    this.disabledEvents=disable;
                },
                eventsDisabled:function()
                {
                    return this.disabledEvents;
                },
                fireEvent: function (event, data, target) {
                    if(this.disabledEvents)
                        return;
                    if (this._ev_firing == event)
                        return;
                    if (!this._ev_listeners) return;
                    if (!this._ev_listeners[event]) return;
                    var nListeners = this._ev_listeners[event].length;
                    if(nListeners===0)
                        return;

                    if (data !== null) {
                        if (typeof data != "undefined")
                            data.target = target;
                        else
                            data = {
                                target: target
                            };
                        data.src = this;
                    }

                    this._ev_notifying = true;
                    var k;
                    var obj;
                    // Hay que capturar aqui cuantos listeners de este tipo hay, y hacer el bucle sobre
                    // esos elementos, evitando los listeners de este mismo tipo que se puedan añadir durante
                    // la ejecución del bucle.
                    // Iteramos sobre una copia de los listeners.
                    var thrownException=null;
                    try {
                        var copied = Array.from(this._ev_listeners[event]);
                        for (k = 0; k < nListeners; k++) {
                            // Si en algun momento los listeners estan a nulo, es que este objeto
                            // se ha destruido.
                            if (this._ev_listeners == null)
                                break;
                            // Pero el listener en si, lo cogemos de la copia.
                            obj = copied[k];
                            // console.debug("NOTIFY: " + this._ev_id + " --> " + event + " : " + obj.id);
                            if (obj.obj) {
                                if (typeof obj.obj == "function") {
                                    obj.obj(event, data, obj.param, target);
                                } else {
                                    if (obj.obj[obj.method])
                                        obj.obj[obj.method](event, data, obj.param, target);
                                }
                            } else {
                                obj.method(event, data, obj.param, target);
                            }
                        }
                    }catch(e)
                    {
                        thrownException=e;
                    }
                    // The following is a protection code; if marks this object as "notifying",so, if as part of the notification, this object
                    // is destroyed, it will not destroy the listeners, but set the mustDestroy flag to true.
                    this._ev_notifying = false;
                    this._ev_firing = null;
                    if (this._ev_mustDestruct) {
                        if(typeof this.__destroyed__!=="undefined")
                            delete this.__destroyed__;
                        this.destruct();
                    }
                    if(thrownException)
                        throw thrownException;

                }
            }
        }
    }
});


Siviglia.Utils.buildClass(
  {
      context: "Siviglia.Path",
      classes: {
          ContextStack: {
              construct: function () {
                  this.contextRoots={};
              },
              methods: {
                  addContext: function (handler) {
                      var prefix=handler.getPrefix();
                      if(prefix==="")
                          prefix="/";
                      this.contextRoots[prefix]=handler;
                      handler.setStack(this);
                  },
                  removeContext:function(handler)
                  {
                      var prefix=handler.getPrefix();
                      if(prefix==="")
                          prefix="/";
                      if(!this.hasPrefix(prefix))
                          throw "INVALID CONTEXT REQUESTED: "+prefix;
                      var ctx=this.contextRoots[prefix];
                      ctx.destruct();
                      this.contextRoots[prefix]=null;
                      delete this.contextRoots[prefix];
                  },
                  getContext: function (prefix) {
                      if (typeof this.contextRoots[prefix] != "undefined")
                          return this.contextRoots[prefix];
                      throw "INVALID CONTEXT REQUESTED: "+prefix;
                  },
                  getRoot:function(str)
                  {
                      var prefix=str.substr(0, 1);
                      var ctx=this.getContext(prefix);
                      return ctx.getRoot();
                  },
                  hasPrefix:function(char)
                  {
                      return typeof this.contextRoots[char]!="undefined";
                  },
                  getCursor:function(prefix)
                  {
                      var cursor=new Siviglia.Path.BaseCursor(this.contextRoots[prefix]);
                      cursor.setPrefix(prefix);
                      return cursor;
                  },
                  getCopy:function()
                  {
                      var newContext=new Siviglia.Path.ContextStack();
                      for(var k in this.contextRoots)
                          newContext.addContext(this.contextRoots[k]);
                      return newContext;
                  }
              }
          },
          Context:{
              construct:function(prefix,stack)
              {
                  this.prefix=prefix;
                  this.stack=stack;
                  if(typeof stack!=="undefined" && stack!==null)
                      stack.addContext(this);
              },
              methods:
                {
                    getPrefix:function(){return this.prefix;},
                    setStack:function(stack){
                        this.stack=stack;
                    }
                }
          },
          BaseCursor:{
              inherits:"Siviglia.Dom.EventManager",
              construct:function(ctx)
              {
                  this.ctx=ctx;
                  this.objRoot=ctx.getRoot();
                  this.pathStack=[];
                  this.remListeners=[];
                  this.__lastTyped=false;
                  this.prefix=null;
                  this.reset();
                  this.EventManager();
              },
              destruct:function()
              {
                  //    console.log("DESTROYING "+this.id);
                  this.cleanListeners();
              },
              methods:{
                  setPrefix:function(p)
                  {
                      this.prefix=p;
                  },
                  getPrefix:function()
                  {
                      return this.prefix;
                  },
                  reset:function()
                  {
                      this.pointer=this.objRoot;
                      this.__lastTyped=(typeof this.pointer.__getParent==="function");
                  },
                  moveTo:function(spec,eventMode)
                  {
                      //this.__lastTyped=false;
                      if(spec===".." && typeof this.pointer.__getParent==="function")
                      {
                          cVal=this.pointer.__getParent();
                          /*if(this.prefix!=='@') {*/
                          cVal.addListener("CHANGE", this, "onChange", "BaseCursor:" + spec);
                          this.remListeners.push(cVal);
                          /*}*/
                          this.pointer=cVal;
                          this.__lastTyped=true;
                          return cVal.getValue()
                      }
                      else {
                          if(this.__lastTyped)
                          {
                              this.pointer=this.pointer.getValue();
                              this.__lastTyped=false;
                          }
                          var childName=spec;
                          var currentParent=this.pointer;
                          if(this.pointer==this.ctx.objRoot && this.prefix=='@')
                          {
                              var ctxParent=this.ctx.getParentObject(spec);
                              if(ctxParent!==null)
                                  currentParent=ctxParent;
                              if(typeof this.pointer[spec+"-index"]!=="undefined")
                                  childName=this.pointer[spec+"-index"];
                          }
                          var v=currentParent[childName];
                          if(typeof v==="undefined")
                              throw "Unknown path "+spec;
                          if(typeof v=="object" && v!==null)
                          {
                              if(typeof v["__type__"]!=="undefined")
                              {
                                  //if(this.prefix!="@" && eventMode==2) {
                                  if(eventMode==2) {
                                      v.addListener("CHANGE", this, "onChange", "BaseCursor:" + spec);
                                      this.remListeners.push(v);
                                  }
                              }
                              else
                                  this.addPathListener(currentParent, childName);
                          }
                          else
                          {
                              if(eventMode==2)
                                  this.addPathListener(currentParent, childName);
                          }
                          this.pointer=currentParent[childName];
                      }
                  },
                  getValue:function()
                  {
                      //if(this.__lastTyped==true)
                      //    return this.pointer.getValue();

                      return this.pointer;
                  },
                  addPathListener:function(parent,propName)
                  {
                      /*                        if(this.prefix=='@')
                                                  return;*/
                      Siviglia.Path.eventize(parent,propName);
                      var m=this;
                      parent["*"+propName].addListener("CHANGE",this,"onChange","Basecursor:"+propName);
                      this.remListeners.push(parent["*"+propName]);
                  },
                  // Algun elemento del path ha cambiado.Hay que notificar para que vuelvan a parsearlo todo.
                  onChange:function()
                  {
                      this.fireEvent("CHANGE",null);
                      // Una vez que se dispara un evento de CHANGE, eliminamos todos los listeners.

                      this.cleanListeners();
                  },
                  cleanListeners:function()
                  {
                      for(var k=0;k<this.remListeners.length;k++)
                          this.remListeners[k].removeListeners(this);
                      this.remListeners=[];
                  }
              }
          },
          BaseObjectContext:{
              inherits:"Context",
              construct:function(objRoot,prefix,stack)
              {
                  this.objRoot=objRoot;
                  this.parentObjs={};
                  this.Context(prefix,stack);
              },
              methods:{
                  getRoot:function(){
                      return this.objRoot;
                  },

                  // Necesario en los contextos @.
                  // El tener un "padre" dentro del stack, hace que se use
                  // ese padre, en vez del stack, cuando hay que eventizar el objeto
                  // padre.Si no, lo que se eventiza, es el stack
                  addParentObject:function(idx,parent)
                  {
                      this.parentObjs[idx]=parent;
                  },
                  getParentObject:function(idx)
                  {

                      return Siviglia.issetOr(this.parentObjs[idx],null);
                  }
              }
          },
          PathResolver: {
              inherits: "Siviglia.Dom.EventManager",
              construct: function (contexts,path,eventMode) {
                  // EventMode 0 : Ningun evento.
                  // EventMode 1: Eventizado solo ultimo elemento del path.
                  // EventMode 2: Eventizado el path completo.
                  this.eventMode=2; // Se eventiza el path completo
                  if(typeof eventMode!=="undefined")
                  {
                      this.eventMode=eventMode;
                  }
                  this.contexts = contexts;
                  this.remlisteners=[];
                  // Los paths antiguos utilizan /* para marcar un contexto determinado.
                  // Por compatibilidad, comprobamos si la cadena pasada tiene ese formato, y
                  // si es asi, lo convertimos al actual (sin la "/")
                  if((path[1]==="*" || path[1]==="@") && path[0]==="/")
                      path=path.substr(1);
                  this.path=path;

                  this.cursors=[];
                  this.valid=false;
                  this.lastValue=null;
                  this.firing=false;
                  if(this.eventMode!==0)
                      this.EventManager();
              },
              destruct:function()
              {
                  this.clearListeners();
              },
              methods: {
                  buildTree: function (str) {
                      var componentStack = [];
                      var components = [];
                      componentStack.push(components);
                      var curExpr = null;
                      var prefix="";
                      var startingPath=true;
                      for (var k = 0; k < str.length; k++) {
                          var char = str[k];
                          if(startingPath)
                          {
                              if(!this.contexts.hasPrefix(char))
                              {
                                  throw "INVALID PATH: "+this.path;
                              }
                              curExpr={"type":"pathElement",str:"",prefix:char}
                              startingPath=false;
                              continue;
                          }
                          switch (char) {
                              case "/": {

                                  if (curExpr != null)
                                      components.push(curExpr);
                                  curExpr = {type: "pathElement", str: ""};
                                  // Si es el primer elemento del path, nos quedamos con el
                                  // caracter siguiente del path, que determina el contexto en el que
                                  // estamos buscando.
                                  if(components.length==0) {

                                      curExpr.prefix = prefix;
                                  }
                                  prefix="";
                              }
                                  break;
                              case "{": {
                                  var nextChar = str[k + 1];
                                  var expr = curExpr != null ? curExpr : {};
                                  expr.type = "subpath";
                                  if (nextChar == "%") {
                                      expr.subtype = "static";
                                      k++;
                                  } else {
                                      expr.subtype = "dynamic";
                                      expr.str = "";
                                  }
                                  components.push(expr);
                                  expr.components = [];
                                  componentStack.push(expr.components);
                                  components = expr.components;
                                  curExpr = null;
                                  startingPath=true;
                              }break;
                              case "}": {
                                  if (curExpr != null) {
                                      var lastChar = curExpr.str.substr(-1, 1);
                                      // Si el ultimo caracter de la expresion actual es un "%", se elimina
                                      if (lastChar == "%")
                                          curExpr.str = curExpr.str.substr(0, curExpr.str.length - 1);
                                      components.push(curExpr);
                                  }
                                  componentStack.pop();
                                  components=componentStack[componentStack.length-1];
                                  curExpr=null;
                              }break;
                              default: {
                                  curExpr.str += char;
                              }
                          }
                      }
                      if(curExpr && (curExpr.str.length>0 || curExpr.type=="subpath"))
                          components.push(curExpr);
                      if (componentStack.length > 1)
                          throw "Invalid Path";
                      return componentStack[0];
                  },
                  isValid:function()
                  {
                      return this.valid;
                  },
                  getPath:function()
                  {

                      if(this.firing)
                          return;
                      var p=this.path[0];
                      if(this.contexts.hasPrefix(p))
                      {
                          this.stack = this.buildTree(this.path);
                          //     console.log("DESTRUYO CURSORES");
                          this.clearListeners();
                          this.valid = true;
                          try {
                              var newVal = this.parse(this.stack, true);
                          }catch(e)
                          {
                              this.valid=false;
                              newVal=null;
                          }
                      }
                      else
                      {
                          this.valid=true;
                          newVal=this.path;
                      }
                      this.firing=true;
                      this.lastValue=newVal;
                      this.fireEvent("CHANGE", {value: newVal,valid:this.valid});
                      this.firing=false;
                      return newVal;
                  },
                  getValue:function(){return this.lastValue;},
                  parse:function(pathParts)
                  {
                      // TODO : Eliminar listeners.

                      var root=this.contexts.getRoot(pathParts[0].prefix);
                      var cursor=this.contexts.getCursor(pathParts[0].prefix);
                      this.cursors.push(cursor);
                      var m=this;
                      if((pathParts[0].prefix!=='@' || pathParts[0].str.indexOf("-index")==-1) && this.eventMode!==0) {
                          cursor.addListener("CHANGE", this, "getPath", "PathResolver:" + this.path)
                      }
                      var lastPointer,lastLabel;

                      for(var k=0;k<pathParts.length && this.valid ;k++)
                      {
                          var p=pathParts[k];
                          switch(p.type)
                          {
                              case "pathElement":
                              {
                                  lastPointer=cursor.getValue();
                                  lastLabel=p.str;
                                  try {
                                      var evMode=this.eventMode;
                                      if(this.eventMode===1 && k==pathParts.length-1)
                                          evMode=2;
                                      cursor.moveTo(p.str,evMode);
                                  }catch(e)
                                  {
                                      this.valid=false;
                                  }
                              }break;
                              case "subpath":
                              {
                                  var val=this.parse(p.components,p.subtype=="static"?false:true);
                                  if(this.valid) {
                                      lastPointer = cursor.getValue();
                                      lastLabel = val;
                                      cursor.moveTo(val);
                                  }
                              }break;
                          }
                      }
                      return cursor.getValue();
                  },
                  clearListeners:function(){
                      for(var k=0;k<this.remlisteners.length;k++)
                          this.remlisteners[k].removeListeners(this);

                      for(var k=0;k<this.cursors.length;k++) {
                          //      this.cursors[k].removeListeners(this);
                          this.cursors[k].destruct();
                      }
                      this.cursors=[];
                  }
              }
          }
      }
  });

Siviglia.Utils.parametrizableStringCounter=0;
Siviglia.Utils.buildClass({
    context:'Siviglia.Path',
    classes:
      {
          ParametrizableStringException:{
              construct:function(message)
              {
                  this.message=message;
              }
          },
          ParametrizableString:
            {
                /*
                    Si se quieren utilizar paths, controller debe ser una instancia de una clase derivada
                    de Siviglia.model.PathRoot
                */
                inherits:"Siviglia.Dom.EventManager",
                construct:function(str,contextStack,opts)
                {
                    this._ps_id=Siviglia.Utils.parametrizableStringCounter;
                    Siviglia.Utils.parametrizableStringCounter++;
                    // Creamos un contextStack propio, para que en caso de que haya un contexto
                    // "relativo" (sivLoop), ésta parametrizableString se quede con una "foto" de las variables de contexto.

                    var newContext=new Siviglia.Path.ContextStack();
                    for(var k in contextStack.contextRoots) {
                        if(k!='@')
                            newContext.addContext(contextStack.contextRoots[k]);
                        else
                        {
                            var contextContextRoot=Object.assign({},contextStack.contextRoots[k].objRoot);
                            var contextContext = new Siviglia.Path.BaseObjectContext(contextContextRoot, "@", newContext);
                            contextContext.parentObjs=Object.assign({},contextStack.contextRoots[k].parentObjs);
                        }
                    }

                    this.contextStack=newContext;
                    this.BASEREGEXP=/\[%(?:(?:([^: ,]*?)%\])|(?:([^: ,]*?)|([^:]*?)):(.*?(?=%\]))%\])/g;
                    this.BODYREGEXP=/\{%(?:([^%:]*?)|(?:([^:]*?):(.*?(?=%\}))))%\}/g;
                    this.PARAMREGEXP=/([^|$ ]+)(?:\||$|(?: ([^|$]+)))/g;
                    this.SUBPARAMREGEXP=/('[^']*')|([^ ]+)/g;
                    this.paths={};
                    this.str=str;
                    this.valid=true;
                    this.pathController=null;
                    this.listenerMode=2;
                    this.opts=opts||{};

                    if(typeof opts!=="undefined")
                    {
                        this.listenerMode=Siviglia.issetOr(opts.listenerMode,2);
                    }
                    this.EventManager();

                },
                destruct:function()
                {
                    this.removeAllPaths();
                    this.contextStack.destruct();
                    this.contextStack=null;

                },
                methods:
                  {
                      parse:function()
                      {
                          this.parsing=true;
                          this.valid=true;
                          var str=this.str;
                          var m=this,r=new RegExp(this.BASEREGEXP),res,f=str;
                          try {
                              while (res = r.exec(str))
                                  f = f.replace(res[0], this.parseTopMatch(res));

                              this.fireEvent("CHANGE", {value: f});
                              this.parsing = false;
                              return f;
                          }catch(e)
                          {
                              throw e;
                          }
                          return null;
                      },
                      parseTopMatch:function(match)
                      {
                          // Match simple

                          if (typeof match[1]!=="undefined") {
                              if (this.isNestedContext(match[1][0]=='/'?match[1][1]:match[1][0])) return match[0];

                              try {
                                  return this.getValue(match[1]);
                              } catch (e) {
                                  this.parsing=false;
                                  console.error("PATH NOT FOUND::"+match[1])
                                  throw new Siviglia.Path.ParametrizableStringException("Parameter not found:"+match[1]);
                              }
                          }

                          var t=Siviglia.issetOr(match[2],null);
                          var t1=Siviglia.issetOr(match[3],null)
                          var mustInclude=false,exists=false,body='';
                          if(t)
                          {
                              var paramName=t;
                              var negated=(t.substr(0,1)=="!");
                              if (negated)
                                  paramName=t.substr(1);
                              try {
                                  this.getValue(paramName);
                                  exists=true;
                              } catch (e) {}

                              mustInclude=(t.substr(0,1)=="!"?!exists:exists);
                          }
                          else
                              mustInclude=this.parseComplexTag(t1);
                          if(mustInclude)
                          {
                              var reg=new RegExp(this.BODYREGEXP);
                              var m=this,bodyMatch,replacements=[];
                              while(bodyMatch=reg.exec(match[4])) {
                                  var replacement=this.parseBody(bodyMatch);
                                  replacements.push({s:bodyMatch[0],r:replacement});
                              }
                              for(var k=0;k<replacements.length;k++) {
                                  match[4]=match[4].replace(replacements[k].s,replacements[k].r);
                              }
                              return match[4];
                          }
                          return '';
                      },
                      getValue:function(path)
                      {

                          if(typeof this.paths[path]!=="undefined") {
                              if(!this.paths[path].isValid())
                                  this.valid=false;
                              else {
                                  var v=this.paths[path].getValue();

                                  if (v === null) {
                                      this.parsing = false;
                                      throw new Siviglia.Path.ParametrizableStringException("Null value::" + path);
                                  }
                                  else
                                  {
                                      if(typeof v=="object") {
                                          if(typeof v.__type__ !== "undefined")
                                              return JSON.stringify(v.getValue());
                                          return JSON.stringify(v);
                                      }
                                      else
                                          return v;
                                  }

                              }
                          }

                          var controller=new Siviglia.Path.PathResolver(this.contextStack,path,this.listenerMode);
                          this.paths[path]=controller;
                          // Si no queremos que sea dinamico, ya que lo que queremos es el valor actual del path, y punto,
                          // no aniadimos ningun listener al path
                          if(this.listenerMode!=0) {
                              //if (!((path[0] == "/" && path[1] == "@") || (path[0] == "@")))
                              controller.addListener("CHANGE", this, "onListener", "ParametrizableString: value:" + path);
                          }
                          var val=controller.getPath();
                          if(!controller.isValid()) {
                              this.parsing=false;
                              throw new Siviglia.Path.ParametrizableStringException("Unknown path: " + path);
                          }
                          else {
                              if (val === null) {
                                  this.parsing = false;
                                  throw new Siviglia.Path.ParametrizableStringException("Null value::" + path);
                              }
                              else
                              {
                                  if(typeof val=="object")
                                      return JSON.stringify(val);
                              }
                          }

                          return val;
                      },
                      getRawValue:function(path) {
                          if(typeof this.paths[path]!=="undefined") {
                              if(!this.paths[path].isValid())
                                  this.valid=false;
                              else {
                                  var v=this.paths[path].getValue();

                                  if (v === null) {
                                      this.parsing = false;
                                      throw new Siviglia.Path.ParametrizableStringException("Null value::" + path);
                                  }
                                  else {
                                      if(typeof v=="object") {
                                          if(typeof v.__type__ !== "undefined")
                                              return v.getValue()
                                          return v
                                      }
                                      else
                                          return v;
                                  }
                              }
                          }

                          var controller=new Siviglia.Path.PathResolver(this.contextStack,path,this.listenerMode);
                          this.paths[path]=controller;
                          // Si no queremos que sea dinamico, ya que lo que queremos es el valor actual del path, y punto,
                          // no aniadimos ningun listener al path
                          if(this.listenerMode!=0) {
                              //if (!((path[0] == "/" && path[1] == "@") || (path[0] == "@")))
                              controller.addListener("CHANGE", this, "onListener", "ParametrizableString: value:" + path);
                          }
                          var val=controller.getPath();
                          if(!controller.isValid()) {
                              this.parsing=false;
                              throw new Siviglia.Path.ParametrizableStringException("Unknown path: " + path);
                          }
                          else {
                              if (val === null) {
                                  this.parsing = false;
                                  throw new Siviglia.Path.ParametrizableStringException("Null value::" + path);
                              }
                              else
                              {
                                  if(typeof val=="object")
                                      return val
                              }
                          }

                          return val;
                      },
                      removeAllPaths:function()
                      {
                          for(var k in this.paths)
                              this.paths[k].destruct();
                      },
                      onListener:function()
                      {
                          if(!this.parsing) {

                              this.parse();
                          }
                      },
                      parseBody:function(match)
                      {
                          //this.BODYREGEXP=/{\%(?:(?<simple>[^%:]*)|(?:(?<complex>[^:]*):(?<predicates>.*?(?=\%}))))\%}/;
                          var v=Siviglia.issetOr(match[1],null);
                          if(v)
                          {
                              if (this.isNestedContext(v[0]=='/'?v[1]:v[0])) return match[0];
                              try {
                                  return this.getValue(v);
                              }catch(e)
                              {
                                  this.parsing=false;
                                  throw new Siviglia.Path.ParametrizableStringException("Parameter not found: "+v);
                              }
                          }
                          var complex=Siviglia.issetOr(match[2],null);
                          var cVal=null;
                          try {
                              cVal=this.getValue(complex);
                          }catch(e) {
                              this.parsing = true;
                          }

                          var r=this.PARAMREGEXP,res;
                          while(res= r.exec(match[3]))
                          {
                              var func=typeof res[1]=="undefined"?null:res[1];
                              var args=typeof res[2]=="undefined"?null:res[2];
                              if(func=="default" && cVal==null)
                              {
                                  cVal=args.cTrim("'");
                                  continue;
                              }
                              if(! args)
                              {
                                  if(cVal==null)
                                  {
                                      this.parsing=false;
                                      throw new Siviglia.Path.ParametrizableStringException("Parameter not found: "+v);
                                  }

                                  if(this.controller && typeof this.controller[func]!=="undefined")
                                      cVal=this.controller[func](cVal);
                                  else
                                      cVal=cVal[func]();
                                  continue;

                              }
                              /* //this.SUBPARAMREGEXP=/('[^']*')|([^ ]+)/g; */
                              var r2=new RegExp(this.SUBPARAMREGEXP);
                              var cRes=null;
                              var pars=[];
                              var cur;
                              while(cRes=r2.exec(args)) {
                                  cur=Siviglia.isset(cRes[0])?cRes[0].cTrim("'"):cRes[1];
                                  pars.push(cur=="@@"?cVal:this.getValue(cur));
                              }

                              if(this.controller)
                                  cVal=this.controller[func].apply(this.controller,pars);
                              else
                                  cVal=cVal[func].apply(cVal,pars);
                          }
                          return cVal;
                      },
                      parseComplexTag:function(format)
                      {
                          var parts=format.split(',');
                          var d=$.Deferred();
                          var opsStack=[];

                          for(var k=0;k<parts.length;k++) {
                              var c=parts[k];
                              var sparts=c.split(" ");
                              var negated=(sparts[0].substr(0,1)=='!');
                              if(negated)
                                  tag=sparts[0].substr(1);
                              else
                                  tag=sparts[0];
                              if(sparts.length==1) {
                                  if(negated) {
                                      try {
                                          curValue = this.getValue(tag);
                                      }catch(e){
                                          curValue=null;
                                      }
                                      if (curValue!=null)
                                          return false;
                                  }
                                  continue;
                              }

                              var curValue;
                              try{
                                  curValue=this.getValue(tag);
                              }catch (e){
                                  this.parsing=false;
                                  throw new Siviglia.Path.ParametrizableStringException("Parameter not found: "+tag);
                              }
                              var result=false;
                              switch(sparts[1]) {
                                  case "is":{
                                      result=Siviglia["is"+sparts[2].ucfirst()](this.getRawValue(tag));
                                  }break;
                                  case "!=":{
                                      result=(curValue!=this.getValue(sparts[2]));
                                  }break;
                                  case "==":{
                                      result=(curValue==this.getValue(sparts[2]));
                                  }break;
                                  case ">":{
                                      result=(curValue>parseInt(this.getValue(sparts[2])));
                                  }break;
                                  case "<":{
                                      result=(curValue<parseInt(this.getValue(sparts[2])));
                                  }break;
                              }
                              if(negated)
                                  result=!result;
                              if(!result)
                                  return false;
                          }
                          return true;
                      },
                      isNestedContext: function (contextID) {
                          if (contextID.match('[^a-zA-Z0-9]')) {
                              try {
                                  this.contextStack.getContext(contextID)
                              } catch (error) {
                                  if (this.opts.isNestedContext) return true;
                                  throw error + ' on ' + this.str;
                              }
                              return false
                          }
                          return false
                      }
                  }
            }
      }
});

Siviglia.Path.eventize=function(obj,propName) {
    var srcObject = obj[propName];
    var disableEvents = false;
    if (obj.hasOwnProperty("__type__")) {
        if (obj.__type__ === "BaseTypedObject")
            return; // No se necesita hacer nada, ya que obj[propName] ya soporta addEventListener
    }
    // En cualquier otro caso, es posible hacer un proxy sobre el objeto padre.
    // Primero, quitar de enmedio el caso en que el obj[propName] es un BaseType, donde, de nuevo, no hay que hacer nada.
    if (obj[propName] !== null && obj[propName].hasOwnProperty("__type__") && obj[propName].__type__ == "BaseType")
        return; // No se necesita hacer nada, ya que obj[propName] ya soporta addEventListener

    // Si estamos aqui, ni el objeto, ni la propiedad, son objetos basetyped . Podrian ser objetos evented, incluso podrian
    // tener un evento CHANGE, pero no lo sabemos. Tendria que existir una propiedad que permitiera identificarlos, y que
    // evitara tener que montar un proxy sobre ellos.

    // Ahora hay varias posibilidades.
    // La primera que hay que mirar, es que obj[propName] sea null. En ese caso, no sabemos que va a ser obj[propName] en el futuro.
    // No sabemos si habra que crearle un proxy, o valdria con un defineProperty en el padre.
    // La segunda, es si obj[propName] es un objeto simple, o no. Si es un objeto simple, vale con un defineProperty.Si no, hay que montar un proxy.
    // Ahora, una restriccion: que ocurre si la propiedad comienza siendo una cosa, y luego es otra?
    // O, si empieza siendo "algo", y luego es "null"?
    // Por lo tanto, es mejor hacer un defineProperty en el padre, y en el hijo.
    if (!obj.hasOwnProperty("__disableEvents__")) {
        Object.defineProperty(obj, "__disableEvents__", {
            get: function () {
                return disableEvents;
            },
            set: function (val) {
                disableEvents = val;
            },
            enumerable: false
        });
    }
    var evManagers=[];
    if (!obj.hasOwnProperty("__evmanagers__")) {

        Object.defineProperty(obj, "__evmanagers__", {
            get: function () {
                return evManagers;
            },
            set: function (val) {
                evManagers = val;
            },
            enumerable: false
        });
    }
    if (!obj.hasOwnProperty("__destroy__")) {
        Object.defineProperty(obj, "__destroy__", {
            get: function () {
                return function(){for(var k=0;k<evManagers.length;k++)evManagers[k].destruct()}
            },
            set: function (val) {

            },
            enumerable: false
        });
    }


    if (!obj.hasOwnProperty("*" + propName)) {

        var v = obj[propName];
        var ev = new Siviglia.Dom.EventManager();
        obj.__evmanagers__.push(ev);

        Object.defineProperty(obj, "*" + propName, {
            get: function () {
                return ev;
            },
            set: function (val) {
            },
            enumerable: false
        });
        if(typeof v=="object")
        {
            if(obj.hasOwnProperty("__disableEvents__"))
                obj.__disableEvents__=true;
            v=Siviglia.Path.Proxify(v, ev);
            if(obj.hasOwnProperty("__disableEvents__"))
                obj.__disableEvents__=false;
        }

        Object.defineProperty(obj, propName, {
            get: function () {
                return v;
            },
            set: function (val) {
                // Si estamos haciendo set de exactamente el mismo valor, y ese valor es simple,
                // retornamos.
                if(typeof val!=="object" && val===v)
                    return;
                if (typeof val === "object" && val !== null)
                    v = Siviglia.Path.Proxify(val, ev);
                else
                    v = val;
                if (!obj.__disableEvents__)
                    ev.fireEvent("CHANGE", {object: obj, property: propName, value: val});

            },
            enumerable: true
        });

    }
}

Siviglia.Path.Proxify=function(obj,ev)
{
    var curVal=obj;
    // Lo siguiente, no se puede hacer:
    // (Ver si el objeto es un proxy de un BaseType, y aniadir el listener al basetype)
    //obj.__parentbto__.addListener("CHANGE",null,function(evName,params){
    // ev.fireEvent("CHANGE",params);
    //});
    // Si hay un partenbto, o sea, obj es un proxy de un BaseType, ocurriria lo siguiente:
    // Actualemente, ese BaseType tiene el objeto "obj" como valor.
    // Si el listener no se pone directamente sobre *ese* proxy, sino sobre el basetype que
    // lo contiene, puede pasar lo siguiente:
    // Si el basetype cambia completamente de valor (creando un proxy nuevo), lanzara un evento
    // CHANGE, que disparará a este listener, que esta asociado al *antiguo* valor.
    // Y eso es porque se esta escuchando al padre del proxy, no al proxy en si mismo.

    if(typeof obj.__isProxy__ !== "undefined") {
        obj.__ev__.addListener("CHANGE",null,function(event,params){ev.fireEvent("CHANGE",params),"Siviglia-Proxify:Existing"});
        return obj;
    }

    var isArray=(obj.constructor.toString().indexOf("rray")>0);
    var referenceCounter=1;
    var __disableEvents__=false;
    var objProxy = new Proxy(obj,{
        get:function(target,prop)
        {
            if(prop==="__ev__")
                return ev;
            if(prop==="__isProxy__")
                return true;
            if(prop=="__disableEvents__")
                return __disableEvents__;
            if(prop===Symbol.toStringTag)
                return target.toString;

            if(prop==="[[KEYS]]")
            {
                var result=[];
                if(Siviglia.typeof(curVal)==="object")
                {
                    for(var k in curVal)
                    {
                        result.push({"LABEL":k,"VALUE":k});
                    }
                    return result;
                }
                if(Siviglia.typeof(curVal)==="array")
                {
                    for(var k=0;k<curVal.length;k++)
                    {
                        result.push({"LABEL":k,"VALUE":k});
                    }
                    return result;
                }
                throw "Pedidas keys en objeto sin keys";
            }
            return curVal[prop];
        },
        apply:function(target,thisArg,list)
        {
            var retVal=curVal.target.apply(thisArg,list);
            //if(isArray && ['pop','push','slice','splice','concat','shift','unshift'])
            //    ev.fireEvent("CHANGE",{object:obj,property:propName,value:retVal});
            return retVal;
        },
        set: function (target, prop,value) {

            if(prop=="__disableEvents__")
            {
                __disableEvents__=value;
                return true;
            }
            var mustFire=true;

            /*   if(
                   ((typeof curVal[prop]==="undefined" || curVal[prop]===null) && (typeof value!=="undefined" && value!==null))
                   ||
                   ((typeof curVal[prop]!=="undefined" && curVal[prop]!==null) && (typeof value==="undefined" || value===null))
               )
                   mustFire=true;*/


            curVal[prop]=value;

            if(mustFire && !__disableEvents__) {
                if ((!isArray && prop[0]!='_' ) || (isArray && prop !== "length") )
                    ev.fireEvent("CHANGE", {object: obj, property:prop,value: value});
            }
            return true;
        },
        deleteProperty:function(target,prop)
        {
            delete curVal[prop];
            if(!__disableEvents__)
                ev.fireEvent("CHANGE",{object:obj,property:prop,value:undefined});
            return true;
        }
    });
    return objProxy;
}



Siviglia.UI = {
    expandos: {
        'sivparams': 'ParamsExpando',
        'sivvalue': 'ValueExpando',
        'sivclass': 'ClassExpando',
        'sivloop': 'LoopExpando',
        'sivif': 'IfExpando',
        'sivevent': 'EventExpando',
        'sivstate': 'StateExpando',
        'sivwidget': 'WidgetExpando',
        'sivview': 'ViewExpando',
        'sivcss': 'CssExpando',
        'sivattr': 'AttrExpando',
        'sivcall': 'CallExpando',
        'sivpromise': 'PromiseExpando',
        // 'sivexists': 'NonEmptyExpando'
    },
    viewStack: []
};
Siviglia.Utils.buildClass(
  {
      context: "Siviglia.UI",
      classes: {
          HTMLParser:
            {
                construct: function (stack,parentView) {
                    if (!stack) {
                        stack = new Siviglia.Path.ContextStack();
                    }
                    this.parentView=parentView;
                    this.stack = stack;
                    this.expandos = [];
                },
                destruct: function () {
                    this.stack = null;
                    this.destroyExpandos();

                },
                methods:
                  {
                      addContext: function (prefix, plainObj) {
                          var plainCtx = new Siviglia.Path.BaseObjectContext(plainObj, prefix, this.stack);
                      },
                      recurseHTML: function (node, applyFunc) {
                          var dataset = node.data();
                          if (dataset && dataset.noparse)
                              return;
                          var parseChildren = applyFunc(node);
                          if (!parseChildren)
                              return;
                          var m = this;
                          node.trigger("startChildren");
                          var n=node[0];

                          var nextNode=null;
                          // Primero, se hace una pasada por los nodos, antes de procesarlos.
                          // Nos quedamos con una referencia a los nodos que hay ANTES de ser procesados.
                          // Y son estos los que hay que procesar, ignorando cualquier otro que se añada
                          // durante el procesamiento.
                          var actualNodes=[];
                          for(var k=0;k<n.childNodes.length;k++) {
                              actualNodes.push(n.childNodes[k]);
                          }
                          //for(var k=0;k<n.childNodes.length;k++) {
                          for(var k=0;k<actualNodes.length;k++) {
                              nextNode = actualNodes[k].nextElementSibling;
                              m.recurseHTML($(actualNodes[k]), applyFunc);
                          }
                          node.trigger("endChildren");
                      },
                      destroyExpandos: function () {
                          this.expandos.map(function (v) {
                              v.destruct();
                          })
                      },
                      parse: function (node) {

                          var cb = function (node) {
                              if(node.length ==0)
                                  return;
                              var newExpandos = {};
                              var dataset = node.data();
                              var k;
                              var retValue = true;
                              if (dataset && dataset["sivid"]) {

                                  var curRoot = this.stack.getRoot("*");
                                  if (curRoot)
                                      curRoot[dataset["sivid"]] = node;
                              }
                              for (k in Siviglia.UI.expandos) {
                                  if (dataset[k]) {
                                      newExpandos[k] = new Siviglia.UI.Expando[Siviglia.UI.expandos[k]]();
                                  }
                              }
                              for (var k in newExpandos) {
                                  retValue = retValue && newExpandos[k]._initialize($(node), this, this.stack, newExpandos);
                                  this.expandos.push(newExpandos[k]);

                              }
                              return retValue;
                          };

                          this.recurseHTML(node, cb.bind(this));

                          return false;
                      }
                  }
            }
      }
  }
);
Siviglia.Errors={}
/*Siviglia.Errors.PathNotFoundException=function (path) {
    this.path = path;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, PathNotFoundException);
    else
        this.stack = (new Error()).stack;
};


Siviglia.Errors.PathNotFoundException.prototype = Object.create(Error.prototype);
Siviglia.Errors.PathNotFoundException.prototype.name = "PathNotFoundException";
Siviglia.Errors.PathNotFoundException.prototype.constructor = Siviglia.Errors.PathNotFoundException;*/

Siviglia.UI.expandoCounter = 0;
Siviglia.Utils.buildClass(
  {
      context: "Siviglia.UI.Expando",
      classes:
        {
            Expando: {
                construct: function (expandoTag) {
                    this.expandoTag = expandoTag;
                    this._ex_id = Siviglia.UI.expandoCounter;
                    Siviglia.UI.expandoCounter++;
                    this.str = null;
                    this.observer = null;
                },
                destruct: function () {

                    if (this.str)
                        this.str.destruct();
                    if (this.node) {
                        this.node.remove();
                    }

                    this.node = null;
                    this.destroyed = true;
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        this.node = node;
                        this.parentView=nodeManager.parentView;
                        var pString = node.data(this.expandoTag);
                        var contextual=false;
                        if((pString[0]=="/" && pString[1]=="@" ) || (pString[0]=="@"))
                            contextual=true;
                        if (pString[0] == "/")
                            pString = "[%" + pString + "%]";
                        this.stack=stack;
                        this.str = new Siviglia.Path.ParametrizableString(pString, stack);
                        if(!contextual)
                            this.str.addListener("CHANGE", this, "_update", "BaseExpando:" + this.expandoTag);
                        var v;
                        try {
                            v = this.str.parse();
                        }catch(e)
                        {
                            throw e
                            // throw new Siviglia.Errors.PathNotFoundException(pString);

                        }
                        if(contextual)
                            this.update(v);
                        return true;
                    },
                    _update: function (event, params) {
                        this.update(params.value);
                    }
                }
            },
            ValueExpando: {
                inherits: "Expando",
                construct: function () {
                    this.Expando("sivvalue");
                    this.addedClass="";

                },
                methods: {
                    update: function (val) {
                        if(typeof val.__type__!=="undefined")
                            val=val.getValue();
                        if (Siviglia.isString(val)) {
                            var parts = val.split("::");
                            for (var k = 0; k < parts.length; k++) {
                                var p1 = parts[k].split("|")

                                if (p1.length == 1)
                                    this.node.html(p1[0]);
                                else {
                                    if(p1[0]=="^class")
                                    {
                                        if(this.addedClass!=="")
                                            this.node.removeClass(this.addedClass);
                                        this.node.addClass(p1[1]);
                                        this.addedClass=p1[1];
                                    }
                                    else {
                                        if(p1[0][0]==="~")
                                        {
                                            var css={};
                                            css[p1[0].substr(1)]=p1[1];
                                            this.node.css(css);
                                        }
                                        else
                                            this.node.attr(p1[0], p1[1]);
                                    }
                                }
                            }
                        } else
                            this.node.html("" + val);
                    }
                }
            },
            CallExpando: {
                inherits: "Expando",
                construct: function () {
                    this.Expando("sivcall");
                },
                destruct: function () {
                    if(this.paramObj!==null)
                        this.paramObj.removeListeners(this);
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        this.method = node.data("sivcall");
                        this.node = node;
                        this.stack=stack;
                        this.paramObj=null;
                        // Noa aniadimos como listener de los parametros.
                        // Nota: los parametros se parsean antes, ya que existen antes en el array de
                        // expandos existentes.
                        var paramsObj = node.data("sivparams");
                        if (paramsObj) {
                            this.paramObj = nodeExpandos["sivparams"];
                            this.paramObj.addListener("CHANGE", this, "update", "CallExpando:" + this.method);
                        }
                        this.update();
                        // Un sivcall no debe procesar su contenido.El por que, es complejo:
                        // Supongamos que el contenido del nodo , va a ser establecido en la llamada , a otra subplantilla cargada via ajax.
                        // La primera vez que se procesa el sivCall, la plantilla que quiere meter en el nodo, no esta cacheada,
                        // asi que cuando termina la llamada , el nodo no tiene hijos, y no se parsean.
                        // La segunda vez que se ejecute el SivCall, la plantilla a meter YA esta cacheada, por lo que muy probablemente
                        // hara que ANTES de terminar la llamada, el nodo ya tenga la subplantilla.
                        // Esta diferencia hace que, en el primer caso, el contenido de sivCall no se parsee.En el segundo, si.
                        // Y esto puede provocar que el codigo acabe parseando dos veces la subplantilla.
                        // Por si acaso, metemos un parametro extra que nos indique que queremos hacer.
                        var doparse = node.attr("parseContent");
                        if (doparse)
                            return true;
                        return false; // NO se deben procesar los contenidos del nodo.Que lo haga quien lo llama.

                    },
                    update: function () {
                        var params = null;
                        if (this.paramObj!==null)
                            params = this.paramObj.getValues();

                        if (this.method.substr(0, 1) == ".") {
                            return window[this.method.substr(1)](this.node, params);
                        }
                        var src = this.stack.getRoot("*")
                        src[this.method](this.node, params);
                    }
                }

            },
            ParamsExpando: {
                inherits: "Expando,Siviglia.Dom.EventManager",
                construct: function () {
                    this.Expando("sivparams");
                    this.paramValues={};
                    this.paths=[];
                    this.EventManager();
                    this.disableEvents=false;
                },
                destruct:function()
                {
                    if(this.paths!==null) {
                        this.paths.map(function (item) {
                            item.destruct();
                        });
                        this.paths = null;
                    }
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        this.node = node;
                        var pObj = node.data(this.expandoTag);
                        if (typeof pObj == "string") {
                            try {
                                pObj = JSON.parse(pObj);
                            }catch(e)
                            {
                                debugger;
                            }
                        }
                        this.disableEvents=true;
                        var m=this;
                        for(var k in pObj)
                        {
                            (function(key,value){
                                var pr=new Siviglia.Path.PathResolver(stack,value);
                                pr.addListener("CHANGE",null,function(ev,param){
                                    // TODO : Que hacer si un path de un parametro es no definido?
                                    // Por ahora, simplemente enviamos un null.El widget debera saber que hacer.
                                    if(param.valid===false)
                                        m.updateParams(key,null);
                                    else
                                        m.updateParams(key,param.value);
                                },"ParamsExpando");
                                m.paths.push(pr);
                                pr.getPath();
                            })(k,pObj[k]);
                        }
                        this.disableEvents=false;
                        return true;
                    },
                    updateParams:function(pName,pValue)
                    {
                        //if(typeof pValue.__type__!=="undefined")
                        //    val=pValue.getValue();

                        this.paramValues[pName]=pValue;
                        if(this.disableEvents==false)
                            this.fireEvent("CHANGE", {value: this.paramValues});
                        if (this.node) {
                            this.node.data("params", this.params);
                        }
                    },
                    getValues: function () {
                        return this.paramValues;
                    }
                }
            },
            // Aunque derive de Expando, Loop no se basa en parametrizableString, sino directamente en path.
            LoopExpando: {
                inherits: "Expando",
                construct: function () {
                    this.resolver = null;
                    this.Expando("sivloop");
                    this.oldNodes=null;
                    this.origNode=null;

                    this.childNodes = [];
                    this.nest = true;

                },
                destruct: function () {
                    this.reset();
                    if (this.resolver)
                        this.resolver.destruct();
                    this.childNodes = null;
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        this.origHTML = [];
                        this.stack = stack;
                        this.oManagers=[];
                        this.ownStacks=[];
                        this.node = node;
                        this.origNode=node[0].cloneNode(false);
                        Object.keys(this.origNode.dataset).forEach(dataKey => {
                            delete this.origNode.dataset[dataKey];
                        });
                        this.parentView=nodeManager.parentView;
                        for (var k = 0; k < node[0].childNodes.length; k++) {
                            var cNode = node[0].childNodes[k];
                            if (cNode.nodeType != 3 && cNode.nodeType != 8)
                                this.origHTML.push(cNode.cloneNode(true));
                        }
                        if (typeof node.data("sivnested") !== "undefined")
                            this.nest = node.data("sivnested");

                        this.contextParam = node.data("contextindex");
                        this.resolver = new Siviglia.Path.PathResolver(stack, node.data("sivloop"));
                        this.resolver.addListener("CHANGE", this, "update", "LoopExpando:" + this.str);
                        this.resolver.getPath();
                        node.remove();
                        return false;
                    },
                    reset: function () {
                        for(var k in this.oManagers)
                        {
                            this.oManagers[k].destruct();
                        }
                        for(var k in this.ownStacks)
                            this.ownStacks[k].destruct()
                        this.oManagers=[];
                        this.ownStacks=[];

                    },
                    update: function (event, params) {
                        if(params.valid===false)
                            return;
                        var oldNodes=this.childNodes;
                        if(this.oManagers.length > 0) {
                            let nnode=this.origNode.cloneNode(false);
                                this.node=$(nnode).insertBefore(this.node[0]);
                            this.reset();
                        }
                        var val = params.value;
                        if(typeof params.value.__type__!=="undefined")
                            val=params.value.getValue();
                        if (!val)
                            val = [];
                        var contextRoot;
                        var newNode=$(this.origNode.cloneNode(false));

                        var newNodes=[];
                        var cb = (function (key, value,parent) {
                            contextRoot = {};
                            var stack=this.stack.getCopy();
                            var manager = new Siviglia.UI.HTMLParser(stack,this.parentView);
                            var contextContext = new Siviglia.Path.BaseObjectContext(contextRoot, "@", stack);

                            // Ponemos al elemento sobre el que iteramos, como el padre de la variable de contexto .
                            // Asi, si iteramos sobre un array [1,2,3], con contextIndex="param",
                            // @param apuntará a 1,a 2, y a 3 al iterar, pero el padre del contexto, asociado a "param", siempre será el array
                            stack.getContext("@").addParentObject(this.contextParam,parent);
                            contextRoot[this.contextParam] = value;
                            contextRoot[this.contextParam + "-index"] = key;


                            for (var j = 0; j < this.origHTML.length; j++) {
                                // Por qué hay que crear un fakeParent:
                                // Si un loop contiene la creacion de una vista, pasa lo siguiente:
                                // <div data-sivLoop="/*miarray" ...><div data-sivView="...."></div></div>
                                // La vista, se parsea, crea sus nodos, y lo que va a intentar, es poner esos nodos
                                // como *hermanos* del nodo que contiene sivView, y luego, eliminar el nodo que contiene sivView,
                                // para que así no quede rastro de él. Pero el problema es que el nodo que contiene data-sivView,
                                // que ha sido clonado por el sivLoop, no tiene padre...es un clon que aun no está en el DOM..asi que no
                                // puede tener hermanos...
                                // Asi que creamos un padre "fake", para que el contenido del cloneNode tenga un padre..y asi, si hay
                                // una vista, el clone pueda tener un padre.
                                var curNode = this.origHTML[j].cloneNode(true);
                                // Como padre, creamos una copia del nodo original.
                                var fakeParent=$(this.origNode.cloneNode(false));
                                fakeParent.append(curNode);
                                if (curNode.nodeType == 1)
                                    manager.parse(fakeParent);
                                //reference.parentNode.insertBefore(curNode, reference.nextSibling);
                                newNodes.push({node: fakeParent.contents(), value: value});
                                var l=fakeParent[0].childNodes.length;
                                for(var s=0;s<l;s++) {

                                    newNode[0].appendChild(fakeParent[0].childNodes[0]);
                                }
                                //reference = curNode;
                            }
                            this.oManagers.push(manager);
                            this.ownStacks.push(stack);
                            return contextRoot[this.contextParam];

                        }).bind(this);

                        var valType = val.constructor.toString();

                        if (valType.substr(0,16) =="function Array()")
                            val.map(function (value, index) {
                                var ret=cb(index, value,val);

                            });
                        else {
                            if (valType.indexOf("bject") > 0) {
                                for (var k in val) {
                                    var ret=cb(k, val[k],val);
                                }
                            } else {
                                //alert("Indicado LoopExpando sobre path que no es un array");
                                return;
                            }
                        }
                        var newChildren=$(newNode).contents();
                        if (newChildren.length === 0)
                            newChildren = $("<div></div>");
                        if(this.origNode.tagName=="div" || this.origNode.tagName=="span") {

                            newChildren.insertBefore(this.node[0]);
                            this.node.remove();
                            this.node=newChildren;
                        }
                        else
                        {
                            let newNode=$(this.origNode.cloneNode(false));
                            newNode.insertBefore(this.node[0]);
                            newNode.append(newChildren);
                            this.node.remove();
                            this.node=newNode;
                        }

                        //$(newNode).children().appendTo(this.node);

                        this.childNodes=newNodes;

                        for(var k=0;k<oldNodes.length;k++)
                            oldNodes[k].node.remove();
                    }
                }
            },
            EventExpando: {
                inherits: "Expando",
                construct: function () {
                    this.Expando("sivevent");
                },
                destruct: function () {
                    this.reset();
                    if(this.node)
                        this.node.unbind();
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        this.node = node;
                        var attr = node.data(this.expandoTag);
                        var callback = node.data("sivcallback");
                        if (!callback)
                            throw "Event Expando missing data-sivcallback expando";
                        var evContext = null;
                        try {
                            evContext = stack.getRoot("*");
                        } catch (e) {
                            evContext = window;
                        }
                        var paramsExpando = node.data("sivparams");
                        var paramsObj;
                        if (paramsExpando)
                            paramsObj = nodeExpandos["sivparams"].getValues();
                        node.data("event_caller", evContext);
                        node.data("event_method", callback);
                        var callbackBuilder = function (evName) {
                            return function (event) {
                                var caller = $(this).data("event_caller");
                                var params = [];
                                params.push($(this));
                                params.push(paramsObj);
                                var method = $(this).data("event_method");
                                // Si existe caller.invoke, es que es un widget
                                if (caller.invoke)
                                    return evContext.invoke(method, params, evName, event);
                                else {
                                    params.push(evName);
                                    params.push(event);
                                    return evContext[method].apply(caller, params);
                                }
                            }
                        };
                        this.node = node;

                        var events = attr.split(",");
                        events.map(function (item) {
                            $(node).off(item);
                            $(node).on(item, callbackBuilder(item));
                        });
                        return true;
                    },
                    reset: function () {
                        if(this.node) {
                            var attr = this.node.data(this.expandoTag);
                            var events = attr.split(",");
                            events.map(function (item) {
                                this.node.unbind(item);
                            }.bind(this));
                        }
                    }
                }
            },

            IfExpando: {
                inherits: "Expando",
                construct: function () {
                    this.oManager = null;
                    this.Expando("sivif");
                },
                destruct: function () {
                    this.removeCurrentChildren();
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {

                        this.origHTML = [];
                        this.childNodes=[];
                        while (node[0].childNodes.length>0) {
                            var n = node[0].childNodes[0];
                            var s = n.cloneNode(true);
                            n.parentElement.removeChild(n);
                            this.origHTML.push(n);
                        }
                        this.origDisplay = node[0].style.display;
                        // Se crea un comentario en la posicion del nodo
                        this.commentNode=document.createComment("SivIfReference");
                        $(this.commentNode).insertBefore(node);
                        this.Expando$_initialize(node, nodeManager, stack, nodeExpandos);
                        node.remove();
                        return false;
                    },
                    update: function (val) {
                        if (!eval(val))
                            this.removeContent();
                        else
                            this.restoreContent();
                    },
                    restoreContent: function () {
                        this.removeCurrentChildren();

                        this.oManager = new Siviglia.UI.HTMLParser(this.stack,this.parentView);
                        //this.node.html("");

                        var curNode;
                        // Se crea un container temporal para todos los clones.
                        // Esto es necesario para que los expandos que sustituyen su nodo (como loop, if, view),
                        // puedan colocar su contenido "detras" del nodo que los define. Pero para que exista ese "detras",
                        // el nodo que los define tenia que tener un padre.
                        var tempContainer=document.createElement("div");
                        for (var j = 0; j < this.origHTML.length; j++) {
                            curNode = this.origHTML[j].cloneNode(true);
                            tempContainer.appendChild(curNode);
                        }
                        // Se parsea el padre temporal.
                        this.oManager.parse($(tempContainer));
                        // Y ahora, se extraen del temporal, y se colocan detras del comentario de marca.
                        var lastNode=$(this.commentNode);
                        while(tempContainer.childNodes.length>0)
                        {
                            curNode=$(tempContainer.childNodes[0]);
                            curNode.insertAfter(lastNode);
                            lastNode=curNode;
                            this.childNodes.push(lastNode);
                        }
                        //this.node.css("display", this.origDisplay);
                        this.dontRecurse = false;
                    },
                    removeCurrentChildren:function()
                    {
                        if (this.oManager)
                            this.oManager.destruct();
                        for(var k=0;k<this.childNodes.length;k++)
                        {
                            this.childNodes[k].remove();
                        }
                        this.childNodes=[];
                    },
                    removeContent: function () {
                        this.removeCurrentChildren();
                        this.node.css("display", "none");
                        this.dontRecurse = true;
                    }
                }
            },
            /*NonEmptyExpando: {
                inherits: "IfExpando",
                construct: function () {
                    this.oManager = null;
                    this.Expando("sivexists");
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        try {
                            this.IfExpando$_initialize(node, nodeManager, stack, nodeExpandos);
                        } catch (e) {
                            if (e instanceof Siviglia.Errors.PathNotFoundException) {
                                node.remove();
                                this.removeContent();
                            } else
                                throw e;
                        }
                    },
                    update: function () {
                        this.restoreContent();
                    }
                }
            },*/
            PromiseExpando:{
                inherits: "Expando",
                construct: function () {
                    this.oManager = null;
                    this.Expando("sivpromise");
                },
                destruct:function()
                {
                    if(this.resolver)
                        this.resolver.destruct();
                },
                methods: {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {

                        this.origHTML = [];
                        this.childNodes=[];
                        while (node[0].childNodes.length>0) {
                            var n = node[0].childNodes[0];
                            var s = n.cloneNode(true);
                            n.parentElement.removeChild(n);
                            this.origHTML.push(n);
                        }
                        this.origDisplay = node[0].style.display;
                        // Se crea un comentario en la posicion del nodo
                        this.commentNode=document.createComment("SivPromiseReference");
                        $(this.commentNode).insertBefore(node);

                        this.resolver = new Siviglia.Path.PathResolver(stack, node.data("sivpromise"));
                        this.resolver.addListener("CHANGE", this, "update", "PromiseExpando:" + this.str);
                        this.resolver.getPath();
                        return false;
                    },
                    update: function (event, params) {
                        var value=params.value;
                        if(value.then)
                            value.then(function(){this.restoreContent()}.bind(this))
                    },
                    restoreContent: function () {
                        this.removeCurrentChildren();

                        this.oManager = new Siviglia.UI.HTMLParser(this.stack,this.parentView);
                        //this.node.html("");

                        var curNode;
                        // Se crea un container temporal para todos los clones.
                        // Esto es necesario para que los expandos que sustituyen su nodo (como loop, if, view),
                        // puedan colocar su contenido "detras" del nodo que los define. Pero para que exista ese "detras",
                        // el nodo que los define tenia que tener un padre.
                        var tempContainer=document.createElement("div");
                        for (var j = 0; j < this.origHTML.length; j++) {
                            curNode = this.origHTML[j].cloneNode(true);
                            tempContainer.appendChild(curNode);
                        }
                        // Se parsea el padre temporal.
                        this.oManager.parse($(tempContainer));
                        // Y ahora, se extraen del temporal, y se colocan detras del comentario de marca.
                        var lastNode=$(this.commentNode);
                        while(tempContainer.childNodes.length>0)
                        {
                            curNode=$(tempContainer.childNodes[0]);
                            curNode.insertAfter(lastNode);
                            lastNode=curNode;
                            this.childNodes.push(lastNode);
                        }
                        //this.node.css("display", this.origDisplay);
                        this.dontRecurse = false;
                    },
                    removeCurrentChildren:function()
                    {
                        if (this.oManager)
                            this.oManager.destruct();
                        for(var k=0;k<this.childNodes.length;k++)
                        {
                            this.childNodes[k].remove();
                        }
                        this.childNodes=[];
                    },
                    removeContent: function () {
                        this.removeCurrentChildren();
                        this.node.css("display", "none");
                        this.dontRecurse = true;
                    }
                }
            }
        }
  }
)

Siviglia.Utils.buildClass(
  {
      context: 'Siviglia.UI.Expando',
      classes: {
          WidgetExpando: {
              inherits: 'Expando',
              construct: function () {
                  this.Expando("sivwidget");
              },
              methods: {
                  _initialize: function (node, nodeManager, pathRoot, contextObj, caller) {
                      this.caller = caller;
                      this.widgetName = node.data("sivwidget");
                      this.widgetNode = node[0];
                      this.widgetCode = node.data("widgetcode");
                      this.widgetParams = node.data("widgetparams");
                      if(typeof Siviglia.UI.Expando.WidgetExpando.prototype.widgets=="undefined")
                          Siviglia.UI.Expando.WidgetExpando.prototype.widgets={};
                      Siviglia.UI.Expando.WidgetExpando.prototype.widgets[this.widgetName] = this;
                      this.context = contextObj;
                      this.pathRoot = pathRoot;
                      node[0].removeAttribute("sivWidget");
                      node.removeData("sivWidget");
                      return false;
                  },
                  getNode: function () {
                      var newNode= $(this.widgetNode).clone(true);
                      newNode[0].removeAttribute("data-sivwidget");
                      newNode.removeData("sivwidget");
                      return newNode;
                  },
                  getClass: function(){
                      if(typeof this.widgetCode=="undefined") {
                          console.warn("El widget " + this.widgetName + " no tiene clase asociada.Se asume " + this.widgetName);
                          this.widgetCode=this.widgetName;
                      }


                      var curClass = Siviglia.Utils.stringToContextAndObject(this.widgetCode);
                      if(typeof curClass.context[curClass.object]==="undefined")
                      {
                          throw "ERROR::LA CLASE DEFINIDA PARA EL WIDGET "+this.widgetName+" ("+this.widgetCode+") NO EXISTE";
                      }


                      return this.widgetCode;
                  }
              }
          },
          WidgetFactory: {
              construct: function () {
              },
              methods: {
                  hasInstance:function(widgetName)
                  {
                      var lib = Siviglia.UI.Expando.WidgetExpando.prototype.widgets;

                      return lib && lib[widgetName];
                  },
                  get:function(widgetName,context)
                  {
                      var ins=this._getFromCache();
                      if(ins)
                      {
                          var p = $.Deferred();
                          p.resolve(ins);
                          return p;
                      }
                      return this._getFromRemote(widgetName,context);
                  },
                  _getFromCache:function(widgetName,context)
                  {
                      var lib = Siviglia.UI.Expando.WidgetExpando.prototype.widgets;
                      if (lib && lib[widgetName])
                          return lib[widgetName];
                      return null;
                  },
                  getInstance: function (widgetName,context) {

                      var p=this._getFromCache(widgetName,context);
                      if(p)
                          return p;
                      return this._getFromRemote(widgetName,context);
                  },
                  _getFromRemote:function(widgetName,context)
                  {
                      if(typeof Siviglia.UI.Expando.WidgetExpando.prototype.widgetPromises[widgetName]!=="undefined")
                          return Siviglia.UI.Expando.WidgetExpando.prototype.widgetPromises[widgetName];
                      var p = $.Deferred();
                      Siviglia.UI.Expando.WidgetExpando.prototype.widgetPromises[widgetName]=p;
                      var lib = Siviglia.UI.Expando.WidgetExpando.prototype.widgets;
                      Siviglia.require([
                          {"type":"widget",
                              "template":"/js/"+widgetName.replace(/\./g,"/")+".html",
                              "js":"/js/"+widgetName.replace(/\./g,"/")+".js",
                              "context":context
                          }
                      ],true).then(function(){
                          // Cuando se ha parseado el nodo al cargar el widget, se ha autoañadido a la cache.
                          if(typeof lib[widgetName]==="undefined")
                          {
                              // Probamos el metodo alternativo, cuando el nombre es del tipo /model/....
                              // Primero, quitamos la parte comun, que es /js/Siviglia
                              var w2="Siviglia"+widgetName.replace("/js/Siviglia","").replace(/\//g,".");
                              if(typeof lib[w2]==="undefined")
                                  console.error("El widget "+widgetName+" | "+w2+" no esta bien definido.Se ha cargado el fichero, pero la clase sigue sin existir");
                              else
                                  widgetName=w2;
                          }
                          p.resolve(lib[widgetName]);
                      });

                      return p;
                  }
              }
          },

          View: {
              construct: function (template, params, widgetParams,node,  context,parentView) {

                  this.__template = template;
                  this.__params = params;
                  this.__node = node;
                  this.rootNode=node; // Solo por compatibilidad
                  this.__context = context.getCopy();
                  var plainCtx = new Siviglia.Path.BaseObjectContext(this, "*", this.__context);
                  this.__widgetParams = widgetParams;
                  this.oManager=null;
                  this.destroyed=false;
                  this.__builtPromise=SMCPromise();
                  this.__completedPromise=SMCPromise();
                  this.__externalPromises=[];
                  this.__built=false;
                  this.__parentView=null;
                  this.__subViews=[];
                  if(typeof parentView!=="undefined")
                      this.__parentView=parentView;

              },
              destruct:function()
              {
                  // Necesitamos saber si hemos sido destruidos desde el preInitialize.
                  this.destroyed=true;
                  if(this.__parentView)
                      this.__parentView.__removeSubView(this);
                  if(this.oManager)
                      this.oManager.destruct();
                  if(typeof this.__destroy__!=="undefined")
                      this.__destroy__();
              },
              methods: {
                  __setParentView:function(view)
                  {
                      this.__parentView=view;

                  },
                  __addDependency:function(promise)
                  {
                      this.__externalPromises.push(promise);
                  },
                  __build: function () {
                      var widgetFactory = new Siviglia.UI.Expando.WidgetFactory();
                      // var p=$.Deferred();
                      var p=SMCPromise();
                      var f=(function (w) {

                          var returned=this.preInitialize(this.__params);
                          var f=function() {
                              // Si tras el preInitialize hemos sido destruidos, porque no podia renderizarse
                              // la vista, salimos aqui.
                              if(this.destroyed==true)
                                  return;
                              this.__composeHtml(w);
                              this.parseNode();
                              this.waitComplete().then(function(){
                                  this.initialize(this.__params);
                              }.bind(this))
                              p.resolve(this);
                              this.__builtPromise.resolve();
                          }.bind(this);
                          if(typeof returned!=="undefined" && returned.then)
                              returned.then(f);
                          else
                              f();
                      }).bind(this);
                      if(!widgetFactory.hasInstance(this.__template))
                          SMCPromise.when(widgetFactory.getInstance(this.__template)).then(f);
                      else
                          f(widgetFactory.getInstance(this.__template));
                      return p;
                  },
                  __addSubView:function(view)
                  {
                      this.__subViews.push({view:view,promise:view.__builtPromise,resolved:false});
                      view.waitComplete().then(function(builtView){
                          if(view.__viewName!==null)
                              this[view.__viewName]=view.__view;
                          this.__setSubViewResolved(view,builtView);
                      }.bind(this));
                  },
                  __setSubViewResolved:function(view,replaceWith)
                  {
                      if(this.__built)
                          return;
                      var allResolved=true;
                      for(var k=0;k<this.__subViews.length;k++)
                      {
                          var c=this.__subViews[k];
                          if(!c.resolved)
                          {
                              if(c.view===view) {
                                  c.resolved = true;
                                  if(Siviglia.isset(replaceWith)) {
                                      c.view = replaceWith;
                                      c.view.__setParentView(this);
                                  }
                              }
                              else
                                  allResolved=false;
                          }
                      }
                      if(allResolved)
                      {
                          this.__builtPromise.then(function(){
                              this.__built=true;
                              $.when.apply($, this.__externalPromises).then( function(){
                                  this.__completedPromise.resolve();
                              }.bind(this) );
                          }.bind(this));
                      }
                  },
                  // Este metodo se debe usar para esperar a que todas las
                  // vistas hijas hayan terminado.
                  waitComplete:function()
                  {
                      return this.__completedPromise;
                  },
                  __removeSubView:function(view)
                  {
                      for(var k=0;k<this.__subViews.length;k++)
                      {
                          if(this.__subViews[k].view===view) {
                              this.__subViews.splice(k, 1);
                              break;
                          }
                      }
                      this.__setSubViewResolved(null);
                  },
                  __composeHtml: function (widget) {

                      this.widgetNode = widget.getNode();
                      //this.__node[0].parentNode.insertBefore(widgetNode[0],this.__node[0].nextSibling);

                  },
                  parseNode:function()
                  {

                      this.oManager = new Siviglia.UI.HTMLParser(this.__context,this);
                      try {
                          this.__node.removeAttr("data-sivview");
                          this.__node.removeData("sivview");
                          Siviglia.UI.viewStack.push(this);
                          var oldNode=this.__node;
                          this.__node=this.widgetNode;
                          this.rootNode=this.__node;
                          this.oManager.parse(this.__node);
                          $.each(oldNode,function(idx,value){
                              if(idx==0) {
                                  if (this.widgetNode instanceof jQuery){
                                      value.replaceWith(this.widgetNode[0]);
                                  }
                                  else
                                      value.replaceWith(this.widgetNode);
                              }
                              else
                                  value.remove();
                          }.bind(this));
                          Siviglia.UI.viewStack.pop();
                          var children=[];
                          /*
                          for(var j=0;j<this.widgetNode.length;j++)
                          {
                              var curNode=this.widgetNode[j];
                              for(l=0;l<curNode.childNodes.length;l++)
                                  children.push(curNode.childNodes[l]);
                          }*/
                          //this.rootNode=$(children);//this.widgetNode.children();
                          this.rootNode=this.widgetNode.children();

                          // Chequeamos si todos los elementos han sido resueltos
                          this.__setSubViewResolved(null);

                      }catch(e)
                      {
                          console.dir(e);
                          throw e;
                      }
                      //console.log(this.__node[0].innerHTML)
                  },
                  getNode:function()
                  {
                      return this.__node;
                  },
                  preInitialize:function(params)
                  {

                  },
                  initialize:function(params)
                  {

                  },
                  onAddedToDom:function()
                  {

                  },
                  rebuild:function()
                  {

                  }
              }

          },
          ViewExpando: {
              inherits: 'Expando',
              construct: function () {
                  this.Expando('sivview');
                  this.__view = null;
                  this.__builtPromise=SMCPromise();
                  this.__name = null;
                  this.__params = null;
                  this.__str=null;
                  this.__altLayout=null;
                  this.__viewName=null;
                  this.__parentView=null;

              },
              destruct: function () {
                  if (this.__view !== null)
                      this.__view.destruct();
              },
              methods:
                {
                    _initialize: function (node, nodeManager, stack, nodeExpandos) {
                        if(this.__parentView===null && typeof nodeManager.parentView!=="undefined") {
                            this.__parentView=nodeManager.parentView;
                            this.__parentView.__addSubView(this, this.__builtPromise);
                        }
                        var dataset = node.data();
                        if(typeof dataset["viewname"]!=="undefined")
                        {
                            // Se ve si el nodo indica que hay que mapear el nodo a un id determinado de la
                            // vista padre.
                            // Para ello, se recoge la propiedad data-viewName, que se resuelve como una
                            // parametrizable string, con el stack del padre, y sin eventos (tiene que resolverse inmediatamente)
                            var curRoot = stack.getRoot("*");
                            var str = new Siviglia.Path.ParametrizableString(dataset["viewname"], stack,{listenerMode:0});
                            var parsed=str.parse();
                            if(parsed)
                                this.__viewName=parsed;
                        }

                        // Listener de nombre de vista: Es el propio del Expando.
                        var altLayout = node.data("sivlayout");

                        if(typeof altLayout!=="undefined")
                            this.__altLayout=altLayout;

                        this.__stack=stack;

                        // Obtener id para, en su caso, mapear esta instancia sobre la vista padre.
                        // Nota: Esto podria ser un array.
                        this.__oldNode=null;
                        this.node = node;
                        this.__expandoNode=node;

                        this.__params=typeof nodeExpandos["sivparams"]=="undefined"?null:nodeExpandos["sivparams"];
                        if (this.__params)
                            this.__params.addListener("CHANGE", this, "__updateParams", "ViewExpando:" + this.__method);
                        this.Expando$_initialize(node, nodeManager, stack, nodeExpandos);

                        return false;
                    },
                    update: function (params) {
                        this.__name = params;
                        this.__rebuild();
                    },
                    __updateParams:function(event,params){


                        this.__rebuild();
                    },
                    waitComplete:function()
                    {
                        return this.__builtPromise;
                    },
                    __rebuild:function()
                    {
                        var p=$.Deferred();
                        //var p=new SMCPromise();
                        if(this.__view)
                            this.__view.rebuild();


                        this.node.removeData("sivview");
                        this.node.removeAttr("data-sivview");
                        var oldView=null;
                        if (this.__view) {
                            oldView=this.__view;
                            // oldView.getNode().css({"display":"none"})
                        }
                        if(this.__params)
                            this.__currentParamsValues=this.__params.getValues();
                        var widgetFactory = new Siviglia.UI.Expando.WidgetFactory();
                        var m=this;

                        var f=(function (w) {
                            var className=w.getClass();
                            var obj=Siviglia.Utils.stringToContextAndObject(className);
                            var tempNode=$("<div class='inner'></div>");
                            this.__view = new obj.context[obj.object](
                              this.__altLayout==null?this.__name:this.__altLayout,
                              this.__currentParamsValues,null, tempNode,  this.__stack,this.__parentView);
                            this.__view.waitComplete().then(function(){
                                if(this.__parentView!==null) {
                                    this.__builtPromise.resolve(this.__view);
                                }
                                p.resolve()
                            }.bind(this))
                            Siviglia.UI.viewStack.push(this.__view);
                            this.__view.__build().then(function(){
                                // Importante no usar aqui .children(), ya que omite los comentarios,
                                // que son necesarios para sivIf
                                m.rootNode = $(m.__view.getNode()[0].childNodes);
                                m.rootNode.insertAfter($(m.node[0]));
                                m.node.remove();
                                m.node = m.rootNode;
                                if(oldView)
                                    oldView.destruct();
                                m.__view.onAddedToDom();
                                Siviglia.UI.viewStack.pop();

                            });

                        }).bind(this);

                        if(!widgetFactory.hasInstance(this.__name)) {
                            SMCPromise.when(widgetFactory.getInstance(this.__name)).then(f);
                        }
                        else
                            f(widgetFactory.getInstance(this.__name));
                        return p;

                    }
                }
          }
      }
  });
Siviglia.Utils.buildClass({
    "context":"Siviglia.services",
    "classes":{
        "ServiceManager":{
            construct:function()
            {
                if(typeof Siviglia.services.__serviceList==="undefined")
                    Siviglia.services.__serviceList=[];
            },
            methods:{
                add:function(serviceName,instance)
                {
                    Siviglia.services.__serviceList[serviceName]=instance;
                },
                get:function(serviceName)
                {
                    return Siviglia.issetOr(Siviglia.services.__serviceList[serviceName],null);
                }
            }
        }
    }
});
Siviglia.Service=new Siviglia.services.ServiceManager();
Siviglia.UI.Expando.WidgetExpando.prototype.widgets={};
Siviglia.UI.Expando.WidgetExpando.prototype.widgetPromises={};

Siviglia.UI.Expando.WidgetExpando.prototype.widgetLoadingPromises={};
Siviglia.UI.Expando.WidgetExpando.prototype.widgetExecutingRequires={};
Siviglia.Utils.load=function(assets, doParse) {
    var loadHTML=function(url,node,prevPromise){
        var promise=$.Deferred();
        $.get(url).then(function (r) {
            var add = function () {
                if (typeof node == "undefined" || node == null) {
                    node = $("<div></div>");
                    $(document.body).append(node);
                }
                node.html(r);
                // Ojo, aqui se llama a un objeto Siviglia.App.Page
                promise.resolve(node);
            }

            if (typeof prevPromise == "undefined" || prevPromise == null)
                add();
            else
                prevPromise.then(function () {add();});
        });
        return promise;
    };
    var loadJS = function (url, prevPromise) {
        var promise = $.Deferred();
        var add = function () {
            var v = document.createElement("script");
            v.onload = function () {
                promise.resolve();
            }
            v.src = url;
            document.head.appendChild(v);
        }
        if (typeof prevPromise == "undefined" || prevPromise == null)
            add();
        else
            prevPromise.then(function () {
                add();});
        return promise;
    };
    var loadCSS=function(url){
        var promise=$.Deferred();
        var v=document.createElement("link");
        v.rel="stylesheet";
        v.href=url;
        v.onload=function(){promise.resolve();}
        document.head.appendChild(v);
        return promise;
    };
    var loadWidget = function (config, prevPromise) {
        var widgetPrototype = Siviglia.UI.Expando.WidgetExpando.prototype;
        var subdomain = Siviglia.config.staticsUrl
        var promise = $.Deferred();
        promise.resolved=false;
        var jsURL = subdomain + config.js
        var htmlURL = subdomain + config.template

        if (!config.node) {
            if(typeof Siviglia.Utils.load.__rootloadnode__=="undefined") {
                Siviglia.Utils.load.__rootloadnode__ = $('<div style="display:none;"></div>');
                $(document.body).prepend(Siviglia.Utils.load.__rootloadnode__);
            }
            var newDiv=$('<div></div>');
            Siviglia.Utils.load.__rootloadnode__.append(newDiv);
            config.node=newDiv;
        }

        widgetPrototype.widgetExecutingRequires[jsURL]=0;

       // promisesList.push(promise);
        var widgetPromises = [];

        var htmlPromise = loadHTML(htmlURL, config.node, prevPromise)
        widgetPromises.push(htmlPromise);

        var jsAndRequirePromise=$.Deferred();
        var jsPromise = loadJS(jsURL, htmlPromise)
        jsPromise.then(function(){
            if(widgetPrototype.widgetExecutingRequires[jsURL]===0)
                jsAndRequirePromise.resolve();
            else
                widgetPrototype.widgetLoadingPromises.then(function(){jsAndRequirePromise.resolve();})
        })
        widgetPromises.push(jsAndRequirePromise);

        $.when.apply($, widgetPromises).then(function () {
            console.log("RESUELTO WIDGET DE "+jsURL);
            if (true ){ //typeof doParse !== "undefined" && doParse === true) {
                var parser = new Siviglia.UI.HTMLParser(config.context, null);
                parser.parse(config.node);
                config.node.data("noparse",true);
            }
            promise.resolved=true;
            promise.resolve(config.node);
            if(typeof widgetPrototype.widgetLoadingPromises[jsURL] !=="undefined")
                widgetPrototype.widgetLoadingPromises[jsURL].resolve();
        })
        return promise
    }

    if (typeof assets === 'string' || typeof assets.template === 'string')
        assets = [assets]

    var promisesList=[];
    var lastPromise=null;

    for(var k=0;k<assets.length;k++) {
        var resource=assets[k];

        if(typeof resource==="string") {
            var type=null;
            var splitPath = resource.split('/')
            if(splitPath.length>0) {
                var fileName=splitPath.pop()
                var splitFileName=fileName.split(".");
                if(splitFileName.length > 1)
                    type=splitFileName.pop();
                else
                    type = 'widget'
            }
            switch(type) {
                case "html": {
                    promisesList.push(loadHTML(resource,null));
                }break;
                case "js": {
                    promisesList.push(loadJS(resource));
                }break;
                case "css": {
                    promisesList.push(loadCSS(resource));
                }break;
                case "widget":{
                    lastPromise=loadWidget({"template":resource+".html","js":resource+".js"},lastPromise)
                    promisesList.push(lastPromise);
                }
            }

        } else {
            lastPromise = loadWidget(resource,lastPromise)
            promisesList.push(lastPromise)
        }
    }

    var curPromise=$.Deferred();
    $.when.apply($, promisesList).done(function() {
        console.dir(promisesList);
        curPromise.resolve();
    });
    return curPromise;
};
Siviglia.require = function (assets, doParse=false) {
    if (typeof assets === 'string' || typeof assets.template === 'string') {
        assets = [assets]
    }
    var newAssets=[];
    reqPromises=[];
    var widgetURL = Siviglia.config.staticsUrl;
    var promiseForDepended = $.Deferred();
    for (var k = 0; k < assets.length; k++) {

        var dependency = assets[k];
        if(typeof Siviglia.UI.Expando.WidgetExpando.prototype.widgetLoadingPromises[widgetURL + dependency + '.js'] !== "undefined")
            reqPromises.push(Siviglia.UI.Expando.WidgetExpando.prototype.widgetLoadingPromises[widgetURL + dependency + '.js']);
        else {

            Siviglia.UI.Expando.WidgetExpando.prototype.widgetExecutingRequires[widgetURL + dependency + '.js'] = 1;
            Siviglia.UI.Expando.WidgetExpando.prototype.widgetLoadingPromises[widgetURL + dependency + '.js'] = promiseForDepended;
            newAssets.push(dependency);
        }
    }
    var finishedPromise=$.Deferred();
    if(newAssets.length > 0) {
        var promise = Siviglia.Utils.load(newAssets, doParse);
        reqPromises.push(promise);
    }
    $.when.apply($,reqPromises).then(function(){
        promiseForDepended.resolve()
        finishedPromise.resolve();
    })
    return finishedPromise;
}

Siviglia.Utils.setCookie = function (name, value, expires, path, domain, secure) {
    var today = new Date().getTime();
    var expires_date = new Date(today + (expires ? expires * 1000 * 60 * 60 * 24 : 0));
    document.cookie = name + "=" + escape(value) +
      ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
      ( ( path ) ? ";path=" + path : ";path=/" ) +
      ( ( domain ) ? ";domain=" + domain : "" ) +
      ( ( secure ) ? ";secure" : "" );
}
Siviglia.Utils.getCookie = function (check_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (var i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');
        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
        // if the extracted name matches passed check_name
        if (cookie_name == check_name) {
            b_cookie_found = true;
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }
            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }
    if (!b_cookie_found) {
        return null;
    }
}

/*

 The following functions are stolen from the dojo toolkit. (www.dojotoolkit.org)

 */
String.prototype.cTrim=function( characters) {
    if(!Siviglia.isset(characters)) {
        if(typeof String.prototype.trim !== undefined) {
            // Simply use the String.trim as a default
            return String.prototype.trim.call(string);
        } else {
            // set characters to whitespaces
            characters = "\s\uFEFF\xA0";
        }
    }
    // Characters is set at this point forward
    // Validate characters just in case there are invalid usages
    var escaped = characters.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    var target = new RegExp('^[' + escaped + ']+|[' + escaped + ']+$',"g");
    // Remove the characters from the string
    return this.replace(target, '');
};
String.prototype.ucfirst=function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.str_repeat = function(times){
    return this.repeat(times)
}

if (!String.prototype.trim) {
    String.prototype.trim = function (c) {
        c=Siviglia.issetOr(c,'\s');
        return this.replace(/^\s+|\s+$/g, '');
    };

    String.prototype.ltrim = function (c) {
        c=Siviglia.issetOr(c,'\s');
        return this.replace(/^\s+/, '');
    };

    String.prototype.rtrim = function (c) {
        c=Siviglia.issetOr(c,'\s');
        return this.replace(/\s+$/, '');
    };

    String.prototype.fulltrim = function () {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };
}

Siviglia.types = {
    fromJson: function (/*String*/ json) {
        return eval("(" + json + ")"); // Object
    },
    _escapeString: function (/*String*/str) {
        return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
        replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
        replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r"); // string
    },
    isString: function (/*anything*/ it) {
        return (typeof it == "string" || it instanceof String); // Boolean
    },

    isArray: function (/*anything*/ it) {
        //	summary:
        //		Return true if it is an Array.
        //		Does not work on Arrays created in other windows.
        return it && (it instanceof Array || typeof it == "array"); // Boolean
    },

    isFunction: function (/*anything*/ it) {
        // summary:
        //		Return true if it is a Function
        return Function.call(it) === "[object Function]";
    },

    isObject: function (/*anything*/ it) {
        return it !== undefined &&
          (it === null || typeof it == "object" || Siviglia.types.isArray(it) || Siviglia.types.isFunction(it)); // Boolean
    }
};
Siviglia.deepmerge=(function(){
    var isMergeableObject=function (val) {
        var nonNullObject = val && typeof val === 'object'

        return nonNullObject
          && Object.prototype.toString.call(val) !== '[object RegExp]'
          && Object.prototype.toString.call(val) !== '[object Date]'
    }

    var emptyTarget=function(val) {
        return Array.isArray(val) ? [] : {}
    }

    var cloneIfNecessary=function(value, optionsArgument) {
        var clone = optionsArgument && optionsArgument.clone === true
        return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
    }

    var defaultArrayMerge=function(target, source, optionsArgument) {
        var destination = target.slice()
        source.forEach(function(e, i) {
            if (typeof destination[i] === 'undefined') {
                destination[i] = cloneIfNecessary(e, optionsArgument)
            } else if (isMergeableObject(e)) {
                destination[i] = deepmerge(target[i], e, optionsArgument)
            } else if (target.indexOf(e) === -1) {
                destination.push(cloneIfNecessary(e, optionsArgument))
            }
        })
        return destination
    }

    var mergeObject=function(target, source, optionsArgument) {
        var destination = {}
        if (isMergeableObject(target)) {
            Object.keys(target).forEach(function (key) {
                destination[key] = cloneIfNecessary(target[key], optionsArgument)
            })
        }
        Object.keys(source).forEach(function (key) {
            if (!isMergeableObject(source[key]) || !target[key]) {
                destination[key] = cloneIfNecessary(source[key], optionsArgument)
            } else {
                destination[key] = deepmerge(target[key], source[key], optionsArgument)
            }
        })
        return destination
    }

    var deepmerge=function(target, source, optionsArgument) {
        var array = Array.isArray(source);
        var options = optionsArgument || { arrayMerge: defaultArrayMerge }
        var arrayMerge = options.arrayMerge || defaultArrayMerge

        if (array) {
            return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
        } else {
            return mergeObject(target, source, optionsArgument)
        }
    }

    deepmerge.all = function deepmergeAll(array, optionsArgument) {
        if (!Array.isArray(array) || array.length < 2) {
            throw new Error('first argument should be an array with at least two elements')
        }

        // we are sure there are at least 2 values, so it is safe to have no initial value
        return array.reduce(function (prev, next) {
            return deepmerge(prev, next, optionsArgument)
        })
    }

    return deepmerge;
})();



