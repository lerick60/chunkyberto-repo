import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser("chunkyberto-secret"));

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    `${process.env.APP_URL}/api/youtube/callback`
  );

  const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

  // API Routes
  app.get("/api/youtube/auth-url", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });
    res.json({ url: authUrl });
  });

  app.get("/api/youtube/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      // Store tokens in a secure cookie
      res.cookie("yt_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res.send(`
        <html>
          <body style="background: #020617; color: white; font-family: sans-serif; display: flex; items-center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center;">
              <h1 style="color: #ef4444;">YouTube Conectado</h1>
              <p>Autenticación exitosa. Esta ventana se cerrará automáticamente.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'YOUTUBE_AUTH_SUCCESS' }, '*');
                  setTimeout(() => window.close(), 1000);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/youtube/status", (req, res) => {
    const tokens = req.cookies.yt_tokens;
    res.json({ connected: !!tokens });
  });

  app.post("/api/youtube/upload", upload.single("video"), async (req, res) => {
    const tokens = req.cookies.yt_tokens;
    if (!tokens) {
      return res.status(401).json({ error: "Not authenticated with YouTube" });
    }

    const { title, description, tags, privacy } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "No video file provided" });
    }

    try {
      const auth = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET
      );
      auth.setCredentials(JSON.parse(tokens));

      const youtube = google.youtube({ version: "v3", auth });

      // Write the buffer to a temp file for reliable streaming to YouTube API
      const tempPath = path.join(__dirname, `temp_${Date.now()}.webm`);
      fs.writeFileSync(tempPath, videoFile.buffer);

      const uploadRes = await youtube.videos.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
            tags: tags ? tags.split(",").map(t => t.trim()) : [],
            categoryId: "22",
          },
          status: {
            privacyStatus: privacy || "private",
          },
        },
        media: {
          body: fs.createReadStream(tempPath),
        },
      });

      // Cleanup temp file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      res.json({ success: true, videoId: uploadRes.data.id });
    } catch (error) {
      console.error("YouTube Upload Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const serveStatic = () => {
    app.use(express.static(path.resolve(__dirname, "dist"), { index: false }));
    app.use((req, res) => {
      try {
        let html = fs.readFileSync(path.resolve(__dirname, "dist", "index.html"), "utf-8");
        
        const envScript = `<script>
          window.process = window.process || { env: {} };
          window.process.env.GEMINI_API_KEY = ${JSON.stringify(process.env.GEMINI_API_KEY || '')};
          window.process.env.API_KEY = ${JSON.stringify(process.env.API_KEY || '')};
          window.process.env.APP_URL = ${JSON.stringify(process.env.APP_URL || '')};
        </script>`;
        
        html = html.replace('</head>', `${envScript}</head>`);
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
