import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
} from '~/layouts/project';
import styles from './project-case-study.module.css';

export function ProjectCaseStudy({ project, children }) {
  return (
    <>
      <ProjectContainer className={styles.caseStudy}>
        <ProjectHeader
          title={project.title}
          description={project.headerDescription ?? project.description}
          linkLabel={project.headerLinkLabel ?? project.linkLabel}
          url={project.headerUrl ?? project.url}
          roles={project.roles}
          className={styles.header}
        />
        <Section className={styles.metadataSection}>
          <div className={styles.publishedAt}>
            <Text className={styles.caseStudyLabel} size="s">
              Case study
            </Text>
            {!!project.publishedAt && (
              <>
                <Divider
                  className={styles.metaDivider}
                  lineWidth="52px"
                  notchWidth="42px"
                  notchHeight="6px"
                  aria-hidden="true"
                />
                <Text as="time" size="s" secondary dateTime={project.publishedAt}>
                  {project.publishedLabel}
                </Text>
              </>
            )}
          </div>
        </Section>
        <ProjectSection className={styles.imageSection} padding="top">
          <ProjectSectionContent>
            <ProjectImage
              className={styles.projectImage}
              src={project.image}
              alt={project.imageAlt}
            />
          </ProjectSectionContent>
        </ProjectSection>
        {children ? (
          <ProjectSection className={styles.contentSection} padding="none">
            <ProjectSectionContent
              width="m"
              className={styles.articleBody}
            >
              {children}
            </ProjectSectionContent>
          </ProjectSection>
        ) : (
          project.sections.map((section, index) => (
            <ProjectSection
              className={styles.contentSection}
              padding="none"
              key={section.title}
            >
              <ProjectSectionContent>
                <div className={styles.sectionHeading}>
                  <Text className={styles.sectionNumber} size="s" as="span">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <ProjectSectionHeading>{section.title}</ProjectSectionHeading>
                </div>
                {section.paragraphs?.map(paragraph => (
                  <ProjectSectionText key={paragraph}>{paragraph}</ProjectSectionText>
                ))}
                {!!section.points?.length && (
                  <ul className={styles.detailList}>
                    {section.points.map(point => (
                      <li key={point}>
                        <Text as="span">{point}</Text>
                      </li>
                    ))}
                  </ul>
                )}
                {!!section.code && (
                  <pre className={styles.codeBlock}>
                    <code>{section.code}</code>
                  </pre>
                )}
              </ProjectSectionContent>
            </ProjectSection>
          ))
        )}
        <ProjectSection className={styles.backSection} padding="top">
          <ProjectSectionContent>
            <Button secondary href="/#project-1" icon="chevron-left">
              Back to projects
            </Button>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
