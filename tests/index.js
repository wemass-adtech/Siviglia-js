// Catálogo editable. Las rutas son relativas a index.html.
// ejecutor: true indica que el test figura en el testsList.js de su sección.
// Los archivos auxiliares, las plantillas y los ejecutores no son tests individuales.
// const tests = await (await ).json();

// fetch("tests/tests_definitions.json").then((response) => {
//   response.json().then((data) => {
//     window.tests = data;
//     renderizar();
//   });
// });

const secciones = {
  UI: { ruta: "src/ui/tests/", titulo: "Interfaz y widgets" },
  Core: { ruta: "tests/core/", titulo: "Núcleo y dependencias" },
  Types: { ruta: "tests/types/", titulo: "Sistema de tipos" },
};
const buscador = document.getElementById("search");
const filtroSeccion = document.getElementById("section-filter");
const catalogo = document.getElementById("catalog");
const navegacion = document.getElementById("section-links");

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function filtrarTests(texto, seccion) {
  const terminos = normalizar(texto).trim().split(/\s+/).filter(Boolean);
  return tests.filter(function (test) {
    const contenido = normalizar(
      [
        test.titulo,
        test.descripcion,
        test.ruta,
        test.seccion,
        test.categoria,
      ].join(" "),
    );
    return (
      (!seccion || test.seccion === seccion) &&
      terminos.every(function (termino) {
        return contenido.includes(termino);
      })
    );
  });
}

function crearElemento(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto !== undefined) elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}

function rutaArchivo(test) {
  return test.ruta.split("/").map(encodeURIComponent).join("/");
}

function rutaEjecutor(test) {
  const base = secciones[test.seccion].ruta;
  return (
    base + "index.html?path=" + encodeURIComponent(test.ruta.slice(base.length))
  );
}

function crearEnlace(texto, ruta, titulo) {
  const enlace = crearElemento("a", texto);
  enlace.href = ruta;
  if (titulo) enlace.setAttribute("aria-label", texto + ": " + titulo);
  return enlace;
}

function renderizar() {
  const visibles = filtrarTests(buscador.value, filtroSeccion.value);
  const fragmento = document.createDocumentFragment();
  navegacion.replaceChildren();

  for (const [nombre, configuracion] of Object.entries(secciones)) {
    const seleccionados = visibles.filter(function (test) {
      return test.seccion === nombre;
    });
    const total = tests.filter(function (test) {
      return test.seccion === nombre;
    }).length;
    const id = "seccion-" + nombre.toLowerCase();
    const acceso = crearEnlace(
      nombre + " · " + seleccionados.length + "/" + total,
      "#" + id,
    );
    acceso.addEventListener("click", function () {
      // La navegación siempre permite llegar a una sección, incluso si estaba filtrada.
      buscador.value = "";
      filtroSeccion.value = nombre;
      renderizar();
    });
    navegacion.append(acceso);
    if (!seleccionados.length) continue;

    const seccion = crearElemento("section", undefined, "test-section");
    seccion.id = id;
    seccion.setAttribute("aria-labelledby", id + "-titulo");
    const cabecera = crearElemento("div", undefined, "section-heading");
    const titulo = crearElemento("h2", nombre + " · " + configuracion.titulo);
    titulo.id = id + "-titulo";
    titulo.append(crearElemento("span", seleccionados.length, "badge"));
    cabecera.append(
      titulo,
      crearEnlace(
        "Abrir índice de " + nombre,
        configuracion.ruta + "index.html",
      ),
    );
    seccion.append(cabecera);

    const categorias = [
      ...new Set(
        seleccionados.map(function (test) {
          return test.categoria;
        }),
      ),
    ].sort(function (a, b) {
      return a.localeCompare(b, "es");
    });
    for (const categoria of categorias) {
      const grupo = seleccionados
        .filter(function (test) {
          return test.categoria === categoria;
        })
        .sort(function (a, b) {
          return a.titulo.localeCompare(b.titulo, "es", { numeric: true });
        });
      const contenedor = crearElemento("div", undefined, "category");
      const subtitulo = crearElemento("h3", categoria);
      subtitulo.append(crearElemento("span", grupo.length, "badge"));
      contenedor.append(subtitulo);
      const tabla = crearElemento("table");
      tabla.setAttribute("aria-label", nombre + ": " + categoria);
      const encabezado = crearElemento("thead");
      const filaEncabezado = crearElemento("tr");
      for (const texto of ["Test / ruta", "Descripción", "Acceso"]) {
        const celda = crearElemento("th", texto);
        celda.scope = "col";
        filaEncabezado.append(celda);
      }
      encabezado.append(filaEncabezado);
      const cuerpo = crearElemento("tbody");
      for (const test of grupo) {
        const fila = crearElemento("tr");
        const identidad = crearElemento("td");
        identidad.append(
          crearElemento("span", test.titulo, "test-title"),
          crearElemento("code", test.ruta, "test-path"),
        );
        const acciones = crearElemento("td", undefined, "actions");
        if (test.ejecutor)
          acciones.append(
            crearEnlace("Abrir test", rutaEjecutor(test), test.titulo),
          );
        acciones.append(crearEnlace("Archivo", rutaArchivo(test), test.titulo));
        fila.append(
          identidad,
          crearElemento("td", test.descripcion, "description"),
          acciones,
        );
        cuerpo.append(fila);
      }
      tabla.append(encabezado, cuerpo);
      contenedor.append(tabla);
      seccion.append(contenedor);
    }
    fragmento.append(seccion);
  }

  catalogo.replaceChildren(fragmento);
  document.getElementById("result-count").textContent =
    visibles.length + " de " + tests.length + " tests";
  document.getElementById("empty-state").hidden = visibles.length !== 0;
}

for (const nombre of Object.keys(secciones)) {
  const opcion = crearElemento("option", nombre);
  opcion.value = nombre;
  filtroSeccion.append(opcion);
}
buscador.addEventListener("input", renderizar);
filtroSeccion.addEventListener("change", renderizar);
document.getElementById("clear-filters").addEventListener("click", function () {
  buscador.value = "";
  filtroSeccion.value = "";
  renderizar();
  buscador.focus();
});

(async () => {
  const tests = await (await fetch("tests/tests_definitions.json")).json();
  window.tests = tests;
  renderizar();
})();
