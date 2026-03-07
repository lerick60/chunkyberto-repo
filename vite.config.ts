import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPlugin = (env: Record<string, string>, mode: string) => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      const apiKey = env.API_KEY || env.GEMINI_API_KEY || '';
      return html.replace(
        '<head>',
        `<head>\n    <script>window.process = window.process || { env: {} }; window.process.env.API_KEY = window.process.env.API_KEY || "${apiKey}"; window.process.env.GEMINI_API_KEY = window.process.env.GEMINI_API_KEY || "${apiKey}";</script>`
      );
    }
  };
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        'process.env.API_KEY': 'process.env.API_KEY',
        'process.env.GEMINI_API_KEY': 'process.env.GEMINI_API_KEY'
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      
      plugins: [react(), tailwindcss(), htmlPlugin(env, mode)],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
