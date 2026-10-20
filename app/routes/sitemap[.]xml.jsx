import { getPosts } from './articles_._index/posts.server';
import config from '~/config.json';

const staticPaths = ['/', '/about', '/articles', '/contact', '/gallery', '/uses'];
const projectModules = import.meta.glob('./projects.*.mdx');

export async function loader() {
  const posts = await getPosts();
  const projectUrls = Object.keys(projectModules).map(file => {
    const slug = file.replace('./projects.', '').replace(/\.mdx$/, '');
    return `${config.url}/projects/${encodeURIComponent(slug)}`;
  });
  const urls = [
    ...staticPaths.map(path => `${config.url}${path}`),
    ...posts.map(post => `${config.url}/articles/${encodeURIComponent(post.slug)}`),
    ...projectUrls,
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
