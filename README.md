# AR Model Viewer

A Next.js application for previewing and launching augmented reality experiences for GLB and USDZ assets. Load sample scenes, provide remote URLs, or upload local files to visualise models instantly and trigger AR Quick Look or Scene Viewer.

## Features

- One-click previews via `<model-viewer>` with WebXR, Scene Viewer, and Quick Look support
- Sample gallery plus URL and local file ingestion for `.glb` and `.usdz`
- Viewer controls for exposure, shadow intensity, camera orbiting, and auto rotation
- Ready for deployment to Vercel

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Deployment

The project is configured for Vercel. Deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-f28bbc47
```
