array_contains = function (haystack, needle) {

    for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;

}
array_compare = function (total, partial, storeEq) {
    if (!total) return [];
    if (!partial) return [];
    var k, j;
    var found = false;
    var result = [];
    for (k = 0; k < total.length; k++) {
        found = false;
        for (j = 0; j < partial.length; j++) {
            if (total[k] == partial[j]) {
                found = true;
                break;
            }
        }
        if ((found && storeEq) || (!found && !storeEq))
            result[result.length] = total[k];
    }
    return result;
}
array_intersect = function (total, partial) {
    if (!total) return [];
    if (!partial) return [];
    return array_compare(total, partial, true);
}
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.types',
        classes: {
            PathAble: {
                construct: function () {
                    this.__pathParent = null;
                    this.__pathFieldName = null;
                    this.__pathChildren = {};
                    this.__subscribed = false;
                },
                destruct: function () {
                    this.__pathChildren = null;
                },
                methods:
                    {
                        getParent: function () {
                            return this.__pathParent;
                        },
                        setParent: function (parent) {
                            this.__pathParent = parent;
                            this.subscribe();

                        },
                        subscribe: function () {
                            if (this.__pathParent && this.__pathFieldName && !this.__subscribed) {
                                this.__pathParent.addPathChild(this, this.__pathFieldName);
                            }
                        },
                        addPathChild: function (obj, name) {
                            this.__pathChildren[name] = obj;
                        },
                        setFieldName: function (fieldName) {
                            this.__pathFieldName = fieldName;
                        },
                        getFieldName: function () {
                            return this.__pathFieldName;
                        },
                        getFullPath: function () {
                            return this.__fieldNamePath;
                            /*var stack = [];
                            var cur = this;
                            while (!Siviglia.empty(cur)) {
                                var fName = cur.getFieldName();
                                if (fName !== null && fName !== "")
                                    stack.unshift(fName);
                                cur = cur.getParent();
                            }
                            return "/" + stack.join("/");*/
                        },
                        findPath: function (path, asTypes) {
                            var prefix = "";
                            if (typeof asTypes !== "undefined")
                                prefix = "*";
                            var cur = this;
                            if (typeof path === "string") {
                                var parts = path.split("/");
                                if (parts[0] == "")
                                    parts.shift();
                            }
                            for (var k = 0; k < parts.length; k++) {
                                var f = parts[k];
                                if (typeof cur[prefix + f] === "undefined")
                                    throw "Path desconocido:" + path;
                                cur = cur[prefix+f];
                            }
                            return cur;
                        }
                    }
            }
        }

    }
)


top.validations = 0;
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.model',
        classes: {
            BaseTypedException:
                {
                    constants:
                        {
                            ERR_REQUIRED_FIELD: 1,
                            ERR_NOT_A_FIELD: 2,
                            ERR_INVALID_STATE: 3,
                            ERR_INVALID_STATE_TRANSITION: 4,
                            ERR_INVALID_PATH: 5,
                            ERR_DOUBLESTATECHANGE: 6,
                            ERR_INVALID_STATE_CALLBACK: 7,
                            ERR_CANT_CHANGE_FINAL_STATE: 8,
                            ERR_NO_STATE_DEFINITION: 9,
                            ERR_CANT_CHANGE_STATE: 10,
                            ERR_CANT_CHANGE_STATE_TO: 11,
                            ERR_REJECTED_CHANGE_STATE: 12,
                            ERR_NOT_EDITABLE_IN_STATE: 13,
                            ERR_LOAD_DATA_FAILED: 14,
                            ERR_UNKNOWN_STATE: 15,
                            ERR_INVALID_VALUE: 16,
                            ERR_PENDING_STATE_CHANGE: 17,
                            ERR_NO_CONTROLLER: 18,
                            ERR_NO_STATE_CONTROLLER: 19,
                            ERR_NOT_EDITABLE: 20,
                            ERR_CANT_SAVE_ERRORED_FIELD: 21,
                            ERR_CANT_SAVE_ERRORED_OBJECT: 22,
                            ERR_CANT_COPY_ERRORED_FIELD: 23,
                            ERR_TYPE_NOT_FOUND:24,
                            ERR_INVALID_SERIALIZER:25,
                            ERR_UNSET:26
                        },
                    construct: function (path, code, params) {
                        this.path = path;
                        this.type = 'BaseTypedException';
                        this.code = code;
                        this.params = params;
                    },
                }
        }
    }
)
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.types',
        classes: {

            BaseType:
                {
                    inherits: 'Siviglia.Dom.EventManager,Siviglia.types.PathAble',
                    constants: {
                        TYPE_SET_ON_STORE: 0x1,
                        TYPE_SET_ON_ACCESS: 0x2,
                        TYPE_IS_FILE: 0x4,
                        TYPE_REQUIRES_SAVE: 0x8,
                        TYPE_NOT_EDITABLE: 0x10,
                        TYPE_NOT_MODIFIED_ON_NULL: 0x20,
                        TYPE_REQUIRES_UPDATE_ON_NEW: 0x40,
                        TYPE_GENERATE_BEFORE_STORE: 0x80,
                        VALIDATION_MODE_NONE: 0,  // Sin validacion alguna.
                        VALIDATION_MODE_SIMPLE: 1, // Validaciones simples de tipo (__validate())
                        VALIDATION_MODE_COMPLETE: 2, // Validacion de tipo y source.
                        VALIDATION_MODE_STRICT: 3 // Validacion de tipo, s
                    },
                    construct: function (name, def, parentType, val, validationMode) {
                        this.__iid__=Siviglia.types.BaseType.insCounter;
                        Siviglia.types.BaseType.insCounter++;
                        this.__type__ = "BaseType";
                        this.__controller=null;
                        this.__setParent(parentType, name);
                        if (!Siviglia.empty(this.__parent) && this.__controller == null)
                            this.__controller = this.__parent.__getControllerForChild();
                        if (this.__controller !== null) {
                            var parentPath = this.__parent.__getFieldPath();
                            this.__controllerPath = this.__fieldNamePath.replace(this.__controller.__getFieldPath(), "");
                            this.__controllerPath = this.__controller.__getPathPrefix()+this.__controllerPath.substr(1);
                        }
                        this.__validationMode = (validationMode == null ? Siviglia.types.BaseType.VALIDATION_MODE_STRICT : validationMode)
                        this.__setOnEmpty = false;
                        if (typeof def["SET_ON_EMPTY"] !== "undefined" && def["SET_ON_EMPTY"] == true)
                            this.__setOnEmpty = true;

                        this.__dirty = false;
                        this.__errored = false;
                        this.__errorException = null;
                        this.__definition = def;
                        this.__valueSet = false;
                        this.__resolvers=[];
                        this.__flags = 0;
                        this.__saving=false;

                        this.__unassigned=true;
                        if (typeof def["FIXED"] == true)
                            this.__flags |= Siviglia.types.BaseType.TYPE_NOT_EDITABLE;

                        //this.__source = this.__getSource();
                        this.__source=null;
                        this.__sourceException=false;
                        this.__sourceFactory = null;
                        this.__sourceChecked=false;
                        this.__referencedField = null;
                        if (Siviglia.isset(def["FIXED"])) {
                            this.apply(def["FIXED"], Siviglia.types.BaseType.VALIDATION_MODE_NONE);
                        } else {
                            if (!Siviglia.empty(val))
                                this.setValue(val);
                            else {
                                this.__value = null;
                                this.__applyDefaultValue();
                            }
                        }
                        this.EventManager();
                        this.PathAble();
                    },
                    destruct: function () {

                        if (this.__source) {
                            console.log("DESTRUYENDO SOURCE: "+JSON.stringify(this.__name, null, 2));
                            this.__source.destruct();
                        }
                        for(var k=0;k<this.__resolvers.length;k++)
                            this.__resolvers[k].destruct();
                        this.__value=null;
                        // Si alguien nos ha "proxificado", se elimina el event manager
                        if(typeof this.__isProxy__!=="undefined"){
                            if(typeof this.__destruct__!=="undefined")
                                this.__destruct__();
                            else{
                                if(typeof this.__ev__!=="undefined")
                                    this.__ev__.destruct();
                            }
                        }

                    },

                    methods:
                        {
                            __applyDefaultValue:function()
                            {
                                if (this.__hasDefaultValue()) {
                                    // creamos una copia del valor por defecto
                                    var newDef=JSON.parse(JSON.stringify(this.__getDefaultValue()));
                                    this.apply(newDef, Siviglia.types.BaseType.VALIDATION_MODE_NONE);
                                }
                            },
                            __setParent: function (parent, name) {
                                this.__parent = parent;
                                var path = null;
                                var fieldName = null;
                                this.__name = name;
                                if (name !== null) {
                                    if (Siviglia.isString(name)) {
                                        path = "";
                                        fieldName = name;
                                    } else {
                                        path = !Siviglia.empty(name["path"]) ? (name["path"] == "/" ? "" : name["path"]) : "";
                                        fieldName = name.fieldName;
                                    }
                                }
                                this.__fieldName = fieldName;
                                this.__fieldNamePath = path + (fieldName!==""?"/":"") + fieldName;

                            },
                            // Los tipos por defecto solo devuelven una promesa resuelta.
                            __overrideDefinition: function (d, d1) {
                                var t = {};
                                for (var k in d1)
                                    t[k] = d1[k];
                                for (var k in d)
                                    t[k] = d[k];
                                return t;

                            },
                            __getName: function () {
                                return this.__name;
                            },
                            __getController: function () {
                                return this.__controller;
                            },
                            __getControllerPath: function () {
                                return this.__controllerPath;
                            },
                            __getFieldPath: function () {
                                return this.__fieldNamePath;
                            },
                            __setValidationMode: function (mode) {
                                this.__validationMode = mode;
                            },
                            __getValidationMode: function () {
                                return this.__validationMode;
                            },
                            __getFieldName: function () {
                                return this.__fieldName;
                            },
                            __getParent: function () {
                                return this.__parent;
                            },
                            __getPathPrefix: function () {
                                return "#";
                            },
                            __hasSource: function () {
                                return !Siviglia.empty(this.__definition["SOURCE"]);
                            },
                            __getSource: function () {
                                if (!this.__hasSource())
                                    return null;
                                if(this.__source!==null)
                                    return this.__source;
                                var def = this.__getSourceDefinition();
                                var factory = new Siviglia.Data.SourceFactory();
                                var stack = new Siviglia.Path.ContextStack();
                                var plainCtx = new Siviglia.Path.BaseObjectContext(this.__parent, "#", stack);

                                this.__source = factory.getFromSource(def,
                                    this,
                                    stack
                                );
                                this.__source.addListener("CHANGE",this,"__onSourceChanged","BaseType-SourceChanged");
                                return this.__source;
                            },
                            // Por defecto, los valores dependientes de un source, es el propio valor.
                            // Esto no es asi en los diccionarios, donde el valor que depende del source, son las keys.
                            __getSourcedValue:function()
                            {
                                return this.getValue();
                            },
                            setFlags: function (flags) {
                                this.__flags |= flags;
                            },
                            getFlags: function () {
                                return this.__flags;
                            },
                            setValue: function (val) {
                                    return this.apply(val, this.__validationMode);

                            },
                            __setDirty: function (dirty,noEvent) {
                                if (this.__errored)
                                    this.__clearErrored();

                                if (dirty !== this.__dirty) {
                                    if (this.__controller) {
                                        if (dirty)
                                            this.__controller.addDirtyField(this);
                                        else
                                            this.__controller.removeDirtyField(this);
                                    }

                                    this.__dirty = dirty;
                                }
                                if(dirty && noEvent!==true)
                                    this.onChange();
                            },
                            isDirty: function () {
                                return this.__dirty;
                            },
                            __setErrored: function (e) {
                                this.__errored = true;
                                this.__errorException = e;
                                if (this.__controller)
                                    this.__controller.addErroredField(this);
                                this.onError();
                            },
                            __getError: function () {
                                return this.__errorException;
                            },
                            __isErrored: function () {
                                return this.__errored;
                            },
                            __clearErrored: function () {
                                if (this.__errored === false)
                                    return;
                                this.__sourceException=null;
                                this.__errorException = null;
                                this.__errored = false;
                                if (this.__controller)
                                    this.__controller.__clearErroredField(this);
                            },
                            __clearError:function(e){
                                if(this.__errorException===e)
                                {
                                    this.__errorException=null;
                                    this.__errored=false;
                                    if (this.__controller)
                                        this.__controller.__clearErroredField(this);
                                }
                            },
                            apply: function (val, validationMode) {
                                // Esto no esta tan claro que haya que hacerlo asi.
                                // Esto sirve para que si lo que se asigna no es un valor javascript normal, sino un BaseType,
                                // se obtenga el valor "normal", y se descarte el baseType. Pero esto es una copia, no es el mismo valor.
                                // Ademas, el hecho de asignar un esto "molesta" sólo en algunas circunstancias, no siempre.
                                // Habría que tratar esto mejor, comprobando que este tipo, es del mismo tipo que val, copiando su estado (errores, etc),
                                // y compartiendo el valor.
                                var wasErrored=this.__errored;
                                this.__clearErrored();
                                if(val!==null && typeof val!=="undefined" ){
                                    if(val.hasOwnProperty("__type__"))
                                        val=val.getPlainValue();
                                    if(val.hasOwnProperty("__basetype__"))
                                        val=val.__basetype__.getPlainValue();
                                }



                                if (validationMode===Siviglia.types.BaseType.VALIDATION_MODE_NONE || this.__isEditable()) {
                                if (this.__isEmptyValue(val) && !wasErrored) {
                                    var hasChanged = false;
                                    if (this.__value != null) {
                                        if(this.__value && this.__value.hasOwnProperty("__destroy__"))
                                            this.__value.__destroy__();
                                        this.__clearErrored();
                                        hasChanged = true;

                                    }
                                    this.__value = null;
                                    this.__valueSet = false;
                                    this.__clear();

                                    if (hasChanged) {
                                        this.__setDirty(true);
                                    }
                                    if (validationMode === Siviglia.types.BaseType.VALIDATION_MODE_STRICT) {
                                        if (this.__isRequired()) {
                                            var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD);
                                            this.__setErrored(e);
                                            throw e;
                                        }
                                    }
                                    return;
                                }
                                validationMode = Siviglia.issetOr(validationMode, null);
                                if (validationMode === null)
                                    validationMode = this.__validationMode;

                                if (this.__isEmptyValue(val)) {
                                    if (this.__setOnEmpty === false)
                                        val = null;
                                }

                                if (this.__flags & Siviglia.types.BaseType.TYPE_NOT_EDITABLE)
                                    return;
                                var willSetDirty=true;

                                if(this.__value===this.__getEffectiveValue(val) && !wasErrored)
                                    willSetDirty=false;
                                if(this.__value && this.__value.hasOwnProperty("__destroy__"))
                                    this.__value.__destroy__();
                                try {
                                    var retVal = this._setValue(val, validationMode);
                                    this.__valueSet = true;
                                }catch(e)
                                {
                                    this.__setErrored(e);
                                    throw e;
                                }

                                if(this.__isDynamic())
                                {
                                    validationMode = Siviglia.types.BaseType.VALIDATION_MODE_NONE;
                                    this.onChange();
                                }

                                if (val!==null && validationMode !== Siviglia.types.BaseType.VALIDATION_MODE_NONE) {
                                    try {
                                        this.validate(validationMode);
                                        if(willSetDirty)
                                            this.__setDirty(true);

                                    } catch (e) {
                                        this.__setErrored(e);
                                        throw e;
                                    }
                                } else {
                                    if (this.__controller)
                                        this.__setDirty(false);
                                }

                                } else {
                                    var e;
                                    if (this.__controller && this.__controller.getStateDef() !== null)
                                        e = new Siviglia.model.BaseTypedException(this.getFullPath(),Siviglia.model.BaseTypedException.ERR_NOT_EDITABLE_IN_STATE);
                                    else
                                        e = new Siviglia.model.BaseTypedException(this.getFullPath(),Siviglia.model.BaseTypedException.ERR_NOT_EDITABLE);
                                    this.__setErrored(e);
                                    throw e;
                                }
                                return retVal;
                            },
                            getPath:function(path,ctxStack)
                            {
                                if(!Siviglia.isset(ctxStack))
                                    ctxStack=new Siviglia.Path.ContextStack();
                                var prefix=this.__getPathPrefix();
                                var ctx=new Siviglia.Path.BaseObjectContext(this,prefix,ctxStack);
                                // Si el prefijo no es "#', añadimos tambien este mismo objeto con el prefijo '#'
                                if(prefix!=='#')
                                    ctx=new Siviglia.Path.BaseObjectContext(this,"#",ctxStack);
                                var path=new Siviglia.Path.PathResolver(ctxStack,path);
                                this.__resolvers.push(path);
                                return path.getPath();
                            },

                            // Se utiliza para convertir un valor posible de este tipo, en un valor "real"
                            // de este tipo. Por ejemplo, a un campo Enum se le puede asignar una string,
                            // el nombre del estado, pero su valor efectivo seria el id de la label
                            __getEffectiveValue:function(val)
                            {
                                return val;
                            },
                            __isEmptyValue: function (val) {
                                return typeof val === "undefined" || val === null;
                            },
                            _setValue: function (v, validationMode) {
                                this.__value = v;
                                return this.__value;
                            },
                            validate: function (validationMode) {
                                try {
                                    var val = this.__value;
                                    validationMode = Siviglia.issetOr(validationMode, null);
                                    if (validationMode === null)
                                        validationMode = this.__validationMode;
                                    if (!this.__hasOwnValue()) {
                                        if (validationMode === Siviglia.types.BaseType.VALIDATION_MODE_STRICT) {
                                            if (this.__isRequired()) {
                                                var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD);
                                                this.__setErrored(e);
                                                throw e;
                                            }
                                        }
                                        return true;
                                    }
                                    var res = this._validate();
                                    this.__validateSource(val,validationMode);
                                    this.__onlyValidating = false;
                                    return res;
                                }catch(e)
                                {
                                    throw e;
                                }
                            },
                            __validateSource:function(val,validationMode)
                            {
                                if (this.__hasSource() && validationMode >= Siviglia.types.BaseType.VALIDATION_MODE_COMPLETE) {
                                    var s = this.__getSource();
                                    if (!s.isAsync() ) {
                                        this.__checkSource(val);
                                    }
                                }
                            },
                            __isRequired: function () {
                                if(this.__isDefinedAsRequired())
                                    return true;
                                return this.__controller && this.__controller.isFieldRequired(this.__controllerPath);

                            },
                            __isDefinedAsRequired: function () {
                                return Siviglia.issetOr(this.__definition.REQUIRED, false);
                            },
                            __checkSource: function (value) {
                                // Esto solo deberia llamarse si el modo de validacion es complete.
                                if(!this.__hasOwnValue())
                                {
                                    return true;
                                }
                                if (this.__hasSource()) {
                                    if(value===null)
                                    {
                                        var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: value});
                                        // No lo ponemos a errored. Esto lo hara quien capture esta excepcion.
                                        //this.__setErrored(e);
                                        // Nos guardamos que la excepcion se ha lanzado aqui, para que, si más tarde, desde el listener de source, se valida ok, sepamos
                                        // que podemos borrar el error, y volver a poner este campo a "ok"
                                        this.__sourceException = true;
                                        this.__sourceChecked = false;
                                        throw e;
                                    }
                                    var s = this.__getSource();
                                    var v=this.__getSourcedValue();
                                    var checker=function(val) {
                                        if (!s.contains(val)) {
                                            //this.setValue(null);
                                            var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: val});
                                            // No lo ponemos a errored. Esto lo hara quien capture esta excepcion.
                                            //this.__setErrored(e);
                                            // Nos guardamos que la excepcion se ha lanzado aqui, para que, si más tarde, desde el listener de source, se valida ok, sepamos
                                            // que podemos borrar el error, y volver a poner este campo a "ok"
                                            this.__sourceException = true;
                                            this.__sourceChecked = false;
                                            throw e;
                                        }
                                    }.bind(this);
                                    (Siviglia.isArray(v)?v:[v]).map(checker);
                                }
                                this.__sourceChecked=true;
                                this.__clearSourceException();
                                return true;
                            },
                            __onSourceChanged:function(evName,params)
                            {
                                // Ha cambiado el source.
                                // Si el source no era valido, y ya lo sabiamos (o no se ha asignado un valor,
                                // o ya dio una excepcion), simplemente, salimos. Todo sigue igual.
                                if(this.__sourceChecked===false && params.valid===false)
                                    return;
                                if(this.__isEmpty() && !this.__sourceException)
                                    return;
                                if(this.__validationMode!==Siviglia.types.BaseType.VALIDATION_MODE_NONE)
                                {
                                    // Si el source es valido, comprobamos que el valor asignado sigue pertenciendo al source
                                    // Nos quedamos con el estado actual de chequeo del source
                                    var wasChecked=this.__sourceChecked;
                                    if(params.valid) {
                                        try {
                                            this.__checkSource(this.__value);
                                        }catch(e)
                                        {
                                            // El valor no pertenecia al source..
                                            // Si ya lo sabiamos, no se lanza de nuevo la excepcion, a menos que estemos en un save()
                                            if(wasChecked===false && !this.__saving)
                                                return;
                                            // Si no lo sabiamos, creamos una excepcion, y ponemos este objeto a erroneo.
                                            var e=new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: this.getValue()});
                                            this.__setErrored(e);
                                            // Nos guardamos que la excepcion se ha lanzado aqui, para que, si más tarde, desde el listener de source, se valida ok, sepamos
                                            // que podemos borrar el error, y volver a poner este campo a "ok"
                                            this.__sourceException=true;
                                            this.__sourceChecked=false;
                                            // No lanzamos la excepcion...
                                            //throw e;
                                            // Queremos que el valor se ponga a nulo, sólo cuando, mientras se edita el objeto
                                            // (especialmente en un formulario).
                                            // Pero si se está guardando, no queremos que se ponga a nulo, especialmente porque entonces, se
                                            // pierde el error.
                                            if(!this.__saving)
                                                this.setValue(null);
                                        }
                                    }
                                    else
                                    {
                                        // El source no es valido.Si no es valido, y el valor actual si lo es, hay que lanzar una excepcion
                                        if(wasChecked==true)
                                        {
                                            var e=new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: this.getValue()});
                                            this.__setErrored(e);
                                            // Nos guardamos que la excepcion se ha lanzado aqui, para que, si más tarde, desde el listener de source, se valida ok, sepamos
                                            // que podemos borrar el error, y volver a poner este campo a "ok"
                                            this.__sourceException=true;
                                            this.__sourceChecked=false;
                                            //throw e;
                                        }
                                    }
                                }
                            },
                            __clearSourceException:function()
                            {
                                if(this.__sourceException===true)
                                {
                                    this.__sourceException=false;
                                    this.__clearErrored();
                                    this.__setDirty(true);
                                }

                            },
                            __localValidate: function () {
                                return this.validate();
                            },
                            __postValidate: function () {
                                return true;
                            },
                            __hasValue: function () {
                                return (this.__valueSet || this.__setOnEmpty === true);
                            },
                            __hasOwnValue: function () {
                                return this.__valueSet;
                            },
                            __isEmpty: function () {
                                return !this.__hasValue();
                            },
                            copy: function (type) {
                                if (type.__hasValue()) {
                                    this._copy(type);
                                } else {
                                    this.__clear();
                                }
                            },
                            _copy: function (type) {
                                if (type.__errored) {
                                    throw new Siviglia.model.BaseTypedException(this.__fieldNamePath,Siviglia.model.BaseTypedException.ERR_CANT_COPY_ERRORED_FIELD);
                                }
                                this.setValue(type.getValue())
                            },
                            equals: function (val) {
                                var hasVal = this.__hasValue();
                                if (!hasVal && val === null)
                                    return true;
                                if ((hasVal && val === null) || (!hasVal && val !== null))
                                    return false;
                                return this._equals(val);
                            },
                            _equals: function (val) {
                                return this.__value === val;
                            },
                            __rawSet: function (val) {
                                if (val === null) {
                                    this.__clear();
                                } else {
                                    if (this.__flags & Siviglia.types.BaseType.TYPE_NOT_EDITABLE)
                                        return;
                                    this.apply(val, Siviglia.types.BaseType.VALIDATION_MODE_NONE);
                                }
                            },
                            ready: function () {
                                var d = $.Deferred();
                                d.resolve();
                                return d;
                            },
                            is_set: function () {
                                if (this.__valueSet)
                                    return true;
                                return this.__flags & this.TYPE_SET_ON_STORE ||
                                    this.__flags & this.TYPE_SET_ON_ACCESS;
                            },
                            __clear: function () {
                                var wasEmpty = this.__isEmpty();
                                this.__value = null;
                                this.__valueSet = false;
                                if (!wasEmpty)
                                    this.__setDirty(true);
                                else
                                    this.onChange();
                            },
                            __isEditable: function () {
                                if (this.__flags & this.TYPE_NOT_EDITABLE)
                                    return false;
                                if(this.__definition.TYPE=="State")
                                    return true;
                                if (Siviglia.empty(this.__controller))
                                    return true;
                                if (!this.__controller.getStateDef())
                                    return true;
                                return this.__controller.getStateDef().isEditable(this.__controllerPath);

                            },
                            getValue: function () {
                                if (this.__hasValue())
                                    return this._getValue();
                                return null;
                            },
                            _getValue: function () {
                                return this.__value;
                            },
                            __hasDefaultValue: function () {
                                return 'DEFAULT' in this.__definition && this.__definition["DEFAULT"] !== null && this.__definition["DEFAULT"] !== "NULL";
                            },
                            __getDefaultValue: function () {
                                if (!!Siviglia.empty(this.__definition["DEFAULT"]))
                                    return null;
                                var def = this.__definition["DEFAULT"];
                                if (def === "null" || def == "NULL")
                                    return null;
                                return this.__definition["DEFAULT"];
                            },
                            __getRelationshipType: function (name, parent) {
                                return $.when(this);
                            },
                            getDefinition: function () {
                                return this.__definition;
                            },
                            save: function () {
                                this.__saving=true;
                                try {
                                    if (this.__hasSource() && this.__valueSet) {
                                        var s = this.__getSource();
                                        if (!s.isAsync())
                                            this.__checkSource(this.__value);
                                    }
                                }catch(e)
                                {
                                    this.__saving=false;
                                    throw e;
                                }
                                this.__saving=false;

                                if (this.__isErrored())
                                    throw new Siviglia.model.BaseTypedException(this.__fieldNamePath,Siviglia.model.BaseTypedException.ERR_CANT_SAVE_ERRORED_FIELD);
                                if (!Siviglia.empty(this.__definition.REQUIRED) && this.__definition.REQUIRED==true && (!this.__valueSet || this.__value === "")) {
                                    this.__setErrored(new Siviglia.model.BaseTypedException(this.__fieldNamePath, Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD));
                                }
                                if (this.isDirty())
                                    this.__setDirty(false);
                            },
                            __getControllerForChild: function () {
                                return this.__controller;
                            },
                            __isRelation: function () {
                                return false;
                            },

                            isContainer: function () {
                                return false;
                            },
                            // Funcion para utilizar en sort
                            compare: function (val, direction) {
                                //  a signed integer where a negative return value means x < y, positive means x > y and 0 means x = 0.
                                var n1 = this.__isEmptyValue(this.__value);
                                var n2 = this.__isEmptyValue(val.__value);
                                if (n1 && !n2)
                                    return -1;
                                if (n1 && n2 || this.__value === val.__value)
                                    return 0;
                                if (!n1 && n2)
                                    return 1;
                                if (this.__value > val.__value)
                                    return direction == "ASC" ? 1 : -1;
                                return direction == "ASC" ? -1 : 1;
                            },
                            set: function (val) {

                                return this.setValue(val);
                            },
                            unset: function () {
                                if (!this.__valueSet)
                                    return;
                                this.__clear();
                            },
                            get: function () {
                                return this.getValue();
                            },
                            getPlainValue: function (dontSave) {
                                if(!this.__saving && typeof dontSave==="undefined")
                                     this.save();
                                return this.getValue();
                            },
                            serialize: function () {
                                return this.getValue();
                            },
                            onChange: function () {
                                this.fireEvent("CHANGE", {data: this});
                            },
                            onError:function(){
                                this.fireEvent("ERROR",{data:this});
                            },
                            __getSourceDefinition: function () {
                                return this.__definition["SOURCE"];
                            },
                            getSourceLabel: function () {
                                var s = this.getSource();
                                if (s == null)
                                    throw "No source";
                                return s.getSource().getLabelField();
                            },
                            getSourceValue: function () {
                                var s = this.getSource();
                                if (s == null)
                                    throw "No source";
                                return s.getSource().getValueField();
                            },
                            intersect: function (val) {
                                return val;
                            },
                            getField: function (f) {
                                // Un campo basico no tiene subcampos:
                                throw "Cant get field " + f + " from simple type.";
                            },
                            usesRemoteValidation: function () {
                                return this.useRemoteValidation;
                            },
                            useRemoteValidation: function (val) {
                                this.useRemoteValidation = val;
                            },


                            setReferencedField: function (ref) {
                                this.__referencedField = ref;
                            },
                            getReferencedField: function () {
                                return this.__referencedField;
                            },
                            __isDynamic:function()
                            {
                                if(typeof this.__definition.references !=="undefined")
                                {
                                    return this.__definition.references.PARAMTYPE!=="undefined" && this.__definition.references.PARAMTYPE==="DYNAMIC";
                                }
                                return false;
                            }
                        }
                },
            IntegerException:
                {
                    inherits: 'Siviglia.model.BaseTypedException',
                    constants:
                        {
                            ERR_TOO_SMALL: 100,
                            ERR_TOO_BIG: 101,
                            ERR_NOT_A_NUMBER: 102
                        },
                    construct: function (path, code, params) {
                        this.BaseTypedException(path, code, params);
                        this.type = 'IntegerException';
                    }
                },
            Integer:
                {
                    inherits: 'BaseType',
                    methods:
                        {
                            get: function () {
                                if (!this.__valueSet)
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);
                                return parseInt(this.__value);
                            },
                            getValue: function () {
                                if (this.__valueSet) return parseInt(this.__value);
                                return null;
                            },
                            _setValue: function (val) {
                                this.__value = parseInt(val);
                                return this.__value;
                            },
                            _validate: function () {
                                var val=this.__value;
                                if (this.__isEmptyValue(val))
                                    return true;

                                if (Siviglia.types.isString(val))
                                    val = val.trim();


                                var asStr = '' + val;
                                if (!asStr.match(/^\d+$/)) {
                                    throw new Siviglia.types.IntegerException(this.getFullPath(), Siviglia.types.IntegerException.ERR_NOT_A_NUMBER);
                                }

                                if ('MIN' in this.__definition && val < parseInt(this.__definition.MIN)) {
                                    throw new Siviglia.types.IntegerException(this.getFullPath(), Siviglia.types.IntegerException.ERR_TOO_SMALL);
                                }
                                if ('MAX' in this.__definition && val > parseInt(this.__definition.MAX))
                                    throw new Siviglia.types.IntegerException(this.getFullPath(), Siviglia.types.IntegerException.ERR_TOO_BIG);

                                return true;
                            }
                        }

                },
            StringException:
                {
                    inherits: 'Siviglia.model.BaseTypedException',
                    constants: {
                        ERR_TOO_SHORT: 100,
                        ERR_TOO_LONG: 101,
                        ERR_INVALID_CHARACTERS: 102
                    },
                    construct: function (path, code, params) {
                        this.BaseTypedException(path, code, params);
                        this.type = 'StringException';
                    }
                },
            String:
                {
                    inherits: 'BaseType',

                    methods:
                        {
                            _validate: function () {
                                var val=this.__value;
                                if (this.__isEmptyValue(val)) {
                                    if (this.__definition.REQUIRED)
                                        throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);
                                    else {
                                            return true;
                                        }
                                }
                                val = '' + val;

                                var c = val.length;
                                if ('MINLENGTH' in this.__definition && c < this.__definition["MINLENGTH"])
                                    throw new Siviglia.types.StringException(this.getFullPath(), Siviglia.types.StringException.ERR_TOO_SHORT, {
                                        min: this.__definition['MINLENGTH'],
                                        cur: c
                                    });

                                if ('MAXLENGTH' in this.__definition && c > this.__definition["MAXLENGTH"])
                                    throw new Siviglia.types.StringException(this.getFullPath(), Siviglia.types.StringException.ERR_TOO_LONG, {
                                        max: this.__definition['MAXLENGTH'],
                                        cur: c
                                    });

                                if ('REGEXP' in this.__definition) {
                                    if (!Siviglia.isset(this.regex)) {
                                        var s = this.__definition["REGEXP"];
                                        var regParts = s.match(/^\/(.*?)\/([gim]*)$/);
                                        if (regParts) {
                                            this.regex = new RegExp(regParts[1], regParts[2]);
                                        } else {
                                            this.regex = new RegExp(s);
                                        }


                                    }
                                    if (!val.match(this.regex)) {
                                        throw new Siviglia.types.StringException(this.getFullPath(), Siviglia.types.StringException.ERR_INVALID_CHARACTERS);
                                    }
                                }
                                return true;
                            },
                            _setValue: function (val) {
                                if (this.__definition.TRIM)
                                    val = val.trim();
                                this.__value = val;
                                return this.__value;
                            },
                            __isEmptyValue:function(val)
                            {
                                if(val===null)
                                    return true;
                                var blankIsNull=Siviglia.issetOr(this.__definition["BLANK_IS_NULL"],false);
                                if(blankIsNull===false)
                                    return false;

                                if(Siviglia.issetOr(this.__definition["TRIM"],false))
                                    val=val.trim();

                                return val==="";
                            }
                        }
                },
            AutoIncrement:
                {
                    inherits: 'Integer',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {'TYPE': 'AutoIncrement', 'MIN': 0, 'MAX': 9999999999};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.BaseType(name, fullDef, parentType, val, validationType);
                        this.setFlags(Siviglia.types.BaseType.TYPE_SET_ON_STORE);
                    },
                    methods:
                        {
                            _validate: function () {
                                return true;
                            },
                            getRelationshipType: function () {
                                return $.when(new Siviglia.types.Integer({MIN: 0, MAX: 9999999999}));
                            }
                        }
                },
            Boolean:
                {
                    inherits: 'BaseType',
                    methods:
                        {
                            _setValue: function (val) {
                                this.__value = (val === true || val === "1" || val === "true");
                                return this.__value;
                            },
                            _validate: function () {
                                var val=this.__value;
                                return val === true || val === false || val.toLowerCase() == "true" || val.toLowerCase() == "false";
                            },
                            _equals:function(val)
                            {
                                return this.__value==val;
                            }

                        }
                },
            DateTimeException:
                {
                    inherits: 'Siviglia.model.BaseTypedException',
                    constants:
                        {
                            ERR_START_YEAR: 100,
                            ERR_END_YEAR: 101,
                            ERR_WRONG_HOUR: 102,
                            ERR_WRONG_SECOND: 103,
                            ERR_STRICTLY_PAST: 104,
                            ERR_STRICTLY_FUTURE: 105
                        },
                    construct: function (path, code, params) {
                        this.BaseTypedException(path, code, params);
                        this.type = 'DateTimeException';
                    }
                },
            DateTime:
                {
                    inherits: 'BaseType',
                    methods:
                        {

                            _validate: function () {
                                var value=this.__value;
                                if (this.__isEmptyValue(value))
                                    return true;

                                var ex = Siviglia.types;
                                // Si es un objeto, debe ser un objeto Date de js
                                var odate = this.createDate(value);
                                var year = odate.getFullYear();

                                if (isNaN(year)) {
                                    throw new ex.DateTimeException(this.getFullPath(), ex.BaseTypedException.ERR_INVALID_VALUE);
                                }

                                var ex = Siviglia.types;

                                if ('STARTYEAR' in this.__definition && parseInt(this.__definition.STARTYEAR) > year)
                                    throw new ex.DateTimeException(
                                        this.getFullPath(),
                                        ex.DateTimeException.ERR_START_YEAR,
                                        {min: this.__definition.STARTYEAR, cur: year});
                                if ('ENDYEAR' in this.__definition && parseInt(this.__definition.ENDYEAR) < year)
                                    throw new ex.DateTimeException(
                                        this.getFullPath(),
                                        ex.DateTimeException.ERR_END_YEAR,
                                        {max: this.__definition.ENDYEAR, cur: year});
                                cur = new Date();
                                if(typeof this.__definition['STRICTLYPAST']!=="undefined") {
                                    if (this.__definition['STRICTLYPAST']==true && cur < odate)
                                        throw new ex.DateTimeException(
                                            this.getFullPath(),
                                            ex.DateTimeException.ERR_STRICTLY_PAST);
                                }
                                if(typeof this.__definition['STRICTLYFUTURE']!=="undefined") {
                                    if (this.__definition['STRICTLYFUTURE']==true && cur > odate)
                                        throw new ex.DateTimeException(
                                            this.getFullPath(),
                                            ex.DateTimeException.ERR_STRICTLY_FUTURE);
                                }
                                return odate;
                            },
                            _setValue: function (val) {
                                var c;
                                if(val==="NOW")
                                    c=this.createDate(new Date());
                                else
                                    c = this.createDate(val);
                                this.dateValue = c;

                                this.__value = this.fromDateValue(c);
                                return this.__value;
                            },
                            getDateValue: function () {
                                return this.dateValue;
                            },
                            fromDateValue: function (c) {
                                // Y-m-D H:M:S
                                var M = c.getMonth() + 1;
                                var D = c.getDate();
                                var H = c.getHours();
                                var m = c.getMinutes();
                                var s = c.getSeconds();
                                M = (M < 10) ? ('0' + M) : M;
                                D = (D < 10) ? ('0' + D) : D;
                                H = (H < 10) ? ('0' + H) : H;
                                m = (m < 10) ? ('0' + m) : m;
                                s = (s < 10) ? ('0' + s) : s;
                                return c.getFullYear() + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
                            },
                            createDate: function (value) {
                                var odate;
                                if (!Siviglia.types.isObject(value)) {
                                    var v = Date.parse(value.replace(/-/g, '/'));
                                    odate = new Date();
                                    odate.setTime(v);
                                    if (odate == 'Invalid date') {
                                        throw new ex.DateTimeException(this.getFullPath(), ex.BaseTypedException.ERR_INVALID_VALUE);
                                    }
                                } else
                                    odate = value;
                                return odate;
                            },
                            _equals:function(val)
                            {
                                return this.fromDateValue(this.createDate(val))===this.__value;

                            },
                            serialize: function () {
                                return this.__value;
                            },
                            format: function (format) {
                                moment.locale('es');
                                return moment(this.getValue()).format(format);
                            },
                            getDefaultValue: function () {
                                if ('DEFAULT' in this.__definition) {
                                    if (this.__definition['DEFAULT'] === 'NOW') {
                                        return new Date();
                                    }
                                    return this.__definition["DEFAULT"];
                                }
                            }

                        }
                },
            Date:
                {
                    inherits: 'DateTime',
                    methods:
                        {
                            fromDateValue: function (c) {
                                // Y-m-D
                                var M = c.getMonth() + 1;
                                var D = c.getDate();
                                M = (M < 10) ? ('0' + M) : M;
                                D = (D < 10) ? ('0' + D) : D;
                                return c.getFullYear() + '-' + M + '-' + D;
                            }
                        }
                },
            Enum:
                {
                    inherits: 'BaseType',
                    methods:
                        {
                            _validate: function () {
                                var val=this.__value;
                                var v = this.__definition.VALUES;
                                if (this.__isEmptyValue(val))
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);

                                if (Siviglia.types.isString(val) && val != parseInt(val)) {
                                    var idx = this.findIndexOf(val);
                                    if (idx > -1) return true;
                                } else {
                                    if (val < v.length && val >= 0)
                                        return true;
                                }

                                throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {val: val});
                            },
                            _setValue: function (val) {
                                if (Siviglia.types.isString(val) && val != parseInt(val)) {
                                    this.__value = this.findIndexOf(val);
                                } else
                                    this.__value = parseInt(val);
                                return this.__value;
                            },
                            findIndexOf: function (str) {
                                var v = this.__definition.VALUES;
                                for (var k = 0; k < v.length; k++) {
                                    if (v[k] == str)
                                        return k;
                                }
                                return -1;

                            },
                            _equals:function(val)
                            {
                                return this.__value===val || this.getLabel()===val;
                            },
                            __checkSource:function(val)
                            {
                                if(Siviglia.isString(val))
                                    val=this.findIndexOf(val);
                                this.BaseType$__checkSource(val);
                            },
                            getLabels: function () {
                                return this.__definition["VALUES"];
                            },
                            getDefaultValue: function () {
                                if ('DEFAULT' in this.__definition)
                                    return this.findIndexOf(this.__definition.DEFAULT);
                                return null;
                            },
                            getLabel: function () {
                                if (this.__isEmpty())
                                    return null;

                                return this.__definition.VALUES[this.__value];
                            },
                            getValueFromLabel: function (label) {
                                return this.findIndexOf(label);
                            },
                            __hasSource: function () {
                                return true;
                            },
                            __getEffectiveValue:function(val)
                            {
                                if(Siviglia.isString(val))
                                    return this.getValueFromLabel(val);
                                return val;
                            },
                            // Esto se llama en el proceso de validacion.
                            // El problema del Enum es que acepta tanto el indice como el valor,
                            // ambas cosas validan ok. Pero usando el source, solo podríamos utilizar
                            // una de ellas para validar. Ademas, cuando se chequea el source es que el tipo
                            // ya es valido, asi que no tenemos por que volver a validar lo mismo.
                            checkSource: function (val) {
                                return true;
                            },
                            __getSourceDefinition: function () {
                                var sDef = {
                                    "TYPE": "Array",
                                    "VALUES": this.__definition.VALUES,
                                    "LABEL": "LABEL",
                                    "VALUE": "VALUE"

                                }
                                return sDef;
                            },

                        }
                },
            State: {
                inherits: 'Enum',
                construct: function (name, def, parentType, val, validationType) {
                    this.__changing=false;
                    this.__stateExceptions=[]
                    this.awaitingChangeOf=null;
                    this.__danglingState=null;
                    this.BaseType(name,def,parentType,val,validationType);
                },
                methods:{
                    _setValue:function(val,validationMode)
                    {

                        if(this.__getEffectiveValue(val)===this.__value)
                            return;
                        var st = this.__controller.getStateDef();
                        if(validationMode!==Siviglia.types.BaseType.VALIDATION_MODE_NONE) {

                            if (st.changingState == true) {
                                throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_DOUBLESTATECHANGE);
                            }
                        }
                            // Esto es necesario porque, si el campo estado tiene un valor por defecto,
                            // y se llama a este setValue, mientras el padre esta creando (y asignando a __fields)
                            // este campo, cuando se llega aqui, aún no está asignado a __fields
                            if (typeof this.__parent.__fields[this.__fieldName] === "undefined")
                                this.__parent.__fields[this.__fieldName] = this;


                            if(!st.enabled)
                                st.enable();
                            try {
                                st.changeState(val);
                            }catch(e)
                            {
                                if(validationMode!==Siviglia.types.BaseType.VALIDATION_MODE_NONE) {
                                    // Si la excepcion la genero este campo, la lanzamos tal cual.
                                    if (e.path === this.getFullPath())
                                        throw e;

                                    // Si por culpa de un campo, no podemos cambiar de estado, nos ponemos como listener de ese campo, para que cuando cambie,
                                    // si cambia, se vuelve a intentar completar el cambio de estado.
                                    // OJO: Aqui se coje el fullpath del campo que ha dado el problema. Sin embargo, se lo vamos
                                    // a preguntar al controller...Pero no estamos pasando el controllerPath, sino el fullpath...

                                    this.__danglingState = val;
                                    this.awaitingChangeOf = this.__controller.__getField(e.path);
                                    this.__stateExceptions.push({obj: this.awaitingChangeOf, exception: e});
                                    this.awaitingChangeOf.addListener("CHANGE", this, "retryState","State-retry");
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_STATE_TRANSITION);
                                }
                            }
                            this.Enum$_setValue(val);
                  /*      }
                        else
                        {
                            this.Enum$_setValue(val);

                        }*/
                        if(this.awaitingChangeOf!==null)
                        {
                            this.__danglingState=null;
                            this.awaitingChangeOf.removeListeners(this);
                            this.awaitingChangeOf=null;
                        }
                        if(this.__stateExceptions.length > 0)
                        {
                            this.__stateExceptions.map(function(e){
                                e.obj.__clearError(e);
                            })

                        }
                        return val;
                    },
                    retryState:function()
                    {
                        this.apply(this.__danglingState);
                    },
                    onStateChangeComplete:function()
                    {
                        // Si el cambio de estado se ha completado, se puede volver a cambiar el estado.
                        this.__changing=false;
                    }
                }
            },
            /* START */
            FileException: {
                inherits: 'Siviglia.model.BaseTypedException',
                constants: {
                    ERR_FILE_TOO_SMALL: 100,
                    ERR_FILE_TOO_BIG: 101,
                    ERR_INVALID_FILE: 102,
                    ERR_NOT_WRITABLE_PATH: 103,
                    ERR_FILE_DOESNT_EXISTS: 105,
                    ERR_CANT_MOVE_FILE: 106,
                    ERR_CANT_CREATE_DIRECTORY: 107,
                    ERR_UPLOAD_ERR_PARTIAL: 108,
                    ERR_UPLOAD_ERR_CANT_WRITE: 109,
                    ERR_UPLOAD_ERR_INI_SIZE: 110,
                    ERR_UPLOAD_ERR_FORM_SIZE: 111
                },
                construct: function (path, code, message) {
                    this.BaseTypedException(path, code, message);
                    this.type = 'FileException';
                }
            },
            File:
                {
                    inherits: 'BaseType',
                    construct: function (name, def, parentType, val, validationType) {
                        this.BaseType(name, def, parentType, val, validationType);
                        this.setFlags(Siviglia.types.BaseType.TYPE_IS_FILE |
                            Siviglia.types.BaseType.TYPE_REQUIRES_UPDATE_ON_NEW |
                            Siviglia.types.BaseType.TYPE_REQUIRES_SAVE |
                            Siviglia.types.BaseType.TYPE_NOT_MODIFIED_ON_NULL);
                    },
                    methods:
                        {
                            _validate: function () {
                                var val=this.__value;
                                if (this.__isEmptyValue(val) || val === "")
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);

                                if (window.File && window.FileList && window.FileReader) {
                                    size = val.fileSize;
                                    if ('MINSIZE' in this.__definition && size / 1024 < this.__definition.MINSIZE)
                                        throw new Siviglia.types.FileException(this.getFullPath(), Siviglia.types.FileException.ERR_FILE_TOO_SMALL,
                                            {min: this.__definition.MINSIZE, cur: size});
                                    if ('MAXSIZE' in this.__definition && size / 1024 > this.__definition.MAXSIZE)
                                        throw new Siviglia.types.FileException(this.getFullPath(), Siviglia.types.FileException.ERR_FILE_TOO_BIG,
                                            {max: this.__definition.MAXSIZE, cur: size});
                                    if ('EXTENSIONS' in this.__definition) {
                                        var reg = ".*\\.(" + this.__definition.EXTENSIONS.join('|') + ")";
                                        var c = new RegExp(reg);
                                        if (!val.fileName.match(reg))
                                            throw new Siviglia.types.FileException(this.getFullPath(), Siviglia.types.FileException.ERR_INVALID_FILE,
                                                {allowed: this.__definition.EXTENSIONS}
                                            );
                                    }
                                }
                                return true;
                            }
                        }
                },
            City:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {TYPE: 'City', MAXLENGTH: 100, MINLENGTH: 2};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            Name:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {TYPE: 'Name', MAXLENGTH: 100, MINLENGTH: 2};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            HashKey:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {TYPE: 'HashKey', MAXLENGTH: 100, MINLENGTH: 2};
                        var fullDef = this.__overrideDefinition(definition, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            Email:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {
                            'TYPE': 'Email',
                            "MINLENGTH": 8,
                            "MAXLENGTH": 50,
                            "REGEXP": '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+',
                            "ALLOWHTML": false,
                            "TRIM": true
                        };
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            ImageException:
                {
                    inherits: 'FileException',
                    constants: {
                        ERR_NOT_AN_IMAGE: 120,
                        ERR_TOO_SMALL: 121,
                        ERR_TOO_WIDE: 122,
                        ERR_TOO_SHORT: 123,
                        ERR_TOO_TALL: 124
                    },
                    construct: function (path, code, param) {
                        this.BaseTypedException(path, code, param);
                        this.type = 'ImageException';
                    }
                },
            Image:
                {
                    inherits: 'File',
                    construct: function (name, def, parentType, val, validationType) {
                        if (!('EXTENSIONS' in def))
                            def.EXTENSIONS = ['jpg', 'gif', 'jpeg', 'png'];
                        this.File(name, def, parentType, val, validationType);
                    },
                    methods:
                        {
                            _validate: function () {
                                var val=this.__value;
                                if (this.__isEmptyValue(val) || val === "")
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);

                                if (window.File && window.FileList && window.FileReader && window.Blob) {
                                    // Se pueden hacer cosas con HTML5, como copiarlo a un canvas y saber el tamanio real de la imagen,
                                    // recortarla, etc.
                                }
                                return true;
                            },
                            hasThumbnail: function () {
                                return 'THUMBNAIL' in this.__definition;
                            },
                            getThumbnailWidth: function () {
                                return this.__definition.THUMBNAIL.WIDTH;
                            },
                            getThumbnailHeight: function () {
                                return this.__definition.THUMBNAIL.HEIGHT;
                            },
                            hasDescription: function () {
                                return 'DESCRIPTION' in this.__definition;
                            },
                            getDescription: function () {
                                return this.__definition.DESCRIPTION;
                            },
                            getThumbnailPath: function () {
                                var prefix = 'th_';
                                if ('PREFIX' in this.__definition.THUMBNAIL)
                                    prefix = this.__definition.THUMBNAIL.PREFIX;
                                var parts = this.__value.split('/');
                                parts[parts.length - 1] = prefix + parts[parts.length - 1];
                                return parts.join('/');
                            }
                        }
                },
            Video:{
                    inherits:'File',
                construct: function (name, def, parentType, val, validationType) {
                    var stdDef = {'TYPE': 'Video'};
                    var fullDef = this.__overrideDefinition(def, stdDef);
                    this.File(name, fullDef, parentType, val, validationType);
                }

            },
            IP:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {'TYPE': 'IP', 'MAXLENGTH': 15};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            Login:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {
                            'TYPE': 'Login',
                            'MINLENGTH': 4,
                            'MAXLENGTH': 15,
                            'REGEXP': '^[a-zA-Z\d_]{3,15}$/i',
                            'TRIM': true
                        };
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);

                    }
                },
            /* aaa */
            Decimal:
                {
                    /*
                    Api basica de Big : cmp,div,minus,mod, plus, pow, round, sqrt, times, toExponential, toFixed,
                    toPrecision, toString, valueOf */
                    inherits: 'BaseType',
                    methods:
                        {
                            _setValue: function (val,validationMode) {
                                if (Siviglia.types.isObject(val)) {
                                    // Se supone que es un Big.
                                    val = val.toString();
                                }
                                this.__value = val;
                                return this.__value;

                            },
                            _validate: function () {
                                var val=this.__value;
                                if (("" + val).match(/[0-9]+(:?\.[0-9]*)/)) {
                                    return true;
                                }
                                throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE);
                            }
                        }
                },
            Money:
                {
                    inherits: 'Decimal',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {TYPE: 'Money', NDECIMALS: 4, NINTEGERS: 15};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.Decimal(name, fullDef, parentType, val, validationType)

                    }
                },
            Password:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {
                            TYPE: 'Password',
                            MINLENGTH: 5,
                            MAXLENGTH: 16,
                            TRIM: true
                        };
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            Phone:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {
                            TYPE: 'Phone',
                            MINLENGTH: 7,
                            MAXLENGTH: 20,
                            REGEXP: '^(\\+?\\-? *[0-9]+)([,0-9 ]*)([0-9 ])*$'
                        };
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType);
                    }
                },
            Relationship:
                {
                    inherits: 'BaseType',
                    methods:
                        {
                            get: function () {
                                if (!this.__valueSet)
                                    throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_UNSET);

                                if (Siviglia.Utils.isSubclass(valueType, 'Siviglia.types.Integer'))
                                    return parseInt(this.__value);
                                else
                                    return (this.__value);
                            },
                            getValue: function () {
                                var valueType = this.getRelationshipType();

                                if (this.__valueSet) {
                                    if (Siviglia.Utils.isSubclass(valueType, 'Siviglia.types.Integer'))
                                        return parseInt(this.__value);
                                    else
                                        return (this.__value);
                                }

                                if (this.__hasDefaultValue())
                                    return this.__getDefaultValue();

                                return null;
                            },
                            _validate: function () {
                                return true;
                            },
                            getRelationshipType: function () {
                                var obj = this.__definition.MODEL;
                                var target;
                                if ('FIELD' in this.__definition)
                                    target = this.__definition['FIELD'];
                                else {
                                    var keys = Object.keys(this.__definition['FIELDS']);
                                    target = this.__definition['FIELDS'][keys[0]];
                                }
                                return Siviglia.types.TypeFactory.getRelationFieldTypeInstance(obj, target);
                            },
                            __hasSource: function () {
                                //return false;
                                return true;
                            },
                            __getSourceDefinition: function (controller, params) {
                                var keys = [];
                                for (var k in this.__definition["FIELDS"])
                                    keys.push(k);
                                var metadata = Siviglia.issetOr(this.__definition["SOURCE"], null);
                                var label = null;
                                var def = {"TYPE": "DataSource", "MODEL": this.__definition["MODEL"]};
                                if (metadata !== null) {
                                    if (typeof metadata["LABEL"] !== "undefined")
                                        def["LABEL"] = metadata["LABEL"];
                                    def["DATASOURCE"] = Siviglia.issetOr(metadata["DATASOURCE"], "FullList");
                                } else {
                                    def["DATASOURCE"] = "FullList";
                                }
                                def["VALUE"] = this.__definition["FIELDS"][keys[0]];
                                if (typeof this.__definition["PARAMS"] !== "undefined")
                                    def["PARAMS"] = this.__definition["PARAMS"]
                                return def;
                            },
                            getSourceLabel: function () {
                                return this.__definition.SEARCHFIELD;
                            },
                            getSourceValue: function () {
                                return this.__definition.FIELD;
                            },
                            getSearchField: function () {
                                return this.__definition.SEARCHFIELD;
                            },
                            getValueField: function () {
                                if ('FIELD' in this.__definition)
                                    target = this.__definition['FIELD'];
                                else {
                                  var keys = Object.keys(this.__definition['FIELDS']);
                                    target = this.__definition['FIELDS'][keys[0]];
                                }
                                return target;
                            },
                            // Devuelve parametros fijos que son necesarios para
                            // establecer la relacion.Se aplican al datasource.
                            getFixedParameters: function () {
                                return Siviglia.issetOr(this.__definition["CONDITIONS"], null);
                            },

                        }
                },
            Street:
                {
                    inherits: 'String',
                    construct: function (name, def, parentType, val, validationType) {
                        var stdDef = {'TYPE': 'Street', MINLENGTH: 2, MAXLENGTH: 200};
                        var fullDef = this.__overrideDefinition(def, stdDef);
                        this.String(name, fullDef, parentType, val, validationType)
                    }
                },
            Text:
                {
                    inherits: 'BaseType',
                    methods: {
                        _validate: function () {
                            return true;
                        }
                    }
                },

            Timestamp:
                {
                    inherits: 'BaseType',
                    methods: {
                        _validate: function () {
                            return true;
                        }
                    }
                },
            UUID:
                {
                    inherits: 'BaseType',
                    methods: {
                      _validate: function () {
                        return true;
                      },
                    }
                },
            Model:{
                inherits:'String',

                construct:function(name,def,parentType,val,validationType)
                {
                    def["SOURCE"]= {
                        "TYPE":"DataSource",
                        "MODEL":'\\model\\reflection\\Model',
                        "DATASOURCE":'FullList',
                        "VALUE":"smallName",
                        "LABEL_EXPRESSION":"[%/package%] > [%/smallName%]"
                    };
                    this.String(name,def,parentType,val,validationType);

                },
                methods:{
                    _setValue: function (v, validationMode) {
                        v=v.replace(/\\/g,"/");
                        this.__value=v;
                        this.__valueSet=true;
                        return this.__value;
                    }
                }
            },
            Container: {
                inherits: 'BaseType',
                construct: function (name, def, parentType, val, validationType) {
                    this.__erroredFields = null;
                    if(Siviglia.isset(def["INHERITS"]))
                    {
                        var baseType=Siviglia.types.TypeFactory.getType({
                            "fieldName": "inh",
                            "path": "/"
                           }, def, this, null, this.__validationMode);
                        var baseDef=baseType.getDefinition();
                        for(var k in def)
                        {
                            if(k=="FIELDS") {
                                for(var k1 in def["FIELDS"]) {
                                    baseDef["FIELDS"][k1] = def["FIELDS"][k1];
                                }
                            }
                            else
                                baseDef[k]=def[k];
                        }
                        def=baseDef;
                    }
                    this.__fieldDef = def["FIELDS"];
                    this.__fields = {};
                    this.__dirtyFields = [];
                    this.__changingState = false;
                    this.__stateDef=null;
                    this.__stateFieldName=null;
                    if (!Siviglia.empty(def["STATES"])) {
                        this.__stateDef = new Siviglia.types.states.StatedDefinition(this, def);
                        for(var k in def["FIELDS"])
                        {
                            if(def["FIELDS"][k]["TYPE"]==="State")
                                this.__stateFieldName=k;
                        }
                    }
                    this.__definition=def;
                    // Ojo:si se pasa un valor en el constructor, no se asigna hasta que los campos se hayan construido.
                    this.BaseType(name, def, parentType, null, validationType);
                    // __innerValue apunta al valor interno del proxy
                    this.__innerValue=null;
                    this.__revokeProxy=null;
                    if(val!==null)
                        this.setValue(val);


                },
                destruct: function () {
                    if (this.__fields !== null) {
                        for (var k in this.__fields) {
                            this.__fields[k].destruct();
                            delete this.__fields[k];
                            if(this.__innerValue!==null)
                            {
                                delete this.__innerValue[k];
                                delete this.__innerValue["*"+k];
                            }
                        }
                    }
                    if(this.__revokeProxy) {
                        this.__revokeProxy();
                        this.__revokeProxy=null;
                    }

                    if (this.__stateDef)
                        this.__stateDef.destruct();
                    if(this.__value && this.__value.hasOwnProperty("__destroy__"))
                        this.__value.__destroy__();

                },
                methods: {
                    __applyDefaultValue:function()
                    {
                        if (this.__hasDefaultValue()) {
                            this.BaseType$__applyDefaultValue();
                        }
                        else
                            this.reset();
                    },

                    __iterateOnFieldDefinitions: function (cb) {
                        for (var k in this.__fieldDef) {
                            cb.apply(this, [k, this.__fieldDef[k]]);
                        }
                    },
                    __iterateOnFields: function (cb) {
                        for (var k in this.__fields) {
                            cb.apply(this, [k, this.__fields[k]]);
                        }
                    },
                    __overrideDefinition: function (d, d1) {
                        var t = {};
                        for (var k in d)
                            t[k] = d[k];
                        for (var k in d1)
                            t[k] = d1[k];
                        return t;

                    },
                    getPlainValue: function (dontSave) {
                       /* if(this.__value===null) {
                            if (typeof this.__definition["SET_ON_EMPTY"] !== "undefined" &&
                                this.__definition["SET_ON_EMPTY"] == true)
                                return {};
                            return null;
                        }*/
                        var subVal = this.__value;
                        var nSet = 0;
                        var nFields = 0;
                        var res = {};
                        if(!this.__saving && typeof dontSave==="undefined")
                            this.save();
                        // Se mira si hay que devolver las claves que son nulas.
                        for (var k in this.__definition["FIELDS"]) {
                            nFields++;
                            var plainValue=null;
                            if(Siviglia.isset(this["*"+k])) {
                                // No queremos que vuelva a hacer save()
                                plainValue = this["*" + k].getPlainValue(true);
                            }

                            if (plainValue === null) {
                                var d = this.__definition["FIELDS"][k];
                                if (d["KEEP_KEY_ON_EMPTY"] == true) {
                                    res[k] = null;
                                    nSet++;
                                }
                            } else {
                                res[k] = plainValue;
                                nSet++;
                            }
                        }

                        if (nSet == 0) {
                            if (typeof this.__definition["SET_ON_EMPTY"] !== "undefined" &&
                                this.__definition["SET_ON_EMPTY"] == true)
                                return JSON.parse(JSON.stringify(res));
                            return null;
                        }
                        return JSON.parse(JSON.stringify(res));
                    },
                    __getField: function (name) {
                        var fs=this.__definition["FIELDS"];
                        if(name[0]===this.__getPathPrefix())
                            name=name.substr(1);
                        else
                        {
                            if(name[0]==="/")
                            {
                                var localPath=name.replace(this.__fieldNamePath+"/","");
                                name=localPath;
                            }
                        }
                        if(Siviglia.isset(fs[name])) {
                            if (Siviglia.empty(this.__fields[name]))
                                this.__buildField(name,fs[name],null,null)
                            return this.__fields[name];
                        }
                        else
                        return this.__findField(name);
                    },
                    isContainer: function () {
                        return true
                    },
                    getKeys: function () {
                        var res = [];
                        for (var k in this.__definition["FIELDS"]) {
                            res.push({"LABEL": k, "VALUE": k});
                        }
                        return res;
                    },
                    _validate: function () {
                        return true;
                    },

                    __clear: function () {
                        this.reset();
                        this.BaseType$__clear();
                    },
                    reset: function () {
                        if(this.__revokeProxy)
                        {
                            this.__revokeProxy();
                            this.__revokeProxy=null;
                        }

                        if (this.__dirty) {
                            this.__setDirty(false);
                        }
                        this.__dirtyFields = [];

                        this.__clearErrored();
                        this.__erroredFields = null;

                        for (var k in this.__fields) {
                            this.__fields[k].destruct();
                        }
                        this.__fields={};
                        if(this.__value)
                        {
                            if(this.__value.hasOwnProperty("__destroy__"))
                                this.__value.__destroy__();
                        }

                        /*for(var k in this.__definition["FIELDS"])
                        {
                            this.__createFields(k,this.__definition["FIELDS"][k]);
                        }*/
                    },
                    __clearErrored: function () {
                        if (this.__errored === false && this.__erroredFields===null)
                            return;
                        this.__errorException = null;
                        this.__erroredFields=null;
                        this.__errored = false;
                        this.__sourceException=null;
                        if (this.__controller)
                            this.__controller.__clearErroredField(this);
                    },
                    _setValue: function (v, validationMode) {
                        var m = this;
                        if (!Siviglia.isset(validationMode))
                            validationMode = this.__validationMode;

                        this.reset();
                        // Limpiamos el valor interno.
                        this.disableEvents(true);
                        var stateField=null;
                        this.__innerValue=v;
                        // Si hay un campo de estado, hay que asignarlo primero.
                        if(this.__stateDef!==null)
                        {
                                m.__buildField(this.__stateFieldName,
                                    this.__definition["FIELDS"][this.__stateFieldName],
                                    Siviglia.issetOr(v[this.__stateFieldName],null),validationMode);
                                m.__definition["FIELDS"][this.__stateFieldName] = m.__fields[this.__stateFieldName].__definition;

                        }

                        Object.defineProperty(v, "[[KEYS]]", {
                            get: function () {
                                return m.getKeys();
                            },
                            set: function (v) {
                            },
                            enumerable: false,
                            configurable: true
                        });
                        Object.defineProperty(v, "__basetype__", {
                            get: function () {
                                return m;
                            },
                            set: function (v) {
                            },
                            enumerable: false,
                            configurable: true
                        });



                        var revocable=Proxy.revocable(v,{
                           apply:function(target,thisArg,argumentsList)
                           {
                               if(this.hasOwnProperty[target])
                                   target.apply(this,argumentsList);
                               else
                                   thisArg.apply(this,argumentsList);
                           }.bind(this),
                            get:function(target,property,receiver){
                               if(typeof v[property]==="undefined")
                               {
                                   if(typeof this[property]==="undefined")
                                   // Si el campo no existe, lanzamos excepcion, pero no ponemos el objeto a "Errored".Técnicamente,  el objeto no está mal,
                                   // ya que no ha sido modificado.
                                   throw new Siviglia.model.BaseTypedException(m.getFullPath(), Siviglia.model.BaseTypedException.ERR_NOT_A_FIELD, {field:property});
                               }
                               return v[property];

                            }.bind(this),
                            set:function(target,property,value,receiver){
                                if(!v.hasOwnProperty(property))
                                {
                                    if(typeof this[property]==="undefined")
                                    // Si el campo no existe, lanzamos excepcion, pero no ponemos el objeto a "Errored".Técnicamente,  el objeto no está mal,
                                    // ya que no ha sido modificado.
                                    throw new Siviglia.model.BaseTypedException(m.getFullPath(), Siviglia.model.BaseTypedException.ERR_NOT_A_FIELD, {field:property});
                                }
                                v[property]=value;
                                return value;
                            }.bind(this),
                            deleteProperty:function(target,prop){
                               if(typeof this.__definition["FIELDS"][prop]!=="undefined")
                               {
                                   this.__fields[prop].setValue(null);
                               }
                               if(prop==="[[KEYS]]")
                                   return; // No permitimos que se elimine
                                delete target[prop];
                            }.bind(this)
                        });
                        this.__value=revocable.proxy;
                        this.__revokeProxy=revocable.revocable;

                        this.__iterateOnFieldDefinitions(function (name, def) {
                            if(def["TYPE"]!=="State") {
                                (function (k, def) {

                                    // lo hacemos en dos pasos: primero definimos, despues ponemos valor.
                                    m.__buildField(k, def, v[k],validationMode);
                                })(name, def);

                                // Se recupera la definicion del tipo, y se copia sobre la definicion del bto.
                                // Esto es asi, porque si la definicion del campo, en el bto, era del tipo MODEL/FIELD, en el tipo, ahora,
                                // ya se ha resuelto.Quien intente leer la definicion del campo, a traves del bto, solo va a ver la definicion MODEL/FIELD.
                                // Por eso, copiamos la definicion del tipo, sobre el bto.
                                m.__definition["FIELDS"][name] = m.__fields[name].__definition;
                            }
                        });
                        // Si este campo tiene estados, se comprueban ahora.
                        if (this.__stateDef !== null) {
                            this.__stateDef.enable();
                            this.__stateDef.checkState();
                        }

                        this.__valueSet = true;
                        this.disableEvents(false);
                        return this.__value;

                //        this.onChange();
                    },
                    __createFields:function(fieldName,def)
                    {
                        if(Siviglia.isset(this.__fields[fieldName]))
                            return;
                        this.__fields[fieldName] = Siviglia.types.TypeFactory.getType({
                            "fieldName": fieldName,
                            "path": this.__fieldNamePath
                        }, def, this, null, this.__validationMode);
                    },
                    __buildField:function(fieldName,def,value,validationMode)
                    {

                        var m=this;
                        validationMode=Siviglia.empty(validationMode)?m.__getValidationMode():validationMode
                        // Se crea el campo si no se habia creado ya.
                        m.__createFields(fieldName,def);

                        if (this.__innerValue && !this.__innerValue.hasOwnProperty("*" + fieldName))
                        {
                        var dsts=[this];
                        if(this.__innerValue)
                            dsts.push(this.__innerValue);
                        var dst;
                        for (var s=0;s<dsts.length;s++) {
                            dst = dsts[s];
                            if (!dst.hasOwnProperty("*" + fieldName)) {
                                Object.defineProperty(dst, "*" + fieldName, {
                                    get: function () {
                                        return m.__getField(fieldName);
                                    },
                                    set: function (v) {
                                    },
                                    enumerable: false,
                                    configurable: true
                                });
                                // Al ser un container, la propiedad *[[KEYS]],en teoria, no cambia.
                                // Otra cosa es que queramos que, por ejemplo, en el array de KEYS solo
                                // aparezcan las claves que no son null.En ese caso si que serian dinamicos
                                // Es por eso
                                Object.defineProperty(dst, fieldName, {
                                    get: function () {
                                        return m.__getField(fieldName).getValue();
                                    },
                                    set: function (val) {
                                        m.__getField(fieldName).apply(val, m.__validationMode);
                                        return val;
                                    },
                                    enumerable: true,
                                    configurable: true
                                });
                            }
                        }
                        }
                        // Una vez creados los campos, es ahora cuando se puede asignar el valor.
                        // Esto es asi, para que si hay una excepcion durante la asignacion del valor,
                    // no se quede el objeto a medio construir
                        if(!Siviglia.empty(value))
                            m.__fields[fieldName].apply(value,validationMode);
                    },
                    isDirty: function () {
                        return this.__dirty;
                    },
                    setDirty: function (dirty) {
                        this.__dirty = dirty;
                        if (!dirty)
                            this.__dirtyFields = []
                    },
                    addDirtyField: function (field) {
                        var fieldName = field.__getFieldName();
                        this.__clearErroredField(field);
                        if (!this.isDirty()) {
                            if (this.__erroredFields === null)
                                this.__setDirty(true,true);
                        }
                        if (this.__dirtyFields.indexOf(field) < 0)
                            this.__dirtyFields.push(field);
                        if (this.__changingState)
                            this.__checkStateChangeCompleted();
                    },
                    addErroredField: function (field) {
                        var fName=field.__getFieldPath();
                        if(this.__erroredFields===null)
                            this.__erroredFields={};
                        this.__erroredFields[fName]=field;
                        if(this.__controller)
                            this.__controller.addErroredField(this);
                    },
                    getErroredFields: function () {
                        var res=[];
                        if(this.__erroredFields===null)
                            return res;
                        for(var k in this.__erroredFields)
                            res.push(this.__erroredFields[k]);
                        return res;
                    },
                    __clearErroredField: function (field) {
                        if(this.__erroredFields===null)
                            return;
                        var fName=field.__getFieldPath();
                        if(Siviglia.isset(this.__erroredFields[fName])) {
                            delete this.__erroredFields[fName];
                            // Si quedan erroredFields, salimos.
                            for(var k in this.__erroredFields)
                                    return;
                            if(this.__controller)
                                this.__controller.clearErroredField(this);
                            this.setDirty(true);
                            this.__erroredFields=null;
                            this.__errored=false;
                        }
                    },
                    __findField: function (name) {
                        if (name[0] === this.__getPathPrefix()) {
                            name = name.substr(1);
                        }
                        var parts = name.split("/");
                        if (parts.length == 0)
                            return this.__getField(name);
                        return this.findPath(name, true);
                    },
                    __getController: function () {
                        return this.__controller;
                    },
                    __getControllerForChild: function () {
                        if (this.__stateDef !== null)
                            return this;
                        return this.__controller;
                    },
                    __getFieldNames: function () {
                        return this.getKeys();
                    },
                    __getFieldDefinition: function (fieldName) {
                        return this.__fieldDef[fieldName];
                    },
                    __hasValue: function () {
                        return this.__value !== null;
                    },
                    __isEmptyValue:function(val)
                    {
                        if(val===null)
                            return true;
                        var blankIsNull=Siviglia.issetOr(this.__definition["BLANK_IS_NULL"],false);
                        // Si blanco (objeto vacio) no es "Vacio", entonces, da igual lo que haya,
                        // el valor no es vacio.
                        if(!blankIsNull)
                            return false;

                        if(Object.keys(val).length===0)
                            return true;

                        for(var k in val){
                            var f = this.__getField(k);
                            // En cuanto haya un campo a "set", es que el valor no esta vacio.
                            if (!f.__isEmptyValue(val[k]))
                                return false;

                            var def = f.getDefinition();
                            if (Siviglia.issetOr(def["KEEP_KEY_ON_EMPTY"],false))
                                return false;
                        }
                        return true;
                    },
                    __hasOwnValue: function () {
                        return this.__hasValue();
                    },
                    __checkComplete: function (throwExceptions) {
                        var haveValue = false;
                        for (var k in this.__fieldDef) {
                            var f = this.__getField(k);
                            if (!f.__hasOwnValue()) {
                                if (f.__isRequired()) {
                                    if(throwExceptions)
                                    {
                                        var e = new Siviglia.model.BaseTypedException(f.__getFieldPath(),Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD);
                                        f.__setErrored(e);
                                        throw e;
                                    }
                                    return false;
                                }
                                // Si no era requerido, vemos si se mantiene la key o no.
                                var def = f.getDefinition();
                                if (Siviglia.issetOr(def["KEEP_KEY_ON_EMPTY"], false))
                                    haveValue = true;
                            } else
                                haveValue = true;
                        }
                        if(this.__stateFieldName)
                        {
                            // Se llama al campo de estado por si tenia pendiente terminar de cambiar de estado.
                            this.__fields[this.__stateFieldName].onStateChangeComplete();
                        }
                        return haveValue;
                    },
                    __checkStateChangeCompleted: function () {
                        return this.__checkComplete(false);
                    },
                    _copy: function (ins) {
                        this.__setParent(this.__parent, this.__name);
                    },
                    save: function () {
                        this.__saving=true;
                        for (var k in this.__definition["FIELDS"]) {
                            if(!Siviglia.empty(this.__fields[k]))
                                this.__fields[k].save();
                        }
                        this.__checkComplete(true);
                        this.__saving=false;
                        if (this.__erroredFields!==null) {
                            for(var k in this.__erroredFields)
                                throw(this.__erroredFields[k].__errorException);
                        }
                        if(this.__stateDef)
                            this.__stateDef.checkState();
                        if (this.__erroredFields!==null)
                        {
                            for(var k in this.__erroredFields)
                                throw(this.__erroredFields[0].__errorException);
                        }
                    },
                    __isErrored: function () {
                        return this.__errored || this.__erroredFields!==null;
                    },
                    removeDirtyField: function (field) {
                        var idx = this.__dirtyFields.indexOf(field);
                        if (idx >= 0)
                            this.__dirtyFields.splice(idx, 1);
                        if (this.__dirtyFields.length === 0) {
                            this.__setDirty(false);
                            if (this.__controller)
                                this.__controller.removeDirtyField(this);
                        }
                    },
                    cleanDirtyFields: function () {
                        this.__setDirty(false);
                        this.__dirtyFields = [];
                        if (this.__stateDef)
                            this.__stateDef.reset();
                    },
                    getDirtyFields: function () {
                        return this.__dirtyFields;
                    },
                    // Esto se usa por los campos hijos para saber si el controller tiene una
                    // restriccion de que un campo sea requerido, lo cual sólo puede venir del estado.
                    isFieldRequired: function (fieldName) {
                        if (this.__stateDef !== null)
                            return this.__stateDef.isRequired(fieldName);
                        return false;
                    },
                    getStateField: function () {
                        if (this.__stateDef)
                            return this.__stateDef.getStateField();
                        return null;
                    },
                    getStateDef: function () {
                        return this.__stateDef;
                    },
                    getStates: function () {
                        if (!this.__stateDef)
                            return null;
                        var list = [];
                        for (var k in this.__definition["STATES"]["STATES"])
                            list.push(k);
                        return list;
                    },
                    getStateId: function (stateName) {
                        if (!this.__stateDef)
                            return null;

                        return this.getStates().indexOf(stateName);
                    },
                    getStateLabel: function (stateId) {
                        if (!this.__stateDef)
                            return null;
                        return this.getStates()[stateId];
                    },
                    getKeyLabel: function (key) {
                        return this.__definition["FIELDS"][key]["LABEL"];
                    },
                    getGroups: function () {
                        return Siviglia.issetOr(this.__definition["GROUPS"], null);
                    }

                }
            }
        }
    });
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.types',
        classes:
            {
                Proxifier: {
                    construct: function () {
                        this.__currentProxy = null;
                        this.reserved = reserved = ["__isProxy__", "__ev__", "__refcount__", "__destroyed__", "__disableEvents__", "[[KEYS]]", "*[[KEYS]]"];
                        this.__innerValue=null;
                        this.__revokeProxy=null;

                    },
                    destruct: function () {

                        if(this.__currentProxy) {
                            if (typeof this.__currentProxy.__ev__ !== "undefined")
                                this.__currentProxy.__ev__.destruct();
                        }
                        if(this.__value && this.__value.hasOwnProperty("__destroy__"))
                            this.__value.__destroy__();
                        this.reset();
                        if(this.hasOwnProperty("*[[KEYS]]"))
                            this["*[[KEYS]]"].destruct();

                    },
                    methods:
                        {
                            isContainer: function () {
                                return true;
                            },
                            proxify: function (val,validationMode) {


                                if (this.__value !== null) {
                                    this.reset();
                                }
                                if (val === null) {

                                    this.__value = null;
                                    return this.__value;
                                }
                                this.__innerValue=val;

                                if (val.hasOwnProperty("__isProxy__")) {
                                    // Es un array que YA es un proxy. Simplemente, incrementamos el contador de referencias, nos enganchamos a su onChange.
                                    val.__refcount__++;
                                    val.__ev__.addListener("CHANGE", this, "onChange","Proxifier-existingProxy");
                                    this.__currentProxy = val;
                                    this.__value = val;
                                    this.updateChildren(val,validationMode);
                                    return val;
                                }

                                var ev = new Siviglia.Dom.EventManager();


                                var nReferences = 0;
                                var destroyed = false;
                                var eventsDisabled = false;
                                var m = this;

                                // Se establecen todas las propiedades de control.
                                Object.defineProperty(val, "__isProxy__", {
                                    get: function () {
                                        return true
                                    },
                                    set: function (v) {
                                    }
                                    , enumerable: false, configurable: true
                                });
                                Object.defineProperty(val, "__ev__", {
                                    get: function () {
                                        return ev
                                    },
                                    set: function (v) {
                                    }
                                    , enumerable: false, configurable: true
                                });
                                Object.defineProperty(val, "__refcount__", {
                                    get: function () {
                                        return nReferences;
                                    },
                                    set: function (v) {
                                        nReferences = v;
                                        if (v == 0) {
                                            for (var k in val) {
                                                if (typeof val["*" + k] !== "undefined")
                                                    val["*" + k].destruct();
                                            }
                                            ev.destruct();
                                            ev = null;
                                            destroyed = true;
                                        }
                                    }
                                    , enumerable: false, configurable: true
                                });

                                Object.defineProperty(val, "__destroyed__", {
                                    get: function () {
                                        return destroyed;
                                    },
                                    set: function (v) {
                                        destroyed = v;
                                    }
                                    , enumerable: false, configurable: true
                                });
                                Object.defineProperty(val, "__disableEvents__", {
                                    get: function () {
                                        return eventsDisabled;
                                    },
                                    set: function (v) {
                                        eventsDisabled = v;
                                    }
                                    , enumerable: false, configurable: true
                                });
                                Object.defineProperty(val, "__basetype__", {
                                    get: function () {
                                        return m;
                                    },
                                    set: function (v) {
                                    },
                                    enumerable: false,
                                    configurable: true
                                });


                                var keys = [];
                                // Las funciones de obtencion de keys, se implementan
                                // tanto en el tipo, como en el objeto.
                                // Es por eso que guardamos la definicion, y la reutilizamos dos veces.

                                var defKeys = {
                                    get: function () {
                                        return keys;
                                    },
                                    set: function (v) {
                                        keys = v;
                                        //keysEv.fireEvent("CHANGE",{"data":keys})
                                    }
                                    , enumerable: false, configurable: true
                                };
                                Object.defineProperty(val, "[[KEYS]]", defKeys);
                                Object.defineProperty(this, "[[KEYS]]", defKeys);
                                // Incluimos al objeto, uns propiedad que se va a llamar *[[KEYS]],
                                // // para que asi,
                                // por "duck typing" , parezca un BaseType.
                                // Para que lo parezca, hay que implementar 2 cosas: que se devuelva el EventManager,
                                // y que si alguien hace ["*[[KEYS]]"]->getValue(), se devuelvan las keys.
                                // Para que eso ocurra, aniadimos una funcion getValue() al eventManager:
                                ev.getValue = function () {
                                    return keys
                                };
                                var defKeyType = {
                                    get: function () {
                                        return ev;
                                    },
                                    set: function (v) {
                                    }
                                    , enumerable: false, configurable: true
                                };
                                Object.defineProperty(val, "*[[KEYS]]", defKeyType);
                                //Object.defineProperty(this,"*[[KEYS]]",defKeyType);

                                // Incrementamos ya el numero de referencias
                                val.__refcount__ = 1;
                                // La funcion buildProxy es la que hay que sobreescribir en las clases hijas.
                                this.__currentProxy = this.buildProxy(val);
                                this.__value = this.__currentProxy;
                                this.disableEvents(true);
                                ev.addListener("CHANGE", this, "onChange","Proxifier-Keys");
                                this.updateChildren(val,validationMode);
                                this.disableEvents(false);
                                return this.__currentProxy;
                            },
                            updateChildren: function (val) {
                                throw "Please implement updateChildren";
                            },

                            reset: function () {
                                this.disableEvents(true);
                                if (this.__currentProxy !== null) {
                                    this.__currentProxy.__ev__.removeListeners(this);
                                    this.__currentProxy.__refcount__--;
                                    this.__currentProxy = null;
                                }
                                if(this.__revokeProxy)
                                    this.__revokeProxy();
                                this.disableEvents(false);
                            },

                            intersect: function (val) {
                                if (!this.__valueSet)
                                    return val;
                                if (val.length == 0)
                                    return val;
                                var keys = this.getKeys()
                                return array_compare(val, keys, false);
                            },
                            __hasSource: function () {
                                return !Siviglia.empty(this.__definition["SOURCE"]);
                            },
                            getSource: function (controller, params) {
                                if(!this.__hasSource())
                                    return null;
                                if(this.__source===null) {
                                    var s = new Siviglia.Data.SourceFactory();
                                    var stack = new Siviglia.Path.ContextStack();
                                    var plainCtx = new Siviglia.Path.BaseObjectContext(this.__parent, "#", stack);
                                    this.__source = s.getFromSource(this.__definition.SOURCE, this, stack);
                                }
                                return this.__source;
                            },
                            getSourceLabel: function () {
                                return "[[VALUE]]";
                            },
                            getSourceValue: function () {
                                return "[[VALUE]]";
                            },

                            getKeys: function (val) {
                                var res = [];
                                for (var k in val) {
                                    res.push({"LABEL": k, "VALUE": k});
                                }
                                return res;
                            },
                            __proxyApply: function (val, m) {
                                return function (target, thisArg, argumentsList) {
                                    return target.apply(thisArg, argumentsList);
                                }
                            },
                            __proxyGet: function (val, m) {
                                return function (target, prop, receiver) {
                                    if (prop === "getKeys")
                                        return m.getKeys;
                                    if (m.reserved.indexOf(prop) >= 0)
                                        return target[prop];
                                    if (prop === Symbol.toStringTag)
                                        return target.toString;
                                    if (prop[0] === "*")
                                        return target[prop];
                                    if (typeof target["*" + prop] === "undefined")
                                        return target[prop];
                                    return target["*" + prop].getValue();
                                }
                            },
                            __proxyDeleteProperty: function (val, m) {
                                return function (target, prop) {
                                    var ret = val[prop];
                                    delete val[prop];
                                //    val["*" + prop].removeListeners(m);
                                //    val["*" + prop].destruct();
                                    val["*" + prop].destruct();
                                    delete val["*"+prop];
                                    target["[[KEYS]]"] = m.getKeys(val);
                                    target.__ev__.fireEvent("CHANGE", {object: target, value: m.__currentProxy});
                                    return ret;
                                }
                            },
                            __proxySet: function (val, m) {
                                return function (target, prop, value, receiver) {

             //                       try {

                                        if (reserved.indexOf(prop) >= 0) {
                                            target[prop] = value;
                                            return;
                                        }

                                        var isNewProp = false;
                                        var oldProp;
                                        if(!target.hasOwnProperty("*"+prop))
                                        {
                                            isNewProp = true;
                                        }
                                        else
                                        {
                                            oldProp=target["*"+prop];
                                        }

                                            var instance = m.getValueInstance(prop, null);
                                            Object.defineProperty(target, "*" + prop, {
                                                get: function () {
                                                    return instance
                                                },
                                                set: function (v) {
                                                    instance = v;
                                                    return true;
                                                }
                                                , enumerable: false, configurable: true
                                            })
                                            Object.defineProperty(m, "*" + prop, {
                                                get: function () {
                                                    return instance
                                                },
                                                set: function (v) {
                                                    instance = v;
                                                    return true;
                                                }
                                                , enumerable: false, configurable: true
                                            })
                                        Object.defineProperty(m, prop, {
                                            get: function () {
                                                return instance.getValue()
                                            },
                                            set: function (v) {
                                                // Esta linea se introduce tras ver un problema con Array.splice
                                                if(typeof v.__basetype__!=="undefined")
                                                    instance.setValue(v.__basetype__.getPlainValue());
                                                else
                                                    instance.setValue(v);
                                                return true;
                                            }
                                            , enumerable: false, configurable: true
                                        });
                                    Object.defineProperty(target, "__basetype__", {
                                        get: function () {
                                            return m;
                                        },
                                        set: function (v) {
                                        },
                                        enumerable: false,
                                        configurable: true
                                    });
                                    if(!isNewProp)
                                    {
                                        oldProp.destruct();
                                    }

                                    target[prop] = value;

                                    var exceptionThrown=null;
                                    try {
                                        instance.apply(value, m.__validationMode);
                                    }catch(e)
                                    {
                                        exceptionThrown=e;
                                    }

                                        // OJO: Solo lanzamos evento si la propiedad es nueva, o sea, no habia una propiedad "*".
                                        if (isNewProp) {
                                            target["[[KEYS]]"] = m.getKeys(val);
                                            if (!m.eventsDisabled()) {
                                                target.__ev__.fireEvent("CHANGE", {object: target, value: value});
                                            }
                                        }
                                    if(exceptionThrown)
                                    {
                                        throw exceptionThrown;
                                    }
                                    return true;
               /*                     } catch (e) {
                                        m.fireEvent("ERROR", {})
                                        throw new Siviglia.model.BaseTypedException(m.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {});
                                        return false;
                                    }*/
                                }
                            },
                            buildProxy: function (val) {

                                var revocable= Proxy.revocable(val, {
                                    apply: this.__proxyApply(val, this),
                                    get: this.__proxyGet(val, this),
                                    deleteProperty: this.__proxyDeleteProperty(val, this),
                                    set: this.__proxySet(val, this)
                                });
                                this.__revokeProxy=revocable.revoke;
                                return revocable.proxy;
                            }
                        },

                },
                Dictionary: {
                    inherits: 'BaseType,Proxifier',
                    construct: function (name,def, parent,value, validationMode) {
                        this["[[KEYS]]"] = [];
                        def.ALLOW_NULL_VALUES=Siviglia.issetOr(def.ALLOW_NULL_VALUES,false);
                        Siviglia.Path.eventize(this, "[[KEYS]]");
                        this.Proxifier();
                        this.BaseType(name, def, parent,value, validationMode)
                    },
                    destruct:function()
                    {
                        if(this.__currentProxy)
                        {
                            for(var k in this.__currentProxy)
                            {
                                this["*"+k].destruct();
                            }
                            this.__currentProxy.__ev__.destruct();
                        }
                    },

                    methods: {
                        _validate: function () {
                            return true;
                        },
                        copy: function (val) {
                            this.setValue(val);
                        },
                        __clear: function () {
                            this.reset();
                            this.BaseType$__clear();
                        },
                        __checkSource:function(value)
                        {
                            if(!this.__hasOwnValue())
                                return true;
                            if(Object.keys(this.__currentProxy).length===0)
                                return true;
                            return this.BaseType$__checkSource(value);
                        },
                        _setValue: function (val,validationMode) {
                            if(typeof val==="object" && Object.keys(val).length===0)
                            {
                                // Si es un array vacio, hacemos una copia.
                                // Esto es para no compartir el array con el "mundo exterior", de forma
                                // que se pueda asignar la referencia a más de 1 tipo
                                val={};
                            }
                            else
                            {
                                if(typeof val.__basetype__!=="undefined") {
                                    val = JSON.parse(JSON.stringify(val.__basetype__.getPlainValue()));
                                }
                            }

                            this.__currentProxy = this.proxify(val);
                            return this.__currentProxy;
                            //this["[[KEYS]]"]=this.getKeys();
                        },
                        updateChildren: function (val,validationMode) {
                            var m = this;
                            var oldValidationMode=this.__validationMode;
                            if(typeof validationMode!=="undefined") {
                                this.__validationMode = validationMode;
                            }
                            var thrownException=null;
                            for (var k in val) {
                                try {
                                    m.__currentProxy[k] = val[k];

                                }catch(e)
                                {
                                    if(thrownException===null)
                                        thrownException=e;
                                }
                            }
                            this.__validationMode=oldValidationMode;
                            // Ojo, lanzamos el evento, aunque haya una excepcion pendiente...
                            if (!thrownException && !this.eventsDisabled())
                                this.onChange();
                            if(thrownException) {
                                this.disableEvents(false);
                                this.onChange()
                                throw thrownException;
                            }

                        },
                        getValue: function () {
                            return this.__currentProxy;
                        },
                        __getSourcedValue:function()
                        {
                            if(!this.__valueSet)
                                return null;
                            var pl=this.getPlainValue();
                            if(pl===null)
                                return null;
                            return Object.keys(pl);
                        },
                        // Esta funcion indica que, al comprobar el source, hay que ver las *keys* del tipo.
                        // Esto es usado por proxySet.
                        getSourcedProperty:function()
                        {
                            return "KEY";
                        },
                        getPlainValue: function (dontSave) {
                            if (!this.__valueSet)
                                return null;
                            if(!this.__saving && typeof dontSave==="undefined")
                                this.save();
                            var res = {};
                            var nSet = 0;
                            var nFields = 0;
                            for (var k in this.__currentProxy) {
                                nFields++;
                                if (this.__currentProxy[k] !== null || this.__definition["ALLOW_NULL_VALUES"]===true) {
                                    nSet++;
                                    res[k] = this.__currentProxy["*" + k].getPlainValue(true);
                                }
                            }
                            if (nSet != nFields)
                                this.onChange();

                            if (nSet == 0) {
                                if (this.__definition["SET_ON_EMPTY"] != true) {
                                    return null;
                                }
                            }
                            return res;
                        },
                        getValueInstance: function (key, val) {
                            return  Siviglia.types.TypeFactory.getType({"fieldName":key,"path":this.__fieldNamePath}, this.__definition["VALUETYPE"], this,Siviglia.issetOr(val, null),this.__validationMode);
                        },

                        addItem: function (key, val) {

                            try {
                                this.__currentProxy[key] = Siviglia.issetOr(val, null);
                            }catch(e)
                            {
                                this.onChange();
                                throw e;
                            }
                        },
                        getKeyLabel: function (key) {
                            return key;
                        },
                        save: function () {
                            this.__saving=true;
                            var err = null;
                            var nSet=0;
                            if (!Siviglia.empty(this.__currentProxy)) {

                                for (var k in this.__currentProxy) {
                                    this.__currentProxy["*" + k].save();
                                    if(!this.__currentProxy["*"+k].__hasOwnValue() &&
                                        this.__definition["ALLOW_NULL_VALUES"]===false
                                    )
                                    {
                                            continue;
                                    }
                                    nSet++;
                                }
                                this.__checkSource(this.__currentProxy);
                            }


                            this.__saving=false;

                                if (nSet === 0 && !Siviglia.empty(this.__definition.REQUIRED) && this.__definition.REQUIRED === true &&
                                    this.__definition["SET_ON_EMPTY"] !== true)
                                    this.__setErrored(new Siviglia.model.BaseTypedException(this.__fieldNamePath, Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD));


                        },
                        __isEmptyValue:function(val)
                        {
                            if(val===null)
                                return true;
                            // Si no es nulo, y un valor en blanco ({}) no lo consideramos nulo,
                            // el valor ya no es nulo.
                            var blankIsNull=Siviglia.issetOr(this.__definition["BLANK_IS_NULL"],false);
                            if(!blankIsNull)
                                return false;
                            var nKeys=Object.keys(val).length;
                            // Si no hay keys
                            if(nKeys===0)
                            {
                                // Y SET_ON_EMPTY es true, el valor no esta vacio.
                                if(Siviglia.issetOr(this.__definition["SET_ON_EMPTY"]),false)
                                    return false;
                                return true;
                            }
                            // Miramos si se permite que haya keys con valor nulo.
                            var allowNulls=Siviglia.issetOr(this.__definition["ALLOW_NULL_VALUES"],false);
                            if(allowNulls===true)
                                return false;
                            var nSet=0;
                            // Se crea una instancia del tipo remoto.
                            var ins=this.getValueInstance("test",null);
                            for(var k in val)
                            {
                                // En cuanto se encuentra un valor que no sea empty, el tipo no es empty
                                if(!ins.__isEmptyValue(val[k]))
                                return false;
                            }
                            return true;
                        }

                       /* __checkSource: function (val) {
                            // Esto solo deberia llamarse si el modo de validacion es complete.
                            if (this.__hasSource()) {
                                var s = this.__getSource();
                                // En un Dictionary, el source se comprueba contra las keys del valor
                                for(var k in val) {
                                    if (!s.contains(k)) {
                                        //this.setValue(null);
                                        var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: k});
                                        this.__setErrored(e);
                                        this.__sourceException=true;
                                        throw e;
                                    }
                                }
                                this.__clearSourceException();
                            }

                            return true;
                        },*/
                    }
                },

                TypeSwitcherException: {
                    inherits: 'Siviglia.model.BaseTypedException',
                    constants: {
                        ERR_TYPE_NOT_SET: 140,
                        ERR_INVALID_TYPE: 141,
                    },
                    construct: function (path, code, param) {
                        this.path = path;
                        this.BaseTypedException(path, code, param);
                        this.type = 'TypeSwitcherException';
                    }
                },
                TypeSwitcher: {
                    inherits: 'BaseType',

                    construct: function (name,definition, parent,value, validationMode) {
                        this.subNode = null;
                        this.currentType = null;

                        this.forceType = null;
                        this.BaseType(name, definition,parent, value,validationMode);

                        Object.defineProperty(this, "*value", {
                            enumerable: false, configurable: true, get: function () {
                                return this.subNode;
                            }, set: function (val) {
                            }
                        });
                        Object.defineProperty(this, "value", {
                            enumerable: false, configurable: true, get: function () {
                                return this.subNode.getValue();
                            }, set: function (val) {
                            }
                        });
                    },
                    destruct: function () {
                        this.reset();
                    },
                    methods: {
                        reset: function () {
                            if (this.subNode)
                                this.subNode.destruct();
                            this.subNode = null;
                        },
                        isContainer:function()
                        {
                           return true;
                        },
                        _setValue: function (val,validationMode) {

                            this.reset();
                            var typeInfo = this.getTypeFromValue(val);
                            var typeDef=Siviglia.issetOr(typeInfo["def"],typeInfo["name"]);
                            this.currentType = typeInfo["name"];
                            this.subNode = Siviglia.types.TypeFactory.getType({fieldName:"",path:this.__fieldNamePath}, typeDef, this.__parent,this.forceType == null ? val : null,this.__validationMode);
                            this.forceType=null;
                            // Si despues de est, el subNodo no tiene valor, le asignamos un valor vacio.
                            if(!this.subNode.__hasOwnValue() && this.subNode.isContainer())
                                this.subNode.apply({},Siviglia.types.BaseType.VALIDATION_MODE_NONE);
                            this.__value = this.subNode;
                            // Solo necesitamos eventizar si el cambio de tipo se produce por un cambio de un TYPE_FIELD
                            if (typeof this.__definition.TYPE_FIELD !== "undefined")
                                this._eventize(val);
                            return val;
                        },
                        _eventize: function (val) {
                            var m = this;
                            var tmpObject = {};
                            //WorkAround para eventize:
                            Object.defineProperty(val, "__basetype__", {
                                enumerable: false,
                                configurable: true,
                                get: function () {
                                    return m;
                                }
                            })
                            Object.defineProperty(val, "__isProxy__", {
                                enumerable: false,
                                configurable: true,
                                get: function () {
                                    return true;
                                }
                            })
                            Object.defineProperty(val, "__ev__", {
                                enumerable: false,
                                configurable: true,
                                get: function () {
                                    return m;
                                }
                            })
                            var defBuilder = function (fieldName) {
                                var def = {
                                    set: function (value) {
                                        var curType;
                                        var target = value;
                                        if (value == null)
                                            target = m.__definition.IMPLICIT_TYPE;
                                        if (target !== m.currentType) {
                                            var tmpDef = {};
                                            tmpDef[fieldName] = value;
                                            var typeInfo = m.getTypeFromValue(tmpDef);
                                            var typeDef=Siviglia.issetOr(typeInfo["def"],typeInfo["name"]);

                                            curType = Siviglia.types.TypeFactory.getType({fieldName:this.fieldName,fieldPath:this.__fieldNamePath}, typeDef, m,tmpDef);

                                            if (m.subNode !== null)
                                                m.subNode.destruct();
                                            m.subNode = curType;
                                            m.currentType = typeInfo["name"];
                                            tmpObject[fieldName] = value;
                                            m._eventize(tmpDef);
                                        }
                                        m.disableEvents(true);
                                        if (!m.__definition.CONTENT_FIELD)
                                            m.__value = m.subNode;
                                        m.disableEvents(false);
                                        m.onChange();
                                    },
                                    get: function () {
                                        return tmpObject[fieldName];
                                    },
                                    enumerable: true, configurable: true
                                };
                                // Hacemos una copia del valor del campo en tmpObject.
                                tmpObject[fieldName] = val[fieldName]
                                // Vemos si en el tipo actual, existe ese campo, o si es un campo que debe estar "oculto", ya
                                // que igual no existe en el tipo actual, y sólo está ahi por si se quiere cambiar el valor del tipo.
                                // Esto solo tiene sentido si el subNodo es un container
                                if (m.subNode.isContainer() && typeof m.subNode.__definition.FIELDS!=="undefined" && !Siviglia.empty(m.subNode.__definition.FIELDS[fieldName]))
                                    def.enumerable = false;
                                Object.defineProperty(val, fieldName, def);
                            }
                            //var byType=Siviglia.issetOr(this.__definition["TYPE_FIELD"],null)

                            //if(byType) {
                            var fieldName = this.__definition.TYPE_FIELD;
                            tmpObject[this.__definition.TYPE_FIELD] = val[this.__definition.TYPE_FIELD];
                            defBuilder(this.__definition.TYPE_FIELD);
                            /*}
                    else
                    {
                        byType=Siviglia.issetOr(this.__definition["ON"],null);
                        if(byType) {
                            var included=[];
                            for (var k = 0; k < this.__definition["ON"].length; k++) {
                                var cur=this.__definition["ON"][k];
                                if(Siviglia.isset(cur["FIELD"])){
                                    var f=cur["FIELD"];
                                    if (included.indexOf(f) >= 0)
                                        continue;
                                    defBuilder(f);
                                }

                            }
                        }
                    }*/
                        },
                        _validate: function () {
                            return true;
                        },

                        getTypeDefinition: function (typeName) {
                            var allowedTypes = this.getAllowedTypes();
                            return allowedTypes[typeName];
                        },

                        getTypeFromValue: function (val) {
                            var byType = Siviglia.issetOr(this.__definition["TYPE_FIELD"], null)
                            if (byType) {
                                var typeField = byType;
                                var curType = null;
                                if (typeField != null && typeof val[typeField] !== "undefined")
                                {
                                    curType = val[typeField];
                                } else {
                                    if (!Siviglia.empty(this.__definition.IMPLICIT_TYPE)) {
                                        curType = this.__definition.IMPLICIT_TYPE;
                                    } else
                                        throw new Siviglia.types.TypeSwitcherException(this.getFullPath(), Siviglia.types.TypeSwitcherException.ERR_INVALID_TYPE);
                                }

                                var t=null;
                                if(typeof(this.__definition.ALLOWED_TYPES[curType])!=="undefined")
                                    t=this.__definition.ALLOWED_TYPES[curType];
                                else
                                {
                                    if(typeof(this.__definition.ALLOWED_TYPES["*"])!=="undefined")
                                        t=this.__definition.ALLOWED_TYPES["*"];
                                    else
                                        throw new Siviglia.types.TypeSwitcherException(this.getFullPath(), Siviglia.types.TypeSwitcherException.ERR_INVALID_TYPE);
                                }


                                if (Siviglia.empty(this.__definition.CONTENT_FIELD)) {
                                    return {name: curType, def: t};
                                } else {
                                    var baseDef = {"TYPE": "Container", "FIELDS": {}};
                                    baseDef["FIELDS"][this.__definition.TYPE_FIELD] = {"TYPE": "String"};
                                    baseDef["FIELDS"][this.__definition.CONTENT_FIELD] = t;
                                    return {name: curType, def: baseDef};
                                }

                            }
                            byType = Siviglia.issetOr(this.__definition["ON"], null);

                            if (byType) {
                                if (this.forceType !== null) {
                                    var curType = this.forceType;
                                    // Aun no ponemos forceType a null, esto hay que hacerlo en el setValue,
                                    // para que se establezca a null el valor del subnodo.
                                    //this.forceType = null;
                                    return {name: curType, def: this.__definition.ALLOWED_TYPES[curType]};
                                } else {
                                    for (var k = 0; k < this.__definition["ON"].length; k++) {
                                        var cur = this.__definition["ON"][k];
                                        var f = null;
                                        var v = null;
                                        var cond = false;
                                        if (!Siviglia.empty(cur["FIELD"])) {
                                            f = cur["FIELD"];
                                            cond = !Siviglia.empty(val[f])
                                            if (cond)
                                                v = val[f];
                                        } else {
                                            cond = true;
                                            v = val;
                                        }


                                        var op = cur["IS"];
                                        var then = cur["THEN"];
                                        switch (op) {
                                            case "String": {
                                                if (!cond)
                                                    continue;
                                                if (v.__proto__.constructor.toString().indexOf("String") >= 0)
                                                    return {name: then, def: this.__definition.ALLOWED_TYPES[then]};
                                            }
                                                break;
                                            case "Array": {
                                                if (!cond)
                                                    continue;
                                                if (v.__proto__.constructor.toString().indexOf("Array") >= 0)
                                                    return {name: then, def: this.__definition.ALLOWED_TYPES[then]};
                                            }
                                                break;
                                            case "Object": {
                                                if (!cond)
                                                    continue;
                                                if (v.__proto__.constructor.toString().indexOf("Object") >= 0)
                                                    return {name: then, def: this.__definition.ALLOWED_TYPES[then]};
                                            }
                                                break;
                                            case "Present": {
                                                if (!cond)
                                                    continue;
                                                return {name: then, def: this.__definition.ALLOWED_TYPES[then]};
                                            }
                                                break;
                                            case "Not Present": {
                                                if (!cond)
                                                    return {name: then, def: this.__definition.ALLOWED_TYPES[then]};
                                                continue;
                                            }
                                                break;
                                        }
                                    }
                                    if (this.__definition.IMPLICIT_TYPE)
                                        return {
                                            name: this.__definition.IMPLICIT_TYPE,
                                            def: this.__definition.ALLOWED_TYPES[this.__definition.IMPLICIT_TYPE]
                                        };
                                }


                            }
                            throw new Siviglia.types.TypeSwitcherException(this.getFullPath(), Siviglia.types.TypeSwitcherException.ERR_INVALID_TYPE);

                        },
                        getValue: function () {
                            if (!this.__valueSet)
                                return null;
                            return this.subNode.getValue();
                        },
                        getPlainValue: function (dontSave) {
                            if(!this.subNode)
                                return null;
                            return this.subNode.getPlainValue(dontSave);
                        },

                        isValidType: function (v) {
                            var list = this.getAllowedTypes();
                            return typeof list[v]!=="undefined";
                        },
                        getAllowedTypes: function () {
                            if (Siviglia.type(this.__definition.ALLOWED_TYPES) === "array") {
                                var res = {};
                                this.__definition.ALLOWED_TYPES.map(function (item) {
                                    res[item] = item
                                });
                                return res;
                            }
                            return this.__definition.ALLOWED_TYPES;
                        },
                        getSource: function () {
                            var result = [];

                            if (!Siviglia.empty(this.__definition.ALLOWED_TYPES)) {
                                for (var k in this.getAllowedTypes()) {
                                    result.push({LABEL: k, VALUE: k});
                                }
                            }
                            return result;
                        },
                        __isEmptyValue:function(val)
                        {
                            if(val===null)
                                return true;
                            var typeInfo=this.getTypeFromValue(val);


                            var typeDef=Siviglia.issetOr(typeInfo["def"],typeInfo["name"]);
                            var curType = Siviglia.types.TypeFactory.getType({fieldName:this.fieldName,fieldPath:this.__fieldNamePath}, typeDef, this,null);

                            return curType.__isEmptyValue(val);
                        },
                        getCurrentType: function () {
                            return this.currentType;
                        },
                        getCurrentAllowedType:function(){
                            if(this.currentType===null)
                                return null;
                            // Si el tipo actual esta listado en ALLOWED_TYPES, ése es el allowed Type.
                            if(this.isValidType(this.currentType))
                                return this.currentType;
                            // Si no estaba listado, pero en ALLOWED_TYPES hay una key "*", devolvemos "*"
                            if(typeof this.__definition.ALLOWED_TYPES["*"]!=="undefined")
                                return "*";
                            // TODO : Este tipo tendria un valor no válido...raro.
                            return null;
                        },
                        getCurrentTypeObj: function () {
                            return this.subNode;
                        },
                        setCurrentType: function (type) {
                            // Este metodo es problematico.
                            // En caso de que exista un TYPE_FIELD, es tan simple como asignar un objeto vacio, con
                            // solo el campo tipo puesto:
                            if (!Siviglia.empty(this.__definition.TYPE_FIELD)) {
                                var newObj = {};
                                // Ojo, si el valor es "*", el campo TYPE se pondrá a "*" tambien...
                                // Si setCurrentType se ha llamado desde un formulario, al pintar el UI, en el campo TYPE habrá un "*"
                                newObj[this.__definition.TYPE_FIELD] = type;
                                this.setValue(newObj);
                            } else {
                                // Aqui empieza lo complicado.
                                // Es complicado porque las reglas de decision de tipo, basada en el valor, son faciles
                                // de chequear, cuando YA existe un valor.
                                // Este método, fuerza un tipo en el TypeSwitcher, SIN QUE HAYA UN VALOR.
                                // Por ejemplo, si existe un "ON" "FIELD"=>"X", IS=>"String", THEN=>"TYPEX", aqui sabemos
                                // que queremos asignar "TYPEX", pero no hay forma de crear un objeto que contenga un "X" valido
                                // Qué string tiene que ser? Qué requisitos debe cumplir?
                                // Y si en vez de una string es un objeto, qué objeto debe ser?
                                // Y si la condicion es que algo *no esté presente" o "esté presente"?
                                // La unica forma es "forzar" a que se ponga un tipo, independientemente del valor.
                                // Por otro lado, es una caracteristica de los TypeSwitchers basados en "ON", que el cambio
                                // del *valor* de los datos, no provoca un cambio en el tipo de dato del TypeSwitcher,
                                // como pasa en los TypeSwitchers basados en "TYPE_FIELD".
                                // Es por eso que no necesitamos eventize, por lo que no corremos el riesgo de inventarnos
                                // un valor ahora, que se vaya a "eventizar" en setValue.No es necesario eventizarlo, porque
                                // *una vez decidido el tipo, los cambios de los valores no importan*
                                // Es por eso, que vamos a usar un "truco".
                                // Vamos a pasar a setValue un objeto vacio, {}, pero vamos a forzar que getTypeFromValue, devuelva
                                // el tipo que queremos, en vez de pasar los tests de "ON", y luego establezca su valor a null
                                this.forceType = type;
                                return this.setValue({});
                            }


                        },
                        save: function () {
                            this.__saving=true;
                            if (!Siviglia.empty(this.subNode)) {
                                this.subNode.save();
                                this.__checkSource(this.subNode);
                            }
                            this.__saving=false;
                        }
                    }
                },
                Array: {
                    inherits: 'BaseType,Proxifier',
                    construct: function (name,definition, parent,value, validationMode) {
                        this["[[KEYS]]"] = [];
                        this.simpleContents = null;
                        Siviglia.Path.eventize(this, "[[KEYS]]");
                        this.Proxifier();
                        this.BaseType(name, definition, parent,value, validationMode);
                        var arrObj = Object.getOwnPropertyNames(Array.prototype);
                        var m=this;
                        for( var k=0;k<arrObj.length;k++ ) {
                            (function(prop){
                            Object.defineProperty(m, prop, {
                                get: function () {
                                    if(m.__currentProxy)
                                        return m.__currentProxy[prop];
                                },
                                set: function (v) {
                                    if(m.__currentProxy)
                                        m.__currentProxy[prop]=v;
                                },
                                enumerable: false,
                                configurable: true
                            });
                            })(arrObj[k]);
                        }
                    },
                    destruct:function()
                    {
                        if(this.__currentProxy)
                        {
                            for(var k=0;k<this.__currentProxy.length;k++)
                            {
                                this["*"+k].destruct();
                            }
                        }
                        //this.__destroy__();
                    },
                    methods: {
                        _validate: function () {
                            return true;
                        },
                      /*  __checkSource: function (val) {
                            // Esto solo deberia llamarse si el modo de validacion es complete.
                            if (this.__hasSource()) {
                                var s = this.__getSource();
                               for(var k=0;k<val.length;k++) {
                                   if (!s.contains(val[k])) {
                                       //this.setValue(null);
                                       var e = new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_INVALID_VALUE, {value: val[k]});
                                       this.__setErrored(e);
                                       this.__sourceException=true;
                                       throw e;
                                   }
                               }
                            }
                            return true;
                        },*/
                        _setValue: function (val,validationMode) {
                            // Corrección de valor cuando el array se inicializa desde un TypeSwitcher,
                            // el cual enviará como valor inicial el valor {}
                            if ( Siviglia.typeOf(val)==="object" && Object.keys(val).length===0 )
                                val=[];

                            if(val.length===0)
                            {
                                // Si es un array vacio, hacemos una copia.
                                // Esto es para no compartir el array con el "mundo exterior", de forma
                                // que se pueda asignar la referencia a más de 1 tipo
                                val=[];
                            }
                            else
                            {
                                if(typeof val.__basetype__!=="undefined") {
                                    val = JSON.parse(JSON.stringify(val.__basetype__.getPlainValue()));
                                }
                            }

                            this.__currentProxy = this.proxify(val,validationMode);
                            return this.__currentProxy;
                        },
                        /*apply: function (val,validationMode) {


                            var oldValidationMode=this.__validationMode;
                            if(typeof validationMode!=="undefined")
                                this.__validationMode=validationMode;
                            this.__currentProxy = this.proxify(val);
                            this.__validationMode=oldValidationMode;


                        },*/
                        // La clase base va a llamar a getKeys cuando se llama
                        // a deleteProperty.Pero en un array,no queremos calcular las keys
                        // ahi, sino cuando se modifica length. Por eso
                        // se crea una funcion dummy, que no hace nada, y otra
                        // alternativa, que se llama al modificar length

                        // Obtener las key-values de un array es algo complicado, cuando el array no tiene un tipo simple.
                        __clear: function () {
                            this.reset();
                            this.BaseType$__clear();
                        },
                        getKeys: function (val) {
                            if (this.simpleContents === null)
                                this.simpleContents = this.areContentsSimple();

                            if (!val) return [];
                            var res = [];
                            for (var k in val) {
                                if (k === "length" || Siviglia.empty(val["*" + k]))
                                    continue;
                                var v = val["*" + k].getValue();
                                if (this.simpleContents)
                                    res.push({"LABEL": v, "VALUE": v})
                                else {
                                    res.push(val["*" + k].getValue());
                                }
                            }
                            return res;
                        },
                        __proxyGet: function (val, m) {
                            var m = this;
                            var parentFunc = this.Proxifier$__proxyGet(val, m)
                            return function (target, prop, receiver) {
                                if (prop == "length")
                                    return target[prop];
                                if(prop.toString()=='Symbol(Symbol.toPrimitive)' || prop.toString()=='Symbol(Symbol.toStringTag)')
                                {
                                    return function(){return JSON.stringify(target)};
                                }

                                return parentFunc.apply(this, arguments);
                            }
                        },
                        __proxySet: function (val, m) {
                            var m = this;
                            var parentFunc = m.Proxifier$__proxySet(val, m);
                            return function (target, prop, value, receiver) {

                                if (prop == "length") {
                                    if (val.length !== value) {
                                        for(var k=value+1;k<=val.length;k++)
                                        {
                                            if(typeof val["*"+(k-1)]!=="undefined")
                                                val["*"+(k-1)].destruct();
                                        }

                                        val.length = value;
                                        // La mejor forma de recalcular las keys, es que, o cambie el numero de keys,
                                        // o alguien haya dicho que el objeto esta dirty.
                                        val["[[KEYS]]"] = m.getKeys();
                                        if (!m.disabledEvents) {
                                            try {
                                                target.__ev__.fireEvent("CHANGE", {
                                                    object: target,
                                                    property: prop,
                                                    value: undefined
                                                });
                                            }catch(e)
                                            {
                                                var tt=11;
                                            }
                                       //     m.onChange();
                                        }
                                    }
                                    return true;
                                }
                                return parentFunc.apply(this, arguments);
                            }

                        },
                        // La unica diferencia de esto, con la clase base, es que no se lanza un evento CHANGE al borrar una key
                        // Borrar una key en un array significa que se va a modificar length, y es entonces cuando se tiene que lanzar el evento.
                        __proxyDeleteProperty: function (val, m) {
                            return function (target, prop) {
                                var ret = val[prop];
                                delete val[prop];
                                if(typeof val["*"+prop]!=="undefined") {
                                    //  val["*" + prop].removeListeners(m);
                                    val["*" + prop].destruct();
                                    delete val["*" + prop];
                                    target["[[KEYS]]"] = m.getKeys(val);
                                }
                                return ret!==null?ret:true;
                            }
                        },
                        updateChildren: function (val,validationMode) {
                            var m = this;
                            var oldValidationMode=this.__validationMode;
                            if(typeof validationMode!=="undefined") {
                                this.__validationMode = validationMode;
                            }
                            var thrownException=null;
                            for (var k = 0; k < val.length; k++) {
                                try {
                                    this.__currentProxy[k] = val[k];
                                }catch(e)
                                {
                                    if(thrownException==null)
                                        thrownException=e;
                                }
                            }
                            this.__validationMode=oldValidationMode;
                            if (!thrownException && !this.eventsDisabled())
                                this.onChange();
                            if(thrownException!==null) {
                                this.disableEvents(false);
                                this.onChange();
                                throw thrownException;
                            }

                        },
                        getValue: function () {
                            return this.__value;
                        },
                        getPlainValue: function (dontSave) {
                            if(!this.__saving && typeof dontSave==="undefined")
                                this.save();
                            var res = [];
                            if (this.__value == null)
                                return null;
                            for (var k = 0; k < this.__currentProxy.length; k++) {
                                var val = this.__currentProxy["*" + k].getPlainValue(true);
                                if (val === null)
                                    continue;
                                res.push(val);
                            }
                            if (res.length == 0) {
                                if (this.__definition["SET_ON_EMPTY"] == true)
                                    return []
                                return null;
                            }
                            return res;
                        },


                        getValueInstance: function (idx, value) {
                            var name=(this.__currentProxy !== null)?idx:"0";
                            var ins=Siviglia.types.TypeFactory.getType({fieldName:name,path:this.__fieldNamePath}, this.__definition["ELEMENTS"], this,null);
                            if(value!==null)
                            ins.apply(value,this.__validationMode);
                            return ins;
                        },
                        areContentsSimple: function () {
                            var n;

                                n = this.getValueInstance(0,null);
                            var isContainer=n.isContainer();
                            n.destruct();
                            return !isContainer;
                        },
                        // Esta funcion indica que, al comprobar el source, hay que ver los *valores* del tipo.
                        // Esto es usado por proxySet.
                        getSourcedProperty:function()
                        {
                            return "VALUE";
                        },
                        __isEmptyValue:function(val)
                        {
                            if(val===null)
                                return true;
                            if(val.length > 0)
                                return false;
                            return Siviglia.issetOr(this.__definition["BLANK_IS_NULL"],false);
                        },
                        save: function () {
                            this.__saving=true;
                            var err = null;
                            if (!Siviglia.empty(this.__currentProxy)) {
                                for (var k = 0; k < this.__currentProxy.length; k++) {
                                    var newErr = this.__currentProxy["*" + k].save();
                                    if (err == null) {
                                        if(typeof newErr!=="undefined")
                                        err = newErr;
                                    }
                                    else
                                        err.concat(newErr);
                                }
                                this.__checkSource(this.__currentProxy);
                            }
                            this.__saving=false;
                            return err;
                        }
                    }
                },


                PHPVariable:
                    {
                        inherits: 'BaseType',
                        construct: function (name,def, parent,value, validationMode) {
                            this.BaseType(name, def, parent,value ? this.unserialize(value) : null, validationMode);
                        },
                        methods:
                            {
                                getHTMLTree: function (object) {
                                    if (!object)
                                        object = this.getValue();
                                    var json = "<ul>";
                                    for (var prop in object) {
                                        var value = object[prop];
                                        if (value === null) {
                                            json += "<li class='PHPVariable listItem'><span class='PHPVariable label'>" + prop + "</span><span class='PHPVariable value'>[null]</span></li>";
                                            continue;
                                        }
                                        switch (typeof (value)) {
                                            case "object":
                                                var token = Math.random().toString(36).substr(2, 16);
                                                json += "<li class='PHPVariable listItem'><a class='PHPVariable listContainer listContainerClose' href='#" + token + '\' onclick="$(this).toggleClass(\'listContainerClose\');$(\'#' + token + "').toggleClass('PHPVariableHidden');\">" + prop + " :</a>";
                                                json += "<div class='PHPVariable subContainer PHPVariableHidden' id='" + token + "' >" + this.getHTMLTree(value) + "</div></li>";
                                                break;
                                            default:
                                                json += "<li><span class='PHPVariable label'>" + prop + "</span><span class='PHPVariable value'>" + value + "</span></li>";
                                        }
                                    }
                                    return json + "</ul>";
                                },
                                unserialize: function (val) {
                                    if (val === undefined) return;

                                    var that = this,
                                        utf8Overhead = function (chr) {
                                            // http://phpjs.org/functions/unserialize:571#comment_95906
                                            var code = chr.charCodeAt(0);
                                            if (code < 0x0080) {
                                                return 0;
                                            }
                                            if (code < 0x0800) {
                                                return 1;
                                            }
                                            return 2;
                                        };
                                    error = function (type, msg, filename, line) {
                                        throw new that.window[type](msg, filename, line);
                                    };
                                    read_until = function (data, offset, stopchr) {
                                        var i = 2,
                                            buf = [],
                                            chr = data.slice(offset, offset + 1);

                                        while (chr != stopchr) {
                                            if ((i + offset) > data.length) {
                                                error('Error', 'Invalid');
                                            }
                                            buf.push(chr);
                                            chr = data.slice(offset + (i - 1), offset + i);
                                            i += 1;
                                        }
                                        return [buf.length, buf.join('')];
                                    };
                                    read_chrs = function (data, offset, length) {
                                        var i, chr, buf;

                                        buf = [];
                                        for (i = 0; i < length; i++) {
                                            chr = data.slice(offset + (i - 1), offset + i);
                                            buf.push(chr);
                                            length -= utf8Overhead(chr);
                                        }
                                        return [buf.length, buf.join('')];
                                    };
                                    _unserialize = function (data, offset) {
                                        var dtype, dataoffset, keyandchrs, keys, contig,
                                            length, array, readdata, readData, ccount,
                                            stringlength, i, key, kprops, kchrs, vprops,
                                            vchrs, value, chrs = 0,
                                            typeconvert = function (x) {
                                                return x;
                                            };

                                        if (!offset) {
                                            offset = 0;
                                        }
                                        dtype = (data.slice(offset, offset + 1))
                                            .toLowerCase();

                                        dataoffset = offset + 2;

                                        switch (dtype) {
                                            case 'i':
                                                typeconvert = function (x) {
                                                    return parseInt(x, 10);
                                                };
                                                readData = read_until(data, dataoffset, ';');
                                                chrs = readData[0];
                                                readdata = readData[1];
                                                dataoffset += chrs + 1;
                                                break;
                                            case 'b':
                                                typeconvert = function (x) {
                                                    return parseInt(x, 10) !== 0;
                                                };
                                                readData = read_until(data, dataoffset, ';');
                                                chrs = readData[0];
                                                readdata = readData[1];
                                                dataoffset += chrs + 1;
                                                break;
                                            case 'd':
                                                typeconvert = function (x) {
                                                    return parseFloat(x);
                                                };
                                                readData = read_until(data, dataoffset, ';');
                                                chrs = readData[0];
                                                readdata = readData[1];
                                                dataoffset += chrs + 1;
                                                break;
                                            case 'n':
                                                readdata = null;
                                                break;
                                            case 's':
                                                ccount = read_until(data, dataoffset, ':');
                                                chrs = ccount[0];
                                                stringlength = ccount[1];
                                                dataoffset += chrs + 2;

                                                readData = read_chrs(data, dataoffset + 1, parseInt(stringlength, 10));
                                                chrs = readData[0];
                                                readdata = readData[1];
                                                dataoffset += chrs + 2;
                                                if (chrs != parseInt(stringlength, 10) && chrs != readdata.length) {
                                                    error('SyntaxError', 'String length mismatch');
                                                }
                                                break;
                                            case 'a':
                                                readdata = {};

                                                keyandchrs = read_until(data, dataoffset, ':');
                                                chrs = keyandchrs[0];
                                                keys = keyandchrs[1];
                                                dataoffset += chrs + 2;

                                                length = parseInt(keys, 10);
                                                contig = true;

                                                for (i = 0; i < length; i++) {
                                                    kprops = _unserialize(data, dataoffset);
                                                    kchrs = kprops[1];
                                                    key = kprops[2];
                                                    dataoffset += kchrs;

                                                    vprops = _unserialize(data, dataoffset);
                                                    vchrs = vprops[1];
                                                    value = vprops[2];
                                                    dataoffset += vchrs;

                                                    if (key !== i)
                                                        contig = false;

                                                    readdata[key] = value;
                                                }

                                                if (contig) {
                                                    array = new Array(length);
                                                    for (i = 0; i < length; i++)
                                                        array[i] = readdata[i];
                                                    readdata = array;
                                                }

                                                dataoffset += 1;
                                                break;
                                            default:
                                                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                                                break;
                                        }
                                        return [dtype, dataoffset - offset, typeconvert(readdata)];
                                    };

                                    return _unserialize((val + ''), 0)[2];
                                },
                                _validate: function () {
                                  return true;
                                },
                            }
                    }
            }


    });
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.model',
        classes: {
            BaseTypedObject: {
                inherits: 'Siviglia.types.Container',
                construct: function (defOrUrl, value, validationMode) {
                    //this.EventManager();
                    this.PathAble();
                    this.__validationMode=Siviglia.issetOr(validationMode,Siviglia.types.BaseType.VALIDATION_MODE_COMPLETE);
                    this.__definedPromise = $.Deferred();

                    // Un basetypedobject siempre tiene definidos los campos. Es por eso que le damos un valor
                    // de objeto vacio en caso de que no se haya inicializado.

                    this.__tempValue = value;
                    if (typeof defOrUrl != "string")
                        this.__loadDefinition(defOrUrl);
                    else {
                        var Cache = Siviglia.globals.Cache;
                        var cached = Cache.get("ModelDefinition", defOrUrl);
                        if (typeof cached != "undefined") {
                            this.__loadDefinition(cached);
                        } else {
                            var m = this;
                            $.getJSON(defOrUrl).then(function (r) {
                                Cache.add("ModelDefinition", defOrUrl, r);
                                m.__loadDefinition(r);
                            });
                        }
                    }
                },
                methods: {
                    __loadDefinition: function (d) {
                        if (typeof d["TYPES"] !== "undefined") {
                            for (var k in d["TYPES"]) {
                                Siviglia.types.TypeFactory.installType(k, d["TYPES"][k]);
                            }
                        }
                        var value=null;
                        if(!Siviglia.empty(this.__tempValue))
                            value=this.__tempValue;
                        else
                        {
                            this.__definition=d;
                            if(!this.__hasDefaultValue())
                                value={}
                        }



                        this.Container("", d, null, value,this.__validationMode);
                        this.__definedPromise.resolve(this);
                    },
                    ready: function () {
                        return this.__definedPromise;
                    },
                    __getControllerForChild: function () {
                        return this;
                    },
                    __getPathPrefix: function () {
                        return "/";
                    },

                }
            }
        }
    }
);

Siviglia.types.BaseType.insCounter=0;
/* big.js v1.0.1 https://github.com/MikeMcl/big.js/LICENCE */
(function (e) {
    "use strict";

    function a(e) {
        var t, n, r, i = this;
        if (!(i instanceof a)) return new a(e);
        if (e instanceof a) {
            i.s = e.s, i.e = e.e, i.c = e.c.slice();
            return
        }
        if (e === 0 && 1 / e < 0) e = "-0"; else if (!o.test(e += "")) throw NaN;
        i.s = e.charAt(0) == "-" ? (e = e.slice(1), -1) : 1, (t = e.indexOf(".")) > -1 && (e = e.replace(".", "")), (n = e.search(/e/i)) > 0 ? (t < 0 && (t = n), t += +e.slice(n + 1), e = e.substring(0, n)) : t < 0 && (t = e.length);
        for (n = 0; e.charAt(n) == "0"; n++) ;
        if (n == (r = e.length)) i.c = [i.e = 0]; else {
            for (; e.charAt(--r) == "0";) ;
            i.e = t - n - 1, i.c = [];
            for (t = 0; n <= r; i.c[t++] = +e.charAt(n++)) ;
        }
    }

    function f(e, t, n, r) {
        var i = e.c, s = e.e + t + 1;
        if (n !== 0 && n !== 1 && n !== 2) throw"!Big.RM!";
        n = n && (i[s] > 5 || i[s] == 5 && (n == 1 || r || s < 0 || i[s + 1] != null || i[s - 1] & 1));
        if (s < 1 || !i[0]) e.c = n ? (e.e = -t, [1]) : [e.e = 0]; else {
            i.length = s--;
            if (n) for (; ++i[s] > 9;) i[s] = 0, s-- || (++e.e, i.unshift(1));
            for (s = i.length; !i[--s]; i.pop()) ;
        }
        return e
    }

    function l(e, t, n) {
        var i = t - (e = new a(e)).e, s = e.c;
        s.length > ++t && f(e, i, a.RM), i = s[0] ? n ? t : (s = e.c, e.e + i + 1) : i + 1;
        for (; s.length < i; s.push(0)) ;
        return i = e.e, n == 1 || n == 2 && (t <= i || i <= r) ? (e.s < 0 && s[0] ? "-" : "") + (s.length > 1 ? (s.splice(1, 0, "."), s.join("")) : s[0]) + (i < 0 ? "e" : "e+") + i : e.toString()
    }

    a.DP = 20, a.RM = 1;
    var t = 1e6, n = 1e6, r = -7, i = 21, s = a.prototype, o = /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i, u = new a(1);
    s.cmp = function (e) {
        var t, n = this, r = n.c, i = (e = new a(e)).c, s = n.s, o = e.s, u = n.e, f = e.e;
        if (!r[0] || !i[0]) return r[0] ? s : i[0] ? -o : 0;
        if (s != o) return s;
        t = s < 0;
        if (u != f) return u > f ^ t ? 1 : -1;
        for (s = -1, o = (u = r.length) < (f = i.length) ? u : f; ++s < o;) if (r[s] != i[s]) return r[s] > i[s] ^ t ? 1 : -1;
        return u == f ? 0 : u > f ^ t ? 1 : -1
    }, s.div = function (e) {
        var n = this, r = n.c, i = (e = new a(e)).c, s = n.s == e.s ? 1 : -1, o = a.DP;
        if (o !== ~~o || o < 0 || o > t) throw"!Big.DP!";
        if (!r[0] || !i[0]) {
            if (r[0] == i[0]) throw NaN;
            if (!i[0]) throw s / 0;
            return new a(s * 0)
        }
        var l, c, h, p, d, v = i.slice(), m = l = i.length, g = r.length, y = r.slice(0, l), b = y.length, w = new a(u),
            E = w.c = [], S = 0, x = o + (w.e = n.e - e.e) + 1;
        w.s = s, s = x < 0 ? 0 : x, v.unshift(0);
        for (; b++ < l; y.push(0)) ;
        do {
            for (h = 0; h < 10; h++) {
                if (l != (b = y.length)) p = l > b ? 1 : -1; else for (d = -1, p = 0; ++d < l;) if (i[d] != y[d]) {
                    p = i[d] > y[d] ? 1 : -1;
                    break
                }
                if (!(p < 0)) break;
                for (c = b == l ? i : v; b;) {
                    if (y[--b] < c[b]) {
                        for (d = b; d && !y[--d]; y[d] = 9) ;
                        --y[d], y[b] += 10
                    }
                    y[b] -= c[b]
                }
                for (; !y[0]; y.shift()) ;
            }
            E[S++] = p ? h : ++h, y[0] && p ? y[b] = r[m] || 0 : y = [r[m]]
        } while ((m++ < g || y[0] != null) && s--);
        return !E[0] && S != 1 && (E.shift(), w.e--), S > x && f(w, o, a.RM, y[0] != null), w
    }, s.minus = function (e) {
        var t, n, r, i, s = this, o = s.s, u = (e = new a(e)).s;
        if (o != u) return e.s = -u, s.plus(e);
        var f = s.c, l = s.e, c = e.c, h = e.e;
        if (!f[0] || !c[0]) return c[0] ? (e.s = -u, e) : new a(f[0] ? s : 0);
        if (f = f.slice(), o = l - h) {
            t = (i = o < 0) ? (o = -o, f) : (h = l, c);
            for (t.reverse(), u = o; u--; t.push(0)) ;
            t.reverse()
        } else {
            r = ((i = f.length < c.length) ? f : c).length;
            for (o = u = 0; u < r; u++) if (f[u] != c[u]) {
                i = f[u] < c[u];
                break
            }
        }
        i && (t = f, f = c, c = t, e.s = -e.s);
        if ((u = -((r = f.length) - c.length)) > 0) for (; u--; f[r++] = 0) ;
        for (u = c.length; u > o;) {
            if (f[--u] < c[u]) {
                for (n = u; n && !f[--n]; f[n] = 9) ;
                --f[n], f[u] += 10
            }
            f[u] -= c[u]
        }
        for (; f[--r] == 0; f.pop()) ;
        for (; f[0] == 0; f.shift(), --h) ;
        return f[0] || (f = [h = 0]), e.c = f, e.e = h, e
    }, s.mod = function (e) {
        e = new a(e);
        var t, n = this, r = n.s, i = e.s;
        if (!e.c[0]) throw NaN;
        return n.s = e.s = 1, t = e.cmp(n) == 1, n.s = r, e.s = i, t ? new a(n) : (r = a.DP, i = a.RM, a.DP = a.RM = 0, n = n.div(e), a.DP = r, a.RM = i, this.minus(n.times(e)))
    }, s.plus = function (e) {
        var t, n = this, r = n.s, i = (e = new a(e)).s;
        if (r != i) return e.s = -i, n.minus(e);
        var s = n.e, o = n.c, u = e.e, f = e.c;
        if (!o[0] || !f[0]) return f[0] ? e : new a(o[0] ? n : r * 0);
        if (o = o.slice(), r = s - u) {
            t = r > 0 ? (u = s, f) : (r = -r, o);
            for (t.reverse(); r--; t.push(0)) ;
            t.reverse()
        }
        o.length - f.length < 0 && (t = f, f = o, o = t);
        for (r = f.length, i = 0; r; i = (o[--r] = o[r] + f[r] + i) / 10 ^ 0, o[r] %= 10) ;
        i && (o.unshift(i), ++u);
        for (r = o.length; o[--r] == 0; o.pop()) ;
        return e.c = o, e.e = u, e
    }, s.pow = function (e) {
        var t = e < 0, r = new a(this), i = u;
        if (e !== ~~e || e < -n || e > n) throw"!pow!";
        for (e = t ? -e : e; ;) {
            e & 1 && (i = i.times(r)), e >>= 1;
            if (!e) break;
            r = r.times(r)
        }
        return t ? u.div(i) : i
    }, s.round = function (e, n) {
        var r = new a(this);
        if (e == null) e = 0; else if (e !== ~~e || e < 0 || e > t) throw"!round!";
        return f(r, e, n == null ? a.RM : n), r
    }, s.sqrt = function () {
        var e, t, n, r = this, i = r.c, s = r.s, o = r.e, u = new a("0.5");
        if (!i[0]) return new a(r);
        if (s < 0) throw NaN;
        s = Math.sqrt(r.toString()), s == 0 || s == 1 / 0 ? (e = i.join(""), e.length + o & 1 || (e += "0"), t = new a(Math.sqrt(e).toString()), t.e = ((o + 1) / 2 | 0) - (o < 0 || o & 1)) : t = new a(s.toString()), s = t.e + (a.DP += 4);
        do n = t, t = u.times(n.plus(r.div(n))); while (n.c.slice(0, s).join("") !== t.c.slice(0, s).join(""));
        return f(t, a.DP -= 4, a.RM), t
    }, s.times = function (e) {
        var t, n = this, r = n.c, i = (e = new a(e)).c, s = r.length, o = i.length, u = n.e, f = e.e;
        e.s = n.s == e.s ? 1 : -1;
        if (!r[0] || !i[0]) return new a(e.s * 0);
        e.e = u + f, s < o && (t = r, r = i, i = t, f = s, s = o, o = f);
        for (f = s + o, t = []; f--; t.push(0)) ;
        for (u = o - 1; u > -1; u--) {
            for (o = 0, f = s + u; f > u; o = t[f] + i[u] * r[f - u - 1] + o, t[f--] = o % 10 | 0, o = o / 10 | 0) ;
            o && (t[f] = (t[f] + o) % 10)
        }
        o && ++e.e, !t[0] && t.shift();
        for (f = t.length; !t[--f]; t.pop()) ;
        return e.c = t, e
    }, s.toString = s.valueOf = function () {
        var e = this, t = e.e, n = e.c.join(""), s = n.length;
        if (t <= r || t >= i) n = n.charAt(0) + (s > 1 ? "." + n.slice(1) : "") + (t < 0 ? "e" : "e+") + t; else if (t < 0) {
            for (; ++t; n = "0" + n) ;
            n = "0." + n
        } else if (t > 0) if (++t > s) for (t -= s; t--; n += "0") ; else t < s && (n = n.slice(0, t) + "." + n.slice(t)); else s > 1 && (n = n.charAt(0) + "." + n.slice(1));
        return e.s < 0 && e.c[0] ? "-" + n : n
    }, s.toExponential = function (e) {
        if (e == null) e = this.c.length - 1; else if (e !== ~~e || e < 0 || e > t) throw"!toExp!";
        return l(this, e, 1)
    }, s.toFixed = function (e) {
        var n, s = this, o = r, u = i;
        r = -(i = 1 / 0), e == null ? n = s.toString() : e === ~~e && e >= 0 && e <= t && (n = l(s, s.e + e), s.s < 0 && s.c[0] && n.indexOf("-") < 0 && (n = "-" + n)), r = o, i = u;
        if (!n) throw"!toFix!";
        return n
    }, s.toPrecision = function (e) {
        if (e == null) return this.toString();
        if (e !== ~~e || e < 1 || e > t) throw"!toPre!";
        return l(this, e - 1, 2)
    }, typeof module != "undefined" && module.exports ? module.exports = a : typeof define == "function" && define.amd ? define(function () {
        return a
    }) : e.Big = a
})(this);
Siviglia.types.typeCache = {};
Siviglia.types.installedTypes = {};
Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.types',
        classes: {
            _TypeFactory: {
                construct: function (config, callback) {

                },
                methods:
                    {
                        // Si el tipo es custom, su namespace es:
                        // Siviglia.types.model.web.User.MiTipo
                        installType: function (name, def) {
                            Siviglia.types.installedTypes[name] = def;
                        },
                        getType: function (fieldName, def,parent, val,validationMode) {
                            var type;
                            var mode = "obj";
                            var referencedField = null;
                            if(Siviglia.empty(validationMode))
                                validationMode=Siviglia.types.BaseType.VALIDATION_MODE_STRICT;

                            if (typeof def === "object") {
                                if (typeof def["TYPE"] === "undefined" && typeof def["MODEL"] !== "undefined" && typeof def["FIELD"] !== "undefined") {
                                    var remDefinition = Siviglia.Model.loader.getModelDefinition(def["MODEL"]);

                                    if (remDefinition) {
                                        if (typeof remDefinition["FIELDS"][def["FIELD"]] != "undefined") {
                                            referencedField = def;
                                            newDef = remDefinition["FIELDS"][def["FIELD"]];
                                            for (var k in def) {
                                                if (k != "MODEL" && k != "FIELD")
                                                    newDef[k] = def[k];
                                            }
                                            def = newDef;
                                            def["references"] = referencedField;
                                            type = def["TYPE"];
                                        }
                                    } else
                                        throw new Siviglia.model.BaseTypedException(this.getFullPath(), Siviglia.model.BaseTypedException.ERR_TYPE_NOT_FOUND, {type: type});
                                } else
                                    type = def['TYPE'];
                            } else {
                                type = def;

                                mode = "str";
                            }

                            if (type[0] == "/")
                                type = type.substr(1);
                            var typeDotted = type.replace(/[\\|/]/g, ".");
                            var fullTypeDotted = "Siviglia.types." + typeDotted;
                            var ctx = Siviglia.Utils.stringToContextAndObject(fullTypeDotted);
                            if (typeof ctx["context"][ctx["object"]] === "undefined") {
                                if (typeof Siviglia.types.installedTypes[type] !== "undefined") {
                                    return this.getType(fieldName, Siviglia.types.installedTypes[type], parent,val,validationMode);
                                }
                                if (typeof Siviglia.types.typeCache[type] == "undefined") {
                                    // Se mira si es un tipo custom definido por un paquete.En ese caso, el nombre
                                    // tendria la forma /models/xxx/types/yyyy
                                    $.ajax(
                                        {
                                            async: false,
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            type: 'GET',
                                            url: Siviglia.config.metadataUrl + "js/" + Siviglia.config.mapper + "/" + type,
                                            success: function (data) {
                                                if (data === null)
                                                    throw new Siviglia.model.BaseTypedException(null, Siviglia.model.BaseTypedException.ERR_TYPE_NOT_FOUND, {type: type});
                                                Siviglia.types.typeCache[type] = data;
                                            },
                                            complete: function (data) {

                                            },
                                            error: function (data) {
                                                throw new Siviglia.model.BaseTypedException(null, Siviglia.model.BaseTypedException.ERR_TYPE_NOT_FOUND, {type: type});
                                            }

                                        }
                                    );
                                }
                                ctx = Siviglia.Utils.stringToContextAndObject(fullTypeDotted);
                            }
                            // Se comprueba ahora si existe un Proxy para este tipo de objeto:
                            var newType;
                            // Si lo que nos pasaron como tipo fue simplemente una string, se instancia
                            // pasando como definicion un objeto vacio. Ese objeto llamara a BaseType con la
                            // definicion correcta que necesite.
                            if (mode != "obj")
                                def = {};
                            newType = new ctx.context[ctx.object](fieldName,def, parent,val, validationMode);
                            if (referencedField !== null)
                                newType.setReferencedField(referencedField);
                            return newType;
                        },
                        getRelationFieldTypeInstance: function (model, field) {
                            return Siviglia.types.TypeFactory.getType(
                              null,
                              {"MODEL": model, "FIELD": field},
                              null,
                              null,
                              null
                            );
                        }
                    }
            }
        }
    });
Siviglia.types.TypeFactory = new Siviglia.types._TypeFactory();
Siviglia.i18n = (Siviglia.i18n || {});
Siviglia.i18n.es = (Siviglia.i18n.es || {});
Siviglia.i18n.es.base = (Siviglia.i18n.es.base || {});
Siviglia.i18n.es.base.errors = {
    BaseTyped: {
        1: 'Por favor, complete este campo.',
        3: 'Estado no válido',
        4: 'Transición de estado no válida',
        5: 'Path no válido',
        10: 'No es posible cambiar de estado',
        11: 'No es posible cambiar a ese estado',
        12: 'Cambio de estado rechazado',
        13: 'No editable en el estado actual'
    },
    BaseType: {
        1: 'Por favor, complete este campo.',
        2: 'Campo no válido',
        5: 'Campo Requerido',
        9: 'Campo Requerido'
    },
    Integer: {
        100: 'Valor demasiado pequeño',
        101: 'Valor demasiado grande',
        102: 'Debes introducir un número'
    },
    String: {
        100: 'El campo debe tener al menos %min% caracteres',
        101: 'El campo debe tener un máximo de %max% caracteres',
        102: 'Valor incorrecto',
        103: 'El campo no puede tener el valor (%value%)'
    },
    DateTime: {
        100: 'La fecha debe ser posterior a %min%',
        101: 'La fecha debe ser anterior a %max%',
        102: 'Error de fecha con la hora',
        103: 'Error de fecha los segundos',
        104: 'La fecha debe ser pasada',
        105: 'La fecha debe ser futura',
        106: 'Error de fecha con los minutos'
    },
    File: {
        100: 'El fichero debe tener un tamaño mínimo de %min% Kb',
        101: 'El fichero debe tener un tamaño máximo de %max% Kb',
        102: 'Tipo de fichero incorrecto',
        103: 'Error al guardar el fichero',
        105: 'Error al guardar el fichero',
        106: 'Error al guardar el fichero',
        107: 'Error al guardar el fichero',
        108: 'Error al guardar el fichero',
        109: 'Error al guardar el fichero',
        110: 'Error al guardar el fichero',
        111: 'Error al guardar el fichero'
    },
    Image: {
        120: 'El fichero no es una imagen',
        121: 'La imagen debe tener al menos %min% pixeles de ancho',
        122: 'La imagen debe tener un máximo de %max% píxeles de ancho',
        123: 'La imagen debe tener un mínimo de %min% píxeles de altura',
        124: 'La imagen debe tener un máximo de %max% píxeles de altura'
    },
    TypeSwitcher: {
        101: 'Debes introducir un tipo',
        102: 'Tipo no permitido',
        103: 'Contenido del campo (%field%) desconocido',
        140: 'Tipo no definido'
    },
    Array: {
        101: 'Tipo inválido (%type%) para Array',
        102: 'Valor inválido para Array',
        103: 'El valor asignado al Array es un Diccionario'
    },
    BankAccount: {
        1: 'IBAN no válido',
        2: 'CCC no válido'
    },
    // Container también se añaden las excepciones?
    // lib\model\types\Container.php
    Container: {
        101: 'Por favor, complete este campo',
        102: 'Campo no válido',
        103: 'Tipo inválido para el campo',
        104: 'Error, no se puede asignar un campo en un container nulo'
    },
    Dictionary: {
        101: 'El Diccionario no acepta valores del tipo (%type%)',
        102: 'Valor incorrecto: %type%'
    },
    ModelField: {
        100: 'No se encuentra la referencia a %model% :: %field%'
    }


};
Siviglia.i18n.es.base.getErrorFromServerException = function (exName, exValue) {
    var messages = [];

    var parts = exName.split('\\');
    var lastPart = parts[parts.length - 1]
    var parts = lastPart.split("::");
    //var src = parts[0].replace(/TypeException$/, '').replace(/TypedException$/, '')
    var src=parts[0].replace(/Exception$/,'');
    var p = null;
    for (var j in exValue) {
        p = Siviglia.i18n.es.base.errors[src];
        if (!p)
            return null;
        var errM = Siviglia.i18n.es.base.errors[src][j];
        if (!errM)
            return null;
        messages.push(errM);
    }

    return errM;
}

Siviglia.i18n.es.base.getErrorFromJsException = function (ex) {
    // comprobacion para evitar error: https://hastebin.com/joqifuzoka.apache
    if (typeof ex.type !== "undefined")
        var src = ex.type.replace(/Exception$/, '');

        var p = Siviglia.i18n.es.base.errors[src];
        if (!p)
            return null;
        var str = Siviglia.i18n.es.base.errors[src][ex.code];
        if (ex.params) {
            for (var k in ex.params) {
                str = str.replace("%" + k + "%", ex.params[k]);
            }
        }
        return str;

}


Siviglia.Utils.buildClass(
    {
        context: 'Siviglia.types.states',
        classes:
            {
                StatedDefinitionException: {
                    construct: function (message) {
                        this.message = message;
                    }
                },

                StatedDefinition:
                    {
                        construct: function (model, definition) {
                            //code construct
                            this.model = model;
                            this.definition = definition;
                            this.pathPrefix = model.__getPathPrefix();
                            this.stateField = null;

                            this.oldState = null;
                            this.newState = null;
                            this.hasState=false;
                            this.newStateLabel = null;
                            this.oldStateLabel = null;
                            this.changingState = null;
                            this.enabled=false;
                        },
                        methods:
                            {
                                hasStates:function(){
                                    return this.hasState;
                                },
                                getStates:function(){
                                    if(this.hasState)
                                        return this.definition["STATES"];
                                    return null;
                                },
                                setOldState: function (state) {
                                    // code
                                    this.oldState = state;
                                    this.oldStateLabel = this.getStateLabel(state);
                                },
                                setNewState: function (state) {
                                    this.newState = state;
                                    this.newStateLabel = this.getStateLabel(state);
                                },

                                getNewState: function (state) {
                                    if (this.newState)
                                        return this.newState;
                                    return this.getStateType().getValue();
                                },
                                getOldState: function (state) {
                                    if (this.oldState!==null)
                                        return this.oldState;
                                    return this.getStateType().getValue();
                                },
                                reset: function () {
                                    this.oldState = null;
                                    this.oldStateLabel = null;
                                    this.newState = null;
                                    this.newStateLabel = null;
                                },
                                disable: function () {
                                    this.hasState = false;
                                },
                                enable: function () {
                                    if(this.enabled)
                                        return;
                                    this.hasState = !Siviglia.empty(this.definition["STATES"]) ? true : false;
                                    if (this.hasState) {
                                        this.stateField = this.definition["STATES"]["FIELD"];
                                        if (this.stateField[0] !== this.pathPrefix)
                                            this.stateField = this.pathPrefix + this.stateField;

                                        this.enabled=true;
                                    }
                                },
                                getStateType:function()
                                {
                                    return this.model.__getField(this.stateField);
                                },

                                getCurrentState: function () {
                                    if (!this.hasState)
                                        return null;
                                    return this.getStateType().getValue();
                                },
                                getStateField: function () {
                                    if (this.hasState)
                                        return this.definition["STATES"]["FIELD"];
                                    return null;
                                },
                                getDefaultState: function () {
                                    if (!this.hasState)
                                        return null;
                                    var stateType=this.getStateType();
                                    if (stateType.__hasDefaultValue())
                                        return stateType.__getDefaultValue();
                                    return 0;
                                },

                                getStateId: function (name) {
                                    return this.getStateType().getValueFromLabel(name);
                                },
                                isFinalState: function (label) {
                                    if (!Siviglia.isString(label))
                                        label = this.getStateLabel(label);
                                    return Siviglia.isset(this.definition["STATES"]["STATES"][label]["FINAL"]);
                                },
                                getStateLabel: function (id) {
                                    if (isNaN(id))
                                        return id;
                                    var labels = this.getStateType().getLabels();
                                    return labels[id];
                                },

                                getCurrentStateLabel: function () {
                                    return this.getStateLabel(this.getCurrentState());
                                },

                                checkState: function () {
                                    if (!this.hasState)
                                        return true;
                                    if (this.newState === null)
                                        return true;
                                    var newS = this.definition["STATES"]["STATES"][this.newStateLabel];
                                    if (Siviglia.empty(newS) ||
                                        Siviglia.empty(newS["FIELDS"]) ||
                                        Siviglia.empty(newS["FIELDS"]["REQUIRED"]))
                                        return true;
                                    var st = newS["FIELDS"]["REQUIRED"];
                                    for (var k = 0; k < st.length; k++) {
                                        var field = this.model.__getField(st[k]);
                                        if (!field.__hasValue()) {
                                            var e = new Siviglia.model.BaseTypedException(this.getStateType().__getFieldPath(),Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD);
                                            field.__setErrored(e);
                                            throw e;
                                        }
                                    }
                                },
                                isRequired: function (fieldName) {
                                    if (this.hasState === false)
                                        return this.model.__getField(fieldName).__isDefinedAsRequired();
                                    //return this.model.__getField(fieldName)._isset(this.definition["REQUIRED"]);
                                    return this.isRequiredForState(fieldName, this.getCurrentStateLabel());
                                },
                                isEditable: function (fieldName) {
                                    if (this.hasState === false)
                                        return true;
                                    return this.isEditableInState(fieldName, this.getCurrentStateLabel());
                                },

                                isFixed: function (fieldName) {
                                    if (this.hasState === false)
                                        return false;
                                    return this.isFixedInState(fieldName, this.getCurrentStateLabel());
                                },

                                isFixedInState: function (fieldName, stateName) {
                                    if (!this.hasState)
                                        return true;
                                    return this.existsFieldInStateDefinition(stateName, fieldName, "FIXED");
                                },
                                isEditableInState: function (fieldName, stateName) {
                                    if (!this.hasState)
                                        return true;
                                    if (fieldName[0] !== this.pathPrefix)
                                        fieldName = this.pathPrefix + fieldName;
                                    if (fieldName === this.stateField)
                                        return true;
                                    var res = this.existsFieldInStateDefinition(stateName, fieldName, "EDITABLE", true);
                                    return res;
                                },

                                isRequiredForState: function (fieldName, stateName) {
                                    if (!this.hasState)
                                        return this.model.__getField(fieldName).isRequired();

                                    if (this.existsFieldInStateDefinition(stateName, fieldName, "REQUIRED"))
                                        return true;
                                    return this.model.__getField(fieldName).__isDefinedAsRequired();
                                },
                                existsFieldInStateDefinition: function (stateName, fieldName, group, defResult) {
                                    if (fieldName[0] !== this.pathPrefix)
                                        fieldName = this.pathPrefix + fieldName;
                                    if (Siviglia.empty(this.definition["STATES"]["STATES"][stateName]))
                                        throw new Siviglia.model.BaseTypedException(this.getStateType().__getFieldPath(),Siviglia.model.BaseTypedException.ERR_UNKNOWN_STATE, {"state": stateName});
                                    var st = this.definition["STATES"]["STATES"][stateName];
                                    if (Siviglia.empty(st["FIELDS"]))
                                        return defResult;
                                    if (Siviglia.empty(st["FIELDS"][group]))
                                        return false;
                                    var g = st["FIELDS"][group];

                                    for (var k = 0; k < g.length; k++) {
                                        path = g[k];
                                        if (path == "*")
                                            return true;
                                        if (path[0] !== this.pathPrefix)
                                            path = this.pathPrefix + path;
                                        if (path == fieldName)
                                            return true;
                                        var r = new RegExp(path);
                                        if (r.test(fieldName))
                                            return true;
                                    }
                                    return false;
                                },
                                isChangingState: function () {
                                    return this.changingState;
                                },
                                changeState: function (next) {
                                    // Si no habia un estado previo, o sea, el estado anterior era nulo, este campo estaba en un
                                    // objeto nulo, o ha sido reseteado.
                                    if (this.oldState == null)
                                        this.oldState = this.model.__getField(this.stateField).getValue();
                                    if (this.oldState === null) {
                                        this.nextState = next;
                                        return;
                                    }
                                    var orig = next;
                                    if (Siviglia.isString(next)) {

                                            next = this.getStateId(next);
                                        if(next===-1)
                                        {
                                            var e = new Siviglia.model.BaseTypedException(this.getStateType().__getFieldPath(),Siviglia.model.BaseTypedException.ERR_UNKNOWN_STATE, {"state": orig});
                                            this.model.__setErrored(e);
                                            throw e;
                                        }
                                    }
                                    this.changingState = true;
                                    if (next === this.newState)
                                        return;
                                    // por ahora, hacemos esto: Si ya hay un newState, rechanzamos el nuevo cambio.

                                    if (this.newState)
                                        throw new Siviglia.model.BaseTypedException(this.getStateType().__getFieldPath(),Siviglia.model.BaseTypedException.ERR_DOUBLESTATECHANGE, {
                                            "current": this.getCurrentState(),
                                            "new": next,
                                            "middle": this.newState
                                        });
                                    // Esta linea obliga a que se inicialicen las variables oldState, recuperandolas del modelo, si no se habia hecho ya.
                                    this.setOldState(this.getOldState());
                                    if (this.isFinalState(this.oldState)) {
                                        this.changingState = false;
                                        this.newState = null;
                                        throw new Siviglia.model.BaseTypedException(this.getStateType().__getFieldPath(),Siviglia.model.BaseTypedException.ERR_CANT_CHANGE_FINAL_STATE, {
                                            "current": this.oldStateLabel,
                                            "new": this.newStateLabel
                                        });
                                    }
                                    var actualState = this.oldState;
                                    if (this.oldState === next && this.oldState !== null) {
                                        this.newState = null;
                                        this.changingState = false;
                                        return true;
                                    }
                                    this.setNewState(next);

                                    var newId = this.newState;
                                    // Si no se especifica nada sobre este estado, simplemente, se acepta el cambio.
                                    if (Siviglia.empty(this.definition["STATES"]["STATES"][this.newStateLabel])) {
                                        this.model.__getField(this.stateField).setValue(newId);
                                        this.newState = null;
                                        this.changingState = false;
                                        return;
                                    }
                                    var definition = this.definition["STATES"]["STATES"][this.newStateLabel];
                                    // Se ve si el estado actual es final o no.

                                    if (!Siviglia.empty(definition["FIELDS"]["REQUIRED"])) {
                                        var f = definition["FIELDS"]["REQUIRED"];
                                        for (n = 0; n < f.length; n++) {
                                            var field = this.model["*"+f[n]];
                                            if (!field.__hasValue()) {
                                                this.changingState = false;
                                                this.newState = null;
                                                var e = new Siviglia.model.BaseTypedException(this.model.__getField(f[n]).getFullPath(),Siviglia.model.BaseTypedException.ERR_REQUIRED_FIELD, {"field": f[n]});
                                                field.__setErrored(e);
                                                throw e;
                                            }
                                        }
                                    }
                                    if (!Siviglia.empty(definition["ALLOW_FROM"])) {
                                        if (definition["ALLOW_FROM"].indexOf(this.oldStateLabel) < 0) {
                                            // En JS ignoramos el REJECT_TO
                                            this.changingState = false;
                                            this.newState = null;
                                            var e = new Siviglia.model.BaseTypedException(this.getStateType().getFullPath(),Siviglia.model.BaseTypedException.ERR_CANT_CHANGE_STATE_TO, {
                                                "current": actualState,
                                                "new": next
                                            });
                                            this.getStateType().__setErrored(e);
                                            throw e;
                                        }
                                    }
                                    try {
                                        result = this.executeCallbacks("TESTS", this.newStateLabel, this.oldStateLabel);
                                    } catch (e) {
                                        this.changingState = false;
                                        this.newState = null;
                                        this.model.__setErrored(e);
                                        throw e;
                                    }
                                    if (!result) {
                                        this.changingState = false;
                                        this.newState = null;
                                        var e = new Siviglia.model.BaseTypedException(this.getStateType().getFullPath(),Siviglia.model.BaseTypedException.ERR_CANT_CHANGE_STATE, {
                                            "current": actualState,
                                            "new": next
                                        });
                                        this.model.__setErrored(e);
                                        throw e;
                                    }
                                    this.executeCallbacks("ON_LEAVE", this.oldStateLabel, this.newStateLabel);
                                    this.executeCallbacks("ON_ENTER", this.newStateLabel, this.oldStateLabel);
                                    this.changingState = false;
                                    this.oldState = this.newState;
                                    this.newState = null;
                                    this.getStateType().onStateChangeComplete();
                                },
                                executeCallbacks: function (type, state, refState) {
                                    if (Siviglia.empty(this.definition["STATES"]["LISTENER_TAGS"]))
                                        return true;
                                    if (Siviglia.empty(this.definition["STATES"]['STATES'][state]["LISTENERS"][type]))
                                        return true;

                                    var cbCollection = this.definition["STATES"]["LISTENER_TAGS"];
                                    var def = this.definition["STATES"]['STATES'][state]["LISTENERS"][type];
                                    var callbacks = this.getStatedDefinition(def, refState);
                                    //Hay que buscar quien es el modelo destino.
                                    var dest = this.model;
                                    while (dest.__getParent() !== null)
                                        dest = dest.__getParent();
                                    if (dest === null)
                                        throw new Siviglia.model.BaseTypedException(this.getStateType().getFullPath(),Siviglia.model.BaseTypedException.ERR_NO_STATE_CONTROLLER, {
                                            "state": state,
                                            "callbackType": type
                                        });
                                    var callMethod=function(cCallback)
                                    {
                                        var cDef = cbCollection[cCallback];
                                        var target = dest;
                                        if (!Siviglia.empty(cDef["PATH"]))
                                            target = dest.findPath(cDef["PATH"], true);
                                        var params = Siviglia.issetOr(cDef["PARAMS"], []);
                                        params=params.slice();
                                        params.unshift(dest);
                                        var result;
                                        if(cDef["TYPE"]==="METHOD") {
                                            result = target[cDef["METHOD"]].apply(target, params);
                                            if (type === "TESTS" && result === false)
                                                return false;
                                            return true;
                                        }
                                        if(cDef["TYPE"]=="PROCESS")
                                        {
                                            var res;
                                            for(var j=0;j<cDef["CALLBACKS"].length;j++) {
                                                result=callMethod(cDef["CALLBACKS"][j])
                                                if (type === "TESTS" && result === false)
                                                    return false;
                                            }
                                            return true;
                                        }
                                    }
                                    for (var k in callbacks) {
                                        var result=callMethod(callbacks[k]);
                                        if (type === "TESTS" && result === false)
                                            return false;
                                    }
                                    return true;
                                },


                                getStateTransitions: function (stateId) {
                                    if (!this.hasState)
                                        return null;

                                    if (!Siviglia.empty(this.definition["STATES"]["STATES"][this.getStateLabel(stateId)]["ALLOW_FROM"])) {
                                        var allowed = this.definition["STATES"]["STATES"][this.getStateLabel(stateId)]["ALLOW_FROM"];
                                        var result = [];
                                        allowed.forEach(function(element) {
                                            result.push(this.getStateId(element));
                                        }.bind(this));

                                        return result;
                                    }

                                    return null;
                                },

                                canTranslateTo: function (newStateId) {
                                    var currentState = this.getCurrentState();
                                    var transitions = this.getStateTransitions(newStateId);
                                    if (transitions === null)
                                        return true;

                                    return transitions.indexOf(currentState) >= 0;
                                },

                                getStatedDefinition: function (stateDef, stateToCheck) {
                                    if (!Siviglia.empty(stateDef["STATES"])) {
                                        if (!Siviglia.empty(stateDef["STATES"][stateToCheck]))
                                            return stateDef["STATES"][stateToCheck];

                                        if (!Siviglia.empty(stateDef["STATES"]["*"]))
                                            return stateDef["STATES"]["*"];

                                        // this is fine?
                                        return []
                                    }
                                    return stateDef;
                                },

                                getRequiredFields: function (state) {
                                    if (!Siviglia.empty(this.definition["STATES"]["STATES"][state]["FIELDS"]["REQUIRED"]))
                                        return this.definition["STATES"]["STATES"][state]["FIELDS"]["REQUIRED"];
                                    return [];
                                },
                                getRequiredPermissions: function () {
                                    var currentState = this.getCurrentState();
                                    if (!Siviglia.empty(this.definition["STATES"]["STATES"][this.getStateLabel(currentState)]["PERMISSIONS"]))
                                        return this.definition["STATES"]["STATES"][this.getStateLabel(currentState)]["PERMISSIONS"];
                                    return null;

                                }

                            }
                    }

            }
    })
