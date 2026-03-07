import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/config", (req, res) => {
    res.json({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || "" });
  });

  const serveStatic = () => {
    app.use(express.static(path.resolve(__dirname, "dist"), { index: false }));
    app.use((req, res) => {
      try {
        let html = fs.readFileSync(path.resolve(__dirname, "dist", "index.html"), "utf-8");
        res.send(html);
      } catch (e) {
        res.status(500).send("Error loading index.html. Did you run 'npm run build'?");
      }
    });
  };

  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found, falling back to static serving");
      serveStatic();
    }
  } else {
    serveStatic();
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
