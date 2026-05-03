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

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
    console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in the environment. Users will need to provide it manually in the App Settings.");
  }

  function cleanSecret(val) {
    if (!val) return val;
    // Remove leading/trailing spaces and accidental surrounding quotes
    return val.trim().replace(/^["']|["']$/g, '');
  }

  function getYouTubeCredentials(personaId) {
    const suffix = personaId ? personaId.toUpperCase() : '';
    const clientId = cleanSecret(process.env[`YOUTUBE_CLIENT_ID_${suffix}`]) || cleanSecret(process.env.YOUTUBE_CLIENT_ID);
    const clientSecret = cleanSecret(process.env[`YOUTUBE_CLIENT_SECRET_${suffix}`]) || cleanSecret(process.env.YOUTUBE_CLIENT_SECRET);
    
    if (clientId) {
      console.log(`[OAuth Check] Usando Client ID para ${personaId || 'Global'}: ${clientId.substring(0, 15)}...`);
    }

    return { clientId, clientSecret };
  }

  function getOAuthClient(personaId) {
    const { clientId, clientSecret } = getYouTubeCredentials(personaId);
    if (!clientId || !clientSecret) return null;
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.APP_URL}/api/youtube/callback`
    );
  }

  const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

  // API Routes
  app.get("/api/youtube/auth-url", (req, res) => {
    const { personaId } = req.query;
    if (!personaId) return res.status(400).json({ error: "Missing personaId" });

    const oauth2Client = getOAuthClient(personaId);
    if (!oauth2Client) {
      const suffix = personaId.toUpperCase();
      return res.status(500).json({ error: `Faltan las credenciales exclusivas para esta persona. Asegúrate de configurar YOUTUBE_CLIENT_ID_${suffix} y YOUTUBE_CLIENT_SECRET_${suffix} (o los valores globales) en las variables de entorno.` });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      state: personaId.toString(),
    });
    res.json({ url: authUrl });
  });

  app.get("/api/youtube/callback", async (req, res) => {
    const { code, state: personaId, error } = req.query;
    
    if (error) {
      console.error("YouTube OAuth URL Error:", error);
      return res.status(400).send(`
        <html>
          <body style="background: #020617; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
            <div>
              <h1 style="color: #ef4444;">Error de Autorización</h1>
              <p>Ocurrió un error al intentar conectarse: <strong>${error}</strong></p>
              <p>Asegúrate de haber ingresado bien las credenciales y que las URL de redirección estén correctas en Google Cloud Console.</p>
              <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; background: #334155; color: white; border: none; border-radius: 8px; cursor: pointer;">Cerrar esta ventana</button>
            </div>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send("No se proporcionó un código de autorización.");
    }

    const oauth2Client = getOAuthClient(personaId);
    if (!oauth2Client) {
      return res.status(500).send("Faltan las credenciales de YouTube para esta persona.");
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      // Store tokens in a secure cookie specific to the persona
      res.cookie(`yt_tokens_${personaId}`, JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res.send(`
        <html>
          <body style="background: #020617; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center;">
              <h1 style="color: #ef4444;">YouTube Conectado</h1>
              <p>Autenticación exitosa para la persona: <strong>${personaId}</strong></p>
              <p>Esta ventana se cerrará automáticamente.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'YOUTUBE_AUTH_SUCCESS', personaId: '${personaId}' }, '*');
                  setTimeout(() => window.close(), 2000);
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
      res.status(500).send("Authentication failed: " + error.message);
    }
  });

  app.get("/api/youtube/status", (req, res) => {
    const { personaId } = req.query;
    if (!personaId) return res.status(400).json({ error: "Missing personaId" });
    const tokens = req.cookies[`yt_tokens_${personaId}`];
    res.json({ connected: !!tokens });
  });

  app.post("/api/youtube/upload", upload.single("video"), async (req, res) => {
    const { personaId } = req.body;
    if (!personaId) return res.status(400).json({ error: "Missing personaId" });

    const tokens = req.cookies[`yt_tokens_${personaId}`];
    if (!tokens) {
      return res.status(401).json({ error: `Not authenticated with YouTube for persona ${personaId}` });
    }

    const { title, description, tags, privacy } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "No video file provided" });
    }

    let tempPath = null;
    try {
      const { clientId, clientSecret } = getYouTubeCredentials(personaId);
      const auth = new google.auth.OAuth2(clientId, clientSecret);
      auth.setCredentials(JSON.parse(tokens));

      const youtube = google.youtube({ version: "v3", auth });

      // Write the buffer to a temp file for reliable streaming
      tempPath = path.join(__dirname, `temp_upload_${personaId}_${Date.now()}.webm`);
      fs.writeFileSync(tempPath, videoFile.buffer);

      console.log(`Starting real YouTube upload for persona ${personaId}: ${title}`);

      const uploadRes = await youtube.videos.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
            tags: tags ? tags.split(",").map(t => t.trim()) : [],
            categoryId: "22", // People & Blogs
          },
          status: {
            privacyStatus: privacy || "private",
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          body: fs.createReadStream(tempPath),
        },
      });

      console.log(`YouTube upload successful. Video ID: ${uploadRes.data.id}`);

      res.json({ success: true, videoId: uploadRes.data.id });
    } catch (error) {
      console.error("YouTube Upload Error:", error);
      res.status(500).json({ error: error.message });
    } finally {
      // Cleanup temp file
      if (tempPath && fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch(e) { console.error("Temp file cleanup failed:", e); }
      }
    }
  });

  app.get("/api/youtube/transcript", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });
    try {
      const { YoutubeTranscript } = await import('youtube-transcript');
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      const text = transcript.map(t => t.text).join(' ');
      res.json({ text, source: "transcript" });
    } catch (error) {
      // Fallback: try to fetch the video title and author using YouTube's oEmbed API
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url.trim())}&format=json`);
        const contentType = oembedRes.headers.get("content-type");
        if (oembedRes.ok && contentType && contentType.includes("application/json")) {
          const oembedData = await oembedRes.json();
          return res.json({ 
            text: `[Transcript disabled. Video Title: ${oembedData.title}. Channel: ${oembedData.author_name}]`,
            source: "oembed_fallback"
          });
        }
      } catch (fallbackError) {
        console.error("oEmbed fallback failed:", fallbackError);
      }

      console.error("YouTube Transcript Error:", error.message || error);
      res.status(500).json({ error: error.message || "Failed to fetch transcript" });
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
