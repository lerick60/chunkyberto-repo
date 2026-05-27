# Video Prompts Generation Rules
When generating or modifying the video prompts functionality:
1. All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in the selected language (Spanish, English, or French). Spanish is the default.
2. The narrator expressions must be written to be spoken by a male voice.
3. DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de video:", etc. The ONLY allowed label is the "(Voz masculina): " prefix for the narrator expressions.
4. The narrator expressions must be a maximum of 22 words long.
5. The narrator expression must be appended immediately following the visual description on the next line, WITHOUT a blank line in between. The narrator expression MUST start exactly with the prefix "(Voz masculina): ". Separate each complete block (visual prompt + narrator expression) with at least one blank line.
6. If the user uploads a reference image of "Erick" in the settings, this image MUST be used as an ingredient (context) during the generation of video prompts, and as a reference image (`referenceImages`) during the actual video generation process (`generateVideos`) whenever "Erick" is mentioned in the prompt.
7. Secondary Characters Consistency: Any secondary character identified in the story MUST be assigned a highly detailed, consistent visual description (clothing, hair, specific physical traits) that is repeated across ALL frames they appear in, to guarantee visual continuity between AI-generated images/videos.

# Hybrid Creative Composer Rules
1. Multi-source Inspiration: The Hybrid Creative Composer supports ingesting up to 5 web or YouTube links simultaneously and will use them as foundational knowledge to compose the narrative.

# Video Synthesis Rules
1. The "Sintetizar Película Completa" button must remain enabled even if the video generation model is not available (e.g., in the "Gratis" tier).
2. If a scene has a generated video, the synthesis process MUST use that video instead of the static image for the final compilation.
3. If a scene only has a static image (no video), the synthesis process must display the static image for an average of 10 seconds (or the duration of the TTS audio, whichever is longer).
4. The synthesis process must overlay the narration text as subtitles at the bottom of the video, applying the selected motion and transition effects to the static images.

# Biographies Category Rules
1. The "Biografías Famosas" (biographies) category is available for all main personas (Chunkyberto, Luna, Erick Betancourt, and Erickberto).
2. This category must strictly generate narratives about biographies of scientists, famous people, and famous politicians (both living and deceased).
3. The generated biography must strictly reflect the unique literary style, personality, and point of view of the currently selected persona.

# Products Review Category Rules
1. The "Products Review" category is available for all personas.
2. This category must explicitly scan the most recent product launches and the story should be generated based on the opinion of each persona about the pros and cons they see in a particular electronic product or gadget.
3. The review must be narrated strictly reflecting the particular personality, point of view, and role of the currently active persona.

# Financial and Business Categories Rules
1. "Análisis Financiero" (financial_analysis): Available to all personas. Generates profound financial analysis of public/private companies based on known data (revenues, margins, health, projections).
2. "Casos de Estudio" (case_studies): Available to all personas. Selects real-world business case studies, explicitly including both total successes and absolute failures, explaining the reasons.
3. "Finanzas Básicas" (basic_finance): Available to all personas. Provides simple explanations of financial ratios, micro and macro economic concepts, and financial instruments applied to home economy.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Cinema Analysis Category Rules
1. "Análisis del Cine" (cinema_analysis): Available to all personas. 
2. This category must include analysis of 5 recent movies and 5 older/classic movies. 
3. The selected movies must be chosen to fit the personality and tastes of the currently active persona.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Psychology and Neuroscience Category Rules
1. "Psicología y Neurociencia" (psychology_neuroscience): Available to all personas.
2. This category must include analysis of 5 studies/cases about Neuroscience and 5 studies/cases about Psychology.
3. The news or case studies must be chosen to fit the personality and interests of the currently active persona.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Universal History Category Rules
1. "Historia Universal" (universal_history): Available to all personas.
2. This category must include 10 reviews/narratives about universal history.
3. The focus should be on the USA, Mexico, and/or Spain.
4. The history topics must be selected to fit the personality and interests of the currently active persona.
5. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Alternative History Category Rules
1. "Historia Universal Alternativa" (alternative_history): Available to all personas.
2. This category must scan and select 10 famous human histories.
3. The narrator must tell the real history and then consider 2 alternative scenarios of what would have happened if the events were different.
4. Periodically within the narrative, the persona must express how they would have reacted if they had participated in that history.
5. At the end, the narrator must give their opinion on whether they liked the actual events more than the alternative ones or vice versa.
6. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# World News Category Rules
1. The "Noticias del Mundo" (news_world) category must fetch 10 news stories globally.
2. The "Noticias de México" (news_mexico) category must fetch 10 news stories nationally in Mexico.
3. The "Noticias de Tijuana" (news_tijuana) category must fetch 10 local news stories in Tijuana.
4. For all news categories (world, mexico, tijuana), the first 7 stories MUST be very recent (from today or the last week).
5. For all news categories (world, mexico, tijuana), the last 3 stories MUST be older stories (from a month ago or older).

# Urban Legends Category Rules
1. "Leyendas Urbanas" (urban_legends): Available to all personas.
2. This category must include 10 urban legends from all over the world.
3. The narrator must tell the legend and, periodically during the narration, explicitly think and express how they themselves would have reacted if they were in that same situation.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Unsolved Mysteries Category Rules
1. "Misterios Sin Resolver" (unsolved_mysteries): Available to all personas.
2. This category must scan and select 10 famous unsolved mysteries from all over the world.
3. The narrator must tell the story and, periodically during the narration, explicitly think and express how they themselves would have reacted if they were in that same situation.
4. At the end of each mystery narration, the narrator MUST provide their own particular theory, viewpoint, or opinion on what could solve the mystery or how it might be resolved.
5. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# AI and Robotics News Category Rules
1. "Noticias IA y Robótica" (ai_robotics_news): Available to all personas.
2. This category must scan for the most recent news and advancements in Artificial Intelligence, Robotics, and how far Generative AI is.
3. The narrator must tell the news story and, periodically during the narration, explicitly state what they like and what scares them about that particular news or advancement.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# YouTube Integration Rules
1. Each persona has its own independent YouTube channel configuration.
2. The YouTube settings (URL and connection status) are stored per persona in the application's settings.
3. When uploading a video or viewing the channel, the application must use the specific YouTube configuration of the currently active persona.
4. If a YouTube video is provided as context but it does not have subtitles, the backend will report an error rather than attempting to hallucinate the content since the model cannot natively watch YouTube videos over URL.
5. Furthermore, whenever a YouTube video transcript is provided to the Persona for content generation, the Persona must explicitly give their critical opinion about the topic discussed and the presenters/persons in the video, integrating it naturally into the narrative.

# Narrative Hook Rules
1. Short Narratives Hook: All narratives shorter than 10000 characters generated from internet seeds or user ideas MUST start with a masterful hook. This hook must not be a cheap trick, but promise intrigue, entertainment, and give the reader a real sense of the pleasures to expect. It must awaken urgency, pose questions, show intriguing contexts, reveal narrative tensions, and establish the tone from the very first line.
2. Short Narrative Architecture: Beyond the hook, narratives under 10000 characters must sustain attention using precise narrative architecture. Incorporate as many of these elements as the length allows:
   - Unity of impression and single effect (constant tension, no filler).
   - Focused structure (single main conflict, few characters, single setting).
   - Inescapable central conflict (clear goal and obstacle).
   - Memorable climax and ending (twist, epiphany, or open ending).
   - Every scene must earn its place (relentless condensation, cause-and-effect logic).

# Language Selector Rules
1. The language selector is located in the top right corner of the header.
2. It supports three languages: Spanish (ES), English (EN), and French (FR).
3. The selected language is persisted in `localStorage` and used as the target language for all AI-generated content (stories, prompts, reviews, and narrations).
4. Spanish ('es') is the default language.
5. All UI labels for specific persona-narrative outputs must strictly respect the selected language.

# Generative Models Rules
1. The "Gratis" (free) mode must always include the latest free models. Currently: `veo-3.1-lite-generate-preview` for video logic and `gemini-3.1-flash-tts-preview` for TTS.
