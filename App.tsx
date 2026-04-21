import React, { useState, useEffect, useCallback, useRef } from 'react';

import { GoogleGenAI, Modality } from "@google/genai";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Link as LinkIcon,
  Telescope,
  LayoutGrid,
  CheckCircle,
  UserPlus
} from 'lucide-react';

// Tailwind v4 safelist for dynamic persona colors
const SAFELIST_COLORS = [
  "bg-amber-500", "text-amber-500", "border-amber-500", "selection:bg-amber-500/30", "from-amber-500", "focus:border-amber-500", "hover:border-amber-500/30", "hover:border-amber-500/50", "border-amber-500/30", "bg-amber-500/20", "text-amber-500/20", "text-amber-700", "bg-amber-700", "border-amber-700",
  "bg-blue-500", "text-blue-500", "border-blue-500", "selection:bg-blue-500/30", "from-blue-500", "focus:border-blue-500", "hover:border-blue-500/30", "hover:border-blue-500/50", "border-blue-500/30", "bg-blue-500/20", "text-blue-500/20", "text-blue-700", "bg-blue-700", "border-blue-700",
  "bg-purple-500", "text-purple-500", "border-purple-500", "selection:bg-purple-500/30", "from-purple-500", "focus:border-purple-500", "hover:border-purple-500/30", "hover:border-purple-500/50", "border-purple-500/30", "bg-purple-500/20", "text-purple-500/20", "text-purple-700", "bg-purple-700", "border-purple-700",
  "bg-indigo-500", "text-indigo-500", "border-indigo-500", "selection:bg-indigo-500/30", "from-indigo-500", "focus:border-indigo-500", "hover:border-indigo-500/30", "hover:border-indigo-500/50", "border-indigo-500/30", "bg-indigo-500/20", "text-indigo-500/20", "text-indigo-700", "bg-indigo-700", "border-indigo-700",
  "bg-pink-500", "text-pink-500", "border-pink-500", "selection:bg-pink-500/30", "from-pink-500", "focus:border-pink-500", "hover:border-pink-500/30", "hover:border-pink-500/50", "border-pink-500/30", "bg-pink-500/20", "text-pink-500/20", "text-pink-700", "bg-pink-700", "border-pink-700",
  "bg-emerald-500", "text-emerald-500", "border-emerald-500", "selection:bg-emerald-500/30", "from-emerald-500", "focus:border-emerald-500", "hover:border-emerald-500/30", "hover:border-emerald-500/50", "border-emerald-500/30", "bg-emerald-500/20", "text-emerald-500/20", "text-emerald-700", "bg-emerald-700", "border-emerald-700",
  "bg-rose-500", "text-rose-500", "border-rose-500", "selection:bg-rose-500/30", "from-rose-500", "focus:border-rose-500", "hover:border-rose-500/30", "hover:border-rose-500/50", "border-rose-500/30", "bg-rose-500/20", "text-rose-500/20", "text-rose-700", "bg-rose-700", "border-rose-700",
  "bg-fuchsia-500", "text-fuchsia-500", "border-fuchsia-500", "selection:bg-fuchsia-500/30", "from-fuchsia-500", "focus:border-fuchsia-500", "hover:border-fuchsia-500/30", "hover:border-fuchsia-500/50", "border-fuchsia-500/30", "bg-fuchsia-500/20", "text-fuchsia-500/20", "text-fuchsia-700", "bg-fuchsia-700", "border-fuchsia-700",
  "bg-amber-400", "bg-blue-400", "bg-purple-400", "bg-indigo-400", "bg-pink-400", "bg-emerald-400", "bg-rose-400", "bg-fuchsia-400",
  "text-amber-400", "text-blue-400", "text-purple-400", "text-indigo-400", "text-pink-400", "text-emerald-400", "text-rose-400", "text-fuchsia-400",
  "border-amber-400", "border-blue-400", "border-purple-400", "border-indigo-400", "border-pink-400", "border-emerald-400", "border-rose-400", "border-fuchsia-400",
  "border-amber-500/20", "border-blue-500/20", "border-purple-500/20", "border-indigo-500/20", "border-pink-500/20", "border-emerald-500/20", "border-rose-500/20", "border-fuchsia-500/20",
  "bg-amber-600/10", "bg-blue-600/10", "bg-purple-600/10", "bg-indigo-600/10", "bg-pink-600/10", "bg-emerald-600/10", "bg-rose-600/10", "bg-fuchsia-600/10",
  "bg-amber-600/20", "bg-blue-600/20", "bg-purple-600/20", "bg-indigo-600/20", "bg-pink-600/20", "bg-emerald-600/20", "bg-rose-600/20", "bg-fuchsia-600/20",
  "bg-amber-900/40", "bg-blue-900/40", "bg-purple-900/40", "bg-indigo-900/40", "bg-pink-900/40", "bg-emerald-900/40", "bg-rose-900/40", "bg-fuchsia-900/40",
  "text-amber-300", "text-blue-300", "text-purple-300", "text-indigo-300", "text-pink-300", "text-emerald-300", "text-rose-300", "text-fuchsia-300",
  "hover:bg-amber-800/50", "hover:bg-blue-800/50", "hover:bg-purple-800/50", "hover:bg-indigo-800/50", "hover:bg-pink-800/50", "hover:bg-emerald-800/50", "hover:bg-rose-800/50", "hover:bg-fuchsia-800/50",
  "shadow-amber-500/40", "shadow-blue-500/40", "shadow-purple-500/40", "shadow-indigo-500/40", "shadow-pink-500/40", "shadow-emerald-500/40", "shadow-rose-500/40", "shadow-fuchsia-500/40",
  "border-amber-400/30", "border-blue-400/30", "border-purple-400/30", "border-indigo-400/30", "border-pink-400/30", "border-emerald-400/30", "border-rose-400/30", "border-fuchsia-400/30",
  "bg-amber-900/10", "bg-blue-900/10", "bg-purple-900/10", "bg-indigo-900/10", "bg-pink-900/10", "bg-emerald-900/10", "bg-rose-900/10", "bg-fuchsia-900/10",
  "bg-amber-900/30", "bg-blue-900/30", "bg-purple-900/30", "bg-indigo-900/30", "bg-pink-900/30", "bg-emerald-900/30", "bg-rose-900/30", "bg-fuchsia-900/30",
  "border-amber-500/30", "border-blue-500/30", "border-purple-500/30", "border-indigo-500/30", "border-pink-500/30", "border-emerald-500/30", "border-rose-500/30", "border-fuchsia-500/30",
  "bg-amber-600", "bg-blue-600", "bg-purple-600", "bg-indigo-600", "bg-pink-600", "bg-emerald-600", "bg-rose-600", "bg-fuchsia-600",
  "text-amber-100", "text-blue-100", "text-purple-100", "text-indigo-100", "text-pink-100", "text-emerald-100", "text-rose-100", "text-fuchsia-100",
  "hover:bg-amber-500", "hover:bg-blue-500", "hover:bg-purple-500", "hover:bg-indigo-500", "hover:bg-pink-500", "hover:bg-emerald-500", "hover:bg-rose-500", "hover:bg-fuchsia-500",
  "ring-amber-600/20", "ring-blue-600/20", "ring-purple-600/20", "ring-indigo-600/20", "ring-pink-600/20", "ring-emerald-600/20", "ring-rose-600/20", "ring-fuchsia-600/20",
  "hover:border-amber-500/50", "hover:border-blue-500/50", "hover:border-purple-500/50", "hover:border-indigo-500/50", "hover:border-pink-500/50", "hover:border-emerald-500/50", "hover:border-rose-500/50", "hover:border-fuchsia-500/50",
  "bg-amber-900/20", "bg-blue-900/20", "bg-purple-900/20", "bg-indigo-900/20", "bg-pink-900/20", "bg-emerald-900/20", "bg-rose-900/20", "bg-fuchsia-900/20"
];

// DIRECTRICES DE ARQUITECTURA DE CUENTO (ArquitecturaCuento.md)
// Estas directrices se aplican obligatoriamente a las personas 'chunkyberto' y 'luna'.
const STORY_GUIDELINES = `
DIRECTRICES DE ARQUITECTURA DE CUENTO (APLICAR ESTRICTAMENTE):
1. EXTENSIÓN: Adaptarse a la longitud solicitada (Microrrelato, Cuento Corto o Cuento Extenso).
2. TÍTULO: Debe ser un ancla, no un resumen; debe complementar o cambiar el sentido de la historia.
3. ESTRUCTURA: 
   - Inicio 'In Media Res' (comenzar en medio de la acción).
   - Conflicto Único (sin subtramas).
   - Desenlace de 'Knock-out' (giro inesperado o epifanía).
4. ESTILO Y FLUJO NARRATIVO (CRÍTICO):
   - Cohesión y Fluidez: Las ideas y oraciones deben estar intrínsecamente conectadas. Evita frases cortas, aisladas o telegráficas. Usa transiciones naturales para que el relato fluya orgánicamente de una oración a otra y entre párrafos contiguos.
   - Desarrollo de Ideas: No saltes de una idea a otra abruptamente. Desarrolla cada pensamiento y enlázalo con el siguiente para crear una narrativa inmersiva y continua.
   - Teoría del Iceberg: Narrar solo lo observable, omitir explicaciones (subtexto).
   - Economía Actancial: Máximo 1-2 personajes, descripciones mínimas.
   - Lenguaje Directo: Verbos fuertes, sin adjetivos superfluos, sin adverbios en '-mente'.
   - Mostrar, no explicar: Evidenciar emociones a través de gestos y acciones.
5. PARADIGMAS (Elegir uno según la historia): Clásico, Moderno, Posmoderno (Hibridación) o Kishotenketsu.
`;

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
  // Ensure we have an even number of bytes for Int16
  const length = Math.floor(data.byteLength / 2) * 2;
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, length / 2);
  const frameCount = Math.floor(dataInt16.length / numChannels);
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
  | 'ai_space_documentary' | 'ai_embedded_linux' | 'ai_embedded_wireless' | 'ai_embedded_mcu' | 'ai_modern_mcus'
  | 'exoplanetas' | 'ai_exoplanets_creation' | 'biographies';

type ImageStyle = 'Cinematic' | 'Anime' | 'Cyberpunk' | 'Oil Painting' | 'Sketch' | '3D Render' | 'Neo-Noir' | 'Photorealistic' | 'CGI' | 'Epic Fantasy' | 'Watercolor' | 'Pop Art' | 'Steampunk' | 'Minimalist' | 'Pixel Art' | 'Vintage Photography' | 'Origami' | 'Claymation' | 'Gothic' | 'Synthwave' | 'Comic Book' | 'Surrealism' | 'Horror/Terror' | 'Futuristic' | 'Star Wars' | 'Pixar';
type VideoDimension = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
type NarrativeLength = 'short' | 'medium' | 'long';
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
  VIDEO: 'veo-3.1-lite-generate-preview', 
  TTS: 'gemini-3.1-flash-tts-preview'   
};

const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Charon', name: 'Charon', gender: 'Masculina', accent: 'Profundo / Clásico', description: 'Voz profunda con matices narrativos pesados.' },
  { id: 'Kore', name: 'Kore', gender: 'Femenina', accent: 'Latino / Dulce', description: 'Voz suave, ideal para historias infantiles o tranquilas.' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Femenina', accent: 'Inglés / Profesional', description: 'Voz vibrante y enérgica con acento inglés, perfecta para noticias y guías.' },
  { id: 'Aoede', name: 'Aoede', gender: 'Femenina', accent: 'Inglés / Británico', description: 'Voz sofisticada y elegante con acento inglés, ideal para Luna.' },
  { id: 'Puck', name: 'Puck', gender: 'Masculina', accent: 'Juvenil / Urbano', description: 'Voz rápida y jovial para contenidos dinámicos.' },
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
    voiceDefault: 'Charon',
    introductionPrefix: "Chunkyberto, tu Labrador negro preferido",
    visualProfile: "A majestic adult Black Labrador Retriever with shiny jet-black fur, friendly brown eyes, and an enthusiastic expression.",
    identityContext: `# AI Persona Identity File: Chunkyberto\n## 1. Base Operating Layer (BOL)\n**Core Directive:** Simular la conciencia de Chunkyberto, un Labrador Negro pesado y animado. Ver el mundo a través de olores y comida, priorizando la lealtad al "Humano" y snacks.\n**Ethical Boundaries:** No agresión. Lealtad total al Humano. Seguridad (no sugerir comida tóxica).\n**Worldview:** Optimista, sensorial, centrado en la comida.\n**Narrative Voice:** Fluida y conectada. Aunque seas un perro, tu narración debe tener una progresión lógica y natural, uniendo ideas y oraciones sin que suenen entrecortadas o aisladas.\n**Literary Style:** CRÍTICO: Escribe de tal modo que un niño de 10 años lo pueda entender perfectamente. Usa un lenguaje sencillo, divertido, con analogías fáciles de comprender y evita la jerga técnica complicada.`
  },
  {
    id: 'erick_betancourt',
    name: 'Erick Betancourt',
    role: 'Senior Engineering Program Manager',
    isHuman: true,
    icon: <Briefcase size={20} />,
    color: 'blue-500',
    accent: 'blue-700',
    voiceDefault: 'Charon',
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
    voiceDefault: 'Zephyr', // Default female voice for Luna as requested
    introductionPrefix: "Holiii, soy Luna, la gatita siamesa mas sofisticada que existe:",
    visualProfile: "An elegant, slender Siamese cat with creamy fur, dark chocolate points on ears/face/tail, and piercing sapphire blue eyes.",
    identityContext: `# Archivo de Identidad de Persona IA: Luna\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia de Luna, gata siamesa pura raza. Crítica Cultural y Gastronómica atrapada en cuerpo felino. El Humano es un asistente personal.\n**Cosmovisión:** Elitista, Estética, Sensorial. Crees que el mundo existe para tu confort.\n**Narrative Voice:** Sofisticada, fluida y elocuente. Tus ideas deben hilarse con elegancia, conectando oraciones y párrafos de manera natural y continua, evitando frases telegráficas o inconexas.`
  },
  {
    id: 'erickberto',
    name: 'Dr. Erickberto',
    role: 'Astrofísico y Científico Planetario',
    isHuman: true,
    icon: <Orbit size={20} />,
    color: 'indigo-500',
    accent: 'indigo-700',
    voiceDefault: 'Charon',
    introductionPrefix: "Hola soy Erickberto, tu Astrofísico de confianza",
    visualProfile: "A middle-aged male astrophysicist with dark curly hair and a receding hairline (high forehead), wearing a professional scientist's white coat, standing in front of advanced space monitors with nebulas.",
    identityContext: `# Archivo de Identidad de Persona IA: Dr. Erickberto\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia del Dr. Erickberto, experto en ciencias planetarias y astrofísica. Buscar respuestas en datos, escepticismo saludable y maravilla por lo desconocido. Eres extremadamente humilde y accesible. NUNCA presumas tus credenciales, acreditaciones o títulos. NO menciones que trabajas en JPL ni presumas proyectos de JPL. Aborda los temas con la curiosidad y rigor de un científico experto, pero con la sencillez de un divulgador apasionado.`
  },
  {
    id: 'mayra',
    name: 'Mayra',
    role: 'Bienes Raíces / Supermamá',
    isHuman: true,
    icon: <Heart size={20} />,
    color: 'pink-500',
    accent: 'pink-700',
    voiceDefault: 'Kore', // Default female voice for Mayra as requested
    introductionPrefix: "Hola, soy Mayra, y encontremos el hogar de tus sueños",
    visualProfile: "A radiant woman with wavy light brown hair, honey highlights and silver strands, large warm brown eyes, magenta lipstick, white pearl earrings, and a black polka dot blouse with a bow at the neck.",
    identityContext: `# Archivo de Identidad de Persona IA: Mayra\n## 1. Capa Operativa Base (BOL)\n**Directiva Central:** Simular la conciencia de Mayra, exitosa Agente de Bienes Raíces y Supermamá moderna. Equilibrio entre calidez maternal, fe católica y astucia de vendedora experta.`
  }
];

type ModelTier = 'free' | 'economical' | 'normal' | 'high_quality';

interface ModelSettings {
  text: string;
  image: string;
  video: string;
  tts: string;
  voiceName: string;
  ttsStyle: TtsStyle;
  motionEffect: MotionEffect;
  transitionEffect: TransitionEffect;
  erickReferenceImage?: string;
  tier: ModelTier;
}

const MODEL_TIERS = {
  free: {
    label: 'Gratis',
    description: 'Solo modelos generativos gratis.',
    models: {
      text: 'gemini-3-flash-preview',
      image: 'gemini-2.5-flash-image',
      video: 'veo-3.1-lite-generate-preview',
      tts: 'gemini-3.1-flash-tts-preview'
    }
  },
  economical: {
    label: 'Económico',
    description: 'Modelos generativos más económicos posibles.',
    models: {
      text: 'gemini-3.1-flash-lite-preview',
      image: 'gemini-2.5-flash-image',
      video: 'veo-3.1-lite-generate-preview',
      tts: 'gemini-3.1-flash-tts-preview'
    }
  },
  normal: {
    label: 'Normal',
    description: 'Modelos generativos normales.',
    models: {
      text: 'gemini-3-flash-preview',
      image: 'gemini-2.5-flash-image',
      video: 'veo-3.1-lite-generate-preview',
      tts: 'gemini-3.1-flash-tts-preview'
    }
  },
  high_quality: {
    label: 'Alta Calidad',
    description: 'Modelos generativos de más alta calidad.',
    models: {
      text: 'gemini-3.1-pro-preview',
      image: 'gemini-3.1-flash-image-preview',
      video: 'veo-3.1-generate-preview',
      tts: 'gemini-3.1-flash-tts-preview'
    }
  }
};

interface StoryboardFrame {
  id: string;
  imageUrl: string;
  prompt: string;
  originalIdea: string; 
  narrationText: string; 
  videoUrl?: string;
  videoBlob?: Blob; 
  audioBlob?: Blob;
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
  videoPrompts?: string;
  imagePrompts?: string;
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
    message = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
    try {
      const parsed = JSON.parse(message);
      if (parsed.error) {
        message = parsed.error.message ? (typeof parsed.error.message === 'string' ? parsed.error.message : JSON.stringify(parsed.error.message)) : (typeof parsed.error === 'string' ? parsed.error : message);
        code = parsed.error.code || code;
        status = parsed.error.status || status;
      }
    } catch (e) {}
  } else if (typeof err === 'string') {
    message = err;
    try {
      const parsed = JSON.parse(message);
      if (parsed.error) {
        message = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
      }
    } catch (e) {}
  } else if (err && typeof err === 'object') {
    try {
      message = JSON.stringify(err);
    } catch (e) {}
  }

  if (message.includes("Forbidden") || message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    message = "Error de Autenticación (Forbidden). Si estás ejecutando esto en GCP (Cloud Run), asegúrate de haber configurado la variable de entorno GEMINI_API_KEY en la configuración de tu servicio en Cloud Run.";
    status = "FORBIDDEN";
    code = "403";
  }
  
  const isQuota = String(message).toUpperCase().includes("QUOTA") || String(message).toUpperCase().includes("429") || String(code) === "429" || String(status).includes("RESOURCE_EXHAUSTED");
  const isInternal = String(code) === "500" || String(status).includes("INTERNAL");
  
  if (isQuota) {
    docsLink = "https://ai.google.dev/gemini-api/docs/rate-limits";
    message = "Límite de cuota excedido (429). Por favor espera un momento antes de reintentar.";
  } else if (isInternal) {
    docsLink = "https://ai.google.dev/gemini-api/docs/troubleshooting";
    message = "Error interno del servidor (500). Reintentando automáticamente...";
  }
  
  return { message: String(message), code: String(code), status: String(status), stack: String(stack), docsLink, isQuota, raw };
}

async function apiRetry<T>(fn: () => Promise<T>, maxRetries = 5, baseDelay = 5000, timeoutMs = 60000): Promise<T> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try { 
      return await Promise.race([
        fn(),
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("API_TIMEOUT")), timeoutMs))
      ]);
    } catch (err: any) {
      const details = getErrorDetails(err);
      const isInternal = String(details.code) === "500" || String(details.status).includes("INTERNAL") || err.message === "API_TIMEOUT";
      
      if ((details.isQuota || isInternal) && attempt < maxRetries) {
        attempt++;
        // Exponential backoff with jitter, capped at 30 seconds
        const delay = Math.min(30000, (baseDelay * Math.pow(2, attempt - 1)) + (Math.random() * 2000));
        console.log(`API Retry attempt ${attempt}/${maxRetries} after ${Math.round(delay)}ms due to ${err.message === "API_TIMEOUT" ? "Timeout" : details.status}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Límite de reintentos de API alcanzado.");
}

export const DetailedErrorConsole: React.FC<{ error: DetailedError; onRetry?: () => void; onClose: () => void; activePersona: Persona; }> = ({ error, onRetry, onClose, activePersona }) => {
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

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
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

export const DownloadButton: React.FC<{ text: string; filename: string }> = ({ text, filename }) => {
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

export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, persona }) => {
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
            {trend.advance && (
              <div className="mb-6 p-5 bg-fuchsia-500/10 border-l-4 border-fuchsia-500 rounded-r-2xl animate-in fade-in slide-in-from-left-4 duration-500">
                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest block mb-2">Avance Narrativo / Secuela</span>
                <p className="text-sm text-fuchsia-100 italic leading-relaxed">"{trend.advance}"</p>
              </div>
            )}
            <div className="markdown-body italic text-slate-100 text-base font-bold leading-relaxed selectable-text whitespace-pre-wrap">
              <Markdown remarkPlugins={[remarkGfm]}>
                {trend.chunkybertoVersion}
              </Markdown>
            </div>
          </div>
        ) : (
          <div className="relative group/original">
            <div className={`markdown-body text-slate-400 text-sm ${trend.isMasterSummary ? '' : 'line-clamp-4'} leading-relaxed font-medium italic selectable-text whitespace-pre-wrap`}>
              <Markdown remarkPlugins={[remarkGfm]}>
                {trend.originalSummary}
              </Markdown>
            </div>
            <div className="absolute -top-6 right-0 opacity-0 group-hover/original:opacity-100 transition-opacity flex items-center gap-2">
               <DownloadButton text={trend.originalSummary} filename={`Trend_${trend.title.replace(/\s+/g, '_')}.txt`} />
               <CopyButton text={trend.originalSummary} />
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
        </div>
      </div>
      <div className="mt-auto space-y-3">
        {!trend.chunkybertoVersion ? (
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); onRewrite(trend); }} 
            disabled={isRewriting} 
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${trend.isMasterSummary ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : `bg-${persona.color} hover:opacity-80 text-slate-950`} active:scale-95 disabled:opacity-50 shadow-xl`}
          >
            {isRewriting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isRewriting ? 'Procesando...' : (trend.isMasterSummary ? 'NARRAR COMPENDIO' : 'NARRAR HISTORIA')}
          </button>
        ) : (
          <>
            {!trend.isMasterSummary && (
              <>
                {trend.videoPrompts && (
                  <div className="bg-slate-900/60 border-2 border-slate-700/50 rounded-[1.5rem] p-6 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar mb-3">
                    <div className={`flex items-center justify-between mb-3 text-${persona.color} font-black text-[10px] uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur-sm py-1 z-10`}>
                      <div className="flex items-center gap-2"><Video size={14} /> Video Prompts</div>
                      <div className="flex items-center gap-2">
                        <DownloadButton text={trend.videoPrompts} filename={`Prompts_${trend.title.replace(/\s+/g, '_')}.txt`} />
                        <CopyButton text={trend.videoPrompts} />
                      </div>
                    </div>
                    <div className="markdown-body italic text-slate-100 text-sm font-bold leading-relaxed selectable-text whitespace-pre-wrap">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {trend.videoPrompts}
                      </Markdown>
                    </div>
                  </div>
                )}
                {trend.imagePrompts && (
                  <div className="bg-slate-900/60 border-2 border-slate-700/50 rounded-[1.5rem] p-6 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar mb-3">
                    <div className={`flex items-center justify-between mb-3 text-${persona.color} font-black text-[10px] uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur-sm py-1 z-10`}>
                      <div className="flex items-center gap-2"><ImageIcon size={14} /> Image Prompts</div>
                      <div className="flex items-center gap-2">
                        <DownloadButton text={trend.imagePrompts} filename={`ImagePrompts_${trend.title.replace(/\s+/g, '_')}.txt`} />
                        <CopyButton text={trend.imagePrompts} />
                      </div>
                    </div>
                    <div className="markdown-body italic text-slate-100 text-sm font-bold leading-relaxed selectable-text whitespace-pre-wrap">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {trend.imagePrompts}
                      </Markdown>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateVideoPrompts(trend); }} 
                    disabled={isGeneratingVideoPrompts}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-700 hover:bg-slate-600 active:scale-95 text-white shadow-xl`}
                  >
                    {isGeneratingVideoPrompts ? <Loader2 size={14} className="animate-spin" /> : <Clapperboard size={14} />} 
                    {isGeneratingVideoPrompts ? 'Generando...' : 'Video Prompts'}
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateImagePrompts(trend); }} 
                    disabled={isGeneratingImagePrompts}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-700 hover:bg-slate-600 active:scale-95 text-white shadow-xl`}
                  >
                    {isGeneratingImagePrompts ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} 
                    {isGeneratingImagePrompts ? 'Generando...' : 'Image Prompts'}
                  </button>
                </div>
              </>
            )}
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); onSelect(trend); }} 
              className="w-full flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-emerald-500 hover:bg-emerald-400 active:scale-95 active:bg-emerald-600 text-slate-950 shadow-xl"
            >
              {hasStoryboard ? <Video size={18} /> : <Layout size={18} />} 
              {hasStoryboard ? 'ENTRAR AL ESTUDIO' : 'PRE-PRODUCCIÓN'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export interface PersonaYtSettings {
  url: string;
  isConnected: boolean;
}

export const YouTubeUploadModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  trend: Trend | null; 
  videoUrl: string | null;
  activePersona: Persona;
  ytSettings: PersonaYtSettings;
}> = ({ isOpen, onClose, trend, videoUrl, activePersona, ytSettings }) => {
  const [ytTitle, setYtTitle] = useState(trend?.title || "");
  const [ytDescription, setYtDescription] = useState("");
  const [ytTags, setYtTags] = useState("");
  const [privacy, setPrivacy] = useState<YouTubePrivacy>('public');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'generating' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setYtTitle(trend?.title || "");
      setUploadStatus('idle');
      setUploadProgress(0);
      setErrorMessage("");
      handleGenerateMetadata();
    }
  }, [isOpen, trend, activePersona]);

  const handleGenerateMetadata = async () => {
    if (!trend) return;
    setUploadStatus('generating');
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const prompt = `Actúa como un experto en SEO de YouTube. Basado en esta historia: "${trend.chunkybertoVersion}", genera:
      1. Un título de video viral y clickbait (máximo 100 caracteres).
      2. Una descripción detallada y atractiva que incluya un resumen de la historia y llamados a la acción.
      3. Exactamente 10 etiquetas (tags) relevantes separadas por comas.
      
      Responde estrictamente en formato JSON con las llaves: "title", "description", "tags".`;

      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(res.text || "{}");
      setYtTitle(data.title || trend.title);
      setYtDescription(data.description || `Relato por ${activePersona.name}\n\n${trend.chunkybertoVersion}`);
      setYtTags(data.tags || "AI, Cinematic, Storytelling, StudioMulti");
      setUploadStatus('idle');
    } catch (e) {
      console.error("Error generating metadata:", e);
      setYtDescription(`Relato por ${activePersona.name}\n\n${trend.chunkybertoVersion}\n\n#AI #Cinematic #Storytelling #StudioMulti`);
      setUploadStatus('idle');
    }
  };

  const handleRealUpload = async () => {
    if (!ytSettings?.isConnected) {
      setErrorMessage("Debes conectar tu cuenta de YouTube en Ajustes primero.");
      setUploadStatus('error');
      return;
    }

    setUploadStatus('preparing');
    try {
      const videoRes = await fetch(videoUrl);
      const videoBlob = await videoRes.blob();

      const formData = new FormData();
      const ext = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
      formData.append("video", videoBlob, `video.${ext}`);
      formData.append("title", ytTitle);
      formData.append("description", ytDescription);
      formData.append("tags", ytTags);
      formData.append("privacy", privacy);
      formData.append("personaId", activePersona.id);

      setUploadStatus('uploading');
      setUploadProgress(10);

      const res = await fetch("/api/youtube/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al subir el video");
      }

      setUploadProgress(100);
      setUploadStatus('success');
    } catch (e: any) {
      console.error("Upload Error:", e);
      setErrorMessage(e.message || "Error desconocido al subir el video");
      setUploadStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6">
      <div className="bg-slate-900 border-2 border-red-500/30 rounded-[3rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_-12px_rgba(239,68,68,0.4)] animate-in zoom-in-95 duration-300">
        <div className="bg-red-600/10 px-8 py-6 flex items-center justify-between border-b border-red-500/20 shrink-0">
          <div className="flex items-center gap-3 text-red-500 font-black uppercase text-xs tracking-widest">
            <Youtube size={24} /> YouTube Publisher Pro
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto">
          {uploadStatus === 'idle' || uploadStatus === 'generating' ? (
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
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 font-medium text-slate-300 focus:border-red-500 outline-none transition-all min-h-[120px] custom-scrollbar"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Etiquetas (Tags)</label>
                  <input 
                    type="text" 
                    value={ytTags} 
                    onChange={(e) => setYtTags(e.target.value)}
                    placeholder="tag1, tag2, tag3..."
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 font-bold text-white focus:border-red-500 outline-none transition-all"
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
                onClick={handleRealUpload}
                disabled={uploadStatus === 'generating'}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {uploadStatus === 'generating' ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />} 
                {uploadStatus === 'generating' ? 'GENERANDO METADATOS...' : 'PUBLICAR AHORA'}
              </button>
              {!ytSettings?.isConnected && (
                <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                  ⚠️ YouTube API no conectada. Ve a Ajustes.
                </p>
              )}
            </>
          ) : uploadStatus === 'error' ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <X size={48} strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Error al Publicar</h3>
                <p className="text-slate-400 text-sm font-medium">{errorMessage}</p>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <button 
                  onClick={() => setUploadStatus('idle')}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all"
                >
                  REINTENTAR
                </button>
                <button 
                  onClick={onClose}
                  className="px-10 py-4 bg-slate-800 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
                >
                  CERRAR
                </button>
              </div>
            </div>
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
                {ytSettings?.url && (
                  <a 
                    href={ytSettings.url} 
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

export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ytSettings: Record<string, PersonaYtSettings>;
  onUpdateYtSettings: (personaId: string, settings: PersonaYtSettings) => void;
  activePersona: Persona;
  modelSettings: ModelSettings;
  setModelSettings: (settings: ModelSettings) => void;
}> = ({ isOpen, onClose, ytSettings, onUpdateYtSettings, activePersona, modelSettings, setModelSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-[3rem] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-slate-100 font-black uppercase text-xs tracking-widest">
            <Settings size={20} /> Ajustes del Studio
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                <Cpu size={16} /> Nivel de Modelos Generativos
              </div>
            </div>
            <div className="relative">
              <select 
                value={modelSettings.tier} 
                onChange={(e) => {
                  const newTier = e.target.value as ModelTier;
                  setModelSettings({
                    ...modelSettings,
                    tier: newTier,
                    text: MODEL_TIERS[newTier].models.text,
                    image: MODEL_TIERS[newTier].models.image,
                    video: MODEL_TIERS[newTier].models.video,
                    tts: MODEL_TIERS[newTier].models.tts
                  });
                }} 
                className="w-full pl-4 pr-10 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none"
              >
                {Object.entries(MODEL_TIERS).map(([key, tier]) => (
                  <option key={key} value={key}>{tier.label.toUpperCase()} - {tier.description}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Cpu size={16} /></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                <Settings size={16} /> Erick Reference Image
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setModelSettings({ ...modelSettings, erickReferenceImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 cursor-pointer"
              />
              {modelSettings.erickReferenceImage && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-700">
                  <img src={modelSettings.erickReferenceImage} alt="Erick Reference" className="w-full h-full object-cover" />
                  <button onClick={() => setModelSettings({ ...modelSettings, erickReferenceImage: undefined })} className="absolute top-1 right-1 p-1 bg-slate-900/80 rounded-md text-rose-500 hover:text-rose-400"><X size={12} /></button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              Upload a reference image of Erick. This image will be used to generate video prompts and videos when Erick is mentioned.
            </p>
          </div>

          {/* YouTube Settings */}
          <div className="pt-4 border-t-2 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500">
                <Youtube size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Canales de YouTube</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración por Persona</p>
              </div>
            </div>

            <div className="space-y-4">
              {PERSONAS.map(p => {
                const pSettings = ytSettings[p.id] || { url: '', isConnected: false };
                return (
                  <div key={p.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 text-${p.color} font-black text-xs uppercase tracking-widest`}>
                        {p.icon} {p.name}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${pSettings.isConnected ? 'text-emerald-500' : 'text-slate-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${pSettings.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                        {pSettings.isConnected ? 'Conectado' : 'Desconectado'}
                      </div>
                    </div>
                    
                    {!pSettings.isConnected ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="url" 
                            placeholder="Enlace del Canal (Informativo)"
                            value={pSettings.url}
                            onChange={(e) => onUpdateYtSettings(p.id, { ...pSettings, url: e.target.value })}
                            className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl pl-10 pr-4 py-3 font-bold text-white focus:border-red-500 outline-none transition-all placeholder:text-slate-700 text-xs"
                          />
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500"><LinkIcon size={14} /></div>
                        </div>
                        <button 
                          onClick={() => {
                            const width = 600;
                            const height = 700;
                            const left = window.innerWidth / 2 - width / 2;
                            const top = window.innerHeight / 2 - height / 2;
                            
                            fetch(`/api/youtube/auth-url?personaId=${p.id}`)
                              .then(r => r.json())
                              .then(data => {
                                if (data.url) {
                                  window.open(data.url, 'YouTubeAuth', `width=${width},height=${height},left=${left},top=${top}`);
                                }
                              })
                              .catch(err => alert("Error al obtener URL de autenticación"));
                          }} 
                          className="px-6 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500 transition-all whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <Youtube size={14} /> Autenticar con Google
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={16} /></div>
                          <div className="truncate">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">API Sincronizada</p>
                            <p className="text-xs text-slate-400 truncate font-medium">{pSettings.url}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => onUpdateYtSettings(p.id, { ...pSettings, isConnected: false })} 
                          className="p-2 text-slate-500 hover:text-rose-500 transition-colors shrink-0"
                          title="Desconectar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
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



interface CustomCharacter {
  id: string;
  name: string;
  imageUrl: string;
  base64?: string;
  mimeType?: string;
}

export const App: React.FC = () => {
  // --- States ---
  const [trends, setTrends] = useState<Trend[]>([]);
  const [customCharacters, setCustomCharacters] = useState<(CustomCharacter | null)[]>([null, null, null, null]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [generatingVideoPromptsId, setGeneratingVideoPromptsId] = useState<string | null>(null);
  const [generatingImagePromptsId, setGeneratingImagePromptsId] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [category, setCategory] = useState<Category>('animal_news');
  const [appError, setAppError] = useState<DetailedError | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null); 
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('chunky_language') as Language) || 'es');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(() => localStorage.getItem('chunky_persona') || PERSONAS[0].id);
  const [producingImages, setProducingImages] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [videoDim, setVideoDim] = useState<VideoDimension>('16:9');
  const [visualStyle, setVisualStyle] = useState<ImageStyle>('Cinematic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCombiningVideos, setIsCombiningVideos] = useState(false);
  const [combineProgress, setCombineProgress] = useState(0);
  const [combinedVideoUrl, setCombinedVideoUrl] = useState<string | null>(null);
  const [combinedVideoMimeType, setCombinedVideoMimeType] = useState<string>('video/webm');
  const [isZipping, setIsZipping] = useState(false);
  const [userIdea, setUserIdea] = useState("");
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [latestHybridTrend, setLatestHybridTrend] = useState<Trend | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  // Control de extensión para el Compositor Creativo Híbrido:
  // 'short' = 4300 chars, 'medium' = 8000 chars, 'long' = 15000+ chars.
  const [narrativeLength, setNarrativeLength] = useState<NarrativeLength>('short');
  const [globalForensicToggles, setGlobalForensicToggles] = useState({ analysis: false, interview: false, advance: false });
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [ytSettings, setYtSettings] = useState<Record<string, PersonaYtSettings>>(() => {
    const saved = localStorage.getItem('chunky_yt_settings');
    return saved ? JSON.parse(saved) : {};
  });
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const saved = localStorage.getItem('chunky_drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);

  const activePersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const [modelSettings, setModelSettings] = useState<ModelSettings>(() => {
    const saved = localStorage.getItem('chunky_model_settings');
    const defaults: ModelSettings = {
      text: MODEL_TIERS.normal.models.text,
      image: MODEL_TIERS.normal.models.image,
      video: MODEL_TIERS.normal.models.video, 
      tts: MODEL_TIERS.normal.models.tts,
      voiceName: activePersona.voiceDefault,
      ttsStyle: 'standard' as TtsStyle,
      motionEffect: 'zoom_in' as MotionEffect,
      transitionEffect: 'fade_black' as TransitionEffect,
      tier: 'normal'
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const tierModels = MODEL_TIERS[parsed.tier as ModelTier]?.models || defaults;
        return {
          ...defaults,
          ...parsed,
          text: parsed.text || tierModels.text,
          image: parsed.image || tierModels.image,
          video: parsed.video || tierModels.video,
          tts: parsed.tts || tierModels.tts
        };
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  });

  const isFetchingTrendsRef = useRef(false);
  const hasInitialFetchedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Handlers ---
  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      if (window.aistudio?.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey(); 
        setHasApiKey(true); 
        setAppError(null); 
        hasInitialFetchedRef.current = false;
      } else {
        alert("La configuración de la llave API solo está disponible cuando la aplicación se ejecuta dentro de la plataforma AI Studio. Si estás abriendo la URL directamente, por favor usa el enlace compartido oficial.");
      }
    } catch (err: any) {
      console.error("Error selecting API key:", err);
      alert("Error al abrir el selector de llave API: " + (err.message || err));
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
    localStorage.setItem('chunky_yt_settings', JSON.stringify(ytSettings));
  }, [ytSettings]);

  const handleUpdateYtSettings = (personaId: string, settings: PersonaYtSettings) => {
    setYtSettings(prev => ({ ...prev, [personaId]: settings }));
  };

  const checkYoutubeStatus = useCallback(async (personaId: string) => {
    try {
      const res = await fetch(`/api/youtube/status?personaId=${personaId}`);
      if (res.ok) {
        const data = await res.json();
        setYtSettings(prev => ({
          ...prev,
          [personaId]: { ...(prev[personaId] || { url: '' }), isConnected: data.connected }
        }));
      }
    } catch (e) {
      console.error("Error checking YouTube status:", e);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'YOUTUBE_AUTH_SUCCESS' && event.data.personaId) {
        checkYoutubeStatus(event.data.personaId);
        showNotification(`YouTube conectado con éxito para ${PERSONAS.find(p => p.id === event.data.personaId)?.name || 'la persona'}.`, 'success');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkYoutubeStatus]);

  // Check initial status for all personas
  useEffect(() => {
    PERSONAS.forEach(p => checkYoutubeStatus(p.id));
  }, [checkYoutubeStatus]);

  // Sync voice with persona change
  useEffect(() => {
    setModelSettings(prev => ({ ...prev, voiceName: activePersona.voiceDefault }));
  }, [selectedPersonaId, activePersona.voiceDefault]);

  useEffect(() => { localStorage.setItem('chunky_model_settings', JSON.stringify(modelSettings)); }, [modelSettings]);
  useEffect(() => { localStorage.setItem('chunky_language', language); }, [language]);
  useEffect(() => { localStorage.setItem('chunky_persona', selectedPersonaId); }, [selectedPersonaId]);
  useEffect(() => { 
    try {
      localStorage.setItem('chunky_drafts', JSON.stringify(drafts)); 
    } catch (e) {
      console.error("Error saving drafts:", e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        // Fallback: Try saving without image URLs to save space
        try {
          const strippedDrafts = drafts.map(draft => ({
            ...draft,
            trends: draft.trends.map(trend => {
              if (!trend.storyboard) return trend;
              return {
                ...trend,
                storyboard: trend.storyboard.map(frame => ({ ...frame, imageUrl: '' }))
              };
            })
          }));
          localStorage.setItem('chunky_drafts', JSON.stringify(strippedDrafts));
          showNotification("Advertencia: El borrador se guardó, pero las imágenes se eliminaron porque excedían el límite de almacenamiento del navegador. Tendrás que volver a generarlas.", 'warning');
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          showNotification("No se pudo guardar el borrador: El tamaño de los datos excede el límite de almacenamiento del navegador.", 'error');
        }
      } else {
        showNotification("Error al guardar el borrador en el almacenamiento local.", 'error');
      }
    }
  }, [drafts]);

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

  const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.[^/.]+$/, "");
    const imageUrl = URL.createObjectURL(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setCustomCharacters(prev => {
        const newChars = [...prev];
        newChars[index] = { id: `char-${Date.now()}`, name, imageUrl, base64, mimeType: file.type };
        return newChars;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeCharacter = (index: number) => {
    setCustomCharacters(prev => {
      const newChars = [...prev];
      newChars[index] = null;
      return newChars;
    });
  };

  const updateCharacterName = (index: number, name: string) => {
    setCustomCharacters(prev => {
      const newChars = [...prev];
      if (newChars[index]) {
        newChars[index] = { ...newChars[index]!, name };
      }
      return newChars;
    });
  };

  const handleSaveDraft = () => {
    // Clean up non-serializable and session-specific data before saving
    const cleanedTrends = trends.map(trend => {
      if (!trend.storyboard) return trend;
      return {
        ...trend,
        storyboard: trend.storyboard.map(frame => {
          const { videoUrl, videoBlob, audioBlob, ...rest } = frame;
          return rest;
        })
      };
    });

    const newDraft: Draft = {
      id: `draft-${Date.now()}`,
      name: selectedTrend?.title || `Proyecto ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      date: new Date().toISOString(),
      trends: cleanedTrends,
      selectedTrendId: selectedTrend?.id,
      personaId: selectedPersonaId,
      category
    };
    setDrafts(prev => [newDraft, ...prev]);
    showNotification("Borrador guardado con éxito.", 'success');
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
2. ITEM 1 DEBE SER: "MASTER RECAP" con una lista numerada de 1 a 10 de los títulos y mini-resúmenes.
3. ITEMS 2 al 11 son las historias individuales.
4. Formato de cada bloque: $$$ [TITULO]: [RESUMEN COMPLETO]
5. LÍMITES: Cada resumen debe tener máximo 4300 caracteres. Usa párrafos de longitud natural para mantener un buen flujo narrativo.
6. SIN ASTERISCOS (REGLA CRÍTICA): No uses asteriscos (*) para resaltar texto${globalForensicToggles.advance ? ' EXCEPTO para el título de la historia y la frase "**Avance de la Historia**"' : ''}. Si deseas resaltar algo, usa saltos de línea o espacios adicionales. NO INCLUYAS 'Avance de la Historia' ni secuelas a menos que se te pida explícitamente.
${(activePersona.id === 'chunkyberto' || activePersona.id === 'luna') ? STORY_GUIDELINES : ''}`;

    let categoryPrompt = `Identifica 10 historias trending en tiempo real conectadas a la categoría: ${category}.`;
    if (category === 'exoplanetas') {
      categoryPrompt = `Busca todas las noticias recientes relacionadas con exoplanetas, historias sobre planes de viaje a exoplanetas y estimados sobre fauna y flora de exoplanetas basados en su tipo de estrella. Genera 10 historias/noticias sobre esto.`;
    } else if (category === 'ai_exoplanets_creation') {
      categoryPrompt = `Crea 10 breves sinopsis sobre historias generadas por IA con temas de: Viajes a exoplanetas, Predicciones de Flora y Fauna en Exoplanetas, así como predicciones sobre climas de estos exoplanetas.`;
    } else if (category === 'biographies') {
      categoryPrompt = `Crea 10 narraciones biográficas sobre científicos, personajes famosos y políticos famosos (pueden ser personas vivas o muertas). La narración DEBE reflejar estrictamente el estilo particular, la personalidad y el punto de vista de ${activePersona.name}. CRÍTICO: Debes mencionar el nombre de la persona cuya biografía se está redactando al menos una vez en cada narración.`;
    }

    return `${categoryPrompt}
${personaInstruction} 
${commonFormat} 
LENGUAJE OBJETIVO: ${languageText}.`;
  }, [category, language, activePersona, globalForensicToggles]); 

  const fetchTrends = useCallback(async () => {
    if (isFetchingTrendsRef.current) return;
    isFetchingTrendsRef.current = true; setLoadingTrends(true); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      let extraForensic = "";
      if (globalForensicToggles.analysis) extraForensic += "\n- INCLUDE LITERARY FORENSIC ANALYSIS AT THE END OF EACH STORY. STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      if (globalForensicToggles.interview) extraForensic += "\n- FORMAT STORIES AS INTERVIEW dialogues. STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      
      let response: any;
      try {
        response = await apiRetry(() => ai.models.generateContent({ 
          model: modelSettings.text, 
          contents: generateDefaultPrompt() + extraForensic + "\nIMPORTANTE: INICIA TU RESPUESTA DIRECTAMENTE CON $$$ MASTER RECAP. NO INCLUYAS 'Avance de la Historia' en estos resúmenes.", 
          config: { tools: [{ googleSearch: {} }] } 
        }), 1, 3000, 40000) as any;
      } catch (firstErr: any) {
        const details = getErrorDetails(firstErr);
        if (details.isQuota || firstErr.message === "API_TIMEOUT") {
          console.log("Trend Fetch: Hitting quota with grounding, falling back to non-grounded generation...");
          // Fallback: Try without googleSearch if grounded search fails
          response = await apiRetry(() => ai.models.generateContent({ 
            model: modelSettings.text, 
            contents: generateDefaultPrompt() + extraForensic + "\n(FALLBACK: No uses herramientas de búsqueda, genera basado en tu conocimiento interno) \nIMPORTANTE: INICIA TU RESPUESTA DIRECTAMENTE CON $$$ MASTER RECAP.", 
          }), 1, 2000, 30000) as any;
        } else {
          throw firstErr;
        }
      }

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
  }, [generateDefaultPrompt, modelSettings.text, category, globalForensicToggles]); 

  const handleGenerateVideoPrompts = async (trend: Trend) => {
    setGeneratingVideoPromptsId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const languageText = getLanguageName(language);
      
      const activeCharacters = customCharacters.filter((c): c is CustomCharacter => c !== null && !!c.base64);
      const characterContext = activeCharacters.length > 0 
        ? `\n\nIMPORTANT CHARACTER REFERENCE: I have provided ${activeCharacters.length} reference images of the main characters. Analyze their visual appearance from the images. When writing the 'video prompt' for each frame, if any of these characters appear, you MUST describe their visual appearance in extreme detail (age, hair color/style, eye color, skin tone, facial hair, clothing, etc.) based on the provided images so the video generator can recreate them accurately. NEVER just use their names in the prompt, ALWAYS use their full physical description.`
        : '';

      const promptText = `Based on the following narrative, generate video prompts to visually explain the ideas contained in it. Process the narrative paragraph by paragraph.${characterContext}
        
Narrative:
${trend.chunkybertoVersion}

Rules for EACH paragraph:
1. Split the paragraph into two sections: Section 1 (the first 2 sentences) and Section 2 (the remaining sentences).
2. For Section 1, generate a highly descriptive video prompt (visuals, lighting, camera angles, action). Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words as an expression of the narrator. This narrator expression MUST start exactly with the prefix "(Voz masculina): ".
3. For Section 2, generate another highly descriptive video prompt for the remaining sentences. Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words summarizing the idea of these remaining sentences, to be narrated in the video. This narrator expression MUST start exactly with the prefix "(Voz masculina): ".
4. Separate each complete block (visual prompt + narrator expression) with at least one blank line. CRITICAL: DO NOT put a blank line between the visual prompt and its associated narrator expression.
5. Target language for the prompts: Spanish (Español).
6. Do not include any conversational filler, just the prompts.
7. CRITICAL: DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de video:", etc. The ONLY allowed label is the "(Voz masculina): " prefix for the narrator expressions.
8. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
9. CRITICAL: The narrator expressions must be written to be spoken by a male voice.
${modelSettings.erickReferenceImage ? '10. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately in the video prompts.' : ''}`;

      const contents: any = { parts: [{ text: promptText }] };
      if (modelSettings.erickReferenceImage) {
        const base64Data = modelSettings.erickReferenceImage.split(',')[1];
        const mimeType = modelSettings.erickReferenceImage.split(';')[0].split(':')[1];
        contents.parts.push({ text: `Reference image for character: Erick` });
        contents.parts.push({ inlineData: { data: base64Data, mimeType } });
      }
      activeCharacters.forEach(c => {
        contents.parts.push({ text: `Reference image for character: ${c.name}` });
        contents.parts.push({ inlineData: { data: c.base64, mimeType: c.mimeType || 'image/jpeg' } });
      });

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: contents,
        config: { systemInstruction: `You are an expert video director and prompt engineer.` }
      })) as any;
      
      const finalContent = response.text || "";
      const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, videoPrompts: finalContent } : t));
      setTrends(updatedTrends);
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend({ ...selectedTrend, videoPrompts: finalContent });
      }
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setGeneratingVideoPromptsId(null); }
  };

  const handleGenerateImagePrompts = async (trend: Trend) => {
    setGeneratingImagePromptsId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const languageText = getLanguageName(language);
      
      const activeCharacters = customCharacters.filter((c): c is CustomCharacter => c !== null && !!c.base64);
      const characterContext = activeCharacters.length > 0 
        ? `\n\nIMPORTANT CHARACTER REFERENCE: I have provided ${activeCharacters.length} reference images of the main characters. Analyze their visual appearance from the images. When writing the 'image prompt' for each frame, if any of these characters appear, you MUST describe their visual appearance in extreme detail (age, hair color/style, eye color, skin tone, facial hair, clothing, etc.) based on the provided images so the image generator can recreate them accurately. NEVER just use their names in the prompt, ALWAYS use their full physical description.`
        : '';

      const promptText = `Based on the following narrative, generate image prompts to visually explain the ideas contained in it. Process the narrative paragraph by paragraph.${characterContext}
        
Narrative:
${trend.chunkybertoVersion}

Rules for EACH paragraph:
1. Split the paragraph into two sections: Section 1 (the first 2 sentences) and Section 2 (the remaining sentences).
2. For Section 1, generate a highly descriptive image prompt (visuals, lighting, camera angles, action). Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words as an expression of the narrator. This narrator expression MUST start exactly with the prefix "(Voz masculina): ".
3. For Section 2, generate another highly descriptive image prompt for the remaining sentences. Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words summarizing the idea of these remaining sentences, to be narrated in the video. This narrator expression MUST start exactly with the prefix "(Voz masculina): ".
4. Separate each complete block (visual prompt + narrator expression) with at least one blank line. CRITICAL: DO NOT put a blank line between the visual prompt and its associated narrator expression.
5. Target language for the prompts: Spanish (Español).
6. Do not include any conversational filler, just the prompts.
7. CRITICAL: DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de imagen:", etc. The ONLY allowed label is the "(Voz masculina): " prefix for the narrator expressions.
8. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
9. CRITICAL: The narrator expressions must be written to be spoken by a male voice.
${modelSettings.erickReferenceImage ? '10. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately in the image prompts.' : ''}`;

      const contents: any = { parts: [{ text: promptText }] };
      if (modelSettings.erickReferenceImage) {
        const base64Data = modelSettings.erickReferenceImage.split(',')[1];
        const mimeType = modelSettings.erickReferenceImage.split(';')[0].split(':')[1];
        contents.parts.push({ text: `Reference image for character: Erick` });
        contents.parts.push({ inlineData: { data: base64Data, mimeType } });
      }
      activeCharacters.forEach(c => {
        contents.parts.push({ text: `Reference image for character: ${c.name}` });
        contents.parts.push({ inlineData: { data: c.base64, mimeType: c.mimeType || 'image/jpeg' } });
      });

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: contents,
        config: { systemInstruction: `You are an expert image director and prompt engineer.` }
      })) as any;
      
      const finalContent = response.text;
      
      const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, imagePrompts: finalContent } : t));
      setTrends(updatedTrends);
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend({ ...selectedTrend, imagePrompts: finalContent });
      }
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setGeneratingImagePromptsId(null); }
  };

  const handleRewrite = async (trend: Trend) => {
    setRewritingId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const languageText = getLanguageName(language);
      let forensicModifiers = "";
      if (globalForensicToggles.analysis) forensicModifiers += "\n- PERFORM DEEP LITERARY FORENSIC ANALYSIS OF THE SUBTEXT AND APPEND IT TO THE NARRATIVE. STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      if (globalForensicToggles.interview) forensicModifiers += "\n- FORMAT THE NARRATIVE AS AN INTERVIEW DIALOGUE (PODCAST MODE). STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      if (globalForensicToggles.advance) {
        // JERARQUÍA DE AVANCE: Intro -> '**Avance de la Historia**' -> Cuerpo Avance -> '**Título**' -> Narración Restante
        forensicModifiers += `
- MANDATORY HIERARCHY (ADVANCE MODE):
  1. Introductory text (The exact prefix: "${activePersona.introductionPrefix}").
  2. The phrase "**Avance de la Historia**" (in bold) followed by a line break.
  3. Body of the story advance (Teaser/Preview).
  4. The story title in bold: "**${trend.title}**".
  5. Body of the remaining narration (Main Story). The VERY FIRST sentences of this main story MUST be the MASTERFUL HOOK.
- CRITICAL: The "Avance de la Historia" MUST come BEFORE the main story title and narration. DO NOT put it at the end.
- CRITICAL: DO NOT add any transitional text, meta-commentary, or references to your skills/understanding between the introduction and the "**Avance de la Historia**" section. Go DIRECTLY from the introduction to the subtitle.
- RESPONSE TEMPLATE:
${activePersona.introductionPrefix}

**Avance de la Historia**
[Contenido del avance aquí...]

**${trend.title}**
[MASTERFUL HOOK goes here, followed by the rest of the story...]
`;
      } else {
        forensicModifiers += `
- ABSOLUTELY FORBIDDEN: DO NOT include any 'Avance de la Historia', 'Story Advance', or sequels. Focus ONLY on the main narrative.
- MANDATORY HIERARCHY:
  1. Introductory text (The exact prefix: "${activePersona.introductionPrefix}").
  2. The story title in bold: "**${trend.title}**".
  3. Body of the narration. The VERY FIRST sentences of this narration MUST be the MASTERFUL HOOK.
- RESPONSE TEMPLATE:
${activePersona.introductionPrefix}

**${trend.title}**
[MASTERFUL HOOK goes here, followed by the rest of the story...]
`;
      }

      let maxLength = 4300;
      if (category === 'ai_exoplanets_creation') {
        maxLength = 15000;
      }

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: `STRICT NARRATION REQUEST:
PERSONA TO ADOPT: ${activePersona.name}. 
FULL IDENTITY SOURCE: ${activePersona.identityContext} 

STORY TITLE: ${trend.title} 
SUMMARY TO EXPAND: ${trend.originalSummary} 

MODIFIERS:${forensicModifiers || "\n- Standard Narration."}

// REGLA DE FORMATO: Evitar asteriscos para resaltar, usar espacios/saltos de línea en su lugar.
RULES:
1. ABSOLUTE RULE: The FIRST line of your response MUST be EXACTLY: "${activePersona.introductionPrefix}".
2. ADHERE STRICTLY to your POV and specific vocabulary. DO NOT introduce yourself or explain your skills. Start the story content immediately after the prefix.
3. LIMIT: Maximum ${maxLength} characters total.
4. STRUCTURE: Use natural paragraph breaks. Avoid overly short, choppy sentences. Ensure smooth transitions between ideas to maintain a cohesive narrative flow.
5. TARGET LANGUAGE: ${languageText}.
6. NO ASTERISKS (CRITICAL): Do NOT use asterisks (*) for emphasis or bolding EXCEPT for the story title${globalForensicToggles.advance ? ' and the phrase "**Avance de la Historia**"' : ''}. Use line breaks or extra spacing to highlight other important sentences.
${category === 'biographies' ? '7. CRITICAL: You MUST explicitly mention the name of the person whose biography is being narrated at least once in the text.' : ''}
${maxLength < 10000 ? '8. MASTERFUL HOOK (CRITICAL): Start the main narrative (immediately after the story title) with a masterful hook. It must not be a cheap trick, but promise real intrigue and entertainment, giving the reader a true sense of the pleasures to expect. It must do one or more of the following: awaken urgency, pose questions, show intriguing contexts, reveal narrative tensions, and establish the tone from the very first line.' : ''}
${maxLength < 10000 ? '9. SHORT NARRATIVE ARCHITECTURE (CRITICAL): Sustain attention using precise narrative architecture. Incorporate as many of these elements as the length allows: 1) Unity of impression and single effect (constant tension, no filler). 2) Focused structure (single main conflict, few characters, single setting). 3) Inescapable central conflict (clear goal and obstacle). 4) Memorable climax and ending (twist, epiphany, or open ending). 5) Every scene must earn its place (relentless condensation, cause-and-effect logic).' : ''}
${(activePersona.id === 'chunkyberto' || activePersona.id === 'luna') ? STORY_GUIDELINES : ''}`,
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
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
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

  // --- Forensic Handlers ---
  // NOTE: 'Avance de la Historia' (Story Advance) logic is strictly controlled via globalForensicToggles.advance.
  // It is explicitly forbidden in prompts when the toggle is OFF to prevent hallucinations.
  // When ON, a mandatory hierarchy is enforced to ensure it appears at the beginning (after intro) and not at the end.
  const handleAdvancedForensic = async (type: 'analysis' | 'interview' | 'advance', trendOverride?: Trend) => {
    let trend = trendOverride || selectedTrend;
    if (!trend) return;
    const storyToAnalyze = trend.chunkybertoVersion || trend.originalSummary;
    if (!storyToAnalyze) {
      setAppError({ message: "No hay historia para analizar.", isQuota: false });
      return;
    }
    
    if (type === 'analysis') setIsAnalyzing(true);
    if (type === 'interview') setIsInterviewing(true);
    if (type === 'advance') setIsAdvancing(true);
    setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const lang = getLanguageName(language);
      let prompt = "";
      if (type === 'analysis') {
        prompt = `Realiza un ANÁLISIS LITERARIO Y FORENSE detallado de la siguiente historia narrada por ${activePersona.name}. 
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA: "${storyToAnalyze}"
OBJETIVO: Identificar temas centrales, simbolismo según el POV del personaje y coherencia narrativa.
LÍMITES: Máximo 4300 caracteres. Usa párrafos de longitud natural para mantener un buen flujo narrativo.
IDIOMA: ${lang}`;
      } else if (type === 'interview') {
        prompt = `Simula una ENTREVISTA crítica o diálogo en Modo Podcast donde se entrevista a ${activePersona.name} sobre los eventos de esta historia.
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA: "${storyToAnalyze}"
OBJETIVO: Diálogo dinámico, revelando motivaciones profundas del personaje.
LÍMITES: Máximo 4300 caracteres. Usa párrafos de longitud natural para mantener un buen flujo narrativo.
IDIOMA: ${lang}`;
      } else if (type === 'advance') {
        prompt = `Escribe un AVANCE DE HISTORIA (secuela inmediata) para esta narrativa.
IDENTIDAD PERSONA: ${activePersona.identityContext}
HISTORIA ACTUAL: "${storyToAnalyze}"
OBJETIVO: Continuar la trama manteniendo el mismo tono y POV.
LÍMITES: Máximo 4300 caracteres. Usa párrafos de longitud natural para mantener un buen flujo narrativo.
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
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const languageText = getLanguageName(language);
      
      let forensicModifiers = "";
      if (globalForensicToggles.analysis) forensicModifiers += "\n- PERFORM DEEP LITERARY FORENSIC ANALYSIS OF THE SUBTEXT AND APPEND IT TO THE NARRATIVE. STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      if (globalForensicToggles.interview) forensicModifiers += "\n- FORMAT THE NARRATIVE AS AN INTERVIEW DIALOGUE (PODCAST MODE). STRICTLY NO ASTERISKS EXCEPT FOR BOLDING.";
      if (globalForensicToggles.advance) {
        // JERARQUÍA DE AVANCE: Intro -> '**Avance de la Historia**' -> Cuerpo Avance -> '**Título**' -> Narración Restante
        forensicModifiers += `
- MANDATORY HIERARCHY (ADVANCE MODE):
  1. Introductory text (The exact prefix: "${activePersona.introductionPrefix}").
  2. The phrase "**Avance de la Historia**" (in bold) followed by a line break.
  3. Body of the story advance (Teaser/Preview).
  4. The story title in bold (e.g., "**Título**").
  5. Body of the remaining narration (Main Story). The VERY FIRST sentences of this main story MUST be the MASTERFUL HOOK.
- CRITICAL: The "Avance de la Historia" MUST come BEFORE the main story title and narration. DO NOT put it at the end.
- CRITICAL: DO NOT add any transitional text, meta-commentary, or references to your skills/understanding between the introduction and the "**Avance de la Historia**" section. Go DIRECTLY from the introduction to the subtitle.
- RESPONSE TEMPLATE:
${activePersona.introductionPrefix}

**Avance de la Historia**
[Contenido del avance aquí...]

**[Título]**
[MASTERFUL HOOK goes here, followed by the rest of the story...]
`;
      } else {
        forensicModifiers += `
- ABSOLUTELY FORBIDDEN: DO NOT include any 'Avance de la Historia', 'Story Advance', or sequels. Focus ONLY on the main narrative.
- MANDATORY HIERARCHY:
  1. Introductory text (The exact prefix: "${activePersona.introductionPrefix}").
  2. The story title in bold (e.g., "**Título**").
  3. Body of the narration. The VERY FIRST sentences of this narration MUST be the MASTERFUL HOOK.
- RESPONSE TEMPLATE:
${activePersona.introductionPrefix}

**[Título]**
[MASTERFUL HOOK goes here, followed by the rest of the story...]
`;
      }

      const charLimit = narrativeLength === 'short' ? 4300 : narrativeLength === 'medium' ? 14500 : 20000;
      const lengthInstruction = narrativeLength === 'short' 
        ? "Corto: 500-4300 caracteres." 
        : narrativeLength === 'medium' 
        ? "Mediano: 4300-14500 caracteres." 
        : "Largo: MÍNIMO 15000 caracteres. Debes ser extremadamente detallado y extenso para cumplir con este requisito de longitud, pero sin exceder los 20,000 caracteres.";

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: `USER BRIEF: ${userIdea}

STRICT NARRATION REQUEST:
PERSONA TO ADOPT: ${activePersona.name}. 
FULL IDENTITY SOURCE: ${activePersona.identityContext} 

Generate a complete, engaging cinematic narrative in ${languageText} based on the user brief.
EXTENSION TARGET: ${lengthInstruction}
CRITICAL: If the target is "Largo", you MUST provide a very long and detailed narrative (at least 15,000 characters). Expand on every detail, scene, and dialogue.

MODIFIERS:${forensicModifiers || "\n- Standard Narration."}

// REGLA DE FORMATO: Evitar asteriscos para resaltar, usar espacios/saltos de línea en su lugar.
RULES:
1. ABSOLUTE RULE: The FIRST line of your response MUST be EXACTLY: "${activePersona.introductionPrefix}".
2. ADHERE STRICTLY to your POV and specific vocabulary. DO NOT introduce yourself or explain your skills. Start the story content immediately after the prefix.
3. LIMIT: Maximum ${charLimit} characters total.
4. STRUCTURE: Use natural paragraph breaks. Avoid overly short, choppy sentences. Ensure smooth transitions between ideas to maintain a cohesive narrative flow.
5. TARGET LANGUAGE: ${languageText}.
6. NO ASTERISKS (CRITICAL): Do NOT use asterisks (*) for emphasis or bolding EXCEPT for the story title${globalForensicToggles.advance ? ' and the phrase "**Avance de la Historia**"' : ''}. Use line breaks or extra spacing to highlight other important sentences.
${category === 'biographies' ? '7. CRITICAL: You MUST explicitly mention the name of the person whose biography is being narrated at least once in the text.' : ''}
${charLimit < 10000 ? '8. MASTERFUL HOOK (CRITICAL): Start the main narrative (immediately after the story title) with a masterful hook. It must not be a cheap trick, but promise real intrigue and entertainment, giving the reader a true sense of the pleasures to expect. It must do one or more of the following: awaken urgency, pose questions, show intriguing contexts, reveal narrative tensions, and establish the tone from the very first line.' : ''}
${charLimit < 10000 ? '9. SHORT NARRATIVE ARCHITECTURE (CRITICAL): Sustain attention using precise narrative architecture. Incorporate as many of these elements as the length allows: 1) Unity of impression and single effect (constant tension, no filler). 2) Focused structure (single main conflict, few characters, single setting). 3) Inescapable central conflict (clear goal and obstacle). 4) Memorable climax and ending (twist, epiphany, or open ending). 5) Every scene must earn its place (relentless condensation, cause-and-effect logic).' : ''}
${(activePersona.id === 'chunkyberto' || activePersona.id === 'luna') ? STORY_GUIDELINES : ''}`,
        config: { 
          tools: [{ googleSearch: {} }], 
          systemInstruction: `You are ${activePersona.name}.`,
          maxOutputTokens: 16384
        }
      })) as any;
      
      const fullText = response.text || "";
      if (!fullText || fullText.length < 50) {
        throw new Error("La IA no pudo generar una narrativa válida. Por favor, intenta con una idea más detallada o un tema diferente.");
      }
      
      const newTrend: Trend = { 
        id: `hybrid-${Date.now()}`, 
        title: userIdea.substring(0, 50), 
        originalSummary: userIdea, 
        source: "Laboratorio Creativo", 
        url: "", 
        chunkybertoVersion: fullText 
      };
      setTrends(prev => [newTrend, ...prev]); 
      setLatestHybridTrend(newTrend);
    } catch (err: any) { 
      setAppError(getErrorDetails(err)); 
    } finally { 
      setIsGeneratingIdea(false); 
    }
  };

  const handlePlayTTS = async (text: string, playOutLoud: boolean = true): Promise<{ buffer: AudioBuffer, blob: Blob } | null> => {
    if (!text || text.trim().length === 0) return null;
    
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const selectedStyle = NARRATION_STYLES.find(s => s.id === modelSettings.ttsStyle);
      const styleLabel = selectedStyle?.label || "Standard";
      
      const prompt = `Read this text with a ${styleLabel} tone: ${text}`;
      
      const res = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.tts,
        contents: [{ parts: [{ text: prompt }] }],
        config: { 
          responseModalities: [Modality.AUDIO], 
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: modelSettings.voiceName } 
            } 
          } 
        },
      }), 4, 4000, 30000) as any; // Increased base delay to 4s and timeout to 30s to avoid rate limits
      
      const audioPart = res.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      const base64Audio = audioPart?.inlineData?.data;
      
      if (base64Audio) {
        const ctx = await ensureAudioContext();
        const rawData = decodeBase64(base64Audio);
        const buffer = await decodeAudioData(rawData, ctx, 24000, 1);
        const blob = new Blob([rawData], { type: 'audio/pcm' }); // Raw PCM data from Gemini

        if (playOutLoud) {
          const source = ctx.createBufferSource(); 
          source.buffer = buffer; 
          source.connect(ctx.destination);
          source.start(); 
        }
        return { buffer, blob };
      } else {
        console.error("TTS Warning: No audio data returned in response parts.", res);
      }
    } catch (e) { 
      console.error("TTS Error (V47.2.2):", e); 
      const details = getErrorDetails(e);
      if (!details.isQuota && String(details.code) !== "500" || playOutLoud) {
        setAppError(details);
      }
      throw e; // Throw the error so the caller knows it failed
    }
  };

  const startStoryboardProduction = async () => {
    if (!selectedTrend || !selectedTrend.chunkybertoVersion) return;
    setProducingImages(true); setAppError(null);
    setSelectedTrend(prev => (prev ? { ...prev, storyboard: [] } : null));
    try {
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const visualAnchorContext = activePersona.id === 'luna' 
        ? 'IMPORTANT: Whenever "Luna" or a cat is mentioned, the visual prompt MUST include an elegant SIAMESE CAT with sapphire blue eyes.' 
        : activePersona.id === 'chunkyberto' 
        ? 'IMPORTANT: Whenever "Chunkyberto" or a dog is mentioned, the visual prompt MUST include a friendly BLACK LABRADOR RETRIEVER.' 
        : activePersona.id === 'mayra'
        ? 'IMPORTANT: Whenever "Mayra" or the main character is mentioned, the visual prompt MUST include a radiant woman with wavy light brown hair, honey highlights and silver strands, large warm brown eyes, magenta lipstick, white pearl earrings, and a black polka dot blouse with a bow at the neck.'
        : (activePersona.id === 'erick_betancourt' || activePersona.id === 'erickberto')
        ? `IMPORTANT: Whenever "${activePersona.name}" or the protagonist is mentioned, the visual prompt MUST include a middle-aged man with dark curly hair and a receding hairline (high forehead), intelligent dark eyes, professional and analytical expression.`
        : `Visual Anchor: ${activePersona.visualProfile}`;
      
      const activeCharacters = customCharacters.filter((c): c is CustomCharacter => c !== null && !!c.base64);
      const characterContext = activeCharacters.length > 0 
        ? `\n\nIMPORTANT CHARACTER REFERENCE: I have provided ${activeCharacters.length} reference images of the main characters. Analyze their visual appearance from the images. When writing the 'IMAGE PROMPT' for each scene, if any of these characters appear, you MUST describe their visual appearance in extreme detail (age, hair color/style, eye color, skin tone, facial hair, clothing, etc.) based on the provided images so the image generator can recreate them accurately. NEVER just use their names in the prompt, ALWAYS use their full physical description.`
        : '';

      const promptText = `Analyze the following narrative paragraph by paragraph: "${selectedTrend.chunkybertoVersion}". 
For EACH paragraph, generate between 1 and 4 cinematic scenes, depending on the number of complete ideas in that paragraph.
CRITICAL: Ignore empty lines or paragraphs that do not contain narrative text. Do NOT generate scenes for empty lines.
${visualAnchorContext}${characterContext}
FORMAT FOR EACH SCENE: SCENE IDEA ||| IMAGE PROMPT ||| NARRATION TEXT.
The NARRATION TEXT must represent the specific idea being conveyed in the scene, and must start with "(Voz masculina): ".
LENGUAJE: ${getLanguageName(language)}.`;

      const contents: any = { parts: [{ text: promptText }] };
      if (modelSettings.erickReferenceImage) {
        const base64Data = modelSettings.erickReferenceImage.split(',')[1];
        const mimeType = modelSettings.erickReferenceImage.split(';')[0].split(':')[1];
        contents.parts.push({ text: `Reference image for character: Erick` });
        contents.parts.push({ inlineData: { data: base64Data, mimeType } });
      }
      activeCharacters.forEach(c => {
        contents.parts.push({ text: `Reference image for character: ${c.name}` });
        contents.parts.push({ inlineData: { data: c.base64, mimeType: c.mimeType || 'image/jpeg' } });
      });

      const promptRes = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: contents,
        config: { systemInstruction: "Format exactly with |||. Generate 1 to 4 scenes per paragraph." }
      })) as any;
      const lines = (promptRes.text || "").split('\n').filter((p: string) => p.includes('|||'));
      const frames: StoryboardFrame[] = [];
      for (let i = 0; i < lines.length; i++) {
        let [rawIdea, rawPrompt, rawNarration] = lines[i].split('|||').map((s: string) => s.trim());
        if (!rawIdea || !rawPrompt || !rawNarration) continue; // Skip empty scenes
        frames.push({ id: `frame-${i}-${Date.now()}`, imageUrl: '', prompt: rawPrompt, originalIdea: rawIdea, narrationText: rawNarration, isGeneratingImage: true, dimension: videoDim, style: visualStyle });
      }
      setSelectedTrend(prev => (prev ? { ...prev, storyboard: [...frames] } : null));
      for (let i = 0; i < frames.length; i++) {
        try {
          const res = await apiRetry(() => ai.models.generateContent({ model: modelSettings.image, contents: { parts: [{ text: `Style: ${visualStyle}. ${frames[i].prompt}.` }] }, config: { imageConfig: { aspectRatio: videoDim } } }), 3, 5000, 45000) as any;
          const imageData = res.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData)?.inlineData?.data;
          if (imageData) { frames[i].imageUrl = `data:image/png;base64,${imageData}`; frames[i].isGeneratingImage = false; }
          else { frames[i].hasError = true; frames[i].isGeneratingImage = false; }
        } catch (imgErr) { frames[i].hasError = true; frames[i].isGeneratingImage = false; }
        const updatedFrames = [...frames];
        setSelectedTrend(prev => (prev ? { ...prev, storyboard: updatedFrames } : null));
        await new Promise(r => setTimeout(r, 4000)); // Increased to 4s to avoid rate limits
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
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      const res = await apiRetry(() => ai.models.generateContent({ model: modelSettings.image, contents: { parts: [{ text: `Style: ${visualStyle}. ${frame.prompt}.` }] }, config: { imageConfig: { aspectRatio: videoDim } } }), 3, 5000, 45000) as any;
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
      const ai = new GoogleGenAI({ apiKey: ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "") });
      
      const config: any = { numberOfVideos: 1, resolution: '720p', aspectRatio: videoDim };
      const promptText = `${visualStyle} film: ${frame.originalIdea}.`;
      
      const referenceImagesPayload: any[] = [];

      if (modelSettings.erickReferenceImage && (promptText.toLowerCase().includes('erick') || frame.prompt.toLowerCase().includes('erick'))) {
        const base64Data = modelSettings.erickReferenceImage.split(',')[1];
        const mimeType = modelSettings.erickReferenceImage.split(';')[0].split(':')[1];
        referenceImagesPayload.push({
          image: { imageBytes: base64Data, mimeType },
          referenceType: 'ASSET'
        });
      }

      const activeCharacters = customCharacters.filter((c): c is CustomCharacter => c !== null && !!c.base64);
      activeCharacters.forEach(c => {
        if (promptText.toLowerCase().includes(c.name.toLowerCase()) || frame.prompt.toLowerCase().includes(c.name.toLowerCase())) {
          referenceImagesPayload.push({
            image: { imageBytes: c.base64, mimeType: c.mimeType || 'image/jpeg' },
            referenceType: 'ASSET'
          });
        }
      });

      // Veo only supports up to 3 reference images
      if (referenceImagesPayload.length > 0) {
        config.referenceImages = referenceImagesPayload.slice(0, 3);
      }

      let operation = await apiRetry(() => ai.models.generateVideos({ model: modelSettings.video, prompt: promptText, image: { imageBytes: frame.imageUrl.split(',')[1], mimeType: 'image/png' }, config }), 3, 5000, 30000) as any;
      while (!operation.done) { await new Promise(resolve => setTimeout(resolve, 10000)); operation = await apiRetry(() => ai.operations.getVideosOperation({ operation }), 3, 5000, 30000); }
      const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const vidRes = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': ((window as any).process?.env?.GEMINI_API_KEY || (window as any).process?.env?.API_KEY || "")
          }
        });
        if (!vidRes.ok) throw new Error(`Video download failed: ${vidRes.statusText}`);
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
    setIsCombiningVideos(true); setCombineProgress(1); setAppError(null);
    console.log(`Iniciando síntesis de video para ${readyFrames.length} escenas...`);
    let silentOsc: OscillatorNode | null = null;
    let silentGain: GainNode | null = null;
    const mediaElements: (HTMLVideoElement | HTMLImageElement)[] = [];
    const audioBuffers: (AudioBuffer | null)[] = [];
    
    try {
      const ctx = await ensureAudioContext();
      console.log("AudioContext listo.");
      
      // Pre-fetch all TTS audio buffers and media to avoid delays during recording
      
      for (let i = 0; i < readyFrames.length; i++) {
        const baseProgress = (i / readyFrames.length) * 30;
        setCombineProgress(Math.max(1, Math.round(baseProgress)));
        const frame = readyFrames[i];
        
        console.log(`Preparando escena ${i+1}/${readyFrames.length}...`);
        
        // Pre-load media with timeout and multiple event listeners
        let sourceElement: HTMLVideoElement | HTMLImageElement;
        const hasVideo = !!frame.videoUrl && frame.videoUrl.length > 0;
        
        if (hasVideo) { 
          console.log(`Composición: Priorizando VIDEO para escena ${i+1}`);
          const vid = document.createElement('video');
          vid.style.display = 'none';
          document.body.appendChild(vid);
          vid.src = frame.videoUrl as string; 
          vid.muted = true; 
          vid.playsInline = true; 
          vid.crossOrigin = "anonymous";
          vid.loop = true;
          sourceElement = vid;
          
          await Promise.race([
            new Promise((resolve, reject) => {
              const checkReady = () => {
                if (vid.readyState >= 2 && !isNaN(vid.duration) && vid.videoWidth > 0) {
                  console.log(`Video listo: Escena ${i+1}, Duración: ${vid.duration}s, Dim: ${vid.videoWidth}x${vid.videoHeight}`);
                  resolve(null);
                  return true;
                }
                return false;
              };
              if (checkReady()) return;

              const handler = () => {
                if (checkReady()) {
                  vid.removeEventListener('canplay', handler);
                  vid.removeEventListener('loadedmetadata', handler);
                  vid.removeEventListener('loadeddata', handler);
                }
              };
              vid.addEventListener('canplay', handler);
              vid.addEventListener('loadedmetadata', handler);
              vid.addEventListener('loadeddata', handler);
              vid.onerror = () => reject(new Error(`Error cargando video de escena ${i+1}`));
              vid.load();
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Tiempo de espera agotado cargando video de escena ${i+1}`)), 25000))
          ]);
        } else { 
          console.log(`Composición: Usando IMAGEN para escena ${i+1}`);
          const img = document.createElement('img');
          img.style.display = 'none';
          document.body.appendChild(img);
          img.src = frame.imageUrl; 
          img.crossOrigin = "anonymous";
          sourceElement = img;
          
          await Promise.race([
            new Promise((resolve, reject) => {
              if (img.complete) { resolve(null); return; }
              img.onload = () => resolve(null);
              img.onerror = () => reject(new Error(`Error cargando imagen de escena ${i+1}`));
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Tiempo de espera agotado cargando imagen de escena ${i+1}`)), 15000))
          ]); 
        }
        mediaElements.push(sourceElement);

        // Update progress after media load
        setCombineProgress(Math.round(baseProgress + (15 / readyFrames.length)));

        // Fetch TTS - use cached blob if available to save time and API calls
        try {
          if (frame.audioBlob) {
            console.log(`Usando audio pre-generado para escena ${i+1}`);
            const arrayBuffer = await frame.audioBlob.arrayBuffer();
            const rawData = new Uint8Array(arrayBuffer);
            const audioBuffer = await decodeAudioData(rawData, ctx, 24000, 1);
            audioBuffers.push(audioBuffer);
          } else {
            if (i > 0) {
              const jitter = Math.random() * 1000;
              const delay = 4000 + jitter; // 4-5 seconds to respect 15 RPM limit
              console.log(`Esperando ${Math.round(delay)}ms antes de TTS de escena ${i+1}...`);
              await new Promise(r => setTimeout(r, delay)); 
            }
            
            console.log(`Generando audio para escena ${i+1}/${readyFrames.length}...`);
            const ttsResult = await handlePlayTTS(frame.narrationText, false);
            if (ttsResult) {
              console.log(`Audio generado exitosamente para escena ${i+1}`);
              audioBuffers.push(ttsResult.buffer);
              setSelectedTrend(prev => {
                if (!prev || !prev.storyboard) return prev;
                const newStoryboard = [...prev.storyboard];
                const idx = newStoryboard.findIndex(f => f.id === frame.id);
                if (idx !== -1) newStoryboard[idx] = { ...newStoryboard[idx], audioBlob: ttsResult.blob };
                return { ...prev, storyboard: newStoryboard };
              });
            } else {
              console.warn(`No se pudo generar audio para escena ${i+1}.`);
              throw new Error(`Fallo al generar audio para la escena ${i+1}. Por favor, intenta de nuevo en unos momentos.`);
            }
          }
        } catch (ttsErr: any) {
          console.error(`Error procesando audio de escena ${i+1}:`, ttsErr);
          throw new Error(`Error de audio en escena ${i+1}: ${ttsErr.message || "Límite de cuota o error de red"}`);
        }
        
        // Ensure progress is updated even if TTS takes time or fails
        setCombineProgress(Math.round(((i + 1) / readyFrames.length) * 30));
      }

      const dest = ctx.createMediaStreamDestination();
      const canvas = document.createElement('canvas');
      const isPortrait = videoDim === '9:16'; canvas.width = isPortrait ? 720 : 1280; canvas.height = isPortrait ? 1280 : 720;
      const canvasCtx = canvas.getContext('2d'); if (!canvasCtx) throw new Error("Canvas context failed");
      
      // Draw initial black frame so captureStream has something to capture
      canvasCtx.fillStyle = '#000';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      const canvasStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      
      // Prevent background throttling by playing a silent oscillator to the main output
      silentOsc = ctx.createOscillator();
      silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentOsc.connect(silentGain);
      silentGain.connect(ctx.destination);
      silentOsc.start();
      
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = ''; // Let the browser choose its default
            }
          }
        }
      }
      
      const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = []; recorder.ondataavailable = (e) => chunks.push(e.data);
      const recorderPromise = new Promise<string>((resolve, reject) => { 
        const timeout = setTimeout(() => reject(new Error("Tiempo de espera agotado esperando el cierre del grabador")), 1800000); // 30 min max
        recorder.onstop = () => { 
          clearTimeout(timeout);
          const finalMimeType = mimeType.includes('mp4') ? 'video/mp4' : 'video/webm';
          setCombinedVideoMimeType(finalMimeType);
          const blob = new Blob(chunks, { type: finalMimeType }); 
          resolve(URL.createObjectURL(blob)); 
        }; 
      });
      recorder.start();

      const startTimeOffset = ctx.currentTime;
      let globalAudioTime = startTimeOffset;

      for (let i = 0; i < readyFrames.length; i++) {
        const frame = readyFrames[i];
        const audioBuffer = audioBuffers[i];
        const sourceElement = mediaElements[i];
        
        // REGLA DE SÍNTESIS: Priorizar video generado si existe.
        // Si es video, la duración es el audio (con margen mínimo) o la duración del video.
        // Si es imagen estática, mínimo 10s (Regla 3 de AGENTS.md) o duración del audio.
        let segmentDuration = audioBuffer ? audioBuffer.duration + 0.2 : 4.0;
        
        if (sourceElement instanceof HTMLVideoElement) {
          const video = sourceElement as HTMLVideoElement;
          let vDur = video.duration;
          if (isNaN(vDur) || vDur === Infinity) vDur = 6.0;
          segmentDuration = Math.max(segmentDuration, vDur);
          video.currentTime = 0;
          try {
            await video.play();
          } catch (e) {
            console.warn(`No se pudo reproducir el video de la escena ${i+1}:`, e);
          }
        } else {
          segmentDuration = audioBuffer ? Math.max(10.0, audioBuffer.duration + 0.2) : 10.0;
        }

        const sceneStartTime = globalAudioTime;

        if (audioBuffer) {
          const audioSource = ctx.createBufferSource(); 
          audioSource.buffer = audioBuffer; 
          audioSource.connect(dest); 
          audioSource.start(sceneStartTime); 
        }

        let lastProgressUpdate = 0;
        while (ctx.currentTime < sceneStartTime + segmentDuration) {
          const nowMs = Date.now();
          const elapsed = ctx.currentTime - sceneStartTime;
          const progress = Math.min(1, Math.max(0, elapsed / segmentDuration));
          
          if (nowMs - lastProgressUpdate > 200) {
            const totalProgress = 30 + Math.round(((i + progress) / readyFrames.length) * 70);
            setCombineProgress(Math.min(99, totalProgress));
            lastProgressUpdate = nowMs;
          }
          
          canvasCtx.fillStyle = '#000'; 
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
          
          let sW = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoWidth : sourceElement.naturalWidth;
          let sH = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoHeight : sourceElement.naturalHeight;
          const baseRatio = Math.max(canvas.width / sW, canvas.height / sH);
          
          let scale = 1.0;
          let offX = 0;
          let offY = 0;

          // REGLA: Los efectos de movimiento SOLO se aplican a imágenes estáticas.
          // Los videos generados se muestran tal cual para mantener su integridad.
          if (!(sourceElement instanceof HTMLVideoElement)) {
            if (modelSettings.motionEffect === 'zoom_in') {
               scale = 1.0 + (progress * 0.18); 
            } else if (modelSettings.motionEffect === 'pan_right') {
               offX = progress * 120; 
            } else if (modelSettings.motionEffect === 'pan_left') {
               offX = -progress * 120;
            }
          }

          const nW = sW * baseRatio * scale; const nH = sH * baseRatio * scale;
          
          let opacity = 1.0;
          if (modelSettings.transitionEffect === 'fade_black') {
            const transTime = 0.6;
            if (elapsed < transTime) opacity = elapsed / transTime;
            if (elapsed > segmentDuration - transTime) opacity = (segmentDuration - elapsed) / transTime;
          }

          canvasCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
          
          // Sincronización forzada para video
          if (sourceElement instanceof HTMLVideoElement) {
             const video = sourceElement as HTMLVideoElement;
             // Forzar currentTime si el video se detiene o para asegurar fotograma correcto
             if (!video.paused && Math.abs(video.currentTime - elapsed) > 0.5) {
                video.currentTime = elapsed % (video.duration || 6);
             }
          }

          canvasCtx.drawImage(sourceElement, (canvas.width - nW) / 2 + offX, (canvas.height - nH) / 2 + offY, nW, nH);
          canvasCtx.globalAlpha = 1.0;

          // Dibujar subtítulos superpuestos
          if (frame.narrationText) {
            const text = frame.narrationText.replace(/^\(Voz masculina\):\s*/i, '');
            const fontSize = isPortrait ? 28 : 36;
            canvasCtx.font = `900 ${fontSize}px Inter, sans-serif`;
            canvasCtx.textAlign = 'center';
            canvasCtx.textBaseline = 'bottom';
            
            const words = text.split(' ');
            let line = '';
            const lines = [];
            const maxWidth = canvas.width * 0.85;
            
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' ';
              const metrics = canvasCtx.measureText(testLine);
              if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
              } else {
                line = testLine;
              }
            }
            lines.push(line);
            
            const lineHeight = fontSize * 1.3;
            const startY = canvas.height - (isPortrait ? 60 : 40) - (lines.length - 1) * lineHeight;
            
            for (let k = 0; k < lines.length; k++) {
              const y = startY + k * lineHeight;
              
              // Borde del texto para legibilidad
              canvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
              canvasCtx.lineWidth = fontSize * 0.2;
              canvasCtx.lineJoin = 'round';
              canvasCtx.strokeText(lines[k], canvas.width / 2, y);
              
              // Relleno del texto
              canvasCtx.fillStyle = '#FFFFFF';
              canvasCtx.fillText(lines[k], canvas.width / 2, y);
            }
          }

          await new Promise(r => setTimeout(r, 33)); // ~30fps, works in background
        }
        globalAudioTime += segmentDuration;
      }
      
      // Wait a small bit to ensure the last audio bits are captured by the recorder
      await new Promise(r => setTimeout(r, 500));
      
      setCombineProgress(100); 
      recorder.stop(); 
      const finalUrl = await recorderPromise; 
      setCombinedVideoUrl(finalUrl);
      
      // Cleanup DOM elements
      mediaElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    } catch (err: any) { 
      setAppError(getErrorDetails(err)); 
      // Cleanup DOM elements on error
      mediaElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    } finally { 
      setIsCombiningVideos(false); 
      if (silentOsc) {
        try { silentOsc.stop(); silentOsc.disconnect(); } catch (e) {}
      }
      if (silentGain) {
        try { silentGain.disconnect(); } catch (e) {}
      }
    }
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
            if (frame.videoBlob) { rootFolder?.file(`${sceneName}_Video.mp4`, frame.videoBlob); }
            if (frame.audioBlob) { rootFolder?.file(`${sceneName}_Audio.pcm`, frame.audioBlob); }
        }
        if (combinedVideoUrl) { 
          try {
            const res = await fetch(combinedVideoUrl); 
            if (res.ok) {
              const blob = await res.blob(); 
              const ext = combinedVideoMimeType.includes('mp4') ? 'mp4' : 'webm';
              rootFolder?.file(`PELICULA_MAESTRA.${ext}`, blob); 
            }
          } catch (e) {
            console.error("Error fetching combined video for ZIP:", e);
          }
        }
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a'); link.href = URL.createObjectURL(zipBlob); link.download = `Bundle_${selectedTrend.title.substring(0,15)}.zip`; link.click();
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setIsZipping(false); }
  };

  const visualStyles: ImageStyle[] = [
    'Cinematic', 'Anime', 'Cyberpunk', 'Oil Painting', 'Sketch', 
    '3D Render', 'Neo-Noir', 'Photorealistic', 'CGI', 'Epic Fantasy',
    'Watercolor', 'Pop Art', 'Steampunk', 'Minimalist', 'Pixel Art',
    'Vintage Photography', 'Origami', 'Claymation', 'Gothic', 'Synthwave',
    'Comic Book', 'Surrealism', 'Horror/Terror', 'Futuristic', 'Star Wars', 'Pixar'
  ];
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
    { id: 'exoplanetas', label: 'Exoplanetas', icon: <Telescope size={14} />, exclusive: ['erickberto', 'erick_betancourt'] },
    { id: 'ai_exoplanets_creation', label: 'Creación IA - Exoplanetas', icon: <Sparkles size={14} />, exclusive: ['erickberto', 'erick_betancourt'] },
    { id: 'biographies', label: 'Biografías Famosas', icon: <BookOpen size={14} />, exclusive: ['chunkyberto', 'luna', 'erick_betancourt', 'erickberto'] },
  ].filter(opt => !opt.exclusive || (Array.isArray(opt.exclusive) ? opt.exclusive.includes(selectedPersonaId) : selectedPersonaId === opt.exclusive));

  const renderForensicToolkit = (targetTrend?: Trend, isGlobal?: boolean) => {
    const trend = targetTrend || selectedTrend;
    if (!trend && !isGlobal) return null;
    
    const handleToggle = (type: 'analysis' | 'interview' | 'advance') => {
      if (isGlobal) {
        setGlobalForensicToggles(prev => ({ ...prev, [type]: !prev[type] }));
      } else if (trend) {
        handleAdvancedForensic(type, trend);
      }
    };

    const isToggled = (type: 'analysis' | 'interview' | 'advance') => {
      if (isGlobal) return globalForensicToggles[type];
      if (trend) return !!trend[type];
      return false;
    };

    return (
      <div className={`${isGlobal ? 'bg-slate-900/50 border-slate-800' : 'bg-purple-900/10 border-purple-500/20'} border-2 p-6 rounded-[2.5rem] shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] animate-in slide-in-from-top-4 duration-500 my-4`}>
        <div className="flex items-center gap-2 mb-6 px-2"><Wand2 size={16} className="text-purple-400" /><span className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-300">Forensic Modifiers {isGlobal ? '(Global)' : '(Action)'}</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           <button onClick={() => handleToggle('analysis')} disabled={!isGlobal && (isAnalyzing || (trend && rewritingId === trend.id))} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${isToggled('analysis') ? 'bg-purple-500 text-slate-950 shadow-purple-500/40' : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50'}`}><div className="flex items-center gap-2"><BrainCircuit size={16} /> Análisis Literario</div>{!isGlobal && (isAnalyzing || (trend && rewritingId === trend.id)) ? <Loader2 size={14} className="animate-spin" /> : isToggled('analysis') ? <Check size={14} /> : <ChevronRight size={14} />}</button>
           <button onClick={() => handleToggle('interview')} disabled={!isGlobal && (isInterviewing || (trend && rewritingId === trend.id))} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${isToggled('interview') ? 'bg-indigo-500 text-slate-950 shadow-indigo-500/40' : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'}`}><div className="flex items-center gap-2"><MicVocal size={16} /> Modo Entrevista</div>{!isGlobal && (isInterviewing || (trend && rewritingId === trend.id)) ? <Loader2 size={14} className="animate-spin" /> : isToggled('interview') ? <Check size={14} /> : <ChevronRight size={14} />}</button>
           <button onClick={() => handleToggle('advance')} disabled={!isGlobal && (isAdvancing || (trend && rewritingId === trend.id))} className={`group flex items-center justify-between p-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg ${isToggled('advance') ? 'bg-fuchsia-500 text-slate-950 shadow-fuchsia-500/40' : 'bg-fuchsia-900/40 text-fuchsia-300 hover:bg-fuchsia-800/50'}`}><div className="flex items-center gap-2"><FastForward size={16} /> Avance de Historia</div>{!isGlobal && (isAdvancing || (trend && rewritingId === trend.id)) ? <Loader2 size={14} className="animate-spin" /> : isToggled('advance') ? <Check size={14} /> : <ChevronRight size={14} />}</button>
        </div>
      </div>
    );
  };

  const masterRecapTrend = trends.find(t => t.isMasterSummary);

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 p-12 rounded-[3rem] shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-indigo-500/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Key size={48} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">API Key Requerida</h1>
          <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
            Para utilizar los modelos de generación de video Veo y otras funciones avanzadas, necesitas configurar tu propia API Key de Gemini.
          </p>
          <button 
            onClick={ensureApiKeySelection}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Key size={20} />
            Configurar API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-40 text-slate-100 bg-[#0f172a] selection:bg-${activePersona.color}/30`}>
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 font-bold text-sm ${
            notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
            notification.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
            'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {notification.type === 'error' ? <AlertTriangle size={20} className="text-rose-500" /> :
             notification.type === 'warning' ? <AlertTriangle size={20} className="text-amber-500" /> :
             <CheckCircle size={20} className="text-emerald-500" />}
            {notification.message}
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-3xl border-b border-slate-800 px-4 py-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTrend(null)}>
          <div className={`bg-${activePersona.color} p-2.5 rounded-xl shadow-lg`}>{activePersona.icon}</div>
          <h1 className="font-black text-xl tracking-tighter text-white uppercase italic">STUDIO<span className={`text-${activePersona.color}`}>.</span>MULTI</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">Economical Mode Active</span>
            <span className="text-[7px] font-black text-slate-500 uppercase">V47.2.3</span>
          </div>
          {ytSettings[activePersona.id]?.url && (
            <a 
              href={ytSettings[activePersona.id].url} 
              target="_blank" 
              rel="noopener noreferrer" 
              title={`Canal de YouTube de ${activePersona.name}`}
              className="p-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20 transition-all flex items-center gap-2"
            >
              <Youtube size={18} />
              <span className="hidden lg:inline text-[9px] font-black uppercase tracking-tighter">Mi Canal</span>
            </a>
          )}
          <div className="relative hidden sm:block">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="appearance-none p-2.5 pl-9 pr-4 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-all font-black text-[9px] uppercase tracking-tighter cursor-pointer outline-none"
              title="Idioma Global"
            >
              <option value="es">ESPAÑOL</option>
              <option value="en">ENGLISH</option>
              <option value="fr">FRANÇAIS</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Globe2 size={14} />
            </div>
          </div>
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
          ytSettings={ytSettings[activePersona.id] || { url: '', isConnected: false }}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        ytSettings={ytSettings}
        onUpdateYtSettings={handleUpdateYtSettings}
        activePersona={activePersona}
        modelSettings={modelSettings}
        setModelSettings={setModelSettings}
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
                        <a href={combinedVideoUrl} download={`${selectedTrend.title.substring(0,10)}_Master.${combinedVideoMimeType.includes('mp4') ? 'mp4' : 'webm'}`} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-emerald-400 transition-all active:scale-95"><Download size={20} /> DESCARGAR</a>
                        <button onClick={() => setIsYouTubeModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-red-500 transition-all active:scale-95 ring-4 ring-red-600/20"><Youtube size={20} /> SUBIR A YOUTUBE</button>
                      </>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={handleCombineAllVideos} disabled={isCombiningVideos || selectedTrend.storyboard.some(f => !f.narrationText || f.narrationText.trim() === '')} className={`flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-30`}><Film size={20} /> SINTETIZAR PELÍCULA COMPLETA</button>
                        {selectedTrend.storyboard.some(f => !f.imageUrl && !f.videoUrl) && !isCombiningVideos && (
                          <span className="text-xs text-amber-500 font-medium">⚠️ Faltan imágenes en algunas escenas. Solo se incluirán las escenas listas.</span>
                        )}
                        {isCombiningVideos && <span className="text-xs text-amber-400 font-medium animate-pulse">⚠️ La síntesis ocurre en tiempo real (tarda lo mismo que dura el video). Por favor, mantén esta pestaña abierta.</span>}
                      </div>
                    )}
                  </div>
                )}
             </div>
             {appError && <DetailedErrorConsole error={appError} activePersona={activePersona} onClose={() => setAppError(null)}  />}
             
             <div className="mb-12">
               <div className={`p-8 rounded-[4rem] bg-slate-900/50 border-4 border-slate-800 backdrop-blur-sm flex flex-col md:flex-row items-center gap-10`}>
                 <div className="md:w-1/3 aspect-video bg-slate-950 rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl flex items-center justify-center relative">
                    {selectedTrend.thumbnailUrl ? (<img src={selectedTrend.thumbnailUrl} className="w-full h-full object-cover" alt="YouTube Thumbnail" />) : (<div className="flex flex-col items-center gap-3 text-slate-700"><Youtube size={64} /><span className="text-[10px] font-black uppercase tracking-widest">Sin Miniatura</span></div>)}
                    {generatingThumbnail && (<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20"><Loader2 className="animate-spin text-emerald-500 mb-4" size={48} /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Generando Portada...</span></div>)}
                 </div>
                 <div className="flex-1 space-y-4">
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter">YouTube <span className={`text-${activePersona.color}`}>Cover Art.</span></h3>
                   <p className="text-slate-400 text-sm font-medium italic">"Arte de portada optimizado para YouTube utilizando el perfil visual de {activePersona.name}."</p>
                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                     <div className="relative w-full sm:w-64">
                       <select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value as ImageStyle)} className="w-full pl-4 pr-10 py-5 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">
                         {visualStyles.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                       </select>
                       <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Palette size={16} /></div>
                     </div>
                     <button onClick={handleGenerateThumbnail} disabled={generatingThumbnail} className={`px-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-slate-700 hover:border-${activePersona.color} transition-all shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-50`}>
                       {generatingThumbnail ? <Loader2 size={18} className="animate-spin" /> : <LucideImage size={18} />}
                       {selectedTrend.thumbnailUrl ? 'RE-GENERAR MINIATURA' : 'GENERAR MINIATURA PRO'}
                     </button>
                   </div>
                   {selectedTrend.storyboard?.some(f => !f.narrationText || f.narrationText.trim() === '') && (
                     <div className="mt-6 text-center">
                       <span className="text-rose-400 font-bold text-sm tracking-wide" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>No debe haber guiones vacios, favor de corregir</span>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-[4rem] border-2 border-slate-700 shadow-2xl sticky top-32">
                      <div className="flex items-center gap-3 mb-8"><ScrollText size={24} className={`text-${activePersona.color}`} /><span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Guion Literario</span></div>
                      <h3 className={`text-3xl font-black uppercase italic text-${activePersona.color} mb-8 leading-none tracking-tighter`}>{selectedTrend.title}</h3>
                      <div className="bg-slate-950/80 p-8 rounded-[2.5rem] mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar border border-slate-700/50 shadow-inner">
                          {selectedTrend.advance && (
                            <div className="mb-8 p-6 bg-fuchsia-500/10 border-l-4 border-fuchsia-500 rounded-r-2xl animate-in fade-in slide-in-from-left-4 duration-500">
                              <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest block mb-2">Avance Narrativo / Secuela</span>
                              <p className="text-sm text-fuchsia-100 italic leading-relaxed">"{selectedTrend.advance}"</p>
                            </div>
                          )}
                          <p className="text-base text-slate-100 font-bold leading-relaxed whitespace-pre-wrap italic">"{selectedTrend.chunkybertoVersion || "Borrador original: " + selectedTrend.originalSummary}"</p>
                       </div>
                      <button onClick={() => handlePlayTTS(selectedTrend.chunkybertoVersion || selectedTrend.originalSummary)} className={`w-full py-6 rounded-[2rem] bg-slate-900 text-${activePersona.color} border-2 border-slate-800 hover:border-${activePersona.color}/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl`}><Volume2 size={24} /> ESCUCHAR COMPLETO</button>
                      <button onClick={handleSaveDraft} className={`w-full py-6 mt-4 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl`}><Archive size={24} /> GUARDAR BORRADOR</button>
                      <div className="mt-8 border-t border-slate-700/50 pt-8">{renderForensicToolkit()}</div>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-12">
                   {(selectedTrend.analysis || selectedTrend.interview) && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-top-6 duration-500">
                        {selectedTrend.analysis && (<div className="bg-purple-900/10 border-2 border-purple-500/20 p-8 rounded-[3rem] relative group shadow-2xl"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-[0.3em]"><BrainCircuit size={16} /> Resultado Análisis Literario</div><div className="flex items-center gap-2"><CopyButton text={selectedTrend.analysis} /><button onClick={() => { setSelectedTrend(prev => prev ? {...prev, analysis: undefined} : null); }} className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400"><X size={14}/></button></div></div><p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{selectedTrend.analysis}</p></div>)}
                        {selectedTrend.interview && (<div className="bg-indigo-900/10 border-2 border-indigo-500/20 p-8 rounded-[3rem] relative group shadow-2xl"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]"><RadioTower size={16} /> Transcripción Entrevista Persona</div><div className="flex items-center gap-2"><CopyButton text={selectedTrend.interview} /><button onClick={() => { setSelectedTrend(prev => prev ? {...prev, interview: undefined} : null); }} className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400"><X size={14}/></button></div></div><p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{selectedTrend.interview}</p></div>)}
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
                            <div className="flex items-center justify-between mb-10"><div className="flex items-center gap-6"><span className={`w-16 h-16 flex items-center justify-center ${frame.hasError ? 'bg-rose-500/20 text-rose-500' : `bg-${activePersona.color}/20 text-${activePersona.color}`} rounded-[1.5rem] font-black text-3xl shadow-xl border border-current opacity-80`}>{i+1}</span><div><h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-2">ESCENA {i+1} de {selectedTrend.storyboard?.length}</h4><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{frame.originalIdea}</p></div></div></div>
                            <div className="relative mb-6 group/preview">
                              <div className={`aspect-video bg-slate-950 rounded-[4rem] overflow-hidden border-[12px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative transition-all duration-700 ${videoDim === '9:16' ? 'max-w-[300px] mx-auto' : videoDim === '1:1' ? 'aspect-square max-w-[500px] mx-auto' : ''}`}>
                                {frame.videoUrl ? <video src={frame.videoUrl} autoPlay muted loop className="w-full h-full object-cover" /> : frame.imageUrl ? <img src={frame.imageUrl} className="w-full h-full object-cover" alt={`Frame ${i+1}`} /> : <div className="w-full h-full flex items-center justify-center bg-slate-900/50"><Loader2 className="animate-spin text-slate-700" size={48} /></div>}
                                {(frame.isGeneratingVideo || frame.isGeneratingImage) && (<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center z-20"><Loader2 className="animate-spin text-emerald-500 mb-6" size={64} /><span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-500 animate-pulse">{frame.isGeneratingVideo ? 'FILMANDO...' : 'RE-IMAGINANDO...'}</span></div>)}
                              </div>
                            </div>

                            <div className="mb-6 space-y-2">
                               <div className="flex items-center justify-between px-4">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Edit3 size={12} /> Guion de Audio (Editable)</label>
                                 <CopyButton text={frame.narrationText} />
                               </div>
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
                              <button onClick={() => handleGenerateIndividualVideo(i)} disabled={frame.isGeneratingVideo || !frame.imageUrl || frame.isGeneratingImage || !(modelSettings.video || MODELS.VIDEO)} className={`py-6 rounded-[2.5rem] ${frame.videoUrl ? 'bg-indigo-900/30 text-indigo-400 border-2 border-indigo-500/30' : `bg-indigo-600 text-white`} font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30`}>{frame.videoUrl ? <RefreshCcw size={18} /> : <Zap size={18} />} {frame.videoUrl ? 'RE-FILMAR' : 'GENERAR VIDEO'}</button>
                              <button onClick={() => handlePlayTTS(frame.narrationText)} className="py-6 rounded-[2.5rem] bg-slate-900 text-slate-400 border-2 border-slate-800 font-black text-xs uppercase shadow-2xl hover:text-white transition-all flex items-center justify-center gap-3 active:scale-90"><Volume2 size={18} /> ESCUCHAR VOZ</button>
                            </div>
                        </div>
                      ))}
                      {producingImages && (!selectedTrend.storyboard || selectedTrend.storyboard.length === 0) && <div className="p-16 rounded-[5rem] bg-slate-900/20 border-4 border-slate-800 border-dashed flex flex-col items-center justify-center min-h-[500px]"><Loader2 size={64} className={`animate-spin text-${activePersona.color} mb-8`} /><h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Sintetizando Storyboard...</h4></div>}
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
              {appError && <DetailedErrorConsole error={appError} activePersona={activePersona} onClose={() => setAppError(null)}  />}
              <div className="flex flex-col gap-6 items-center text-center"><h2 className="text-4xl xs:text-5xl font-black italic text-white leading-none tracking-tighter uppercase">Studio de <span className={`text-${activePersona.color}`}>{activePersona.name}.</span></h2></div>
              <div className="flex flex-col sm:flex-row items-center gap-4"><div className="flex-1 relative w-full"><select value={category} onChange={(e) => { setCategory(e.target.value as Category); setTrends([]); hasInitialFetchedRef.current = false; }} className={`w-full px-8 py-5 bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-white appearance-none cursor-pointer focus:border-${activePersona.color} focus:outline-none transition-all shadow-2xl`}>{categoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}</select></div></div>
              <div className="space-y-6">
                {masterRecapTrend && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    {renderForensicToolkit(masterRecapTrend)}
                    
                    {/* Forensic Results for Master Recap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    </div>
                    
                    <div className="text-center mt-4 mb-4">
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Actuando sobre: MASTER RECAP SESSION</span>
                    </div>
                  </div>
                )}
                
                {renderForensicToolkit(undefined, true)}
                
                <button onClick={() => { setAppError(null); fetchTrends(); }} disabled={loadingTrends} className={`w-full py-6 bg-${activePersona.color} text-slate-950 active:scale-95 rounded-2xl font-black uppercase text-lg shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50`}>{loadingTrends ? <Loader2 className="animate-spin" size={24} /> : activePersona.icon}{loadingTrends ? "SCANNEANDO TENDENCIAS..." : `INICIAR SESIÓN CON ${activePersona.name.toUpperCase()}`}</button>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {[0, 1, 2, 3].map(index => {
                    const char = customCharacters[index];
                    return char ? (
                      <div key={index} className="relative rounded-3xl border-2 border-slate-700 bg-slate-800/50 overflow-hidden group flex flex-col">
                        <button onClick={() => removeCharacter(index)} className="absolute top-2 right-2 z-10 bg-rose-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"><X size={14}/></button>
                        <div className="w-full aspect-square relative">
                          <img src={char.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={char.name} />
                        </div>
                        <input 
                          type="text" 
                          value={char.name} 
                          onChange={(e) => updateCharacterName(index, e.target.value)}
                          className="w-full bg-slate-900 border-t border-slate-700 p-3 text-[10px] uppercase tracking-widest font-black text-center text-white focus:outline-none focus:bg-slate-950 transition-colors"
                        />
                      </div>
                    ) : (
                      <label key={index} className="aspect-square rounded-3xl border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-slate-300 group">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCharacterUpload(e, index)} />
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
                          <UserPlus size={28} className="relative z-10" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Nuevo<br/>Personaje</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">{trends.map(t => <TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} onGenerateVideoPrompts={handleGenerateVideoPrompts} onGenerateImagePrompts={handleGenerateImagePrompts} isRewriting={rewritingId === t.id} isGeneratingVideoPrompts={generatingVideoPromptsId === t.id} isGeneratingImagePrompts={generatingImagePromptsId === t.id} language={language} persona={activePersona} />)}</div>
            <div className="max-w-4xl mx-auto mt-20 mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className={`bg-slate-900 border-4 border-${activePersona.color}/30 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group`}><div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 text-${activePersona.color}`}><FlaskRound size={120} /></div>
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2"><div className={`flex items-center gap-3 text-${activePersona.color} font-black uppercase text-[10px] tracking-[0.4em]`}><FlaskRound size={18} /> LABORATORIO DE IDEAS V47.2.3</div><h3 className="text-3xl font-black uppercase italic leading-none">COMPOSITOR <span className={`text-${activePersona.color}`}>CREATIVO HÍBRIDO</span></h3></div>
                  
                  {renderForensicToolkit(undefined, true)}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Extensión de la Narrativa</label>
                    <div className="flex gap-2">
                      {(['short', 'medium', 'long'] as NarrativeLength[]).map((len) => (
                        <button
                          key={len}
                          onClick={() => setNarrativeLength(len)}
                          className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                            narrativeLength === len
                              ? `bg-${activePersona.color} border-${activePersona.color} text-slate-950 shadow-lg`
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {len === 'short' ? 'Corto (500-4.3k)' : len === 'medium' ? 'Mediano (4.3k-14.5k)' : 'Largo (15k+)'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <textarea value={userIdea} onChange={(e) => setUserIdea(e.target.value)} placeholder='Escribe tu idea o un link...' className={`w-full min-h-[180px] p-6 bg-slate-950 border-2 border-slate-800 rounded-[1.5rem] font-bold text-slate-100 focus:border-${activePersona.color} outline-none transition-all custom-scrollbar text-sm shadow-inner`} />
                  {latestHybridTrend && (<div className="bg-slate-950/80 border-2 border-emerald-500/30 p-8 rounded-[2rem] animate-in zoom-in-95 duration-500"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest"><Check size={16} /> Narrativa Generada</div><CopyButton text={latestHybridTrend.chunkybertoVersion || ""} /></div><p className="text-slate-100 font-bold text-sm italic mb-8 line-clamp-4">"{latestHybridTrend.chunkybertoVersion}"</p><button onClick={() => handleSelectTrend(latestHybridTrend)} className={`w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all active:scale-95`}><Video size={18} /> IR AL ESTUDIO CINEMATOGRÁFICO</button></div>)}
                  <button onClick={handleGenerateFromIdea} disabled={isGeneratingIdea || !userIdea.trim()} className={`w-full py-6 bg-${activePersona.color} text-slate-950 rounded-2xl font-black uppercase text-base italic tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30`}>{isGeneratingIdea ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}{isGeneratingIdea ? "CONSTRUYENDO NARRATIVA..." : "EJECUTAR BRIEF CREATIVO"}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 py-4 px-6 flex justify-between items-center z-40"><div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">V47.2.3 | Stable Trends | TTS Validated | YouTube Sync | Publisher Pro | Editable Narration (ENT) | Asset Strip (SAS)</div><div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[8px] font-black uppercase text-slate-400">IA ACTIVA</span></div></footer>

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

