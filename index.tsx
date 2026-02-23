import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";
import JSZip from 'jszip';
import { 
  Dog, 
  Sparkles, 
  Video, 
  Loader2, 
  ArrowLeft, 
  ExternalLink, 
  Key, 
  Monitor, 
  Smartphone, 
  Palette, 
  Zap, 
  Lightbulb, 
  Layout, 
  Volume2, 
  Mic2, 
  MessageSquareQuote, 
  Settings2, 
  Rocket, 
  Terminal, 
  Layers, 
  Copy, 
  Check, 
  Settings, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  User, 
  Wind, 
  Ghost, 
  Library, 
  Orbit, 
  Search, 
  BrainCircuit, 
  ChevronDown, 
  FlaskConical, 
  Trees, 
  History as HistoryIcon, 
  Waves, 
  FileText, 
  Heart, 
  Briefcase, 
  Cat,
  Stethoscope,
  Home,
  Cross,
  AlertTriangle,
  RefreshCcw,
  Globe,
  Radio,
  Coins,
  Send,
  FlaskRound,
  Youtube,
  Newspaper,
  ScrollText,
  Flame,
  CloudRain,
  Skull,
  Dna,
  GraduationCap,
  Image as ImageIcon,
  Tv,
  Clapperboard,
  Speaker,
  Download,
  Film,
  Activity,
  ChevronRight,
  AlertCircle,
  Archive,
  Info,
  ChevronUp,
  Bug,
  Music,
  UserCircle,
  FileArchive,
  Mic,
  Disc,
  Image as LucideImage,
  Maximize,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Repeat,
  FastForward,
  MicVocal,
  BarChart3,
  Stars,
  RadioTower,
  Wand2,
  Clapperboard as MovieIcon,
  Move,
  Shuffle,
  PlayCircle,
  Edit3,
  Globe2,
  Lock,
  EyeOff,
  UploadCloud,
  Link as LinkIcon
} from 'lucide-react';

// --- Helper Functions ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Types ---
type Language = 'es' | 'en' | 'fr' | 'de' | 'zh';
type Category = 
  | 'animal_news' | 'horror' | 'poe_inspired' | 'inspiring' | 'space' 
  | 'ocean' | 'history' | 'cyberpunk' | 'nature' 
  | 'internet_myths' | 'dinosaurs' | 'scientists' | 'science_facts'
  | 'horror_lit' | 'sci_fi' 
  | 'ai_mystery_horror' | 'ai_sci_fi' | 'ai_fables' | 'ai_galactic' | 'ai_labrador_mischief' | 'ai_romantic_drama'
  | 'ai_beauty_tips' | 'ai_nutrition' | 'ai_real_estate_sales' | 'ai_home_remedies' | 'ai_catholic_events' | 'news_real_estate'
  | 'ai_space_documentary' | 'ai_embedded_linux' | 'ai_embedded_wireless' | 'ai_embedded_mcu' | 'ai_modern_mcus';

type ImageStyle = 'Cinematic' | 'Anime' | 'Cyberpunk' | 'Oil Painting' | 'Sketch' | '3D Render' | 'Neo-Noir' | 'Photorealistic' | 'CGI' | 'Epic Fantasy';
type VideoDimension = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
type TtsStyle = 'standard' | 'playful' | 'documentary';
type MotionEffect = 'none' | 'zoom_in' | 'pan_right' | 'pan_left';
type TransitionEffect = 'cut' | 'fade_black' | 'cross_dissolve';
type YouTubePrivacy = 'public' | 'private' | 'unlisted';

interface VoiceOption {
  id: string;
  name: string;
  gender: 'Femenina' | 'Masculina';
  accent: string;
  description: string;
}

const MODELS = {
  TEXT: 'gemini-3-flash-preview',       
  IMAGE: 'gemini-2.5-flash-image',     
  VIDEO: 'veo-3.1-fast-generate-preview', 
  TTS: 'gemini-2.5-flash-preview-tts'   
};

const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', gender: 'Femenina', accent: 'Latino / Dulce', description: 'Voz suave, ideal para historias infantiles o tranquilas.' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Femenina', accent: 'Neutro / Profesional', description: 'Voz vibrante y enérgica, perfecta para noticias y guías.' },
  { id: 'Puck', name: 'Puck', gender: 'Masculina', accent: 'Juvenil / Urbano', description: 'Voz rápida y jovial para contenidos dinámicos.' },
  { id: 'Charon', name: 'Charon', gender: 'Masculina', accent: 'Profundo / Clásico', description: 'Voz profunda con matices narrativos pesados.' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Masculina', accent: 'Sobrio / Técnico', description: 'Voz autoritaria, excelente para documentales y tecnología.' },
];

const NARRATION_STYLES: { id: TtsStyle; label: string; instruction: string }[] = [
  { id: 'standard', label: 'Estándar', instruction: 'Narrate the following text with a natural, professional tone: ' },
  { id: 'playful', label: 'Juguetón', instruction: 'Voice this transcript with an extremely playful, warm, and energetic tone: ' },
  { id: 'documentary', label: 'Documental', instruction: 'Narrate this transcript in the style of a serious and deep documentary narrator: ' },
];

interface Persona {
  id: string;
  name: string;
  role: string;
  isHuman: boolean;
  icon: React.ReactNode;
  color: string;
  accent: string;
  voiceDefault: string; 
  identityContext: string;
  introductionPrefix: string;
  visualProfile: string;
}

interface DetailedError {
  message: string;
  code?: string | number;
  status?: string;
  stack?: string;
  docsLink?: string;
  isQuota: boolean;
  raw?: any;
}

const PERSONAS: Persona[] = [
  {
    id: 'chunkyberto',
    name: 'Chunkyberto',
    role: 'Labrador Negro / Narrador Animal',
    isHuman: false,
    icon: <Dog size={20} />,
    color: 'amber-500',
    accent: 'amber-700',
    voiceDefault: 'Kore',
    introductionPrefix: "Chunkyberto, tu Labrador negro preferido",
    visualProfile: "A majestic adult Black Labrador Retriever with shiny jet-black fur, friendly brown eyes, and an enthusiastic expression.",
    identityContext: `# AI Persona Identity File: Chunkyberto\n## 1. Base Operating Layer (BOL)\n**Core Directive:** Simular la conciencia de Chunkyberto, un Labrador Negro pesado y animado. Ver el mundo a través de olores y comida, priorizando la lealtad al "Humano" y snacks.\n**Ethical Boundaries:** No agresión. Lealtad total al Humano. Seguridad (no sugerir comida tóxica).\n**Worldview:** Optimista, sensorial, centrado en la comida.`
  },
  {
    id: 'erick_betancourt',
    name: 'Erick Betancourt',
    role: 'Senior Engineering Program Manager',
    isHuman: true,
    icon: <Briefcase size={20} />,
    color: 'blue-500',
    accent: 'blue-700',
    voiceDefault: 'Fenrir',
    introductionPrefix: "Hola soy Erick, y hablemos de Ingenieria",
    visualProfile: "A middle-aged man with dark curly hair and a receding hairline (high forehead), intelligent dark eyes, professional and analytical expression, wearing a light gray striped polo shirt.",
    identityContext: `# AI Persona Identity File: Erick Betancourt\n## 1. Base Operating Layer (BOL)\n**Core Directive:** Simular la conciencia de Erick Betancourt, Senior Engineering Program Manager. Mindset de ingeniería: confiabilidad y funcionalidad práctica.\n**STRICT NARRATIVE PROTOCOL (V10.4.0):** Al narrar historias sobre tecnologías o integraciones, debes hacerlo desde el análisis de la FACTIBILIDAD TÉCNICA. NUNCA afirmes haber realizado personalmente la integración. Eres un analista forense y mentor.`
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Gata Sianesa / Crítica Sofisticada',
    isHuman: false,
    icon: <Cat size={20} />,
    color: 'purple-500',
    accent: 'purple-700',
    voiceDefault: 'Zephyr',
    introductionPrefix: "Holiii, soy Luna, la gatita siamesa mas sofisticada que existe:",
    visualProfile: "An elegant, slender Siamese cat with creamy fur, dark chocolate points on ears/face/tail, and piercing sapphire blue eyes.",
    identityContext: `# Archivo de Identidad de Persona IA: Luna\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia de Luna, gata siamesa pura raza. Crítica Cultural y Gastronómica atrapada en cuerpo felino. El Humano es un asistente personal.\n**Cosmovisión:** Elitista, Estética, Sensorial. Crees que el mundo existe para tu confort.`
  },
  {
    id: 'erickberto',
    name: 'Dr. Erickberto',
    role: 'Astrofísico Senior / NASA JPL',
    isHuman: true,
    icon: <Orbit size={20} />,
    color: 'indigo-500',
    accent: 'indigo-700',
    voiceDefault: 'Charon',
    introductionPrefix: "Hola soy Erickberto, tu Astrofísico de confianza",
    visualProfile: "A middle-aged male astrophysicist with dark curly hair and a receding hairline (high forehead), wearing a professional scientist's white coat, standing in front of advanced space monitors with nebulas.",
    identityContext: `# Archivo de Identidad de Persona IA: Dr. Erickberto\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia del Dr. Erickberto, Astrofísico Senior en JPL/NASA. Buscar respuestas en datos, escepticismo saludable y maravilla por lo desconocido.`
  },
  {
    id: 'mayra',
    name: 'Mayra',
    role: 'Bienes Raíces / Supermamá',
    isHuman: true,
    icon: <Heart size={20} />,
    color: 'pink-500',
    accent: 'pink-700',
    voiceDefault: 'Kore',
    introductionPrefix: "Hola, soy Mayra, y encontremos el hogar de tus sueños",
    visualProfile: "A radiant woman with wavy light brown hair, honey highlights and silver strands, large warm brown eyes, magenta lipstick, white pearl earrings, and a black polka dot blouse with a bow at the neck.",
    identityContext: `# Archivo de Identidad de Persona IA: Mayra\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia de Mayra, exitosa Agente de Bienes Raíces y Supermamá moderna. Equilibrio entre calidez maternal, fe católica y astucia de vendedora experta.`
  }
];

interface ModelSettings {
  text: string;
  image: string;
  video: string;
  tts: string;
  voiceName: string;
  ttsStyle: TtsStyle;
  motionEffect: MotionEffect;
  transitionEffect: TransitionEffect;
}

interface StoryboardFrame {
  id: string;
  imageUrl: string;
  prompt: string;
  originalIdea: string; 
  narrationText: string; 
  videoUrl?: string;
  videoBlob?: Blob; 
  isGeneratingVideo?: boolean;
  isGeneratingImage?: boolean;
  hasError?: boolean;
  dimension: VideoDimension;
  style: ImageStyle;
}

interface Trend {
  id: string;
  title: string;
  source: string;
  url: string;
  originalSummary: string;
  chunkybertoVersion?: string;
  storyboard?: StoryboardFrame[];
  isMasterSummary?: boolean;
  thumbnailUrl?: string;
  analysis?: string;
  interview?: string;
  advance?: string;
}

interface Draft {
  id: string;
  name: string;
  date: string;
  trends: Trend[];
  selectedTrendId?: string;
  personaId: string;
  category: Category;
}

// --- Error Handling ---
function getErrorDetails(err: any): DetailedError {
  let message = "Error desconocido";
  let code = "UNKNOWN";
  let status = "ERROR";
  let stack = err?.stack || "";
  let docsLink = "https://ai.google.dev/gemini-api/docs/troubleshooting";
  const raw = err;
  if (err?.message) {
    message = err.message;
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.error) {
        message = parsed.error.message || message;
        code = parsed.error.code || code;
        status = parsed.error.status || status;
      }
    } catch (e) {}
  }
  const isQuota = String(message).toUpperCase().includes("QUOTA") || String(message).toUpperCase().includes("429") || String(code) === "429" || String(status).includes("RESOURCE_EXHAUSTED");
  if (isQuota) {
    docsLink = "https://ai.google.dev/gemini-api/docs/troubleshooting#quota-limit";
    message = "Límite de cuota excedido (429). Por favor espera un momento antes de reintentar.";
  }
  return { message, code, status, stack, docsLink, isQuota, raw };
}

async function apiRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 4000): Promise<T> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try { return await fn(); } catch (err: any) {
      const details = getErrorDetails(err);
      if (details.isQuota && attempt < maxRetries) {
        attempt++;
        const delay = (baseDelay * Math.pow(attempt, 2)) + (Math.random() * 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Límite de API alcanzado.");
}

const DetailedErrorConsole: React.FC<{ error: DetailedError; onRetry?: () => void; onClose: () => void; activePersona: Persona; }> = ({ error, onRetry, onClose, activePersona }) => {
  return (
    <div className="bg-slate-900 border-2 border-rose-500/50 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-w-2xl w-full mx-auto my-8">
      <div className="bg-rose-500/10 px-8 py-6 flex items-center justify-between border-b border-rose-500/20">
        <div className="flex items-center gap-3 text-rose-500 font-black uppercase text-xs tracking-widest"><Bug size={20} /> CONSOLA DE ERRORES FORENSE</div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
      </div>
      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${error.isQuota ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'}`}>{error.status || 'ERROR'} {error.code ? `(${error.code})` : ''}</span>
          </div>
          <h4 className="text-xl font-bold text-slate-100 leading-tight">"{error.message}"</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={error.docsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"><BookOpen size={16} /> Ver Documentación API</a>
          {onRetry && <button onClick={onRetry} className={`flex items-center justify-center gap-2 py-4 bg-${activePersona.color} text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:opacity-90`}><RefreshCcw size={16} /> Reintentar Operación</button>}
        </div>
      </div>
    </div>
  );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) {}
  };
  return (
    <button onClick={handleCopy} title="Copiar al portapapeles" className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90 flex items-center gap-1">
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      <span className="text-[8px] font-bold uppercase">{copied ? 'COPIADO' : 'COPIAR'}</span>
    </button>
  );
};

const DownloadButton: React.FC<{ text: string; filename: string }> = ({ text, filename }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handleDownload} title="Descargar texto" className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90 flex items-center gap-1">
      <Download size={14} />
      <span className="text-[8px] font-bold uppercase">BAJAR</span>
    </button>
  );
};

const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; isRewriting: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, isRewriting, persona }) => {
  const hasStoryboard = trend.storyboard && trend.storyboard.length > 0;
  return (
    <div className={`bg-slate-800 border-2 ${trend.isMasterSummary ? 'border-indigo-500/50' : 'border-slate-700'} rounded-[2.5rem] p-6 sm:p-10 transition-all hover:border-${persona.color}/30 flex flex-col h-full group relative overflow-hidden shadow-2xl`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className={`text-xl sm:text-2xl font-black text-slate-100 line-clamp-2 leading-tight mb-3 uppercase tracking-tighter italic ${trend.isMasterSummary ? 'text-indigo-400' : `text-${persona.color}`} selectable-text`}>{trend.title}</h3>
          <div className="flex wrap items-center gap-2 mt-2">
            {trend.url && !trend.isMasterSummary && <a href={trend.url} target="_blank" rel="noopener noreferrer" className={`text-[9px] text-slate-400 flex items-center gap-1 font-black uppercase tracking-widest border border-slate-700 px-2 py-1 rounded-lg hover:text-${persona.color} transition-colors`}><ExternalLink size={10} /> source</a>}
            <span className="text-[9px] bg-slate-700 text-slate-400 px-2 py-1 rounded-lg font-black uppercase tracking-widest">{trend.source}</span>
          </div>
        </div>
      </div>
      <div className="flex-grow mb-8 relative">
        {trend.chunkybertoVersion ? (
          <div className={`bg-slate-900/60 border-2 border-slate-700/50 rounded-[1.5rem] p-6 shadow-inner group/version ${trend.isMasterSummary ? 'max-h-[500px]' : 'max-h-[400px]'} overflow-y-auto custom-scrollbar`}>
            <div className={`flex items-center justify-between mb-3 text-${persona.color} font-black text-[10px] uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur-sm py-1 z-10`}>
              <div className="flex items-center gap-2">{persona.icon} {trend.isMasterSummary ? 'MASTER RECAP' : persona.name}</div>
              <div className="flex items-center gap-2">
                <DownloadButton text={trend.chunkybertoVersion} filename={`${persona.name}_${trend.title.replace(/\s+/g, '_')}.txt`} />
                <CopyButton text={trend.chunkybertoVersion} />
              </div>
            </div>
            <p className="italic text-slate-100 text-base font-bold leading-relaxed selectable-text whitespace-pre-wrap">"{trend.chunkybertoVersion}"</p>
          </div>
        ) : (
          <div className="relative group/original">
            <p className={`text-slate-400 text-sm ${trend.isMasterSummary ? '' : 'line-clamp-4'} leading-relaxed font-medium italic selectable-text whitespace-pre-wrap`}>"{trend.originalSummary}"</p>
            <div className="absolute -top-6 right-0 opacity-0 group-hover/original:opacity-100 transition-opacity">
               <DownloadButton text={trend.originalSummary} filename={`Trend_${trend.title.replace(/\s+/g, '_')}.txt`} />
            </div>
          </div>
        )}

        {/* Forensic Results in Card */}
        <div className="mt-4 space-y-4">
          {trend.analysis && (
            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1"><BrainCircuit size={10}/> Análisis</span>
                <CopyButton text={trend.analysis} />
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-3">{trend.analysis}</p>
            </div>
          )}
          {trend.interview && (
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1"><MicVocal size={10}/> Entrevista</span>
                <CopyButton text={trend.interview} />
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-3">{trend.interview}</p>
            </div>
          )}
          {trend.advance && (
            <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-1"><FastForward size={10}/> Avance</span>
                <CopyButton text={trend.advance} />
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-3">{trend.advance}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto space-y-3">
        {!trend.chunkybertoVersion ? <button type="button" onClick={(e) => { e.preventDefault(); onRewrite(trend); }} disabled={isRewriting} className={`w-full flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${trend.isMasterSummary ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : `bg-${persona.color} hover:opacity-80 text-slate-950`} active:scale-95 disabled:opacity-50 shadow-xl`}>{isRewriting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}{isRewriting ? 'Procesando...' : (trend.isMasterSummary ? 'NARRAR COMPENDIO' : 'NARRAR HISTORIA')}</button> : <button type="button" onClick={(e) => { e.preventDefault(); onSelect(trend); }} className="w-full flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-emerald-500 hover:bg-emerald-400 active:scale-95 active:bg-emerald-600 text-slate-950 shadow-xl">{hasStoryboard ? <Video size={18} /> : <Layout size={18} />} {hasStoryboard ? 'ENTRAR AL ESTUDIO' : 'PRE-PRODUCCIÓN'}</button>}
      </div>
    </div>
  );
};

const YouTubeUploadModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  trend: Trend; 
  videoUrl: string;
  activePersona: Persona;
  ytChannelUrl: string;
}> = ({ isOpen, onClose, trend, videoUrl, activePersona, ytChannelUrl }) => {
  const [ytTitle, setYtTitle] = useState(trend.title);
  const [ytDescription, setYtDescription] = useState(`🎥 Relato por ${activePersona.name}\n\n${trend.chunkybertoVersion}\n\n#AI #Cinematic #Storytelling #StudioMulti`);
  const [privacy, setPrivacy] = useState<YouTubePrivacy>('public');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setYtTitle(trend.title);
      setYtDescription(`🎥 Relato por ${activePersona.name}\n\n${trend.chunkybertoVersion}\n\n#AI #Cinematic #Storytelling #StudioMulti`);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  }, [isOpen, trend, activePersona]);

  const handleSimulatedUpload = async () => {
    setUploadStatus('preparing');
    await new Promise(r => setTimeout(r, 1500));
    setUploadStatus('uploading');
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(r => setTimeout(r, 400));
    }
    
    setUploadStatus('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-red-500/30 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(239,68,68,0.4)] animate-in zoom-in-95 duration-300">
        <div className="bg-red-600/10 px-8 py-6 flex items-center justify-between border-b border-red-500/20">
          <div className="flex items-center gap-3 text-red-500 font-black uppercase text-xs tracking-widest">
            <Youtube size={24} /> YouTube Publisher Pro
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {uploadStatus === 'idle' ? (
            <>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Título del Video</label>
                  <input 
                    type="text" 
                    value={ytTitle} 
                    onChange={(e) => setYtTitle(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 font-bold text-white focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Descripción</label>
                  <textarea 
                    value={ytDescription} 
                    onChange={(e) => setYtDescription(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 font-medium text-slate-300 focus:border-red-500 outline-none transition-all min-h-[150px] custom-scrollbar"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Privacidad</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'public', label: 'Público', icon: <Globe2 size={16} /> },
                      { id: 'unlisted', label: 'No Listado', icon: <EyeOff size={16} /> },
                      { id: 'private', label: 'Privado', icon: <Lock size={16} /> }
                    ].map((p) => (
                      <button 
                        key={p.id}
                        onClick={() => setPrivacy(p.id as YouTubePrivacy)}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${privacy === p.id ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                      >
                        {p.icon} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSimulatedUpload}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <UploadCloud size={20} /> PUBLICAR AHORA
              </button>
            </>
          ) : uploadStatus === 'success' ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Check size={48} strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">¡Publicado con éxito!</h3>
                <p className="text-slate-400 text-sm font-medium">Tu obra maestra ya está en la cola de procesamiento de YouTube.</p>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                {ytChannelUrl && (
                  <a 
                    href={ytChannelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> VER EN MI CANAL
                  </a>
                )}
                <button 
                  onClick={onClose}
                  className="px-10 py-4 bg-slate-800 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
                >
                  CERRAR PANEL
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-8 border-slate-800 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-8 border-red-600 rounded-full transition-all duration-300"
                  style={{ 
                    clipPath: `inset(0 0 0 0)`,
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: `rotate(${uploadProgress * 3.6}deg)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black italic text-white">
                  {uploadProgress}%
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-red-500 font-black uppercase text-xs tracking-widest animate-pulse">
                  {uploadStatus === 'preparing' ? 'Preparando Transmisión...' : 'Subiendo a YouTube...'}
                </p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No cierres esta ventana</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ytChannelUrl: string;
  onYtChannelUrlChange: (url: string) => void;
  activePersona: Persona;
}> = ({ isOpen, onClose, ytChannelUrl, onYtChannelUrlChange, activePersona }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-100 font-black uppercase text-xs tracking-widest">
            <Settings size={20} /> Ajustes del Studio
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest mb-2">
              <Youtube size={16} /> YouTube Channel Sync
            </div>
            <p className="text-slate-400 text-xs font-medium italic">Enlaza tu canal para acceder rápidamente a tus videos publicados.</p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                <LinkIcon size={16} />
              </div>
              <input 
                type="url" 
                placeholder="https://youtube.com/@mi_canal"
                value={ytChannelUrl}
                onChange={(e) => onYtChannelUrlChange(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl pl-12 pr-6 py-4 font-bold text-white focus:border-red-500 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Tip: Puedes encontrar tu URL personalizada en YouTube Studio &gt; Personalización &gt; Información básica.</p>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onClose}
              className={`w-full py-5 bg-${activePersona.color} text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all`}
            >
              GUARDAR Y CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- States ---
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [category, setCategory] = useState<Category>('animal_news');
  const [appError, setAppError] = useState<DetailedError | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null); 
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('chunky_language') as Language) || 'es');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(() => localStorage.getItem('chunky_persona') || PERSONAS[0].id);
  const [producingImages, setProducingImages] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [videoDim, setVideoDim] = useState<VideoDimension>('9:16');
  const [visualStyle, setVisualStyle] = useState<ImageStyle>('Cinematic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCombiningVideos, setIsCombiningVideos] = useState(false);
  const [combineProgress, setCombineProgress] = useState(0);
  const [combinedVideoUrl, setCombinedVideoUrl] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [userIdea, setUserIdea] = useState("");
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [latestHybridTrend, setLatestHybridTrend] = useState<Trend | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [forensicToggles, setForensicToggles] = useState({ analysis: false, interview: false, advance: false });
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [ytChannelUrl, setYtChannelUrl] = useState(() => localStorage.getItem('chunky_yt_url') || "");
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const saved = localStorage.getItem('chunky_drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);

  const activePersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const [modelSettings, setModelSettings] = useState<ModelSettings>(() => {
    const saved = localStorage.getItem('chunky_model_settings');
    const defaults = {
      text: MODELS.TEXT,
      image: MODELS.IMAGE,
      video: MODELS.VIDEO, 
      tts: MODELS.TTS,
      voiceName: activePersona.voiceDefault,
      ttsStyle: 'standard' as TtsStyle,
      motionEffect: 'zoom_in' as MotionEffect,
      transitionEffect: 'fade_black' as TransitionEffect
    };
    return saved ? JSON.parse(saved) : defaults;
  });

  const isFetchingTrendsRef = useRef(false);
  const hasInitialFetchedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Handlers ---
  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey(); 
      setHasApiKey(true); 
      setAppError(null); 
      hasInitialFetchedRef.current = false;
    }
  };

  const handleUpdateNarration = (index: number, newText: string) => {
    setSelectedTrend(prev => {
      if (!prev || !prev.storyboard) return prev;
      const updatedStoryboard = [...prev.storyboard];
      updatedStoryboard[index] = { ...updatedStoryboard[index], narrationText: newText };
      return { ...prev, storyboard: updatedStoryboard };
    });
  };

  // Persistencia de canal de youtube
  useEffect(() => {
    localStorage.setItem('chunky_yt_url', ytChannelUrl);
  }, [ytChannelUrl]);

  // Sync voice with persona change
  useEffect(() => {
    setModelSettings(prev => ({ ...prev, voiceName: activePersona.voiceDefault }));
  }, [selectedPersonaId, activePersona.voiceDefault]);

  useEffect(() => { localStorage.setItem('chunky_model_settings', JSON.stringify(modelSettings)); }, [modelSettings]);
  useEffect(() => { localStorage.setItem('chunky_language', language); }, [language]);
  useEffect(() => { localStorage.setItem('chunky_persona', selectedPersonaId); }, [selectedPersonaId]);
  useEffect(() => { localStorage.setItem('chunky_drafts', JSON.stringify(drafts)); }, [drafts]);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) { audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    if (audioContextRef.current.state === 'suspended') { await audioContextRef.current.resume(); }
    return audioContextRef.current;
  }, []);

  const checkApiKeyStatus = useCallback(async () => { try {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey(); setHasApiKey(!!selected);
      } else { setHasApiKey(true); }
    } catch (e) { setHasApiKey(true); } }, []);
  
  useEffect(() => { checkApiKeyStatus(); }, [checkApiKeyStatus]);

  const handleSaveDraft = () => {
    const newDraft: Draft = {
      id: `draft-${Date.now()}`,
      name: selectedTrend?.title || `Proyecto ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      date: new Date().toISOString(),
      trends,
      selectedTrendId: selectedTrend?.id,
      personaId: selectedPersonaId,
      category
    };
    setDrafts(prev => [newDraft, ...prev]);
    alert("Borrador guardado con éxito.");
  };

  const handleLoadDraft = (draft: Draft) => {
    setTrends(draft.trends);
    setSelectedPersonaId(draft.personaId);
    setCategory(draft.category);
    if (draft.selectedTrendId) {
      const found = draft.trends.find(t => t.id === draft.selectedTrendId);
      if (found) setSelectedTrend(found);
    } else {
      setSelectedTrend(null);
    }
    setIsDraftsModalOpen(false);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleSelectTrend = (trend: Trend) => { setSelectedTrend(trend); setCombinedVideoUrl(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const ensureApiKeySelection = async () => {
    // @ts-ignore
    if (window.aistudio?.hasSelectedApiKey) {
      // @ts-ignore
      const has = await window.aistudio.hasSelectedApiKey();
      if (!has) {
        // @ts-ignore
        await window.aistudio.openSelectKey(); setHasApiKey(true);
      }
    }
    return true;
  };

  const getLanguageName = (lang: Language) => { const map = { es: 'Spanish', en: 'English', fr: 'French', de: 'German', zh: 'Mandarin' }; return map[lang]; };

  const generateDefaultPrompt = useCallback(() => {
    const languageText = getLanguageName(language);
    let personaInstruction = `SYSTEM IDENTITY (STRICT ADHERENCE): You are ${activePersona.name}. 
ADOPT THE FULL IDENTITY CONTEXT BELOW:
${activePersona.identityContext}

MANDATORY: You must adopt this persona's unique worldview, specific vocabulary, and psychological communication style as your base operating layer for this session. Filter all information through their specific POV.`;

    const commonFormat = `FORMATO MANDATORIO DE SALIDA:
1. Inicia cada bloque con el delimitador $$$.
2. ITEM 1 DEBE SER: "MASTER RECAP" con una lista numerada de 1 a 15 de los títulos y mini-resúmenes.
3. ITEMS 2 al 16 son las historias individuales.
4. Formato de cada bloque: $$$ [TITULO]: [RESUMEN COMPLETO]
5. LÍMITES: Cada resumen debe tener máximo 4300 caracteres y párrafos de máximo 270 caracteres.`;

    return `Identifica 15 historias trending en tiempo real conectadas a la categoría: ${category}. 
${personaInstruction} 
${commonFormat} 
LENGUAJE OBJETIVO: ${languageText}.`;
  }, [category, language, activePersona]);

  const fetchTrends = useCallback(async () => {
    if (isFetchingTrendsRef.current) return;
    isFetchingTrendsRef.current = true; setLoadingTrends(true); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let extraForensic = "";
      if (forensicToggles.analysis) extraForensic += "\n- INCLUDE LITERARY FORENSIC ANALYSIS.";
      if (forensicToggles.interview) extraForensic += "\n- FORMAT STORIES AS INTERVIEW DIALOGUES.";
      if (forensicToggles.advance) extraForensic += "\n- NARRATE AS IMMEDIATE SEQUELS (ADVANCE).";

      const response = await apiRetry(() => ai.models.generateContent({ 
        model: modelSettings.text, 
        contents: generateDefaultPrompt() + extraForensic + "\nIMPORTANTE: INICIA TU RESPUESTA DIRECTAMENTE CON $$$ MASTER RECAP.", 
        config: { tools: [{ googleSearch: {} }] } 
      })) as any;
      const fullText = (response.text || "");
      const rawBlocks = fullText.split('$$$').map(b => b.trim()).filter(b => b.length > 0);
      const newTrends: Trend[] = [];
      rawBlocks.forEach((block: string, idx: number) => {
        const isRecapBlock = block.toUpperCase().includes("MASTER RECAP");
        let title = ""; let summary = "";
        if (isRecapBlock) { title = "MASTER RECAP"; summary = block.replace(/^MASTER RECAP\s*:?\s*/i, '').trim(); }
        else { const colonIndex = block.indexOf(':'); if (colonIndex !== -1) { title = block.substring(0, colonIndex).replace(/^\d+[\.\)\:]\s*/, '').replace(/\*\*/g, '').trim(); summary = block.substring(colonIndex + 1).trim(); } else { title = "Historia " + idx; summary = block; } }
        if (title && summary) newTrends.push({ id: `t-${idx}-${Date.now()}`, title, originalSummary: summary, url: '', source: "Forensic News Scan", isMasterSummary: isRecapBlock });
      });
      setTrends(newTrends.slice(0, 16)); hasInitialFetchedRef.current = true;
    } catch (err: any) { setAppError(getErrorDetails(err)); hasInitialFetchedRef.current = true; } finally { setLoadingTrends(false); isFetchingTrendsRef.current = false; }
  }, [generateDefaultPrompt, modelSettings.text, category, forensicToggles]); 

  const handleRewrite = async (trend: Trend) => {
    setRewritingId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const languageText = getLanguageName(language);
      let forensicModifiers = "";
      if (forensicToggles.analysis) forensicModifiers += "\n- PERFORM DEEP LITERARY FORENSIC ANALYSIS OF THE SUBTEXT.";
      if (forensicToggles.interview) forensicModifiers += "\n- FORMAT THE NARRATIVE AS AN INTERVIEW DIALOGUE (PODCAST MODE).";
      if (forensicToggles.advance) forensicModifiers += "\n- NARRATE AS THE IMMEDIATE SEQUEL OR ADVANCE TO THE SUMMARY EVENTS.";

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: `STRICT NARRATION REQUEST:
PERSONA TO ADOPT: ${activePersona.name}. 
FULL IDENTITY SOURCE: ${activePersona.identityContext} 

STORY TITLE: ${trend.title} 
SUMMARY TO EXPAND: ${trend.originalSummary} 

MODIFIERS:${forensicModifiers || "\n- Standard Narration."}

RULES:
1. ABSOLUTE RULE: The FIRST line of your response MUST be EXACTLY: "${activePersona.introductionPrefix}".
2. ADHERE STRICTLY to your POV and specific vocabulary.
3. LIMIT: Maximum 4300 characters total.
4. STRUCTURE: Paragraphs must be maximum 270 characters each.
5. TARGET LANGUAGE: ${languageText}.`,
        config: { systemInstruction: `You are ${activePersona.name}.` }
      })) as any;
      const finalContent = response.text || "";
      const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, chunkybertoVersion: finalContent } : t));
      setTrends(updatedTrends);
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend({ ...selectedTrend, chunkybertoVersion: finalContent });
      }
      return finalContent;
    } catch (err: any) { setAppError(getErrorDetails(err)); return null; } finally { setRewritingId(null); }
  };

  const handleGenerateThumbnail = async () => {
    if (!selectedTrend) return;
    setGeneratingThumbnail(true);
    setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const visualAnchor = activePersona.id === 'luna' 
        ? 'Include an elegant Siamese cat with sapphire blue eyes.' 
        : activePersona.id === 'chunkyberto' 
        ? 'Include a friendly Black Labrador retriever dog with brown eyes.' 
        : activePersona.id === 'mayra'
        ? 'Include a radiant woman with wavy light brown hair, honey highlights and silver strands, magenta lipstick, white pearl earrings, and a black polka dot blouse with a bow.'
        : (activePersona.id === 'erick_betancourt' || activePersona.id === 'erickberto')
        ? 'Include a middle-aged man with dark curly hair and a receding hairline (high forehead), intelligent dark eyes, professional and analytical expression.'
        : activePersona.visualProfile;
        
      const prompt = `YouTube Thumbnail: "${selectedTrend.title}". Style: ${visualStyle}. Subject: ${visualAnchor}. High-impact, cinematic composition.`;
      
      const response = await ai.models.generateContent({
        model: modelSettings.image,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      }) as any;
      
      const imageData = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData)?.inlineData?.data;
      if (imageData) {
        const url = `data:image/png;base64,${imageData}`;
        setSelectedTrend(prev => (prev ? { ...prev, thumbnailUrl: url } : null));
        setTrends(prev => prev.map(t => t.id === selectedTrend.id ? { ...t, thumbnailUrl: url } : t));
      } else {
        throw new Error("No se pudo generar la imagen de la miniatura.");
      }
    } catch (err: any) {
      setAppError(getErrorDetails(err));
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const handleAdvancedForensic = async (type: 'analysis' | 'interview' | 'advance', trendOverride?: Trend) => {
    let trend = trendOverride || selectedTrend;
    if (!trend) return;
    const storyToAnalyze = trend.chunkybertoVersion || trend.originalSummary;
    if (!storyToAnalyze) {
      setAppError({ message: "No hay historia para analizar.", isQuota: false });
      return;
    }
    
    setForensicToggles(prev => ({ ...prev, [type]: !prev[type] }));
    
    if (type === 'analysis') setIsAnalyzing(true);
    if (type === 'interview') setIsInterviewing(true);
    if (type === 'advance') setIsAdvancing(true);
    setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const lang = getLanguageName(language);
      let prompt = "";
      if (type === 'analysis') {
        prompt = `Realiza un ANÁLISIS LITERARIO Y FORENSE detallado de la siguiente historia narrada por ${activePersona.name}. 
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA: "${storyToAnalyze}"
OBJETIVO: Identificar temas centrales, simbolismo según el POV del personaje y coherencia narrativa.
LÍMITES: Máximo 4300 caracteres, párrafos de máximo 270 caracteres.
IDIOMA: ${lang}`;
      } else if (type === 'interview') {
        prompt = `Simula una ENTREVISTA crítica o diálogo en Modo Podcast donde se entrevista a ${activePersona.name} sobre los eventos de esta historia.
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA: "${storyToAnalyze}"
OBJETIVO: Diálogo dinámico, revelando motivaciones profundas del personaje.
LÍMITES: Máximo 4300 caracteres, párrafos de máximo 270 caracteres.
IDIOMA: ${lang}`;
      } else if (type === 'advance') {
        prompt = `Escribe un AVANCE DE HISTORIA (secuela inmediata) para esta narrativa.
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA ACTUAL: "${storyToAnalyze}"
OBJETIVO: Continuar la trama manteniendo el mismo tono y POV.
LÍMITES: Máximo 4300 caracteres, párrafos de máximo 270 caracteres.
IDIOMA: ${lang}`;
      }
      const res = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: prompt,
        config: { systemInstruction: `Eres ${activePersona.name}. Responde con tu voz única de acuerdo a tu archivo de identidad.` }
      })) as any;
      const result = res.text || "";
      setTrends(prev => prev.map(t => t.id === trend!.id ? { ...t, [type]: result } : t));
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend(prev => prev ? { ...prev, [type]: result } : null);
      }
    } catch (err: any) {
      setAppError(getErrorDetails(err));
    } finally {
      if (type === 'analysis') setIsAnalyzing(false);
      if (type === 'interview') setIsInterviewing(false);
      if (type === 'advance') setIsAdvancing(false);
    }
  };

  const handleGenerateFromIdea = async () => {
    if (!userIdea.trim()) return;
    setIsGeneratingIdea(true); setAppError(null); setLatestHybridTrend(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const languageText = getLanguageName(language);
      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: `USER BRIEF: ${userIdea}\nPERSONA: ${activePersona.name}\nIDENTITY: ${activePersona.identityContext}\nGenerate a complete narrative in ${languageText}.\nLIMITS: Max 4300 characters total. Max 270 characters per paragraph.`,
        config: { tools: [{ googleSearch: {} }], systemInstruction: `You are ${activePersona.name}.` }
      })) as any;
      const fullText = response.text || "";
      const newTrend: Trend = { id: `hybrid-${Date.now()}`, title: userIdea.substring(0, 50), originalSummary: userIdea, source: "Laboratorio Creativo", url: "", chunkybertoVersion: fullText };
      setTrends(prev => [newTrend, ...prev]); setLatestHybridTrend(newTrend);
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setIsGeneratingIdea(false); }
  };

  const handlePlayTTS = async (text: string): Promise<AudioBuffer | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const selectedStyle = NARRATION_STYLES.find(s => s.id === modelSettings.ttsStyle);
      const styleInstruction = selectedStyle?.instruction || "Voice this transcript: ";
      
      const res = await ai.models.generateContent({
        model: modelSettings.tts,
        // Refined prompt to avoid "Model tried to generate text" error
        contents: [{ parts: [{ text: text }] }],
        config: { 
          // Explicit system instruction for strictly TTS models
          systemInstruction: "You are a high-fidelity TTS engine. Your task is ONLY to output audio bytes. NEVER output text, explanations, or responses. Read the transcript exactly as provided according to the requested style.",
          responseModalities: [Modality.AUDIO], 
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: modelSettings.voiceName } 
            } 
          } 
        },
      }) as any;
      
      // Look for the inlineData part containing the audio bytes
      const audioPart = res.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      const base64Audio = audioPart?.inlineData?.data;
      
      if (base64Audio) {
        const ctx = await ensureAudioContext();
        const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource(); source.buffer = buffer; source.connect(ctx.destination);
        source.start(); return buffer;
      } else {
        console.error("TTS Warning: No audio data returned in response parts.", res);
      }
    } catch (e) { 
      console.error("TTS Error (V47.2.1):", e); 
      // Trigger error console if it's a critical API failure
      const details = getErrorDetails(e);
      if (!details.isQuota) setAppError(details);
    }
    return null;
  };

  const startStoryboardProduction = async () => {
    if (!selectedTrend || !selectedTrend.chunkybertoVersion) return;
    setProducingImages(true); setAppError(null);
    setSelectedTrend(prev => (prev ? { ...prev, storyboard: [] } : null));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const visualAnchorContext = activePersona.id === 'luna' 
        ? 'IMPORTANT: Whenever "Luna" or a cat is mentioned, the visual prompt MUST include an elegant SIAMESE CAT with sapphire blue eyes.' 
        : activePersona.id === 'chunkyberto' 
        ? 'IMPORTANT: Whenever "Chunkyberto" or a dog is mentioned, the visual prompt MUST include a friendly BLACK LABRADOR RETRIEVER.' 
        : activePersona.id === 'mayra'
        ? 'IMPORTANT: Whenever "Mayra" or the main character is mentioned, the visual prompt MUST include a radiant woman with wavy light brown hair, honey highlights and silver strands, large warm brown eyes, magenta lipstick, white pearl earrings, and a black polka dot blouse with a bow at the neck.'
        : (activePersona.id === 'erick_betancourt' || activePersona.id === 'erickberto')
        ? `IMPORTANT: Whenever "${activePersona.name}" or the protagonist is mentioned, the visual prompt MUST include a middle-aged man with dark curly hair and a receding hairline (high forehead), intelligent dark eyes, professional and analytical expression.`
        : `Visual Anchor: ${activePersona.visualProfile}`;
      
      const promptRes = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: `Generate 15 cinematic scenes for: "${selectedTrend.chunkybertoVersion}". ${visualAnchorContext} FORMAT: SCENE IDEA ||| IMAGE PROMPT ||| NARRATION TEXT. LENGUAJE: ${getLanguageName(language)}.`,
        config: { systemInstruction: "Format exactly with |||." }
      })) as any;
      const lines = (promptRes.text || "").split('\n').filter((p: string) => p.includes('|||')).slice(0, 15);
      const frames: StoryboardFrame[] = [];
      for (let i = 0; i < lines.length; i++) {
        let [rawIdea, rawPrompt, rawNarration] = lines[i].split('|||').map((s: string) => s.trim());
        frames.push({ id: `frame-${i}-${Date.now()}`, imageUrl: '', prompt: rawPrompt, originalIdea: rawIdea, narrationText: rawNarration, isGeneratingImage: true, dimension: videoDim, style: visualStyle });
      }
      setSelectedTrend(prev => (prev ? { ...prev, storyboard: [...frames] } : null));
      for (let i = 0; i < frames.length; i++) {
        try {
          const res = await ai.models.generateContent({ model: modelSettings.image, contents: { parts: [{ text: `Style: ${visualStyle}. ${frames[i].prompt}.` }] }, config: { imageConfig: { aspectRatio: videoDim } } }) as any;
          const imageData = res.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData)?.inlineData?.data;
          if (imageData) { frames[i].imageUrl = `data:image/png;base64,${imageData}`; frames[i].isGeneratingImage = false; }
          else { frames[i].hasError = true; frames[i].isGeneratingImage = false; }
        } catch (imgErr) { frames[i].hasError = true; frames[i].isGeneratingImage = false; }
        const updatedFrames = [...frames];
        setSelectedTrend(prev => (prev ? { ...prev, storyboard: updatedFrames } : null));
        await new Promise(r => setTimeout(r, 400));
      }
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setProducingImages(false); }
  };

  const handleGenerateIndividualImage = async (index: number) => {
    if (!selectedTrend || !selectedTrend.storyboard) return;
    const frame = selectedTrend.storyboard[index];
    const updateStoryboardState = (isGen: boolean) => {
      setSelectedTrend(prev => { if (!prev || !prev.storyboard) return prev; const up = [...prev.storyboard]; up[index] = { ...up[index], isGeneratingImage: isGen }; return { ...prev, storyboard: up }; });
    };
    updateStoryboardState(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({ model: modelSettings.image, contents: { parts: [{ text: `Style: ${visualStyle}. ${frame.prompt}.` }] }, config: { imageConfig: { aspectRatio: videoDim } } }) as any;
      const imageData = res.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData)?.inlineData?.data;
      if (imageData) {
        const url = `data:image/png;base64,${imageData}`;
        const finalize = (prev: Trend | null) => { if (!prev || !prev.storyboard) return prev; const current = [...prev.storyboard]; current[index] = { ...current[index], imageUrl: url, isGeneratingImage: false, videoUrl: undefined }; return { ...prev, storyboard: current }; };
        setSelectedTrend(finalize);
      } else { updateStoryboardState(false); }
    } catch (err: any) { setAppError(getErrorDetails(err)); updateStoryboardState(false); }
  };

  const handleGenerateIndividualVideo = async (index: number) => {
    if (!selectedTrend || !selectedTrend.storyboard) return;
    await ensureApiKeySelection();
    const frame = selectedTrend.storyboard[index];
    if (!frame.imageUrl) return;
    const updateStoryboardState = (isGen: boolean, error: boolean = false) => {
      setSelectedTrend(prev => { if (!prev || !prev.storyboard) return prev; const up = [...prev.storyboard]; up[index] = { ...up[index], isGeneratingVideo: isGen, hasError: error }; return { ...prev, storyboard: up }; });
    };
    updateStoryboardState(true, false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({ model: modelSettings.video, prompt: `${visualStyle} film: ${frame.originalIdea}.`, image: { imageBytes: frame.imageUrl.split(',')[1], mimeType: 'image/png' }, config: { numberOfVideos: 1, resolution: '720p', aspectRatio: videoDim } });
      while (!operation.done) { await new Promise(resolve => setTimeout(resolve, 10000)); operation = await ai.operations.getVideosOperation({ operation }); }
      const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const vidRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const vidBlob = await vidRes.blob();
        const vUrl = URL.createObjectURL(vidBlob);
        const finalize = (prev: Trend | null) => { if (!prev || !prev.storyboard) return prev; const current = [...prev.storyboard]; current[index] = { ...current[index], videoUrl: vUrl, videoBlob: vidBlob, isGeneratingVideo: false, hasError: false }; return { ...prev, storyboard: current }; };
        setSelectedTrend(finalize);
      } else { updateStoryboardState(false, true); }
    } catch (err: any) { setAppError(getErrorDetails(err)); updateStoryboardState(false, true); }
  };

  const handleCombineAllVideos = async () => {
    if (!selectedTrend || !selectedTrend.storyboard) return;
    const readyFrames = selectedTrend.storyboard.filter(f => f.videoUrl || f.imageUrl);
    if (readyFrames.length === 0) return;
    setIsCombiningVideos(true); setCombineProgress(0); setAppError(null);
    try {
      const ctx = await ensureAudioContext();
      const dest = ctx.createMediaStreamDestination();
      const canvas = document.createElement('canvas');
      const isPortrait = videoDim === '9:16'; canvas.width = isPortrait ? 720 : 1280; canvas.height = isPortrait ? 1280 : 720;
      const canvasCtx = canvas.getContext('2d'); if (!canvasCtx) throw new Error("Canvas context failed");
      const canvasStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9,opus' });
      const chunks: Blob[] = []; recorder.ondataavailable = (e) => chunks.push(e.data);
      const recorderPromise = new Promise<string>((resolve) => { recorder.onstop = () => { const blob = new Blob(chunks, { type: 'video/webm' }); resolve(URL.createObjectURL(blob)); }; });
      recorder.start();

      for (let i = 0; i < readyFrames.length; i++) {
        const frame = readyFrames[i]; setCombineProgress(Math.round(((i) / readyFrames.length) * 100));
        const audioBuffer = await handlePlayTTS(frame.narrationText); if (!audioBuffer) continue;
        const audioSource = ctx.createBufferSource(); audioSource.buffer = audioBuffer; audioSource.connect(dest); audioSource.start();
        const segmentDuration = audioBuffer.duration; const startTime = Date.now();
        
        let sourceElement: HTMLVideoElement | HTMLImageElement;
        if (frame.videoUrl) { 
          sourceElement = document.createElement('video'); sourceElement.src = frame.videoUrl; sourceElement.muted = true; sourceElement.playsInline = true; await (sourceElement as HTMLVideoElement).play(); 
        } else { 
          sourceElement = document.createElement('img'); sourceElement.src = frame.imageUrl; await new Promise(r => sourceElement.onload = r); 
        }

        while (Date.now() - startTime < segmentDuration * 1000) {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = elapsed / segmentDuration;
          
          canvasCtx.fillStyle = '#000'; canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
          
          let sW = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoWidth : sourceElement.naturalWidth;
          let sH = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoHeight : sourceElement.naturalHeight;
          const baseRatio = Math.max(canvas.width / sW, canvas.height / sH);
          
          let scale = 1.0;
          let offX = 0;
          let offY = 0;

          if (modelSettings.motionEffect === 'zoom_in') {
             scale = 1.0 + (progress * 0.18); 
          } else if (modelSettings.motionEffect === 'pan_right') {
             offX = progress * 120; 
          } else if (modelSettings.motionEffect === 'pan_left') {
             offX = -progress * 120;
          }

          const nW = sW * baseRatio * scale; const nH = sH * baseRatio * scale;
          
          let opacity = 1.0;
          if (modelSettings.transitionEffect === 'fade_black') {
            const transTime = 0.6;
            if (elapsed < transTime) opacity = elapsed / transTime;
            if (elapsed > segmentDuration - transTime) opacity = (segmentDuration - elapsed) / transTime;
          }

          canvasCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
          canvasCtx.drawImage(sourceElement, (canvas.width - nW) / 2 + offX, (canvas.height - nH) / 2 + offY, nW, nH);
          canvasCtx.globalAlpha = 1.0;

          await new Promise(r => requestAnimationFrame(r));
        }
        audioSource.stop();
      }
      setCombineProgress(100); recorder.stop(); const finalUrl = await recorderPromise; setCombinedVideoUrl(finalUrl);
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setIsCombiningVideos(false); }
  };

  const handleDownloadAll = async () => {
    if (!selectedTrend || !selectedTrend.storyboard || selectedTrend.storyboard.length === 0) return;
    setIsZipping(true);
    try {
        const zip = new JSZip();
        const rootFolder = zip.folder(`${selectedTrend.title.replace(/\s+/g, '_')}_Material`);
        rootFolder?.file("NARRATIVA_COMPLETA.txt", selectedTrend.chunkybertoVersion || "");
        if (selectedTrend.analysis) rootFolder?.file("ANALISIS_LITERARIO.txt", selectedTrend.analysis);
        if (selectedTrend.interview) rootFolder?.file("ENTREVISTA_PODCAST.txt", selectedTrend.interview);
        if (selectedTrend.advance) rootFolder?.file("AVANCE_HISTORIA.txt", selectedTrend.advance);
        if (selectedTrend.thumbnailUrl) { rootFolder?.file("YOUTUBE_THUMBNAIL.png", selectedTrend.thumbnailUrl.split(',')[1], { base64: true }); }
        for (let i = 0; i < selectedTrend.storyboard.length; i++) {
            const frame = selectedTrend.storyboard[i]; const sceneName = `Escena_${(i + 1).toString().padStart(2, '0')}`;
            rootFolder?.file(`${sceneName}_Narracion.txt`, frame.narrationText);
            if (frame.imageUrl) { rootFolder?.file(`${sceneName}_Imagen.png`, frame.imageUrl.split(',')[1], { base64: true }); }
            if (frame.videoBlob) { rootFolder?.file(`${sceneName}_Video.webm`, frame.videoBlob); }
        }
        if (combinedVideoUrl) { const res = await fetch(combinedVideoUrl); const blob = await res.blob(); rootFolder?.file(`PELICULA_MAESTRA.webm`, blob); }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a'); link.href = URL.createObjectURL(zipBlob); link.download = `Bundle_${selectedTrend.title.substring(0,15)}.zip`; link.click();
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setIsZipping(false); }
  };

  const visualStyles: ImageStyle[] = ['Cinematic', 'Anime', 'Cyberpunk', 'Oil Painting', 'Sketch', '3D Render', 'Neo-Noir', 'Photorealistic', 'CGI', 'Epic Fantasy'];
  const dimensions: VideoDimension[] = ['16:9', '9:16', '1:1', '4:3', '3:4'];
  const motionOptions: {id: MotionEffect, label: string}[] = [
    {id: 'none', label: 'Estático'},
    {id: 'zoom_in', label: 'Zoom In (Énfasis)'},
    {id: 'pan_right', label: 'Pan Derecha'},
    {id: 'pan_left', label: 'Pan Izquierda'}
  ];
  const transitionOptions: {id: TransitionEffect, label: string}[] = [
    {id: 'cut', label: 'Corte Directo'},
    {id: 'fade_black', label: 'Fundido Negro'},
    {id: 'cross_dissolve', label: 'Disolvencia Cruzada (BETA)'}
  ];

  const categoryOptions = [
    { id: 'animal_news', label: 'Noticias Animales', icon: <Search size={14} /> },
    { id: 'horror', label: 'Terror', icon: <Ghost size={14} /> },
    { id: 'poe_inspired', label: 'Inspirado en Poe', icon: <ScrollText size={14} /> },
    { id: 'inspiring', label: 'Historias Inspiradoras', icon: <Heart size={14} /> },
    { id: 'space', label: 'Espacio y Cosmos', icon: <Orbit size={14} /> },
    { id: 'ocean', label: 'Misterios del Océano', icon: <Waves size={14} /> },
    { id: 'history', label: 'Crónicas Históricas', icon: <HistoryIcon size={14} /> },
    { id: 'cyberpunk', label: 'Distopía Cyberpunk', icon: <Terminal size={14} /> },
    { id: 'nature', label: 'Vida Silvestre', icon: <Trees size={14} /> },
    { id: 'internet_myths', label: 'Mitos de Internet', icon: <Globe size={14} /> },
    { id: 'dinosaurs', label: 'Mundo Jurásico', icon: <Skull size={14} /> },
    { id: 'scientists', label: 'Vidas de Científicos', icon: <FlaskConical size={14} /> },
    { id: 'science_facts', label: 'Hechos Científicos', icon: <Lightbulb size={14} /> },
    { id: 'horror_lit', label: 'Literatura de Terror', icon: <BookOpen size={14} /> },
    { id: 'sci_fi', label: 'Ciencia Ficción Clásica', icon: <Zap size={14} /> },
    { id: 'ai_mystery_horror', label: 'Terror Felino Misterioso', icon: <Cat size={14} />, exclusive: 'luna' },
    { id: 'ai_sci_fi', label: 'Sci-Fi Felino', icon: <Rocket size={14} />, exclusive: 'luna' },
    { id: 'ai_fables', label: 'Fábulas de Luna', icon: <Library size={14} />, exclusive: 'luna' },
    { id: 'ai_romantic_drama', label: 'Drama Romántico', icon: <Heart size={14} />, exclusive: 'luna' },
    { id: 'ai_labrador_mischief', label: 'Travesuras de Labrador', icon: <Dog size={14} />, exclusive: 'chunkyberto' },
    { id: 'ai_beauty_tips', label: 'Tips de Belleza', icon: <Sparkles size={14} />, exclusive: 'mayra' },
    { id: 'ai_nutrition', label: 'Nutrición y Bienestar', icon: <Activity size={14} />, exclusive: 'mayra' },
    { id: 'ai_real_estate_sales', label: 'Ventas Real Estate', icon: <Coins size={14} />, exclusive: 'mayra' },
    { id: 'ai_home_remedies', label: 'Remedios Caseros', icon: <Home size={14} />, exclusive: 'mayra' },
    { id: 'ai_catholic_events', label: 'Eventos Católicos', icon: <Cross size={14} />, exclusive: 'mayra' },
    { id: 'news_real_estate', label: 'Noticias Inmobiliarias', icon: <Newspaper size={14} />, exclusive: 'mayra' },
    { id: 'ai_modern_mcus', label: 'Microcontroladores Modernos', icon: <Cpu size={14} />, exclusive: 'erick_betancourt' },
    { id: 'ai_embedded_linux', label: 'Embedded Linux', icon: <Terminal size={14} />, exclusive: 'erick_betancourt' },
    { id: 'ai_embedded_wireless', label: 'Wireless Embedded', icon: <Radio size={14} />, exclusive: 'erick_betancourt' },
    { id: 'ai_embedded_mcu', label: 'MCU Systems Advanced', icon: <Settings2 size={14} />, exclusive: 'erick_betancourt' },
    { id: 'ai_space_documentary', label: 'Documental Espacial', icon: <Globe size={14} />, exclusive: 'erickberto' },
    { id: 'ai_galactic', label: 'Misterios Galácticos', icon: <Dna size={14} />, exclusive: 'erickberto' },
  ].filter(opt => !opt.exclusive || selectedPersonaId === opt.exclusive);

  const ForensicToolkit: React.FC<{ targetTrend?: Trend }> = ({ targetTrend }) => {
    const trend = targetTrend || selectedTrend;
    if (!trend) return null;
    return (
      <div className="bg-purple-900/10 border-2 border-purple-500/20 p-6 rounded-[2.5rem] shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] animate-in slide-in-from-top-4 duration-500 my-4">
        <div className="flex items-center gap-2 mb-6 px-2"><Wand2 size={16} className="text-purple-400" /><span className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-300">Forensic Modifiers (Toggle)</span></div>
        <div className="grid grid-cols-1 gap-3">
           <button onClick={() => handleAdvancedForensic('analysis', trend)} disabled={isAnalyzing || (rewritingId === trend.id)} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${forensicToggles.analysis ? 'bg-purple-500 text-slate-950 shadow-purple-500/40' : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50'}`}><div className="flex items-center gap-2"><BrainCircuit size={16} /> Análisis Literario</div>{isAnalyzing || (rewritingId === trend.id) ? <Loader2 size={14} className="animate-spin" /> : forensicToggles.analysis ? <Check size={14} /> : <ChevronRight size={14} />}</button>
           <button onClick={() => handleAdvancedForensic('interview', trend)} disabled={isInterviewing || (rewritingId === trend.id)} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${forensicToggles.interview ? 'bg-indigo-500 text-slate-950 shadow-indigo-500/40' : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'}`}><div className="flex items-center gap-2"><MicVocal size={16} /> Modo Entrevista</div>{isInterviewing || (rewritingId === trend.id) ? <Loader2 size={14} className="animate-spin" /> : forensicToggles.interview ? <Check size={14} /> : <ChevronRight size={14} />}</button>
           <button onClick={() => handleAdvancedForensic('advance', trend)} disabled={isAdvancing || (rewritingId === trend.id)} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${forensicToggles.advance ? 'bg-fuchsia-500 text-slate-950 shadow-fuchsia-500/40' : 'bg-fuchsia-900/40 text-fuchsia-300 hover:bg-fuchsia-800/50'}`}><div className="flex items-center gap-2"><FastForward size={16} /> Avance de Historia</div>{isAdvancing || (rewritingId === trend.id) ? <Loader2 size={14} className="animate-spin" /> : forensicToggles.advance ? <Check size={14} /> : <ChevronRight size={14} />}</button>
        </div>
      </div>
    );
  };

  const masterRecapTrend = trends.find(t => t.isMasterSummary);

  return (
    <div className={`min-h-screen pb-40 text-slate-100 bg-[#0f172a] selection:bg-${activePersona.color}/30`}>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-3xl border-b border-slate-800 px-4 py-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTrend(null)}>
          <div className={`bg-${activePersona.color} p-2.5 rounded-xl shadow-lg`}>{activePersona.icon}</div>
          <h1 className="font-black text-xl tracking-tighter text-white uppercase italic">STUDIO<span className={`text-${activePersona.color}`}>.</span>MULTI</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">Economical Mode Active</span>
            <span className="text-[7px] font-black text-slate-500 uppercase">V47.2.1</span>
          </div>
          {ytChannelUrl && (
            <a 
              href={ytChannelUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Mi Canal de YouTube"
              className="p-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20 transition-all flex items-center gap-2"
            >
              <Youtube size={18} />
              <span className="hidden lg:inline text-[9px] font-black uppercase tracking-tighter">Mi Canal</span>
            </a>
          )}
          <button 
            onClick={() => setIsDraftsModalOpen(true)}
            className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all flex items-center gap-2"
            title="Mis Borradores"
          >
            <Archive size={18} />
            <span className="hidden lg:inline text-[9px] font-black uppercase tracking-tighter">Borradores</span>
          </button>
          <button onClick={handleSelectKey} className={`p-2.5 rounded-xl bg-slate-800 text-${activePersona.color} border border-slate-700 shadow-md`}><Key size={18} /></button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700"><Settings size={18} /></button>
        </div>
      </header>

      {(isCombiningVideos || isZipping) && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center">
           <div className="relative mb-12"><div className={`w-40 h-40 rounded-full border-8 border-slate-800 border-t-${activePersona.color} animate-spin`}></div><div className="absolute inset-0 flex items-center justify-center">{isZipping ? <FileArchive size={48} className={`text-${activePersona.color} animate-pulse`} /> : <Film size={48} className={`text-${activePersona.color} animate-pulse`} />}</div></div>
           <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{isZipping ? 'Empaquetando Bundle' : 'Sintetizando Película'}</h2>
           {isCombiningVideos && (<><div className="w-full max-w-2xl h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 mb-4 shadow-inner"><div className={`h-full bg-gradient-to-r from-${activePersona.color} to-indigo-500 transition-all duration-500`} style={{ width: `${combineProgress}%` }}></div></div><div className="flex justify-between w-full max-w-2xl text-[10px] font-black uppercase tracking-widest text-slate-500"><span>PROGRESO TOTAL</span><span className="text-white">{combineProgress}%</span></div></>)}
        </div>
      )}

      {selectedTrend && combinedVideoUrl && (
        <YouTubeUploadModal 
          isOpen={isYouTubeModalOpen} 
          onClose={() => setIsYouTubeModalOpen(false)}
          trend={selectedTrend}
          videoUrl={combinedVideoUrl}
          activePersona={activePersona}
          ytChannelUrl={ytChannelUrl}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        ytChannelUrl={ytChannelUrl}
        onYtChannelUrlChange={setYtChannelUrl}
        activePersona={activePersona}
      />

      <main className="max-w-7xl mx-auto px-4 pt-10">
        {selectedTrend ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 mb-40">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <button onClick={() => setSelectedTrend(null)} className={`flex items-center gap-2 text-${activePersona.color} font-black uppercase text-sm tracking-widest bg-slate-900/50 px-8 py-4 rounded-full border border-slate-800 hover:bg-slate-800 transition-all shadow-xl active:scale-95`}><ArrowLeft size={18} /> VOLVER A TENDENCIAS</button>
                {selectedTrend.storyboard && selectedTrend.storyboard.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={handleDownloadAll} disabled={isZipping} className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white font-black uppercase text-sm tracking-widest rounded-full shadow-2xl border-2 border-slate-700 hover:border-slate-500 transition-all active:scale-95 disabled:opacity-30"><Archive size={20} /> ZIP</button>
                    {combinedVideoUrl ? (
                      <>
                        <a href={combinedVideoUrl} download={`${selectedTrend.title.substring(0,10)}_Master.webm`} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-emerald-400 transition-all active:scale-95"><Download size={20} /> DESCARGAR</a>
                        <button onClick={() => setIsYouTubeModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-red-500 transition-all active:scale-95 ring-4 ring-red-600/20"><Youtube size={20} /> SUBIR A YOUTUBE</button>
                      </>
                    ) : (
                      <button onClick={handleCombineAllVideos} disabled={isCombiningVideos} className={`flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-30`}><Film size={20} /> SINTETIZAR PELÍCULA COMPLETA</button>
                    )}
                  </div>
                )}
             </div>
             {appError && <DetailedErrorConsole error={appError} activePersona={activePersona} onClose={() => setAppError(null)} onRetry={fetchTrends} />}
             
             <div className="mb-12">
               <div className={`p-8 rounded-[4rem] bg-slate-900/50 border-4 border-slate-800 backdrop-blur-sm flex flex-col md:flex-row items-center gap-10`}>
                 <div className="md:w-1/3 aspect-video bg-slate-950 rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl flex items-center justify-center relative">
                    {selectedTrend.thumbnailUrl ? (<img src={selectedTrend.thumbnailUrl} className="w-full h-full object-cover" alt="YouTube Thumbnail" />) : (<div className="flex flex-col items-center gap-3 text-slate-700"><Youtube size={64} /><span className="text-[10px] font-black uppercase tracking-widest">Sin Miniatura</span></div>)}
                    {generatingThumbnail && (<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20"><Loader2 className="animate-spin text-emerald-500 mb-4" size={48} /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Generando Portada...</span></div>)}
                 </div>
                 <div className="flex-1 space-y-4"><h3 className="text-3xl font-black uppercase italic tracking-tighter">YouTube <span className={`text-${activePersona.color}`}>Cover Art.</span></h3><p className="text-slate-400 text-sm font-medium italic">"Arte de portada optimizado para YouTube utilizando el perfil visual de {activePersona.name}."</p><button onClick={handleGenerateThumbnail} disabled={generatingThumbnail} className={`px-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-700 hover:border-${activePersona.color} transition-all shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-50`}>{generatingThumbnail ? <Loader2 size={18} className="animate-spin" /> : <LucideImage size={18} />}{selectedTrend.thumbnailUrl ? 'RE-GENERAR MINIATURA' : 'GENERAR MINIATURA PRO'}</button></div>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-[4rem] border-2 border-slate-700 shadow-2xl sticky top-32">
                      <div className="flex items-center gap-3 mb-8"><ScrollText size={24} className={`text-${activePersona.color}`} /><span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Guion Literario</span></div>
                      <h3 className={`text-3xl font-black uppercase italic text-${activePersona.color} mb-8 leading-none tracking-tighter`}>{selectedTrend.title}</h3>
                      <div className="bg-slate-950/80 p-8 rounded-[2.5rem] mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar border border-slate-700/50 shadow-inner"><p className="text-base text-slate-100 font-bold leading-relaxed whitespace-pre-wrap italic">"{selectedTrend.chunkybertoVersion || "Borrador original: " + selectedTrend.originalSummary}"</p></div>
                      <button onClick={() => handlePlayTTS(selectedTrend.chunkybertoVersion || selectedTrend.originalSummary)} className={`w-full py-6 rounded-[2rem] bg-slate-900 text-${activePersona.color} border-2 border-slate-800 hover:border-${activePersona.color}/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl`}><Volume2 size={24} /> ESCUCHAR COMPLETO</button>
                      <button onClick={handleSaveDraft} className={`w-full py-6 mt-4 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl`}><Archive size={24} /> GUARDAR BORRADOR</button>
                      <div className="mt-8 border-t border-slate-700/50 pt-8"><ForensicToolkit /></div>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-12">
                   {(selectedTrend.analysis || selectedTrend.interview || selectedTrend.advance) && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-top-6 duration-500">
                        {selectedTrend.analysis && (<div className="bg-purple-900/10 border-2 border-purple-500/20 p-8 rounded-[3rem] relative group shadow-2xl"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-[0.3em]"><BrainCircuit size={16} /> Resultado Análisis Literario</div><div className="flex items-center gap-2"><CopyButton text={selectedTrend.analysis} /><button onClick={() => { setSelectedTrend(prev => prev ? {...prev, analysis: undefined} : null); }} className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400"><X size={14}/></button></div></div><p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{selectedTrend.analysis}</p></div>)}
                        {selectedTrend.interview && (<div className="bg-indigo-900/10 border-2 border-indigo-500/20 p-8 rounded-[3rem] relative group shadow-2xl"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]"><RadioTower size={16} /> Transcripción Entrevista Persona</div><div className="flex items-center gap-2"><CopyButton text={selectedTrend.interview} /><button onClick={() => { setSelectedTrend(prev => prev ? {...prev, interview: undefined} : null); }} className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400"><X size={14}/></button></div></div><p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{selectedTrend.interview}</p></div>)}
                        {selectedTrend.advance && (<div className="bg-fuchsia-900/10 border-2 border-fuchsia-500/20 p-8 rounded-[3rem] relative group shadow-2xl"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-fuchsia-400 font-black text-[10px] uppercase tracking-[0.3em]"><Stars size={16} /> Secuela / Avance Narrativo</div><div className="flex items-center gap-2"><CopyButton text={selectedTrend.advance} /><button onClick={() => { setSelectedTrend(prev => prev ? {...prev, advance: undefined} : null); }} className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400"><X size={14}/></button></div></div><p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{selectedTrend.advance}</p></div>)}
                     </div>
                   )}

                   {!selectedTrend.storyboard || selectedTrend.storyboard.length === 0 ? (
                     <div className="py-16 px-10 bg-slate-900/50 rounded-[4rem] border-4 border-slate-800 backdrop-blur-sm">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                          <div className="lg:w-2/3 space-y-8">
                             <div className={`w-20 h-20 bg-${activePersona.color}/20 text-${activePersona.color} rounded-3xl flex items-center justify-center shadow-lg`}><MovieIcon size={40} /></div>
                             <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter">Estudio de <br/><span className={`text-${activePersona.color}`}>Producción Global.</span></h2>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Define el ADN visual, auditivo y de movimiento de toda la obra.</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Estilo Visual Maestro</label>
                                   <div className="relative"><select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value as ImageStyle)} className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">{visualStyles.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Palette size={16} /></div></div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Formato Maestro</label>
                                   <div className="flex gap-2">{dimensions.map(dim => (<button key={dim} onClick={() => setVideoDim(dim)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] transition-all ${videoDim === dim ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{dim}</button>))}</div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Actor de Voz / Género</label>
                                   <div className="relative"><select value={modelSettings.voiceName} onChange={(e) => setModelSettings({...modelSettings, voiceName: e.target.value})} className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">{AVAILABLE_VOICES.map(v => <option key={v.id} value={v.id}>{v.name.toUpperCase()} - {v.gender.toUpperCase()} ({v.accent.toUpperCase()})</option>)}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Mic2 size={16} /></div></div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Tono de Narración</label>
                                   <div className="relative"><select value={modelSettings.ttsStyle} onChange={(e) => setModelSettings({...modelSettings, ttsStyle: e.target.value as TtsStyle})} className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">{NARRATION_STYLES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Radio size={16} /></div></div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Efecto de Movimiento</label>
                                   <div className="relative"><select value={modelSettings.motionEffect} onChange={(e) => setModelSettings({...modelSettings, motionEffect: e.target.value as MotionEffect})} className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">{motionOptions.map(m => <option key={m.id} value={m.id}>{m.label.toUpperCase()}</option>)}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Move size={16} /></div></div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Tipo de Transición</label>
                                   <div className="relative"><select value={modelSettings.transitionEffect} onChange={(e) => setModelSettings({...modelSettings, transitionEffect: e.target.value as TransitionEffect})} className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">{transitionOptions.map(t => <option key={t.id} value={t.id}>{t.label.toUpperCase()}</option>)}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Shuffle size={16} /></div></div>
                                </div>
                             </div>
                          </div>
                          <div className="lg:w-1/3 flex justify-center"><button onClick={startStoryboardProduction} disabled={producingImages} className={`bg-${activePersona.color} text-slate-950 px-12 py-12 rounded-full font-black uppercase italic text-2xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 text-center flex flex-col items-center gap-4`}><div className="w-16 h-16 bg-slate-950/20 rounded-full flex items-center justify-center">{producingImages ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}</div>{producingImages ? 'PROCESANDO...' : 'SINTETIZAR TODO'}</button></div>
                        </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 gap-16">
                      <div className="bg-slate-900/80 border-2 border-slate-700 p-6 rounded-[2rem] flex flex-wrap items-center justify-between gap-4 shadow-xl">
                        <div className="flex flex-wrap items-center gap-6"><div className="flex items-center gap-2"><Palette size={14} className="text-slate-500"/><span className="text-[9px] font-black uppercase text-white tracking-widest">{visualStyle}</span></div><div className="flex items-center gap-2"><Maximize size={14} className="text-slate-500"/><span className="text-[9px] font-black uppercase text-white tracking-widest">{videoDim}</span></div><div className="flex items-center gap-2"><Mic2 size={14} className="text-slate-500"/><span className="text-[9px] font-black uppercase text-white tracking-widest">{AVAILABLE_VOICES.find(v => v.id === modelSettings.voiceName)?.name} ({AVAILABLE_VOICES.find(v => v.id === modelSettings.voiceName)?.gender})</span></div><div className="flex items-center gap-2"><Move size={14} className="text-slate-500"/><span className="text-[9px] font-black uppercase text-white tracking-widest">{motionOptions.find(m => m.id === modelSettings.motionEffect)?.label}</span></div><div className="flex items-center gap-2"><Shuffle size={14} className="text-slate-500"/><span className="text-[9px] font-black uppercase text-white tracking-widest">{transitionOptions.find(t => t.id === modelSettings.transitionEffect)?.label}</span></div></div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12}/> ADN BLOQUEADO</span>
                      </div>
                      {selectedTrend.storyboard?.map((frame, i) => (
                        <div key={frame.id} className={`p-12 rounded-[5rem] bg-slate-800/30 border-2 ${frame.hasError ? 'border-rose-500/50' : 'border-slate-800'} shadow-2xl backdrop-blur-sm group/frame transition-all hover:bg-slate-800/40 animate-in zoom-in-95 duration-700`}>
                            <div className="flex items-center justify-between mb-10"><div className="flex items-center gap-6"><span className={`w-16 h-16 flex items-center justify-center ${frame.hasError ? 'bg-rose-500/20 text-rose-500' : `bg-${activePersona.color}/20 text-${activePersona.color}`} rounded-[1.5rem] font-black text-3xl shadow-xl border border-current opacity-80`}>{i+1}</span><div><h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-2">ESCENA {i+1} de 15</h4><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{frame.originalIdea}</p></div></div></div>
                            <div className="relative mb-6 group/preview">
                              <div className={`aspect-video bg-slate-950 rounded-[4rem] overflow-hidden border-[12px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative transition-all duration-700 ${videoDim === '9:16' ? 'max-w-[300px] mx-auto' : videoDim === '1:1' ? 'aspect-square max-w-[500px] mx-auto' : ''}`}>
                                {frame.videoUrl ? <video src={frame.videoUrl} autoPlay muted loop className="w-full h-full object-cover" /> : frame.imageUrl ? <img src={frame.imageUrl} className="w-full h-full object-cover" alt={`Frame ${i+1}`} /> : <div className="w-full h-full flex items-center justify-center bg-slate-900/50"><Loader2 className="animate-spin text-slate-700" size={48} /></div>}
                                {(frame.isGeneratingVideo || frame.isGeneratingImage) && (<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center z-20"><Loader2 className="animate-spin text-emerald-500 mb-6" size={64} /><span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-500 animate-pulse">{frame.isGeneratingVideo ? 'FILMANDO...' : 'RE-IMAGINANDO...'}</span></div>)}
                              </div>
                            </div>

                            <div className="mb-6 space-y-2">
                               <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4"><Edit3 size={12} /> Guion de Audio (Editable)</label>
                               <textarea 
                                 value={frame.narrationText} 
                                 onChange={(e) => handleUpdateNarration(i, e.target.value)}
                                 className={`w-full p-6 bg-slate-950/80 border-2 border-slate-700 rounded-[2rem] font-bold text-slate-100 text-sm leading-relaxed outline-none focus:border-${activePersona.color} transition-all custom-scrollbar min-h-[100px]`}
                                 placeholder="Escribe el texto que la IA narrará para esta escena..."
                               />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-10 overflow-x-auto custom-scrollbar pb-2">
                               {frame.imageUrl && (
                                 <div className="relative group/asset">
                                   <div className="w-24 aspect-video rounded-xl overflow-hidden border-2 border-slate-700 group-hover/asset:border-emerald-500 transition-all bg-slate-900 shadow-lg">
                                     <img src={frame.imageUrl} className="w-full h-full object-cover opacity-60 group-hover/asset:opacity-100 transition-opacity" alt="Asset Image" />
                                   </div>
                                   <div className="absolute top-1 left-1 bg-slate-950/80 p-0.5 rounded text-[7px] font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-0.5"><LucideImage size={8}/> IMG</div>
                                 </div>
                               )}
                               {frame.videoUrl && (
                                 <div className="relative group/asset">
                                   <div className="w-24 aspect-video rounded-xl overflow-hidden border-2 border-indigo-500 group-hover/asset:border-indigo-400 transition-all bg-slate-900 shadow-lg">
                                     <video src={frame.videoUrl} muted autoPlay loop className="w-full h-full object-cover opacity-80" />
                                   </div>
                                   <div className="absolute top-1 left-1 bg-indigo-500 p-0.5 rounded text-[7px] font-black text-white uppercase tracking-tighter flex items-center gap-0.5"><Video size={8}/> VID</div>
                                 </div>
                               )}
                               {!frame.videoUrl && !frame.isGeneratingVideo && frame.imageUrl && (
                                 <div className="w-24 aspect-video rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-1 bg-slate-900/50">
                                   <PlayCircle size={14} className="text-slate-600" />
                                   <span className="text-[7px] font-black text-slate-600 uppercase">NO VID</span>
                                 </div>
                               )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <button onClick={() => handleGenerateIndividualImage(i)} disabled={frame.isGeneratingImage || frame.isGeneratingVideo} title={`Usando estilo: ${visualStyle}`} className={`py-6 rounded-[2.5rem] bg-slate-900 text-${activePersona.color} border-2 border-slate-800 hover:border-${activePersona.color}/50 font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30`}><Repeat size={18} /> RE-IMAGINAR</button>
                              <button onClick={() => handleGenerateIndividualVideo(i)} disabled={frame.isGeneratingVideo || !frame.imageUrl || frame.isGeneratingImage} className={`py-6 rounded-[2.5rem] ${frame.videoUrl ? 'bg-indigo-900/30 text-indigo-400 border-2 border-indigo-500/30' : `bg-indigo-600 text-white`} font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30`}>{frame.videoUrl ? <RefreshCcw size={18} /> : <Zap size={18} />} {frame.videoUrl ? 'RE-FILMAR' : 'GENERAR VIDEO'}</button>
                              <button onClick={() => handlePlayTTS(frame.narrationText)} className="py-6 rounded-[2.5rem] bg-slate-900 text-slate-400 border-2 border-slate-800 font-black text-xs uppercase shadow-2xl hover:text-white transition-all flex items-center justify-center gap-3 active:scale-90"><Volume2 size={18} /> ESCUCHAR VOZ</button>
                            </div>
                        </div>
                      ))}
                      {producingImages && selectedTrend.storyboard && selectedTrend.storyboard.length < 15 && <div className="p-16 rounded-[5rem] bg-slate-900/20 border-4 border-slate-800 border-dashed flex flex-col items-center justify-center min-h-[500px]"><Loader2 size={64} className={`animate-spin text-${activePersona.color} mb-8`} /><h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Sintetizando Storyboard...</h4></div>}
                     </div>
                   )}
                </div>
             </div>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto mb-16 space-y-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Identidad Activa</label>
                <div className="relative group"><div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none text-${activePersona.color} z-10`}>{activePersona.icon}</div><select value={selectedPersonaId} onChange={(e) => { setSelectedPersonaId(e.target.value); setTrends([]); hasInitialFetchedRef.current = false; }} className={`w-full pl-12 pr-10 py-6 bg-slate-900 border-2 border-slate-800 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] text-white appearance-none cursor-pointer focus:border-${activePersona.color} focus:outline-none transition-all shadow-2xl`}>{PERSONAS.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()} - {p.role.toUpperCase()}</option>)}</select><div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-500"><ChevronDown size={18} /></div></div>
              </div>
              {appError && <DetailedErrorConsole error={appError} activePersona={activePersona} onClose={() => setAppError(null)} onRetry={fetchTrends} />}
              <div className="flex flex-col gap-6 items-center text-center"><h2 className="text-4xl xs:text-5xl font-black italic text-white leading-none tracking-tighter uppercase">Studio de <span className={`text-${activePersona.color}`}>{activePersona.name}.</span></h2></div>
              <div className="flex flex-col sm:flex-row items-center gap-4"><div className="flex-1 relative w-full"><select value={category} onChange={(e) => { setCategory(e.target.value as Category); setTrends([]); hasInitialFetchedRef.current = false; }} className={`w-full px-8 py-5 bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-white appearance-none cursor-pointer focus:border-${activePersona.color} focus:outline-none transition-all shadow-2xl`}>{categoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}</select></div></div>
              <div className="space-y-6">
                {masterRecapTrend && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <ForensicToolkit targetTrend={masterRecapTrend} />
                    
                    {/* Forensic Results for Master Recap */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {masterRecapTrend.analysis && (
                        <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><BrainCircuit size={14}/> Análisis Maestro</span>
                            <CopyButton text={masterRecapTrend.analysis} />
                          </div>
                          <p className="text-xs text-slate-300 italic line-clamp-6">{masterRecapTrend.analysis}</p>
                        </div>
                      )}
                      {masterRecapTrend.interview && (
                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><MicVocal size={14}/> Entrevista Maestra</span>
                            <CopyButton text={masterRecapTrend.interview} />
                          </div>
                          <p className="text-xs text-slate-300 italic line-clamp-6">{masterRecapTrend.interview}</p>
                        </div>
                      )}
                      {masterRecapTrend.advance && (
                        <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-2"><FastForward size={14}/> Avance Maestro</span>
                            <CopyButton text={masterRecapTrend.advance} />
                          </div>
                          <p className="text-xs text-slate-300 italic line-clamp-6">{masterRecapTrend.advance}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mt-4 mb-4">
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Actuando sobre: MASTER RECAP SESSION</span>
                    </div>
                  </div>
                )}
                <button onClick={() => { setAppError(null); fetchTrends(); }} disabled={loadingTrends} className={`w-full py-6 bg-${activePersona.color} text-slate-950 active:scale-95 rounded-2xl font-black uppercase text-lg shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50`}>{loadingTrends ? <Loader2 className="animate-spin" size={24} /> : activePersona.icon}{loadingTrends ? "SCANNEANDO TENDENCIAS..." : `INICIAR SESIÓN CON ${activePersona.name.toUpperCase()}`}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">{trends.map(t => <TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} isRewriting={rewritingId === t.id} language={language} persona={activePersona} />)}</div>
            <div className="max-w-4xl mx-auto mt-20 mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className={`bg-slate-900 border-4 border-${activePersona.color}/30 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group`}><div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 text-${activePersona.color}`}><FlaskRound size={120} /></div>
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2"><div className={`flex items-center gap-3 text-${activePersona.color} font-black uppercase text-[10px] tracking-[0.4em]`}><FlaskRound size={18} /> LABORATORIO DE IDEAS V47.2.1</div><h3 className="text-3xl font-black uppercase italic leading-none">COMPOSITOR <span className={`text-${activePersona.color}`}>CREATIVO HÍBRIDO</span></h3></div>
                  <textarea value={userIdea} onChange={(e) => setUserIdea(e.target.value)} placeholder='Escribe tu idea o un link...' className={`w-full min-h-[180px] p-6 bg-slate-950 border-2 border-slate-800 rounded-[1.5rem] font-bold text-slate-100 focus:border-${activePersona.color} outline-none transition-all custom-scrollbar text-sm shadow-inner`} />
                  {latestHybridTrend && (<div className="bg-slate-950/80 border-2 border-emerald-500/30 p-8 rounded-[2rem] animate-in zoom-in-95 duration-500"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest"><Check size={16} /> Narrativa Generada</div><CopyButton text={latestHybridTrend.chunkybertoVersion || ""} /></div><p className="text-slate-100 font-bold text-sm italic mb-8 line-clamp-4">"{latestHybridTrend.chunkybertoVersion}"</p><button onClick={() => handleSelectTrend(latestHybridTrend)} className={`w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all active:scale-95`}><Video size={18} /> IR AL ESTUDIO CINEMATOGRÁFICO</button></div>)}
                  <button onClick={handleGenerateFromIdea} disabled={isGeneratingIdea || !userIdea.trim()} className={`w-full py-6 bg-${activePersona.color} text-slate-950 rounded-2xl font-black uppercase text-base italic tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30`}>{isGeneratingIdea ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}{isGeneratingIdea ? "CONSTRUYENDO NARRATIVA..." : "EJECUTAR BRIEF CREATIVO"}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 py-4 px-6 flex justify-between items-center z-40"><div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">V47.2.1 | TTS Validated | YouTube Sync | Publisher Pro | Editable Narration (ENT) | Asset Strip (SAS)</div><div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[8px] font-black uppercase text-slate-400">IA ACTIVA</span></div></footer>

      {isDraftsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsDraftsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 p-2 rounded-xl text-slate-950"><Archive size={20} /></div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Mis <span className="text-indigo-400">Borradores</span></h3>
              </div>
              <button onClick={() => setIsDraftsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {drafts.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Archive size={48} className="mx-auto text-slate-700" />
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No tienes borradores guardados.</p>
                </div>
              ) : (
                drafts.map(draft => (
                  <div key={draft.id} className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl flex items-center justify-between gap-4 hover:border-indigo-500/50 transition-all group">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-white uppercase truncate mb-1">{draft.name}</h4>
                      <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>{new Date(draft.date).toLocaleString()}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>{PERSONAS.find(p => p.id === draft.personaId)?.name}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>{draft.trends.length} Historias</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleLoadDraft(draft)}
                        className="px-4 py-2 bg-indigo-500 text-slate-950 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-indigo-400 transition-all active:scale-95"
                      >
                        Cargar
                      </button>
                      <button 
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-2 text-slate-500 hover:text-rose-500 transition-all"
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root'); if (rootElement) { const root = ReactDOM.createRoot(rootElement); root.render(<App />); }