# Video Prompts Generation Rules
When generating or modifying the video prompts functionality:
1. All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in the selected language (Spanish, English, or French). Spanish is the default.
2. The narrator expressions must be written to be spoken by a male or female voice (depending on the selected persona).
3. DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de video:", etc. The ONLY allowed label is the "\(Voz masculina\): " or "\(Voz femenina\): " prefix for the narrator expressions.
4. The narrator expressions must be a maximum of 22 words long.
5. The narrator expression must be appended immediately following the visual description on the next line, WITHOUT a blank line in between. The narrator expression MUST start exactly with the prefix "\(Voz masculina\): " or "\(Voz femenina\): ". Separate each complete block (visual prompt + narrator expression) with at least one blank line.
6. The user can toggle a setting ("Sin Narrador") to suppress the narrator expressions entirely. When active, DO NOT add anything to the prompt that would add audio to the video. Only visual descriptions should be generated.
7. If the user uploads a reference image of "Erick" in the settings, this image MUST be used as an ingredient (context) during the generation of video prompts, and as a reference image (`referenceImages`) during the actual video generation process (`generateVideos`) whenever "Erick" is mentioned in the prompt.
8. Secondary Characters Consistency: Any secondary character identified in the story MUST be assigned a highly detailed, consistent visual description (clothing, hair, specific physical traits) that is repeated across ALL frames they appear in, to guarantee visual continuity between AI-generated images/videos.

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
2. "Casos de Estudio" (case_studies): Available to all personas. Selects real-world business case studies, explicitly including both total successes and absolute failures, explaining the reasons. CRITICAL: The selection of case studies must prioritize variety, explicitly avoiding commonly repeated cases to ensure consecutive generations yield completely different sets of case studies.
3. "Finanzas Básicas" (basic_finance): Available to all personas. Provides simple explanations of financial ratios, micro and macro economic concepts, and financial instruments applied to home economy.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Cinema Analysis Category Rules
1. "Análisis del Cine" (cinema_analysis): Available to all personas. 
2. This category must include analysis of a balanced mix of recent movies and older/classic movies (amount scaling with selected length). 
3. The selected movies must be chosen to fit the personality and tastes of the currently active persona.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Psychology and Neuroscience Category Rules
1. "Psicología y Neurociencia" (psychology_neuroscience): Available to all personas.
2. This category must include analysis of studies/cases about Neuroscience and Psychology (amount scaling with selected length).
3. The news or case studies must be chosen to fit the personality and interests of the currently active persona.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Universal History Category Rules
1. "Historia Universal" (universal_history): Available to all personas.
2. This category must include reviews/narratives about universal history (amount scaling with selected length).
3. The focus should be on the USA, Mexico, and/or Spain.
4. The history topics must be selected to fit the personality and interests of the currently active persona.
5. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Comic's History Category Rules
1. "Historia de Comic's" (comic_history): Available to all personas.
2. This category must include stories of between 2500 and 4000 words (amount scaling with selected length).
3. The AI must create stories in a comic book format featuring the currently active persona as the main character.
4. Each story MUST present a memorable villain.
5. The narrative must have rapid development leading up to a climax, which MUST feature a massive battle against the villain.
6. The characters (including the main persona) MUST possess mutant-like superpowers and use them epicly in their fights.
7. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Alternative History Category Rules
1. "Historia Universal Alternativa" (alternative_history): Available to all personas.
2. This category must scan and select famous human histories (amount scaling with selected length).
3. The narrator must tell the real history and then consider 2 alternative scenarios of what would have happened if the events were different.
4. Periodically within the narrative, the persona must express how they would have reacted if they had participated in that history.
5. At the end, the narrator must give their opinion on whether they liked the actual events more than the alternative ones or vice versa.
6. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# World News Category Rules
1. The "Noticias del Mundo" (news_world) category must fetch news stories globally.
2. The "Noticias de México" (news_mexico) category must fetch news stories nationally in Mexico.
3. The "Noticias de Tijuana" (news_tijuana) category must fetch local news stories in Tijuana.
4. For all news categories (world, mexico, tijuana), 70% of the stories MUST be very recent (from today or the last week).
5. For all news categories (world, mexico, tijuana), 30% of the stories MUST be older stories (from a month ago or older).

# Urban Legends Category Rules
1. "Leyendas Urbanas" (urban_legends): Available to all personas.
2. This category must include urban legends from all over the world (amount scaling with selected length).
3. The narrator must tell the legend and, periodically during the narration, explicitly think and express how they themselves would have reacted if they were in that same situation.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Unsolved Mysteries Category Rules
1. "Misterios Sin Resolver" (unsolved_mysteries): Available to all personas.
2. This category must scan and select famous unsolved mysteries from all over the world (amount scaling with selected length).
3. The narrator must tell the story and, periodically during the narration, explicitly think and express how they themselves would have reacted if they were in that same situation.
4. At the end of each mystery narration, the narrator MUST provide their own particular theory, viewpoint, or opinion on what could solve the mystery or how it might be resolved.
5. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# AI and Robotics News Category Rules
1. "Noticias IA y Robótica" (ai_robotics_news): Available to all personas.
2. This category must scan for the most recent news and advancements in Artificial Intelligence, Robotics, and how far Generative AI is.
3. The narrator must tell the news story and, periodically during the narration, explicitly state what they like and what scares them about that particular news or advancement.
4. All narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# AI Hardware Base Category Rules
1. "Hardware Base de Inteligencia Artificial" (ai_hardware_base): Available to all personas.
2. This category must scan for the most recent news and advancements in the hardware on which AI is based (processors, GPUs, TPUs, specialized semiconductors, neuromorphic chips, etc.).
3. The narrator must tell the story and, periodically during the narration, explicitly state what they like and what scares them about that particular hardware news or advancement.
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

# Erick and Erickberto Narration Rules
1. The narratives of "Erick Betancourt" and "Dr. Erickberto" MUST start with "Tema de hoy:" followed immediately by the title of the narration (translated dynamically if the target language is different than Spanish, e.g., "Today's topic:" in English).
2. The UI and the prompt generation engine must dynamically enforce this prefix on the very first line of their narration outputs, using the correct language format.

# World Cup Stories Category Rules
1. "Historias de Mundiales de Soccer" (world_cup_stories): Available to all personas.
2. This category must include up to 10 stories with lengths determined by the active settings (corto, mediano, largo).
3. The stories MUST be about soccer teams that participated in a World Cup or emblematic/famous players that shined in a World Cup, spanning all World Cups up to 2026.
4. From the very beginning of the story, the narrative MUST be very precise about which player, team, and specific World Cup the story is about.
5. The stories must be inspiring, sad, surprising, or almost unknown. In each case, this specific emotional tone MUST be explicitly indicated in the narrative.
6. The narrative must carry a strong hook at the beginning to invite reading the rest of the story.
7. Periodically within the narrative, the persona MUST explicitly indicate their personal taste, pleasure, and love for the game of soccer.
8. The stories MUST be created via Artificial Intelligence and all narrations MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# 2026 World Cup Predictive Analysis Category Rules
1. "Análisis Predictivo de partidos del Mundial 2026" (world_cup_predictions_2026): Available to all personas.
2. This category must include up to 10 stories with lengths determined by the active settings (corto, mediano, largo).
3. The AI MUST use the current date to determine which are the next 10 upcoming matches in the 2026 World Cup and strictly select those matches for the predictions.
4. The narratives MUST focus on technical analysis of playing styles and player skills for teams participating in upcoming 2026 World Cup matches.
5. Based on the comparison of strengths and weaknesses between the teams, the narrative MUST make a prediction about which team will win the future matchup.
6. At the very beginning of the story, the narrator MUST be very precise about which team they think will win and what the exact final score will be.
7. After predicting the winner and score, the narrator MUST develop the analysis of strengths and weaknesses for each participating team.
8. The narrator MUST then explain their reasoning for choosing the winner and justify the predicted final score.
9. The narrative MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Scientific Discoveries Category Rules
1. "Descubrimientos Científicos" (scientific_discoveries): Available to all personas.
2. This category must include up to 10 stories with lengths determined by the active settings (corto, mediano, largo).
3. The stories must be about analysis and explanations of scientific discoveries.
4. At the beginning of the story, the narrator MUST briefly summarize the basic discovery.
5. The narrator MUST then develop a detailed explanation of the key aspect or central element of the discovery.
6. Based on the central discovery in question, the narrator MUST make a prediction about the impact it will have on some of its expected applications.
7. The narrative MUST strictly reflect the style, personality, and point of view of the currently selected persona.

# Movie Scripts Category Rules
1. "Guiones de Películas" (movie_scripts): Available to all personas.
2. This category must include up to 10 stories with lengths determined by the active settings (corto, mediano, largo: appropriate for a short film/scene, a medium-length feature, or a full feature, respectively).
3. The stories must be movie scripts generated with AI.
4. The hook at the beginning MUST be the absolute best possible to grab the audience's attention immediately.
5. The script must have an appropriate structure for the requested length format.
6. The scripts must vary in genre among horror, fiction, drama, action, and comedy.
7. The narrative and script direction MUST strictly reflect the style, personality, and point of view of the currently selected persona.


# Trends Scanning Rules
1. The user can fetch additional stories by clicking 'BUSCAR 10 HISTORIAS MÁS (DISTINTAS)'.
2. When fetching more stories, the prompt MUST exclude the titles of the stories that were already generated in the current session to ensure the newly fetched stories are completely distinct.
3. The new stories will be appended to the current list of stories in the UI.

# Character Consistency Rules
1. Whenever the story refers to the narrating persona (like Chunkyberto, Luna, Erick, etc.) or any other character involved (heroes, villains, secondary characters), you MUST assign them a fixed denomination and use EXACTLY the same denomination every time they appear in the prompts, along with 1 or 2 key adjectives that clearly identify them (e.g., 'the black labrador dog Chunkyberto', 'the villain Dark Shadow').
2. UNDER NO CIRCUMSTANCES should you use synonyms, abbreviations, or vague references (like 'dog', 'hound', 'the man', 'the woman', 'he', 'she').
3. Always use the complete and consistent denomination to ensure that image and video generation engines recognize the exact same character in every scene.
4. This rule applies to both exported prompts (Video Prompts and Image Prompts buttons) and internal Studio storyboard generation.
-e 
# Location Consistency Rules
1. Whenever the story refers to a specific setting, location, or environment (e.g., a room, a building, a city, a landscape), you MUST assign it a fixed, highly detailed description and use EXACTLY the same description every time it appears in the prompts.
2. Ensure architectural style, lighting, time of day, and key objects remain completely consistent across all frames taking place in that location to guarantee visual continuity.
3. This rule applies to both exported prompts (Video Prompts and Image Prompts buttons) and internal Studio storyboard generation.
