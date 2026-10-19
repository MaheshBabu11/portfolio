import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Post, postMarkdown } from '~/layouts/post';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { formatTimecode, readingTime } from '~/utils/timecode';

export async function loader({ request }) {
  const encodedSlug = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  if (!encodedSlug) throw new Response('Article not found', { status: 404 });

  const slug = decodeURIComponent(encodedSlug);
  const encodedPathSlug = encodeURIComponent(slug);
  const module = await import(`../articles.${slug}.mdx`);
  const text = await import(`../articles.${slug}.mdx?raw`);
  const readTime = readingTime(text.default);
  const canonicalUrl = `${config.url}/articles/${encodedPathSlug}`;
  const ogImage = `${config.url}/static/${encodedPathSlug}-og.jpg`;

  return json({
    ogImage,
    canonicalUrl,
    frontmatter: module.frontmatter,
    timecode: formatTimecode(readTime),
  });
}

export function meta({ data }) {
  const { title, abstract } = data.frontmatter;
  return baseMeta({
    title,
    description: abstract,
    prefix: '',
    ogImage: data.ogImage,
    ogType: 'article',
    pageUrl: data.canonicalUrl,
    articlePublishedTime: data.frontmatter.date,
    articleAuthor: config.name,
  });
}

export default function Articles() {
  const { frontmatter, timecode, ogImage, canonicalUrl } = useLoaderData();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.abstract,
    image: ogImage,
    datePublished: frontmatter.date,
    author: {
      '@type': 'Person',
      name: config.name,
      url: `${config.url}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: config.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    inLanguage: 'en',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <MDXProvider components={postMarkdown}>
        <Post {...frontmatter} timecode={timecode}>
          <Outlet />
        </Post>
      </MDXProvider>
    </>
  );
}
