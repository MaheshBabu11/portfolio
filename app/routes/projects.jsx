import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import {
  createProjectDetails,
  ProjectArticle,
  ProjectCaseStudy,
} from '~/components/project-case-study';
import { baseMeta } from '~/utils/meta';

const projectImages = import.meta.glob('../assets/*.{png,webp,jpg,jpeg}', {
  query: '?url',
  import: 'default',
});
const projectModules = import.meta.glob('./projects.*.mdx');

export async function loader({ request }) {
  const encodedSlug = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  if (!encodedSlug) throw new Response('Project not found', { status: 404 });

  const slug = decodeURIComponent(encodedSlug);
  const importProject = projectModules[`./projects.${slug}.mdx`];
  if (!importProject) throw new Response('Project not found', { status: 404 });

  const projectModule = await importProject();
  const imageName = projectModule.frontmatter.image;
  const importImage = projectImages[`../assets/${imageName}`];

  if (!imageName || !importImage) {
    throw new Error(`Missing or unknown hero image "${imageName}" in projects.${slug}.mdx`);
  }

  return json({
    slug,
    frontmatter: projectModule.frontmatter,
    image: await importImage(),
  });
}

export function meta({ data }) {
  return baseMeta({
    title: `${data.frontmatter.title} case study`,
    description: data.frontmatter.summary,
  });
}

export default function ProjectRoute() {
  const { frontmatter, image } = useLoaderData();
  const project = createProjectDetails(frontmatter, { image });

  return (
    <ProjectCaseStudy project={project}>
      <ProjectArticle>
        <Outlet />
      </ProjectArticle>
    </ProjectCaseStudy>
  );
}
