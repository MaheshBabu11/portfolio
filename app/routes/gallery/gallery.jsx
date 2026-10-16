import galleryPhotos from './gallery-images.json';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './gallery.module.css';

export const meta = () =>
  baseMeta({
    title: 'Gallery',
    description: 'A collection of photos from Mahesh Babu.',
  });

export const Gallery = () => {
  return (
    <>
      <ProjectContainer className={styles.gallery}>
        <ProjectHeader
          className={styles.galleryHeader}
          title="Gallery"
          description="A photograph is a pause that lets a moment stay."
        />
        <ProjectSection className={styles.gallerySection} padding="none">
          <ProjectSectionContent width="full" className={styles.galleryContent}>
            {galleryPhotos.length ? (
              <ol className={styles.photoGrid} aria-label="Photo gallery">
                {galleryPhotos.map(photo => (
                  <li className={styles.photoCard} key={photo.pathname}>
                    <figure className={styles.photoFigure}>
                      <a
                        className={styles.photoLink}
                        href={photo.displayUrl}
                        aria-label={`Open larger photo: ${photo.title}`}
                      >
                        <img
                          className={styles.photo}
                          src={photo.thumbnailUrl}
                          alt={photo.title}
                          width={photo.width}
                          height={photo.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    </figure>
                  </li>
                ))}
              </ol>
            ) : (
              <section className={styles.emptyState}>
                <Heading level={4} align="center">
                  No photos yet
                </Heading>
                <Text as="p" secondary>
                  Add photos to <code>app/assets/gallery/</code>. The build creates
                  optimized thumbnails and display-size images before rendering them.
                </Text>
              </section>
            )}
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
