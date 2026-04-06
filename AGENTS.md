# Video Prompts Generation Rules

When generating or modifying the video prompts functionality:
1. All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
2. The narrator expressions must be written to be spoken by a male voice.
3. DO NOT output any labels, headings, or indicators such as "Párrafo 1", "Sección 1", "Prompt de video:", etc. The ONLY allowed label is the "(Voz masculina): " prefix for the narrator expressions.
4. The narrator expressions must be a maximum of 22 words long.
5. The narrator expression must be appended immediately following the visual description on the next line, WITHOUT a blank line in between. The narrator expression MUST start exactly with the prefix "(Voz masculina): ". Separate each complete block (visual prompt + narrator expression) with at least one blank line.
6. If the user uploads a reference image of "Erick" in the settings, this image MUST be used as an ingredient (context) during the generation of video prompts, and as a reference image (`referenceImages`) during the actual video generation process (`generateVideos`) whenever "Erick" is mentioned in the prompt.
