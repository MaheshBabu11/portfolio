<p align="center">
  <img src="public/favicon.svg" width="52" alt="Mahesh Babu portfolio logo" />
</p>

<h1 align="center">Mahesh Babu — Software Engineer</h1>

<p align="center">
  <a href="https://maheshbabu11.dev">Portfolio</a> ·
  <a href="https://github.com/MaheshBabu11">GitHub</a> ·
  <a href="https://www.linkedin.com/in/maheshbabu11/">LinkedIn</a>
</p>

<p align="center">
  <a href="https://maheshbabu11.dev">
    <img src="public/site-preview.png" alt="Preview of Mahesh Babu's portfolio website" />
  </a>
</p>

I’m Mahesh, a software engineer with 5+ years of experience building web applications. I work primarily with Java and Spring Boot, and enjoy building scalable backend APIs, web applications, and data-driven systems. I currently work at Acmatek and am pursuing an MSc in Data Science at Hamburg University of Technology.

This repository contains the source for my portfolio website: [maheshbabu11.dev](https://maheshbabu11.dev).

## Featured projects

- **[HTTP Client Plus](https://plugins.jetbrains.com/plugin/28340-http-client-plus)** — An IntelliJ IDEA plugin for composing, organizing, and executing HTTP requests, saved in the standard `.http` format. [Case study](https://maheshbabu11.dev/projects/http-client-plus)
- **[ASCII Art Generator](https://ascii-art-generator.maheshbabu11.dev/)** — A Spring Boot and HTMX application for generating ASCII art. [Case study](https://maheshbabu11.dev/projects/ascii-art-generator)
- **[NTFY Java](https://github.com/MaheshBabu11/ntfy-java)** — A Java library for publishing notifications to ntfy servers. [Case study](https://maheshbabu11.dev/projects/ntfy-java)
- **[Code Coffee Repeat](https://blog.maheshbabu11.dev/)** — A software engineering blog covering Java, Spring Boot, and web development. [Case study](https://maheshbabu11.dev/projects/code-coffee-repeat)
- **[Excel2DataMap](https://github.com/MaheshBabu11/Excel2DataMap)** — A Java library for converting Excel and CSV files into data maps. [Case study](https://maheshbabu11.dev/projects/excel2datamap)

## About this portfolio

The site is built with React, Remix, Vite, Three.js, and Framer Motion. It includes project case studies and technical articles authored in MDX, a photo gallery, and responsive light and dark themes. Project and article pages are generated from their slugs, and the sitemap includes those pages automatically.

My main areas of interest and experience include:

- **Languages:** Java, Python, C/C++, JavaScript, TypeScript
- **Backend and data:** Spring Boot, Hibernate, PostgreSQL, MySQL, Microsoft SQL Server
- **Tools:** Git, Docker, Azure DevOps, IntelliJ IDEA
- **Web:** React, Remix, Three.js, Framer Motion

## Run locally

Requirements: Node.js 24 or later and npm 9.6.3 or later.

```bash
npm install
npm run dev
```

The development server is started by `npm run dev`. Before starting, the `predev` script optimizes gallery images.

To create a production build:

```bash
npm run build
```

The `prebuild` script also optimizes gallery images before the build.

## Environment

For local theme persistence, the global design setting, and the homepage view counter, copy `.env.example` to `.env.local` and set the values:

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` to a Neon PostgreSQL connection string, choose `DEFAULT_DESIGN` as `murim` or `classic`, and set `ADMIN_PASSWORD` for the first `/admin` visit. The app stores the password as a scrypt hash and stores the cookie-signing secret in the Neon `portfolio_settings` table. `ADMIN_SESSION_SECRET` is optional during initialization; if omitted, the app generates a random secret and saves it there. After the first admin visit initializes these rows, the environment values can be removed.

Sign in at `/admin` to switch the site-wide design; the selection is stored in Neon and applies to all visitors. The settings table is created automatically. The session secret is stored in the database as requested, so restrict database access and keep `DATABASE_URL` server-side.

`SESSION_SECRET` signs each visitor's preferred light/dark theme cookie. The homepage counter stores a total page-view count in Neon PostgreSQL. It counts homepage requests rather than unique people and does not store visitor identities; its table is created automatically.

The contact form opens a prefilled email draft in the visitor’s default email application.

## Gallery images

Add source photos to `app/assets/gallery/`. The gallery optimizer generates thumbnails (up to 640px) and display images (up to 1800px) in `public/gallery-optimized/`. The grid loads thumbnails, and selecting a photo opens its display-size image. Generated images and the manifest are ignored by Git; source photos remain in `app/assets/gallery/`.

After adding photos while the development server is already running, regenerate the images with:

```bash
npm run gallery:optimize
```

## Deployment

Deploy to Vercel with:

```bash
npm run deploy
```

You can also import this repository into a Vercel project and configure `SESSION_SECRET`, `DATABASE_URL`, `DEFAULT_DESIGN`, and the initial `ADMIN_PASSWORD` in the project’s environment variables. `ADMIN_SESSION_SECRET` is optional. Keep the Neon connection string server-side, and rotate credentials if they have been exposed.

## License

See [LICENSE](LICENSE).
