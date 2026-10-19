<p align="center">
  <img src="/public/favicon.svg" width="50" alt="Logo" />
</p>
<h1 align="center">Personal portfolio</h1>

[![Site preview](/public/site-preview.png)](https://maheshbabu11.dev)

My design portfolio to showcase a few projects. Built with [Remix](https://remix.run/), [Three.js](https://threejs.org/), and [Framer Motion](https://www.framer.com/motion/). View the [live site](https://maheshbabu11.dev).

## Install & run

Make sure you have Node.js `24.x` LTS or higher and npm `9.6.3` or higher installed. Install dependencies with:

```bash
npm install
```

Once it's done start up a local server with:

```bash
npm run dev
```

## Deployment

Deploy the site to Vercel:

```bash
npm run deploy
```

You can also import the repository into Vercel. Configure `SESSION_SECRET` in
the Vercel project settings for persistent theme sessions. For local development,
copy `.env.example` to `.env.local` and set a random secret. The contact form
opens a prefilled email draft in the visitor's default email app.
The PWA caches same-origin assets and displays an offline page when a navigation
cannot reach the network.

Add source photos to `app/assets/gallery/`. The `predev` and `prebuild` scripts
generate aspect-ratio-preserving WebP thumbnails (up to 640px) and display-size
images (up to 1800px) in `public/gallery-optimized/`; the gallery grid loads only
thumbnails, and clicking one opens its display-size version. Generated images and the manifest are
ignored by Git, while source photos remain in the assets folder. Run
`npm run gallery:optimize` after adding photos to an already-running dev server.

## Permissions

I'm cool with anyone using the code or parts of the code for their own site, it is open source so people can learn from it and adapt it. However, I would encourage you to modify the theme and components it to make it your own. If you are using the site's design largely unmodified, I'd appreciate being credited as the designer of the website.

I do not give permission to present any of my projects as your own (this is being actively used as my portfolio site and these are my real projects I've worked on).

## FAQs

<details>
  <summary>How do I change the color on the <code>DisplacementSphere</code> (blobby rotating thing in the background).</summary>
  
  You'll need to edit the fragment shader. [Check out this issue for more details](https://github.com/HamishMW/portfolio/issues/19#issuecomment-870996615).
</details>

<details>
  <summary>How do I get the contact form to work?</summary>
  
  The contact form opens a prefilled message in the visitor's default email app. No email service credentials are required.
</details>
