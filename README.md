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

This repository contains the source code for [maheshbabu11.dev](https://maheshbabu11.dev), my personal portfolio. I’m a software engineer with 5+ years of experience building web applications, primarily with Java and Spring Boot. I currently work at Acmatek and am pursuing an MSc in Data Science at Hamburg University of Technology.

## Features

- Responsive portfolio with light and dark themes and three visual designs.
- Project case studies and technical articles written in MDX.
- Interactive 3D project previews, animated backgrounds, and a photo gallery.
- Contact form powered by EmailJS.
- Searchable command palette for pages, articles, and site controls.
- Password-protected `/homelab` dashboard with Dashdot system metrics and live HTTP checks for Paperless-ngx, Portainer, Immich, and Vaultwarden.

## Featured projects

- **[HTTP Client Plus](https://plugins.jetbrains.com/plugin/28340-http-client-plus)** — IntelliJ IDEA plugin for composing, organizing, and executing HTTP requests in the standard `.http` format. [Case study](https://maheshbabu11.dev/projects/http-client-plus)
- **[ASCII Art Generator](https://ascii-art-generator.maheshbabu11.dev/)** — Spring Boot and HTMX application for generating ASCII art. [Case study](https://maheshbabu11.dev/projects/ascii-art-generator)
- **[NTFY Java](https://github.com/MaheshBabu11/ntfy-java)** — Java library for publishing notifications to ntfy servers. [Case study](https://maheshbabu11.dev/projects/ntfy-java)
- **[Code Coffee Repeat](https://blog.maheshbabu11.dev/)** — Software engineering blog covering Java, Spring Boot, and web development. [Case study](https://maheshbabu11.dev/projects/code-coffee-repeat)
- **[Excel2DataMap](https://github.com/MaheshBabu11/Excel2DataMap)** — Java library for converting Excel and CSV files into data maps. [Case study](https://maheshbabu11.dev/projects/excel2datamap)

## Technology

The site is built with React, Remix, Vite, Three.js, and Framer Motion. Project and article pages are generated from MDX files; the sitemap includes those pages automatically.

My work spans:

- **Languages:** Java, Python, C/C++, JavaScript, TypeScript
- **Backend and data:** Spring Boot, Hibernate, PostgreSQL, MySQL, Microsoft SQL Server
- **Tools:** Git, Docker, Azure DevOps, IntelliJ IDEA
- **Web:** React, Remix, Three.js, Framer Motion

## Run locally

### Requirements

- Node.js 24 or later
- npm 9.6.3 or later

### Setup

```bash
npm install
cp .env.example .env.local
```

Configure the required environment variables in `.env.local` (see [Configuration](#configuration)), then start the development server:

```bash
npm run dev
```

The development and production commands optimize gallery images before starting or building the app.

### Production build

```bash
npm run build
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Signs the visitor’s preferred light/dark theme cookie. |
| `DATABASE_URL` | Neon PostgreSQL connection used for global design settings and the homepage view counter. |
| `DEFAULT_DESIGN` | Initial site design: `murim`, `nano`, or `classic`. |
| `ADMIN_PASSWORD` | Initial password for `/admin` and `/homelab`; its scrypt hash is stored in Neon. |
| `ADMIN_SESSION_SECRET` | Optional initial admin/homelab session signing secret. If omitted, one is generated and stored in Neon. |
| `EMAILJS_SERVICE_ID` | EmailJS service used by the contact form. |
| `EMAILJS_TEMPLATE_ID` | EmailJS template used by the contact form. |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key. |
| `EMAILJS_PRIVATE_KEY` | EmailJS private key; keep it server-side. |
| `CONTACT_TO_EMAIL` | Recipient for contact-form messages. |
| `DASHDOT_URL` | Optional Dashdot base URL. Defaults to `https://dashdot.maheshbabu11.dev`. |

The first `/admin` visit initializes the admin password hash and session secret in the Neon `portfolio_settings` table. After initialization, the bootstrap password and optional session secret can be removed from the environment. Keep `DATABASE_URL`, `SESSION_SECRET`, and the EmailJS private key on the server.

The contact form sends messages through EmailJS. Configure the template with `to_email`, `reply_to`, and `subject`, and include `from_email` and `message` in the body. Enable API access for Node.js in EmailJS security settings.

### Homelab dashboard

The `/homelab` page uses the admin password to create a separate HTTP-only session cookie that expires after one hour. The page and its data endpoints require this session.

System metrics are fetched server-side from Dashdot’s documented `/info` and `/load/*` endpoints every 30 seconds. Service availability checks for Paperless-ngx, Portainer, Immich, and Vaultwarden also run server-side every 30 seconds. The page is private to authenticated visitors; no service API credentials are required.

### Admin and homepage data

Sign in at `/admin` to change the site-wide design. The selection applies to all visitors. The Nano Machine design has its own light and dark palettes and system-interface styling.

The homepage counter records total homepage requests in Neon; it does not identify unique visitors or store visitor identities. Database tables for settings and the counter are created automatically.

## Gallery

Add source photos to `app/assets/gallery/`. The gallery optimizer creates thumbnails (up to 640 px) and display images (up to 1800 px) in `public/gallery-optimized/`. Generated images and the manifest are ignored by Git; keep source photos in `app/assets/gallery/`.

To regenerate optimized images while the development server is running:

```bash
npm run gallery:optimize
```

## Deployment

Deploy to Vercel with:

```bash
npm run deploy
```

Alternatively, import the repository into a Vercel project and configure the required environment variables in the project settings. Set `DASHDOT_URL` only if you use a different Dashdot instance.

## License

See [LICENSE](LICENSE).
