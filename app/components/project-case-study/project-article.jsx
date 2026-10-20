import { MDXProvider } from '@mdx-js/react';
import { postMarkdown } from '~/layouts/post';
import styles from './project-article.module.css';

const ArticleImage = ({ alt, width, ...rest }) => (
  <img
    className={styles.articleImage}
    alt={alt ?? ''}
    width={width}
    loading="lazy"
    {...rest}
  />
);

const markdownComponents = {
  ...postMarkdown,
  img: ArticleImage,
};

export function ProjectArticle({ article: Article, children }) {
  return (
    <MDXProvider components={markdownComponents}>
      {Article ? <Article /> : children}
    </MDXProvider>
  );
}

export function createProjectDetails(frontmatter, details) {
  const publishedAt = frontmatter.publishedAt;
  const publishedLabel = publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${publishedAt}T00:00:00Z`))
    : undefined;

  return {
    ...details,
    title: frontmatter.title,
    description: frontmatter.summary,
    publishedAt,
    publishedLabel,
    imageAlt: frontmatter.imageAlt ?? details.imageAlt ?? frontmatter.title,
  };
}
