Siviglia.Utils.buildClass(
    {
        context:'Siviglia.Data',
        classes:
            {
                SourceFactory:
                    {
                      methods:
                          {
                              /**
                               * Devuelve un SimpleListener, al que ponerle listeners de CHANGE, y hacerle "listen"
                               * @param source
                               * @param controller
                               * @param contextStack : stack de contextos.
                               */
                              getFromSource:function(source,controller,contextStack)
                              {
                                  var typeMap={
                                      "Array":"ArrayDataSource",
                                      "DataSource":"FrameworkDataSource",
                                      "Url":"RemoteDataSource",
                                      "Path":"PathDefinedDataSource",
                                      "Relationship":"RelationshipDataSource"

                                  };
                                  var type=typeMap[source.TYPE];
                                  if(typeof type=="undefined")
                                      throw "Unknown source type:"+source.TYPE;
                                  return new Siviglia.Data[type](source,controller,contextStack);
                              }
                          }
                    },
                /*
                    DataSource base:
                    Recibe como parametro un fetcher (ver mas abajo), que es la clase que se encarga de
                    obtener los datos.
                    Lanza eventos sobre la carga del datasource.

                 */

                BaseDataSource:
                    {
                        inherits:"Siviglia.Dom.EventManager",
                        constants:{
                            EVENT_START_LOAD:"START_FETCHING",
                            EVENT_LOADED:"EVENT_LOADED",
                            EVENT_LOADING:"LOADING",
                            EVENT_LOAD_ERROR:"LOAD_ERROR",
                            EVENT_INVALID_DATA:"INVALID_DATA",
                            CHANGE:"CHANGE"
                        },
                        construct:function(source,controller,stack)
                        {
                            this.source=this.processSource(source);
                            this.plainCtx=new Siviglia.Path.BaseObjectContext(controller,"#",stack);
                            this.stack=stack;
                            this.controller=controller;
                            this.pstring=null;
                            this.data=null;
                            this.valid=false;
                            this.searchString=null;
                            this.EventManager();
                            this.__unfiltered=null;
                            if(Siviglia.isset(this.source["UNIQUE"]))
                            {
                                this.controller.addListener("CHANGE",this,"fetch","BaseDataSource-Unique");
                            }
                        },
                        destruct:function()
                        {
                            if(this.plainCtx) {
                                this.stack.removeContext(this.plainCtx);
                                this.plainCtx.destruct();
                                this.plainCtx=null;
                            }
                            if(this.pstring) {
                                this.pstring.destruct();
                                this.pstring=null;
                            }
                            this.controller.removeListeners(this);
                        },
                        methods:
                            {
                                // isAsync es utilizado por el validate de los tipos.
                                // Si el source de un tipo es asincrono, no se valida el valor contra el source,
                                // para evitar entrar en un bucle.
                                isAsync:function()
                                {
                                    return false;
                                },
                                processSource:function(source)
                                {
                                    return source;
                                },
                                getParent:function()
                                {
                                    return this.controller;
                                },
                                fetch:function()
                                {

                                },
                                _dofetch:function(source)
                                {

                                },
                                onData:function(data) {
                                    this.valid = (data !== null);
                                    if (this.valid)
                                        this.data = this.filterByLabel(data);
                                    else
                                        this.data = data;
                                    if (typeof this.source["UNIQUE"] !== "undefined" && this.source["UNIQUE"] === true) {

                                            this.__unfiltered = this.data;
                                            this.controller.removeListeners(this);
                                            this.controller.addListener("CHANGE",this,"filterData","BaseDataSource");
                                            this.filterData(this.data,this.valid);

                                    }

                                    this.notify(this.data,this.valid);
                                    //var encoded=JSON.stringify(data);
                                    //if(encoded===this.lastData)
                                    //    return;
                                    ///this.lastData=encoded;
                                },
                                filterData:function(data,valid)
                                {
                                    if(valid) {
                                        var curVal = this.controller.__getSourcedValue();
                                        if (Siviglia.isArray(curVal)) {
                                            var valueField = this.getValueField();
                                            var newData = [];
                                            for (var k = 0; k < this.__unfiltered.length; k++) {
                                                if (curVal.indexOf(this.__unfiltered[k][valueField]) >= 0)
                                                    continue;
                                                newData.push(this.__unfiltered[k]);
                                            }
                                            this.data = newData;
                                        }
                                    }

                                },
                                notify:function(data,valid){
                                    this.fireEvent(Siviglia.Data.BaseDataSource.EVENT_LOADED,{value:data,valid:valid});
                                    this.fireEvent(Siviglia.Data.BaseDataSource.CHANGE,{value:data,valid:valid});
                                },
                                filterByLabel:function(data)
                                {
                                    if(this.searchString==null || this.searchString==="")
                                        return data;
                                   var result=[];
                                   var labelField=this.getLabelField();
                                   var r=new RegExp(this.searchString)
                                   for(var k=0;k<data.length;k++)
                                   {
                                       if(r.test(data[k][labelField]))
                                       {
                                           result.push(data[k]);
                                       }
                                   }
                                    return result;
                                },
                                onListener:function(event,param)
                                {
                                    source=param.value;
                                    this._dofetch(source);
                                },
                                getLabelField:function()
                                {
                                    return Siviglia.issetOr(this.source["LABEL"],"LABEL");
                                },
                                getLabelExpression:function()
                                {
                                    return Siviglia.issetOr(this.source["LABEL_EXPRESSION"],null);
                                },
                                getLabel:function(row)
                                {
                                    if(typeof this.source["LABEL_EXPRESSION"]==="undefined")
                                        return row[Siviglia.issetOr(this.source["LABEL"],"LABEL")];
                                    var ctxStack=new Siviglia.Path.ContextStack();
                                    var plainCtx = new Siviglia.Path.BaseObjectContext(row, "/", ctxStack);
                                    var p=new Siviglia.Path.ParametrizableString(this.source["LABEL_EXPRESSION"],ctxStack,{listenerMode:0})
                                    return p.parse();
                                },
                                getValueField:function()
                                {
                                    return Siviglia.issetOr(this.source["VALUE"],"VALUE");
                                },
                                addContext:function(ctx)
                                {
                                    this.stack.addContext(ctx);
                                },
                                contains:function(value)
                                {
                                    if(Siviglia.empty(this.data)) {
                                        this.fetch();
                                        if(Siviglia.empty(this.data))
                                            return false;
                                    }
                                    var valField = this.getValueField();
                                    if(this.source["UNIQUE"]===true)
                                    {
                                        // Si los valores son unicos, lo unico que nos importa saber es si el campo es un
                                        // array, que no haya valores duplicados.
                                        // Si fuera un dictionary, y se introdujeran valores duplicados, una key machaca a la otra,
                                        // asi que lo que controla el source, que son las keys, solo tiene que mirar si todas las keys
                                        // están contenidas, no buscar duplicados.
                                        // Los UNIQUE en diccionarios no sirven para validar, sino para mostrar un UI
                                        var allVals=this.controller.__getSourcedValue();
                                        if(allVals===null || allVals.length===0)
                                            return true;
                                        // Creamos una copia:
                                        var copied=allVals.slice(0);
                                        var unfiltered=this.__unfiltered;
                                        for (var k = 0; k < unfiltered.length && copied.length > 0; k++) {
                                            for(var j=0;j<copied.length;j++) {
                                                if (unfiltered[k][valField] === copied[j]) {
                                                    copied.splice(j,1);
                                                    // En cuanto encontramos uno, vemos si hay un duplicado, porque si lo hay, ya sabemos que hay error.
                                                    if(copied.indexOf(unfiltered[k][valField])>=0)
                                                        return false;
                                                    break;
                                                }
                                            }
                                        }
                                        return copied.length===0;
                                    }
                                    else {

                                        for (var k = 0; k < this.data.length; k++) {
                                            if (this.data[k][valField] === value)
                                                return true;
                                        }
                                    }
                                    return false;
                                },
                                isRemote:function()
                                {
                                    return false;
                                },
                                getDynamicField:function()
                                {
                                    return null;
                                },
                                search:function(str)
                                {
                                    this.searchString=str;
                                    this.fetch();
                                },
                                getUnfiltered:function()
                                {
                                    // Ojo, aqui no se comprueba que ya se haya cargado...Hay que asegurarse
                                    // de que aqui se llama sólo si se ha hecho un fetch.
                                    return this.__unfiltered;
                                }
                            }
                    },
                    ArrayDataSource:{
                        inherits:"BaseDataSource",
                        construct:function(source,controller,stack)
                        {

                            this.source=source;
                            this.BaseDataSource(source,controller,stack);
                            this.lastWasValid=true;
                            this.ev = new Siviglia.Dom.EventManager();

                            if(typeof source["DATA"] != "undefined") {
                                source["DATA"]=Siviglia.Path.Proxify(source["DATA"], this.ev);
                                this._initializeValues(source["DATA"]);

                            }
                            else {
                                if (typeof source["VALUES"] !== "undefined") {
                                    source["VALUES"]=Siviglia.Path.Proxify(source["VALUES"], this.ev);
                                    this.ev.addListener("CHANGE",null,function(){
                                        this.rebuildValues();
                                        this.fetch();

                                    }.bind(this),"Constructor ArrayDatasource");
                                    this.rebuildValues();


                                    if(typeof source["LABEL"]=="undefined")
                                        source["LABEL"]="LABEL";
                                    if(typeof source["VALUE"]=="undefined")
                                        source["VALUE"]="LABEL";
                                }
                            }

                        },
                        destruct:function()
                        {
                            if(this.ev!==null)
                                this.ev.destruct();
                        },
                        methods:
                            {
                                _initializeValues:function(data)
                                {
                                    this.valsArray=data;
                                },
                                rebuildValues:function()
                                {
                                    this.valsArray=[];
                                    var re=null;
                                    if(this.searchString)
                                        re=new RegExp("/"+this.searchString+"/");
                                    for(var k=0;k<this.source["VALUES"].length;k++) {
                                        if(!re || re.match(this.source["VALUES"][k]) )
                                            this.valsArray.push({"VALUE": k, "LABEL": this.source["VALUES"][k]});
                                    }

                                },
                                resolvePath:function(path)
                                {
                                    if(path==null)
                                        return this._initializeValues([]);

                                    var source=this.source["DATA"];
                                    if(path[0]=="/")
                                        path=path.substr(1);
                                    var parts=path.split("/");
                                    for(var k=0;k<parts.length;k++)
                                        source=source[parts[k]];
                                    this._initializeValues(source);
                                },
                                onChanged:function(evName,data)
                                {

                                    if(data.valid==false)
                                    {
                                        if(this.lastWasValid==false)
                                            return;
                                        this.lastWasValid=false;
                                        this.valsArray=null;
                                    }
                                    else {
                                        this.lastWasValid=true;
                                        this.valsArray = data.value;

                                    }
                                    this.onData(this.valsArray);
                                },
                                fetch:function()
                                {
                                    if(typeof this.source["PATH"]!=="undefined")
                                    {
                                        // Fetch solo crea y evalua la parametrizable string en caso de que aun no
                                        // se hubiera creado.En otro caso, los cambios a la fuente se han obtenido via
                                        // listeners
                                        if(!this.pstring) {
                                            var plainCtx = new Siviglia.Path.BaseObjectContext(this.source["DATA"], "/", this.stack);
                                            this.pstring = new Siviglia.Path.PathResolver(this.stack, this.source["PATH"]);
                                            this.pstring.addListener("CHANGE", this, "onChanged","ArrayDataSource -- PString");

                                            try {
                                                this.valsArray = this.pstring.getPath();
                                            } catch (e) {
                                                this.valsArray = null;
                                                this.onData(null);
                                            }
                                        }
                                    }
                                    else
                                        this.onData(this.valsArray);

                                }
                            }
                    },
                /*
                En el objectDefinedDataSource, el parametro source es un objeto de la
                complejidad que sea.El asunto es que ese objeto, se procesa y se convierte en una simple
                cadena, en processSource.
                Asi, cuanlquier referencia a un path dentro de la definicion, sera resuelta, y luego, en
                el _dofetch, y en el onListener, se deshace el cambio, volviendo a ser el objeto de la complejidad inicial.
                 */
                    ObjectDefinedDataSource:
                        {
                            inherits:"BaseDataSource",
                            methods:
                                {
                                    processSource:function(source)
                                    {
                                        return source;
                                    },
                                    onListener:function(evName, params)
                                    {
                                        var source=params.value;
                                        this._dofetch(JSON.parse(source));
                                    }

                                }

                        },
                /**
                 * Un PathDefinedDataSource, no utiliza una parametrizable string.Su resultado no es una string, es el valor de la
                 * variable apuntada por el path.
                 * Es decir, una url, por ejemplo del tipo : "http://www.a.com/[%/*a%]" , resuelve a una string.
                 * Un path del tipo "*a", resuelve al objeto "a".
                 */
                PathDefinedDataSource:
                        {
                           inherits:"BaseDataSource",
                            destruct:function()
                            {
                                if(this.pathController)
                                    this.pathController.destruct();
                            },
                            methods:
                                {
                                    fetch:function()
                                    {
                                        var source=this.source["PATH"];
                                        if(source[0]!="#")
                                            source="#"+source;
                                        if(!this.pathController) {
                                            var str = this.source["PATH"];
                                            this.pathController = new Siviglia.Path.PathResolver(this.stack, str);
                                            this.pathController.addListener("CHANGE", this, "onListener","PathDefinedDataSource");

                                            try {
                                                var res = this.pathController.getPath();
                                                if (this.pathController.isValid()) {
                                                    this.onData(res);
                                                }
                                            }catch(e)
                                            {
                                                this.onData(null);
                                            }
                                        }
                                        else
                                        {
                                            this.onData(this.data);
                                        }
                                    },
                                    // Su valor, es el que haya resuelto el listener de la parametrizable string.
                                    onListener:function(event,params)
                                    {
                                        if(params.valid) {
                                            var data = params.value;
                                            if(data===null)
                                                return this.onData([]);
                                            return this.onData(data);
                                        }
                                    }
                                }
                        },
                /*
                 Simple fetcher de una url.
                 La definicion de la url debe ser un objeto del tipo:
                 {
                    url:"....",
                    params:{"xx:"...","yy":"..."..}
                    options:{...}
                 }
                 Esto, a traves de ObjectDefinedDataSource, se convierte a Json, y se establecen los listeners,
                 para escuchar los posibles parametros.
                 Cuando los parametros se han resuelto, se llama a _dofetch.
                 */
                RemoteDataSource: {
                    inherits:'ObjectDefinedDataSource',
                    construct:function(source,controller,stack)
                    {
                        this.ObjectDefinedDataSource(source,controller,stack);


                    },
                    methods:
                        {
                            isAsync:function()
                            {
                                return true;
                            },
                            fetch:function()
                            {
                                if(!this.pstring) {
                                    var parametrized=JSON.stringify(this.source.URL);
                                    this.pstring = new Siviglia.Path.ParametrizableString(parametrized, this.stack);
                                    this.pstring.addListener("CHANGE",this,"onListener","RemoteDataSource");
                                }
                                try {
                                    this.pstring.parse();

                                }catch(e)
                                {
                                    this.onData(null);
                                }
                            },
                            _dofetch:function(def)
                            {
                                //if(typeof def=="string")
                                //    def=JSON.parse(def);
                                var m=this;
                                var parameters=def.PARAMS;
                                var options=def.OPTIONS;
                                var allP={};
                                if(parameters)
                                {
                                    for(var k in parameters)
                                        allP[k]=parameters[k];
                                }
                                if(options)
                                {
                                    for(var k in options)
                                        allP[k]=options[k];
                                }

                                var baseUrl=def;


                                this.fireEvent(Siviglia.Data.BaseDataSource.EVENT_LOADING);
                                try {
                                    $.ajax({
                                        async: true,
                                        dataType: 'json',
                                        data: '',
                                        type: 'GET',
                                        url: baseUrl,
                                        xhrFields: {
                                            withCredentials: true
                                        }
                                    }).then(function(data){

                                        if(this.searchString===null)
                                            m.onData(data);
                                    if(this.searchString===null)
                                        filtered=data;
                                    else {
                                        var re = new RegExp("/" + this.searchString + "/");
                                        var filtered = [];
                                        for (var k = 0; k < data.length; k++) {
                                            if (re.match(data[k][this.getLabelField()]))
                                                filtered.push(data[k]);
                                        }
                                    }
                                    this.onData(filtered);
                                    }.bind(this));
                                }catch(e)
                                {
                                    this.fireEvent(Siviglia.Data.BaseDataSource.EVENT_LOAD_ERROR);
                                }
                            },
                            isRemote:function()
                            {
                                return true;
                            },
                            hasAutoComplete:function()
                            {
                                return false;
                            }

                        }
                },
                    /*
                        FrameworkDataSource
                        Sobreescribe RemoteDataSource para crear una definicion compatible con RemoteDataSource,
                         cargar la metadata del Ds.

                     */
                    FrameworkDataSource:{
                        inherits:'BaseDataSource',
                        construct:function(source,controller,stack)
                        {
                            this.pstring=null;
                            this.BaseDataSource(source,controller,stack);
                            this.pstring=null;

                           this.ds=null;
                        },
                        destruct:function(){
                            if(this.ds!==null) {
                                this.ds.removeListeners(this);
                                this.ds.destruct();
                            }
                        },
                        methods:
                            {
                                isAsync:function()
                                {
                                    return true
                                },
                                processSource:function(source)
                                {
                                    if(typeof source.params=="undefined")
                                        source.params={}
                                    return source;
                                },
                                hasAutoComplete:function()
                                {
                                    return this.getDynamicField()!==null;
                                },
                                getDs:function()
                                {
                                    if(this.ds===null) {
                                        this.ds = new Siviglia.Model.DataSource(this.source["MODEL"], this.source["DATASOURCE"], null);
                                        if (typeof this.source["PARAMS"] !== "undefined") {
                                            // $this->parent apunta al tipo de dato al que pertenece el source.
                                            // $this->parent->parent apunta al container que contiene al tipo al que pertenece el source.
                                            var ctxStack = new Siviglia.Path.ContextStack();
                                            var ctx = new Siviglia.Path.BaseObjectContext(this.getParent().__parent, "#", ctxStack);
                                            var encoded = JSON.stringify(this.source["PARAMS"]);
                                            this.pstring = new Siviglia.Path.ParametrizableString(encoded, ctxStack);
                                            this.pstring.addListener("CHANGE", this, "onListener", "FrameworkDataSource");
                                        }
                                    }
                                    return this.ds;
                                },
                                fetch:function()
                                {


                                    if(this.pstring===null)
                                    {
                                        this._dofetch("{}");
                                        return;
                                    }
                                   try{
                                       this.pstring.parse();
                                   } catch(e)
                                   {
                                       this.onData(null);
                                   }
                                },
                                _dofetch:function(parameters)
                                {

                                    var p=JSON.parse(parameters);
                                    var ds=this.getDs();
                                    ds.freeze();
                                    for(var k in p)
                                        ds.params[k]=p[k];
                                    if(this.searchString!==null)
                                    {
                                        var f=this.getDynamicField();
                                        if(f)
                                            ds.params[f]=this.searchString;
                                    }
                                    console.log("FETCH:"+this.source["MODEL"]);
                                    ds.unfreeze().then(
                                        function(){
                                            console.log("FETCH-FINISHED:"+this.source["MODEL"]);
                                            this.onData(ds["*data"].getPlainValue(true))}.bind(this),
                                        function(){
                                            this.onData(null);
                                        }.bind(this)
                                        );
                                },
                                isLoadValid:function(data)
                                {
                                    return this.valid;
                                },
                                getDynamicField:function()
                                {
                                    var ds=this.getDs();
                                    var def=ds.getDefinition();
                                    var labelField=this.getLabelField();
                                    var targetDynField="DYN_"+labelField;
                                    if(Siviglia.isset(def.FIELDS.params.FIELDS[targetDynField]))
                                        return targetDynField;
                                    return null;
                                }

                            }
                    },
                RelationshipDataSource:{
                        inherits:"FrameworkDataSource",
                    construct:function(source,controller,stack)
                    {
                        var valField=null;
                        for(var k in source["FIELDS"])
                            valField=source["FIELDS"][k];
                        var s2= {
                            "TYPE": "DataSource",
                            "MODEL":source["MODEL"],
                            "DATASOURCE":Siviglia.issetOr(source["DATASOURCE"],"FullList"),
                            "LABEL":source["SOURCE"]["LABEL"],
                            "VALUE":valField
                        };
                        this.FrameworkDataSource(s2,controller,stack);
                    },
                    methods:{

                    }

                }

            }
    }
);
