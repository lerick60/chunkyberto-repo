# Video Prompts Generation Rules

When generating or modifying the video prompts functionality:
1. All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
2. The narrator expressions must be written to be spoken by a male voice.
3. DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de video:", etc. The ONLY allowed label is the "(Voz masculina): " prefix for the narrator expressions.
4. The narrator expressions must be a maximum of 22 words long.
5. The narrator expression must be appended immediately following the visual description on the next line, WITHOUT a blank line in between. The narrator expression MUST start exactly with the prefix "(Voz masculina): ". Separate each complete block (visual prompt + narrator expression) with at least one blank line.
6. If the user uploads a reference image of "Erick" in the settings, this image MUST be used as an ingredient (context) during the generation of video prompts, and as a reference image (`referenceImages`) during the actual video generation process (`generateVideos`) whenever "Erick" is mentioned in the prompt.

# Video Synthesis Rules
1. The "Sintetizar Película Completa" button must remain enabled even if the video generation model is not available (e.g., in the "Gratis" tier).
2. If a scene only has a static image (no video), the synthesis process must display the static image for an average of 10 seconds (or the duration of the TTS audio, whichever is longer).
3. The synthesis process must overlay the narration text as subtitles at the bottom of the video, applying the selected motion and transition effects to the static images.

# Biographies Category Rules
1. The "Biografías Famosas" (biographies) category is available for all main personas (Chunkyberto, Luna, Erick Betancourt, and Erickberto).
2. This category must strictly generate narratives about biographies of scientists, famous people, and famous politicians (both living and deceased).
3. The generated biography must strictly reflect the unique literary style, personality, and point of view of the currently selected persona.

# YouTube Integration Rules
1. Each persona has its own independent YouTube channel configuration.
2. The YouTube settings (URL and connection status) are stored per persona in the application's settings.
3. When uploading a video or viewing the channel, the application must use the specific YouTube configuration of the currently active persona.

# Narrative Hook Rules
1. Short Narratives Hook: All narratives shorter than 10000 characters generated from internet seeds or user ideas MUST start with a masterful hook. This hook must not be a cheap trick, but promise intrigue, entertainment, and give the reader a real sense of the pleasures to expect. It must awaken urgency, pose questions, show intriguing contexts, reveal narrative tensions, and establish the tone from the very first line.
2. Short Narrative Architecture: Beyond the hook, narratives under 10000 characters must sustain attention using precise narrative architecture. Incorporate as many of these elements as the length allows:
   - Unity of impression and single effect (constant tension, no filler).
   - Focused structure (single main conflict, few characters, single setting).
   - Inescapable central conflict (clear goal and obstacle).
   - Memorable climax and ending (twist, epiphany, or open ending).
   - Every scene must earn its place (relentless condensation, cause-and-effect logic).

# Generative Models Rules
1. The "Gratis" (free) mode must always include the latest free models. Currently: `veo-3.1-lite-generate-preview` for video logic and `gemini-3.1-flash-tts-preview` for TTS.
