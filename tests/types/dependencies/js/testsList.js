var testsList = [
  {
    name: "Container: Simple Container",
    description:
      "Prueba sencilla para comprobar que las librerias se inicializan correctamente",
    path: "container/simpleContainer.js",
  },
  {
    name: "Container: Prueba de campo requerido",
    description:
      "El campo two es requerido, lo cual provoca error.Hay que fijarse en que esta comprobacion se efectua al llamarse a save(), no antes, ya que no podemos saber a priori si esos campos se van a establecer después.Hay que tener en cuenta que la validacion de formularios, y cualquier intento de enviar un BTO al servidor, tiene primero que llamar a save() del objeto.",
    path: "container/pruebaDeCampoRequerido.js",
  },
  {
    name: "Container: Prueba de campo erroneo",
    description: "Se asigna un campo que no valida (cadena demasiado corta)",
    path: "container/pruebaDeCampoErroneo.js",
  },
  {
    name: "Container: Prueba de campo vacio",
    description: "Se asigna un valor nulo, y se testea la funcion HasOwnValue",
    path: "container/pruebaDeCampoVacio.js",
  },
  {
    name: "Container: Valor inicial nulo",
    description:
      "Se comprueba que un container al que no se le ha asignado un valor, tiene un valor nulo",
    path: "container/valorInicialNulo.js",
  },
  {
    name: "Container: Valor nulo de campos",
    description: "Se comprueba que campos no asignados tienen un valor nulo",
    path: "container/valorNuloDeCampos.js",
  },
  {
    name: "Container: Valor por defecto de campos",
    description:
      "Se comprueba que se aplica el valor por defecto cuando el campo se establece a nulo",
    path: "container/valorPorDefectoDeCampos.js",
  },
  {
    name: "Container: Valor nulo cuando todos los campos son nulos",
    description:
      "Se comprueba que, si los campos de un container son nulos, y no tienen KEEP_KEY_ON_EMPTY, el valor del container es nulo,al convertirlo a un valor plano.",
    path: "container/valorNuloCuandoTodosLosCamposSonNulos.js",
  },
  {
    name: "Container: Valor no nulo cuando todos los campos son nulos, preservando keys",
    description:
      "Se comprueba que, si los campos de un container son nulos, pero tienen PRESERVE_KEYS_ON_NULL, el valor del container no es nulo, al convertirlo en un valor plano.",
    path: "container/valorNoNuloCuandoTodosLosCamposSonNulos,PreservandoKeys.js",
  },
  {
    name: "Container: Container usando <code>BLANK_IS_NULL</code>",
    description:
      "Container: Valor nulo cuando: <br>1) <code>BLANK_IS_NULL</code> es true en el container, y no hay campos, o <br>2)<code>BLANK_IS_NULL</code> es true en el container, y los campos que se asignan, tambien tienen <code>BLANK_IS_NULL</code>, y estan en blanco.",
    path: "container/containerUsandoBLANK_IS_NULL.js",
  },
  {
    name: "Container: Obtencion de path",
    description: "Prueba de obtencion de campo a traves de un path",
    path: "container/obtencionDePath.js",
  },
  {
    name: "Container: Obtencion de path 2",
    description:
      "Obtencion de un path mas profundo.Se comprueba que existen las claves de un container que existe dentro de varios campos.",
    path: "container/obtencionDePath2.js",
  },
  {
    name: "Container: Obtencion de path 3",
    description:
      "Obtencion de un path relativo: Primero se navega hasta un cierto elemento de la estructura, y luego se pide un path relativo",
    path: "container/obtencionDePath3.js",
  },
  {
    name: "Container: Chequeo de fuente",
    description:
      "Establecimiento de un valor dependiente de una fuente. La fuente de un campo, es el valor de otro campo.Se prueba tanto un valor valido, como un valor no valido.",
    path: "container/chequeoDeFuente.js",
  },
  {
    name: "String: Varios test de String",
    description:
      "Se prueba la validacion de Strings, y como añadir un listener de CHANGE a un campo.Este listener se dispara tambien cuando hay un error. Un contador cuenta el numero de CHANGES, y el numero de errores.",
    path: "string/variosTestDeString.js",
  },
  {
    name: "String: Comprobacion de <code>BLANK_IS_NULL</code> en String",
    description:
      "Se comprueba el funcionamiento de <code>BLANK_IS_NULL</code> en Strings",
    path: "string/comprobacionDeBLANK_IS_NULLEnString.js",
  },
  {
    name: "BaseTypedObject: Comprobacion de nulos (1)",
    description: "Se prueba que un valor no asignado devuelve nulo",
    path: "baseTypedObject/comprobacionDeNulos(1).js",
  },
  {
    name: "BaseTypedObject: Comprobacion de nulos (2)",
    description: "Se prueba que un valor no asignado devuelve nulo",
    path: "baseTypedObject/comprobacionDeNulos(2).js",
  },
  {
    name: "BaseTypedObject: Comprobacion de nulos (3)",
    description: "Se prueba que un valor no asignado devuelve nulo",
    path: "baseTypedObject/comprobacionDeNulos(3).js",
  },
  {
    name: "TypeSwitcher: Comprobacion TS 1",
    description:
      "Primera comprobacion de funcionamiento de un typeswitcher.Se ve que una vez establecido el tipo, los campos internos existen. Hay que tener en cuenta que hay que establecer al menos 1 campo, ya que, si no, el container tendria todos los campos a nulo, y, sin <code>KEEP_KEY_ON_EMPTY</code>, el container en si seria nulo.",
    path: "typeSwitcher/comprobacionTS1.js",
  },
  {
    name: "TypeSwitcher: Comprobacion TS 2",
    description:
      "Comprobacion del funcionamiento de <code>IMPLICIT_TYPE</code>: Si a un typeswitcher se le asigna un valor que no tiene el campo definido como campo de tipo, se utiliza el tipo indicado por <code>IMPLICIT_TYPE</code>",
    path: "typeSwitcher/comprobacionTS2.js",
  },
  {
    name: "TypeSwitcher: Comprobacion TS 3",
    description:
      "Comprobacion de que en un typeswitcher, al cambiar de tipo (primero se crea un tipo implicito, y luego un TIPO4), los campos pertenecientes al primer tipo, ya no estan definidos.",
    path: "typeSwitcher/comprobacionTS3.js",
  },
  {
    name: "TypeSwitcher: Comprobacion TS 4",
    description: "Comprobacion de acceso a un TypeSwitcher a traves de campos",
    path: "typeSwitcher/comprobacionTS4.js",
  },
  {
    name: "TypeSwitcher: Comprobacion Listener TS 1",
    description:
      "Comprobacion del funcionamiento de listeners sobre typeswitchers: se establece un listener para escuchar cuando cambia el tipo del typeswitcher",
    path: "typeSwitcher/comprobacionListenerTS1.js",
  },
  {
    name: "TypeSwitcher: Comprobacion Listener TS 2",
    description:
      "Comprobacion del funcionamiento de listener de TypeSwitcher, al establecer el valor a nulo (hay que fijarse en que el listener se establece justo antes de establecer el valor a nulo.)",
    path: "typeSwitcher/comprobacionListenerTS2.js",
  },
  {
    name: "TypeSwitcher: Comprobacion Listener TS 3",
    description:
      "Se establecen listeners sobre campos internos del typeswitcher.Se comprueba tambien que no quedan listeners colgados",
    path: "typeSwitcher/comprobacionListenerTS3.js",
  },
  {
    name: "BaseTypedObject: Comprobacion <code>save()</code> en BaseTypedObject",
    description:
      "Se comprueba el funcionamiento de Save en BaseTypedObject.Al llamar a <code>save()</code> se hacen las comprobaciones de los campos requeridos.Se intenta primero salvar un objeto incompleto, lo que tiene que hacer saltar una excepcion.Al establecer el valor que falta, la excepcion no debe saltar, por lo que se debe haber mantenido el valor de la variable e1",
    path: "baseTypedObject/comprobacionSave()EnBaseTypedObject.js",
  },
  {
    name: "BaseTypedObject: Comprobacion de <code>getPath</code> en BaseTypedObject y TypeSwitcher",
    description:
      "Se comprueba el funcionamiento de <code>getFullPath</code>, que debe calcular el path completo de un campo.Aqui, el typeswitcher en si, no debe añadir nada al path.Ese campo debe ser transparente.",
    path: "baseTypedObject/comprobacionDeGetPathEnBaseTypedObjectYTypeSwitcher.js",
  },
  {
    name: "BaseTypedObject: Comprobacion de <code>KEEP_ON_EMPTY</code> en BaseTypedObject",
    description:
      "Se comprueba el funcionamiento de KEEP_ON_EMPTY.Un campo con el flag <code>KEEP_ON_EMPTY</code> se devuelve como NULL si no se ha asignado un valor.",
    path: "baseTypedObject/comprobacionDeKEEP_ON_EMPTYEnBaseTypedObject.js",
  },
  {
    name: "BaseTypedObject: Comprobacion de <code>DEFAULT</code> en BaseTypedObject",
    description:
      "Se establece el valor por defecto de un BaseTypedObject completo",
    path: "baseTypedObject/comprobacionDeDEFAULTEnBaseTypedObject.js",
  },
  {
    name: "Container: Comprobacion de <code>save()</code> en Container",
    description:
      "Se intenta guardar un objeto Container con un valor interno que es requerido.Cuando ese valor se establece, se deja de lanzar la excepcion",
    path: "container/comprobacionDeSaveEnContainer.js",
  },
  {
    name: "Container: Comprobacion de <code>getPath()</code> en Container",
    description: "Comprobacion de calculo correcto de paths de campos",
    path: "container/comprobacionDeGetPathEnContainer.js",
  },
  {
    name: "Container: Comprobacion de <code>SET_ON_EMPTY</code> y <code>KEEP_ON_EMPTY</code> en Container",
    description:
      "Comprobacion de <code>KEEP_ON_EMPTY</code> y <code>SET_ON_EMPTY</code>",
    path: "container/comprobacionDeSET_ON_EMPTYYKEEP_ON_EMPTYEnContainer.js",
  },
  {
    name: "Dictionary: Comprobacion de <code>getPath</code> y <code>DEFAULT</code> en Dictionary",
    description:
      "Comprobaciones de valor por defecto y <code>getPath</code> en tipos Dictionary",
    path: "dictionary/comprobacionDeGetPathYDEFAULTEnDictionary.js",
  },
  {
    name: "Dictionary: Comprobacion de <code>SET_ON_EMPTY</code> en Dictionary",
    description:
      "Comprobacion del flag <code>SET_ON_EMPTY</code> en diccionarios",
    path: "dictionary/comprobacionDeSET_ON_EMPTYEnDictionary.js",
  },
  {
    name: "Dictionary: Comprobacion de <code>ALLOW_NULL_VALUES</code> en Dictionary",
    description:
      "Comprobacion del flag <code>SET_ON_EMPTY</code> en diccionarios",
    path: "dictionary/comprobacionDeALLOW_NULL_VALUESEnDictionary.js",
  },
  {
    name: "Dictionary: Test simple de dictionary (1)",
    description:
      "Pruebas de funcionamiento simple de diccionarios, incluyendo listeners",
    path: "dictionary/testSimpleDeDictionary(1).js",
  },
  {
    name: "Dictionary: Test simple de dictionary (2)",
    description:
      "Se comprueba que no se disparan listeners en los objetos que mantienen copias",
    path: "dictionary/testSimpleDeDictionary(2).js",
  },
  {
    name: "Dictionary: Comprobacion de <code>BLANK_IS_NULL</code> en Dictionary",
    description:
      "Se comprueba la funcionalidad de <code>BLANK_IS_NULL</code> en Dictionary",
    path: "dictionary/comprobacionDeBLANK_IS_NULLEnDictionary.js",
  },
  {
    name: "TypeSwitcher: Comprobacion de <code>DEFAULT</code> en  TypeSwitcher (1)",
    description: "Prueba de vlor por defecto en TypeSwitcher",
    path: "typeSwitcher/comprobacionDeDEFAULTEnTypeSwitcher(1).js",
  },
  {
    name: "TypeSwitcher: Comprobaciones de TypeSwitcher (1)",
    description:
      "Varias comprobaciones del funcionamiento normal de TypeSwitchers",
    path: "typeSwitcher/comprobacionesDeTypeSwitcher(1).js",
  },
  {
    name: "TypeSwitcher: Comprobaciones de TypeSwitcher (2)",
    description:
      "Mismas comprobaciones que el test anterior, pero sin <code>CONTENT_FIELD</code> en el TypeSwitcher",
    path: "typeSwitcher/comprobacionesDeTypeSwitcher(2).js",
  },
  {
    name: "TypeSwitcher: Comprobaciones de TypeSwitcher (3)",
    description:
      "Comprobación del funcionamiento del valor * en <code>ALLOWED_TYPES</code>",
    path: "typeSwitcher/comprobacionesDeTypeSwitcher(3).js",
  },
  {
    name: "TypeSwitcher: Comprobacion de <code>BLANK_IS_NULL</code> en TypeSwitcher",
    description: "Se comprueba <code>BLANK_IS_NULL</code> en TypeSwitcher",
    path: "typeSwitcher/comprobacionDeBLANK_IS_NULLEnTypeSwitcher.js",
  },
  {
    name: "Array: Comprobaciones de Array (1)",
    description:
      "Comprobaciones basicas de array, incluyendo gestores de eventos,chequeos de errores,etc",
    path: "array/comprobacionesDeArray(1).js",
  },
  {
    name: "Array: Comprobaciones de Array (2)",
    description:
      "Comprobaciones del funcionamiento correcto de los metodos de Array",
    path: "array/comprobacionesDeArray(2).js",
  },
  {
    name: "Array: Comprobaciones de Array (3)",
    description:
      "Mismo test anterior, con elementos complejos de tipo Container.Se comprueban tambien los paths",
    path: "array/comprobacionesDeArray(3).js",
  },
  {
    name: "Array: Comprobaciones de Array (4)",
    description:
      'Se comprueba que cuando se hace <code>getValue()</code>code> de un tipo, y se sobreescribe el tipo, no se reciben nuevos eventos.<br>Supongamos un Array con valor [2,3,4]. Si alguien asigna a "obj" un <code>getValue()</code>code> de eso, se queda con ese array.Si al tipo Array se le asigna un nuevo valor ([5,6,7]), obj NO es notificado. Es decir, obj esta escuchando a su propia copia, no al BaseType.',
    path: "array/comprobacionesDeArray(4).js",
  },
  {
    name: "Array: Comprobaciones de Array(5)",
    description: "Se comprueba el funcionamiento de BLANK_IS_NULL",
    path: "array/comprobacionesDeArray(5).js",
  },
  {
    name: "Array: Comprobaciones de Array (6)",
    description:
      "Se comprueba el funcionamiento del borrado de elementos de un array,con TypeSwitchers y Containers",
    path: "array/comprobacionesDeArray(6).js",
  },
  {
    name: "Array: Comprobaciones de Array (7)",
    description:
      "Utilizacion de arrays planos js. Es importante ver que, para vincular un array js con un array controlado por un tipo, es necesario sobreescribir la variable inicial, con el valor devuelto por setValue(), o, en caso de usar el constructor de tipo para establecer el valor, reasignar la variable a lo que devuelva <code>getValue().</code><br>En el ejemplo, hay 2 lineas que parecen equivalentes:<br> t1.f3=arr;<br>arr=t1.f3<br>pero no lo son: al asignarse t1.f3, se construye un proxy alrededor del valor. Cuando se obtiene el valor de nuevo, t1.f3 devuelve el proxy, no el array original. por lo que en la primera linea, arr es un array javascript normal.Tras la segunda linea, arr es un proxy a ese array.",
    path: "array/comprobacionesDeArray(7).js",
  },
  {
    name: "Array: Comprobaciones de Array (8)",
    description:
      "Tests de comportamiento de Arrays, cuando se usan referencias.Se crea un basetypedobject con 2 arrays,y se comprueba que al asignar uno al otro, se crea una copia.",
    path: "array/comprobacionesDeArray(8).js",
  },
  {
    name: "Dictionary: Comprobaciones de Referencias a Dictionary",
    description:
      "Test equivalente al anterior, pero usando Dictionarys en vez de Arrays.",
    path: "dictionary/comprobacionesDeReferenciasADictionary.js",
  },
  {
    name: "Container: Container inicializado a partir de objeto plano javascript",
    description:
      "Se comprueba el funcionamiento de container inicializado a partir de un objeto plano javascript",
    path: "container/containerInicializadoAPartirDeObjetoPlanoJavascript.js",
  },
  {
    name: "Enum: Comprobaciones de Enum (1)",
    description: "Comprobaciones simples del tipo Enum",
    path: "enum/comprobacionesDeEnum(1).js",
  },
  {
    name: "Integer: Comprobaciones de Integer",
    description: "Comprobaciones simples del tipo Integer",
    path: "integer/comprobacionesDeInteger.js",
  },
  {
    name: "String: Comprobaciones de String",
    description: "Comprobaciones de String, incluyendo regexes",
    path: "string/comprobacionesDeString.js",
  },
  {
    name: "DateTime: Comprobaciones de DateTime",
    description:
      "Varias comprobaciones del funcionamiento del tipo DateTime, incluyendo limites, fechas pasadas y fechas futuras",
    path: "dateTime/comprobacionesDeDateTime.js",
  },
  {
    name: "Source: Source de Enum (1)",
    description:
      "Comprobacion del funcionamiento de fuentes del tipo Enum (que, por debajo utiliza sources de tipo Array)",
    path: "source/sourceDeEnum(1).js",
  },
  {
    name: "Source: Sources de String (Array)",
    description:
      "Se comprueba el funcionamiento de un Source sobre un tipo String. Se utiliza para que, aunque un campo sea una simple String, su valor tenga que estar incluido en una fuente. Esto lo hace ligeramente parecido a los Enum, aunque en los Enum hay un valor numerico asociado, y en los Strings con source, no.",
    path: "source/sourcesDeString(Array).js",
  },
  {
    name: "Source: Sources de String (Array Path)",
    description:
      "Comprobación de sources basadas en Path, para String. Se declaran campos cuyo valor depende de un path que se basa en hasta dos otros campos del mismo objeto,y el path, una vez sustituidos los campos, apunta a arrays que contienen los valores permitidos para el campo que contiene el path.",
    path: "source/sourcesDeString(ArrayPath).js",
  },
  {
    name: "Source: Source tipo PATH",
    description:
      "Pruebas de source de tipo path. Un campo entero apunta a otro campo, un array, que contiene los valores posibles. Se ve tambien como añadir listeners a los sources.",
    path: "source/sourceTipoPATH.js",
  },
  {
    name: "Source: Source tipo PATH, con valores unicos",
    description:
      "Pruebas de source de tipo path, con valores unicos.Tenemos un array con tipos simples (String), cuyo source son las keys de un diccionario. Hay que asegurarse de que en el array no hay elementos duplicados.",
    path: "source/sourceTipoPATH,ConValoresUnicos.js",
  },
  //   {
  //     name: "Source: Source tipo Remoto",
  //     description:
  //       "Comprobacion de source de tipo remoto, mezclado con parametros en la URL que define el source. A diferencia de otros sources, los remotos solo se comprueban si el validationMode es COMPLETE, o cuando se hace el save().Hay que tener en cuenta que cuando este objeto esta vacio, y mientras no se asigna el valor que completa la URL, el source pueder llamar a onChange, pero estara marcado como invalid. Como al finalizar el test, lo que hay es una promesa que tiene que cumplirse, no estaran destruidos todos los listeners (no se ha destruido el basetypedobject) cuando se salga de la funcion. Se añade un then a la promesa, para destruir el bto con sus listeners.",
  //     path: "source/sourceTipoRemoto.js",
  //   },
  {
    name: "TypeSwitcher: Typeswitcher extended 1",
    description:
      "Especificacion de typeswitcher basados en el tipo de dato de un cierto campo existente en el valor asignado al TypeSwicther.Esto es, en la clave <code>ON</code> del TypeSwitcher, existe un campo <code>FIELD</code>",
    path: "typeSwitcher/typeswitcherExtended1.js",
  },
  {
    name: "TypeSwitcher: Typeswitcher extended 2",
    description:
      "Se utiliza no solo el tipo, sino la existencia o no de un campo, para decidir el tipo del typeswitcher",
    path: "typeSwitcher/typeswitcherExtended2.js",
  },
  {
    name: "TypeSwitcher: Typeswitcher extended 3",
    description:
      "Especificacion de typeswitcher basados en el tipo de dato asignado al typeswitcher (y no de un cierto campo, como hace 2 tests).Esto es, en la clave <code>ON</code> del TypeSwitcher, <strong>NO</strong> existe un campo <code>FIELD</code>",
    path: "typeSwitcher/typeswitcherExtended3.js",
  },
  {
    name: "Array: Array Serialization",
    description:
      "Se prueba la serializacion a json (getPlainValue), combinando diccionario/container/array",
    path: "array/arraySerialization.js",
  },
  {
    name: "Container: Accesos a traves de paths",
    description:
      "Se comprueba el acceso correcto a campos especificados por paths.<br><strong>ESTE EJEMPLO ES IMPORTANTE</strong> porque en la version por el lado del servidor, <strong>NO ES NECESARIO</strong> dar un valor al container, para poder acceder a sus campos. Esto se hace asi, porque, mientras en PHP esto es codigo valido: <code>$a['q']='hola';</code> el equivalente javascript, <code>a.q='hola'</code> da error, ya que hay que inicializar <code>a</code> a un objeto. Por mantener la misma semantica que el lenguaje original, la libreria de tipos exige, antes de acceder a los campos, que el container padre tenga valor.",
    path: "container/accesosATravesDePaths.js",
  },
  {
    name: "Container: Comprobaciones de campos dirty",
    description:
      "Diferentes comprobaciones de que los campos se establecen a dirty correctamente",
    path: "container/comprobacionesDeCamposDirty.js",
  },
  {
    name: "Container: Comprobaciones de campos dirty anidados",
    description:
      "Se comprueba que los campos dirty son asignados cada uno a su controller, con los paths correctos",
    path: "container/comprobacionesDeCamposDirtyAnidados.js",
  },
  {
    name: "Container: Comprobaciones basicas de estado",
    description:
      "En este test, se introducen muchas aserciones sobre la API basica de estado, por no crear un test separado por cada cosa a probar. De nuevo, aqui hay una diferencia grande con respecto al servidor: Hay que darle un valor al container para poder preguntar por su estado.",
    path: "container/comprobacionesBasicasDeEstado.js",
  },
  {
    name: "Container: Comprobaciones funcionales de estado",
    description:
      "Se ejecutan operaciones dependientes de estado, para comprobar que campos requeridos, transiciones posibles, etc, se respetan.",
    path: "container/comprobacionesFuncionalesDeEstado.js",
  },
  {
    name: "Container: Comprobaciones funcionales de estado (2)",
    description:
      "Test identico al anterior,pero los cambios de estado se provocan asignando valores completos al container, no campo a campo.",
    path: "container/comprobacionesFuncionalesDeEstado(2).js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion simple de campo sucio",
    description: "Prueba de contabilizacion correcta de campos sucios",
    path: "baseTypedObjectModel/comprobacionSimpleDeCampoSucio.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion simple de campo con error",
    description:
      "Se crea un BTO y se asigna un campo a un valor no valido.Se comprueba la excepcion, y que el campo se ha marcado como con error.Se le asigna después un valor correcto, y se comprueba que la condición de error se ha limpiado.",
    path: "baseTypedObjectModel/comprobacionSimpleDeCampoConError.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de errores generados por cambios de estado",
    description:
      "Se comprueba que los errores generados por cambios de estado, se asignan correctamente a los campos que los generan.",
    path: "baseTypedObjectModel/comprobacionDeErroresGeneradosPorCambiosDeEstado.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de errores generados por cambios de estado (2)",
    description:
      "Se comprueba que los errores generados por cambios de estado, se asignan correctamente a los campos que los generan.La excepcion lanzada, y la que se almacena en el objeto, es la misma (de hecho, es el mismo objeto)",
    path: "baseTypedObjectModel/comprobacionDeErroresGeneradosPorCambiosDeEstado(2).js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de cambio de estado ok",
    description:
      "Se comprueba que la definicion usada en los ejemplos anteriores cambia de estado de forma correcta, cuando los campos que requiere estan presentes",
    path: "baseTypedObjectModel/comprobacionDeCambioDeEstadoOk.js",
  },
  {
    name: "BaseTypedObjectModel: Otra comprobacion de cambio de estado incorrecto",
    description:
      "Utilizando la misma definicion, se intenta pasar de un estado (Another) a otro (Other), que solo permite transicionar a él desde el estado None,lo que provoca la excepcion",
    path: "baseTypedObjectModel/otraComprobacionDeCambioDeEstadoIncorrecto.js",
  },
  {
    name: "BaseTypedObjectModel: Error al intentar una transicion de estado no permitida",
    description:
      "Se intenta pasar de un estado a otro, cuando esa transicion no esta permitida.",
    path: "baseTypedObjectModel/errorAlIntentarUnaTransicionDeEstadoNoPermitida.js",
  },
  {
    name: "BaseTypedObjectModel: Error al cambiar a estado no definido",
    description:
      "Se intenta pasar a un estado no definido, lanzandose un error de UNKNOWN_STATE",
    path: "baseTypedObjectModel/errorAlCambiarAEstadoNoDefinido.js",
  },
  {
    name: "BaseTypedObjectModel: Tests de llamada de callbacks",
    description:
      "Al cambiar el estado del objeto, se llaman diferentes callbacks:ON_ENTER,ON_LEAVE y TESTS.Los callbacks de TEST se llaman para verificar que el cambio de estado se permite.En la definicion usada en este ejemplo, hay un test que siempre devuelve falso, asociado al paso al estado Another. Es por eso que salta una excepcion al intentar ir a ese estado.",
    path: "baseTypedObjectModel/testsDeLlamadaDeCallbacks.js",
  },
  {
    name: "BaseTypedObjectModel: Segundo test de callbacks de estado",
    description:
      "Esta vez, se aplica otro callback de TEST, que en este caso retorna true, por lo que se acepta el cambio de estado.El callback de test, ademas, establece el valor de una variable. Se comprueba que esa variable ha cambiado, por lo que el callback se ha llamado.",
    path: "baseTypedObjectModel/segundoTestDeCallbacksDeEstado.js",
  },
  {
    name: "BaseTypedObjectModel: Tercer test de callbacks de estado",
    description:
      "Esta vez, se ejecuta tanto un METHOD como un PROCESS, especificados en el ON_ENTER del estado Another",
    path: "baseTypedObjectModel/tercerTestDeCallbacksDeEstado.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de que no es posible salir de un estado final",
    description: "",
    path: "baseTypedObjectModel/comprobacionDeQueNoEsPosibleSalirDeUnEstadoFinal.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de callbacks especificados con *",
    description:
      "La especificacion de callbacks asociados a ENTER,LEAVE o TEST, puede ser diferente segun el estado del que se sale o al que se llega. Esos estados se pueden especificar con el nombre del estado, o con el caracter *, para cualquier otro estado que no se haya especificado.",
    path: "baseTypedObjectModel/comprobacionDeCallbacksEspecificadosCon-star-.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de callbacks independientes",
    description:
      "La especificacion de callbacks asociados a ENTER,LEAVE o TEST, puede ser independiente del estado al que se llega o del que se sale",
    path: "baseTypedObjectModel/comprobacionDeCallbacksIndependientes.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de path simple",
    description: "Simple obtencion del valor de un campo, a traves del path",
    path: "baseTypedObjectModel/comprobacionDePathSimple.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de paths complejos",
    description:
      "Obtencion de valores a partir de paths, atravesando arrays y diccionarios",
    path: "baseTypedObjectModel/comprobacionDePathsComplejos.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de paths complejos 2",
    description:
      "Obtencion de valores a partir de un path que contiene una referencia a otro campo",
    path: "baseTypedObjectModel/comprobacionDePathsComplejos2.js",
  },
  {
    name: "BaseTypedObjectModel: Comprobacion de paths complejos 3",
    description:
      "Obtencion de valores a partir de un path que contiene una referencia a otro campo",
    path: "baseTypedObjectModel/comprobacionDePathsComplejos3.js",
  },
  {
    name: "Container: Valor vacio en valor por defecto.",
    description:
      "Comprobacion de que si los valores de un container, son siempre los valores por defecto, el valor del container es nulo",
    path: "container/valorVacioEnValorPorDefecto..js",
  },
  {
    name: "Source: Comprobacion de source en Arrays, al asignar arrays completos",
    description:
      "Se comprueba que, al asignar un array, las funciones de comprobacion de fuentes comprueban todos los elementos del array",
    path: "source/comprobacionDeSourceEnArrays,AlAsignarArraysCompletos.js",
  },
  {
    name: "BaseTypedObject: Revocacion de proxy",
    description:
      "Una vez que se borra un valor de un tipo, las referencias a él provocan un error al accederse a ellas.La forma correcta de mantener el valor, es a traves de getPlainValue()",
    path: "baseTypedObject/revocacionDeProxy.js",
  },
  {
    name: "Array: Array con campos container",
    description: "Array cuyos elementos son de tipo container",
    path: "array/arrayConCamposContainer.js",
  },
];
