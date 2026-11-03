# Portafolio — Camilo Canasteros

Sitio estático (HTML + CSS + JS, sin dependencias).

## Antes de publicar
Busca `TODO` en `index.html` y reemplaza:
- Las URLs `#` de cada proyecto (Visión Latina, Presbicia Latam, Valenti Studio).
- Tus enlaces de GitHub y LinkedIn.
- El cargo en Teleperformance.
- Agrega tu CV como `cv-camilo-canasteros.pdf` en esta misma carpeta.

## Probar en local
Abre `index.html` en el navegador, o usa la extensión Live Server de VS Code.

## Subir a Vercel
**Opción A — con GitHub (recomendada):**
1. Sube esta carpeta a un repositorio nuevo en GitHub.
2. En vercel.com → *Add New → Project* → importa el repositorio.
3. Framework Preset: **Other**. Sin build command ni output directory. *Deploy*.
4. Cada `git push` vuelve a desplegar automáticamente.

**Opción B — con la CLI:**
```bash
npm i -g vercel
cd portafolio
vercel        # primera vez (preview)
vercel --prod # producción
```
