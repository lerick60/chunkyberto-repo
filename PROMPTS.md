# Manual de Ingeniería de Prompts - Studio.Multi V45.0.0

Este documento detalla las plantillas refinadas utilizadas por el motor para garantizar la consistencia de las 5 identidades activas.

## 1. Escaneo de Tendencias (Real-Time Search)
**Objetivo:** Identificar 15 noticias y generar un resumen maestro.
**Template:**
> "Identifica 15 historias trending en tiempo real conectadas a la categoría: {category}.
> SYSTEM IDENTITY (STRICT ADHERENCE): You are {persona_name}.
> {identity_context}
>
> MANDATORY FORMAT:
> 1. Inicia con el delimitador $$$.
> 2. ITEM 1: 'MASTER RECAP' (Lista numerada 1-15).
> 3. ITEMS 2-16: Historias individuales con formato '$$$ [TITULO]: [RESUMEN]'.
> LENGUAJE: {language_name}."

---

## 2. Refuerzo de Narrativa (Story Expansion)
**Objetivo:** Convertir un resumen frío en una obra con el POV de la Persona.
**Template:**
> "STRICT NARRATION REQUEST:
> PERSONA: {persona_name}. 
> BOL (Base Operating Layer): {identity_context}
> 
> REGLAS ABSOLUTAS:
> 1. La PRIMERA LÍNEA debe ser exactamente: '{introduction_prefix}'.
> 2. Filtra la historia a través de tu POV (ej: Erick = Viabilidad Técnica, Chunky = Comida/Lealtad, Luna = Crítica de Clase).
> 3. LENGUAJE: {language_name}."

---

## 3. Producción de Storyboard (15 Escenas)
**Objetivo:** Generar 15 cuadros cinematográficos con consistencia visual (VAP).
**Template:**
> "Genera 15 escenas cinematográficas para: '{story_text}'.
> VISUAL ANCHOR PROTOCOL (VAP): 
> - Si aparece {persona_name}, usar descriptor: {visual_profile}.
> 
> FORMATO MANDATORIO:
> IDEA ESCENA ||| PROMPT VISUAL (Estilo {visual_style}) ||| TEXTO NARRACIÓN.
> LENGUAJE: {language_name}."

---

## 4. Herramientas Forenses (Análisis Psicológico)
### Análisis Literario
> "Realiza un ANÁLISIS LITERARIO Y FORENSE del subtexto de esta historia. ¿Qué revela sobre las motivaciones ocultas de {persona_name}?"
### Modo Entrevista
> "Simula una entrevista en modo Podcast donde {persona_name} responde sobre los eventos narrados, saliendo de la narración para entrar en el diálogo."
### Avance de Historia
> "Escribe la secuela inmediata. ¿Qué pasa 5 minutos después del final de esta historia?"

---

## 5. Visual Anchor Protocol (VAP) - Descriptores Mandatorios
- **Erick/Erickberto**: Middle-aged man, dark curly hair, high forehead, intelligent eyes, professional striped polo / white lab coat.
- **Mayra**: Radiant woman, light brown wavy hair, honey highlights, magenta lipstick, white pearl earrings, black polka dot blouse with bow.
- **Luna**: Siamese cat, sapphire blue eyes, creamy fur, chocolate points.
- **Chunkyberto**: Black Labrador Retriever, shiny jet-black fur, friendly brown eyes.
