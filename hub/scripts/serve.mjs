import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../site");
const port = Number.parseInt(process.env.PORT || "4173", 10);
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://localhost");
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const normalized = path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
  const candidate = path.resolve(siteRoot, `.${normalized}`);

  if (!candidate.startsWith(`${siteRoot}${path.sep}`) && candidate !== siteRoot) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const metadata = await stat(candidate);
    if (!metadata.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(path.extname(candidate)) || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    createReadStream(candidate).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Course hub preview: http://127.0.0.1:${port}`);
});
