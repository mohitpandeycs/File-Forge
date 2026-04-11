<p align="center">
	<img src="public/fileforge-mark.svg" alt="FileForge Logo" width="84" />
</p>

<h1 align="center">FileForge</h1>

<p align="center">
	Browser-based file conversion tools for documents, spreadsheets, images, and PDFs.
</p>

<p align="center">
	Fast • Private • Simple
</p>

## Overview

FileForge is a modern web app built with Next.js that provides practical file conversion utilities in a clean interface.

Core experience:

1. Upload one or multiple files.
2. Select the target format.
3. Convert and download instantly.

## Features

1. Image conversion with batch support (ZIP export).
2. PDF tools: merge, split, compress, and info extraction.
3. Base64 encode/decode utility.
4. Conversion history (with authentication).
5. Dark-first UI optimized for desktop and mobile.
6. SEO-ready static files: robots.txt and sitemap.xml.

## Tech Stack

1. Next.js 16 (App Router)
2. React 19 + TypeScript
3. Tailwind CSS 4
4. Zustand (state)
5. Supabase (auth + persisted history)
6. Conversion libraries: pdf-lib, xlsx, mammoth, marked, heic2any, jszip

## Project Structure

```text
src/
	app/                 # App routes and metadata
	components/          # UI components and tool modules
	constants/           # Static app data and format maps
	lib/                 # Utilities, converters, auth/store/supabase
public/
	fileforge-mark.svg   # Brand icon used in README and app UI
	robots.txt
	sitemap.xml
```

## Getting Started

### Prerequisites

1. Node.js 20+ (recommended)
2. npm 10+ (or any compatible package manager)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_SITE_VERIFICATION=optional_google_verification_token
```

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Main Routes

1. `/` Home
2. `/tools` All conversion tools
3. `/convert/[tool]` Dynamic conversion pages
4. `/pdf-tools` PDF utility suite
5. `/compress` Image compression tool
6. `/base64` Base64 encode/decode tool
7. `/history` Conversion history
8. `/auth/login` Authentication

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from `.env.local`.
4. Deploy.

After deployment, verify:

1. `/robots.txt`
2. `/sitemap.xml`

## Notes

1. Some conversions are browser-local for privacy and speed.
2. Supabase is required for auth and synced conversion history.
3. Keep environment keys out of source control.

## License

This project is currently private. Add a license file if you plan to open-source it.
