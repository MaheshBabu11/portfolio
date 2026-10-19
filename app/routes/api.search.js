import { json } from '@remix-run/node';
import { getPosts } from './articles_._index/posts.server';

export async function loader() {
  const posts = await getPosts();
  const articles = posts.map(({ slug, frontmatter }) => ({
    title: frontmatter.title,
    description: frontmatter.abstract,
    href: `/articles/${encodeURIComponent(slug)}`,
  }));

  return json(
    { articles },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    }
  );
}
