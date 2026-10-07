# Siviglia-js

## Servidor local

Desde la raíz del proyecto, ejecuta:

```sh
pnpm start
```

Abre http://localhost:4173 para consultar el catálogo. El servidor utiliza únicamente
módulos de Node.js, sirve los archivos del proyecto y escucha en `localhost`.
También puedes iniciarlo directamente con `node server.js`.

Para utilizar otro puerto:

```sh
PORT=8088 pnpm start
```

Detén el servidor con `Ctrl+C`.

El servidor es estático: los ejemplos PHP necesitan un intérprete PHP y los tests
con servicios remotos o dependencias externas siguen necesitando esos recursos.
