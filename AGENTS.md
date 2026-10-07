# Instrucciones del proyecto

## Introducción

- El core de este framework se encuentra en la carpeta '/src'.
- El fichero Siviglia.js es el punto de entrada y el motor del framework.

## Ejecución

- Ejecuta las peticiones de implementación salvo que el usuario solicite planificación o exista una restricción vigente.
- Declara un bloqueo de modo o permisos solo cuando exista una instrucción vigente o una denegación de herramienta que lo demuestre.
- Si el usuario pide revisión sin cambios, presenta la propuesta y espera su confirmación antes de editar.
- Conserva los archivos modificados o sin seguimiento que no pertenezcan a la tarea.

## Catálogo de tests

- Usa ui/tests/, tests/core/ y tests/types/ como raíces de los tests.
- Mantén index.html como catálogo de escritorio, sin adaptación móvil ni dependencias externas.
- Declara cada entrada en la variable tests con ruta, titulo, descripcion, seccion y categoria.
- Usa UI, Core y Types como valores de seccion del catálogo.
- Genera el listado, las categorías, los filtros y los contadores a partir de tests.
- Consulta ui/tests/dependencies/js/testsList.js para obtener name, doc y path de los tests UI.
- Consulta tests/types/dependencies/js/testsList.js para obtener name, description y path de los tests Types.
- Lee el archivo de cada test ausente de esos registros antes de redactar su descripción.
- Marca ejecutor: true solo si la ruta figura en el testsList.js de la sección.
- Construye los enlaces de ejecución UI/Types con index.html?path= y la ruta relativa a la sección codificada.
- Los scripts de Core requieren contexto de ejecución; no les apliques el selector ?path= de UI/Types.
- Excluye dependencias, stubs, recursos, plantillas y ejecutores del recuento de tests individuales.
- Divide por sección o categoría cualquier búsqueda truncada antes de dar el inventario por completo.
- package.json declara pnpm@12.9.1 y su script test es un placeholder que termina con error.
- Comprueba los archivos nuevos sin seguimiento con git diff --no-index --check /dev/null <archivo>.
- Informa por separado de la validación del catálogo, las pruebas en navegador y la ejecución de las suites.
