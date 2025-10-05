# IA Text Reviewer — Vite React (lista para GitHub Pages)

Este proyecto es una UI tipo chat (modo oscuro futurista) que conecta a un backend serverless que llama a la API de Replicate.
No expongas tu `REPLICATE_API_TOKEN` en el frontend — definela en las variables de entorno de Vercel / Render.

## Cómo usar localmente
1. `npm install`
2. `npm run dev`
3. La UI estará en http://localhost:5173 (por defecto)

## Despliegue
- Backend: desplegar `api/generate.js` en Vercel (o cualquier serverless). Añade la variable de entorno `REPLICATE_API_TOKEN` y `REPLICATE_MODEL_VERSION`.
- Frontend: puedes usar GitHub Pages con el build de Vite.
  - `npm run build`
  - Subir la carpeta `dist/` a GitHub Pages (o usar la acción oficial para publicar el build).

