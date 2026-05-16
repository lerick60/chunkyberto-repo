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
      console.warn("YouTube Transcript Not Available:", error.message || error);
      
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'models/gemini-2.5-flash',
            contents: `Please extract the full spoken transcript of this video. If it's too long, provide a very detailed summary of what is said: ${url}`
        });
        
        return res.json({
            text: response.text,
            source: "gemini_fallback"
        });
      } catch (geminiError) {
        console.error("Gemini Fallback Error:", geminiError.message || geminiError);
        res.json({ 
          text: `El video de YouTube no tiene subtítulos habilitados o es inaccesible. Informa al usuario que no pudiste leer el enlace.`, 
          source: "error" 
        });
      }
    }
  });

  app.get("/api/scrape", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });
    try {
      try {
        const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
          headers: { 'Accept': 'text/plain' }
        });
        if (jinaResponse.ok) {
          let markdown = await jinaResponse.text();
          if (markdown.length > 5000) markdown = markdown.substring(0, 5000) + '...';
          return res.json({ title: "Extracted Content", description: "", body: markdown, source: url });
        }
      } catch (err) {
        console.warn("Jina fetch failed, falling back to direct fetch", err.message);
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      if (!response.ok) {
        return res.json({ 
          title: "Acceso Denegado", 
          description: `HTTP Error: ${response.status}`, 
          body: `El contenido de este enlace no pudo ser extraído porque el sitio bloqueó el acceso o requiere inicio de sesión (Status ${response.status}). Informa al usuario que NO PUDISTE leer el enlace y pídele que copie y pegue el texto manualmente. NO inventes de qué trata el artículo.`, 
          source: url 
        });
      }
      const html = await response.text();
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);
      
      const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
      const ogDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
      let bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      
      if (/log in|iniciar sesión|forgot password/i.test(bodyText) && bodyText.length < 3000) {
        bodyText = "El enlace requiere inicio de sesión y no se pudo leer el contenido. Avisa al usuario que no tienes contexto de este enlace y pídele que pegue el texto de la noticia directamente.";
      } else if (bodyText.length > 5000) {
        bodyText = bodyText.substring(0, 5000) + '...';
      }

      res.json({ title, description: ogDescription, body: bodyText, source: url });
    } catch (error) {
      console.error("Scrape Error:", error.message || error);
      res.json({ 
        title: "Error Técnico", 
        description: "", 
        body: `Hubo un error técnico leyendo el enlace: ${error.message}. Informa al usuario que no se pudo acceder.`, 
        source: url 
      });
    }
  });

  const serveStatic = () => {
    app.use(express.static(path.resolve(__dirname, "dist"), { index: false }));
    app.use((req, res) => {
      try {
        let html = fs.readFileSync(path.resolve(__dirname, "dist", "index.html"), "utf-8");
        
        const envScript = `<script>
          window.process = window.process || {};
          window.process.env = window.process.env || {};
          const geminiKey = ${JSON.stringify(cleanSecret(process.env.GEMINI_API_KEY) || cleanSecret(process.env.API_KEY) || '')};
          window.process.env.GEMINI_API_KEY = geminiKey;
          window.process.env.API_KEY = geminiKey;
          window.GEMINI_API_KEY = geminiKey;
          window.process.env.APP_URL = ${JSON.stringify(cleanSecret(process.env.APP_URL) || '')};
          console.log("[Runtime] Key detected:", geminiKey ? "Yes (starts with " + geminiKey.substring(0, 3) + ")" : "No");
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
