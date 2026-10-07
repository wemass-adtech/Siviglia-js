import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const host = "localhost";
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT debe ser un número entre 1 y 65535.");
  process.exit(1);
}

function isInsideRoot(path) {
  return path === root || path.startsWith(root + sep);
}

const server = createServer(async (request, response) => {
  function reply(status, message, headers = {}) {
    response.writeHead(status, {
      "Content-Type": "text/plain; charset=utf-8",
      ...headers,
    });
    response.end(request.method === "HEAD" ? undefined : message);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    reply(405, "Método no permitido", { Allow: "GET, HEAD" });
    return;
  }

  let url;
  let pathname;
  try {
    url = new URL(request.url, `http://${host}:${port}`);
    pathname = decodeURIComponent(url.pathname);
    if (pathname.includes("\0")) throw new Error("Ruta inválida");
  } catch {
    reply(400, "Ruta inválida");
    return;
  }

  try {
    let path = resolve(root, "." + pathname);
    if (!isInsideRoot(path)) {
      reply(403, "Acceso no permitido");
      return;
    }
    path = await realpath(path);
    if (!isInsideRoot(path)) {
      reply(403, "Acceso no permitido");
      return;
    }
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        reply(301, "", { Location: url.pathname + "/" + url.search });
        return;
      }
      path = await realpath(resolve(path, "tests/index.html"));
    }
    if (!isInsideRoot(path)) {
      reply(403, "Acceso no permitido");
      return;
    }
    if (extname(path).toLowerCase() === ".php") {
      reply(501, "Este servidor estático no ejecuta PHP.");
      return;
    }
    const content = await readFile(path);
    response.writeHead(200, {
      "Content-Type":
        contentTypes[extname(path).toLowerCase()] || "application/octet-stream",
      "Content-Length": content.length,
      "Cache-Control": "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code)) {
      reply(404, "Archivo no encontrado");
    } else {
      console.error(error);
      reply(500, "Error al servir el archivo");
    }
  }
});

server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `El puerto ${port} está ocupado. Selecciona otro con PORT.`
      : error.message,
  );
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Catálogo de tests: http://${host}:${port}`);
});
