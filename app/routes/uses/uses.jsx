import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Uses',
    description: 'The technologies and tools I use to build software.',
  });
};

export const Uses = () => {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Uses"
          description="A selection of the technologies and tools I use across backend engineering, data work, and building this portfolio."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Engineering</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    I build backend applications with <Link href="https://www.java.com/">Java</Link>,
                    <Link href="https://spring.io/projects/spring-boot"> Spring Boot</Link>,
                    <Link href="https://hibernate.org/orm/"> Hibernate</Link>, and Maven.
                    My experience also includes building web applications with Vaadin.
                  </ListItem>
                  <ListItem>
                    I work with <Link href="https://www.postgresql.org/">PostgreSQL</Link>,
                    <Link href="https://www.mysql.com/"> MySQL</Link>, and Microsoft SQL
                    Server for relational data.
                  </ListItem>
                  <ListItem>
                    My other programming and data tools include Python, C/C++, JavaScript,
                    TypeScript, Flask, and TensorFlow.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Developer tools</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    My development toolset includes IntelliJ IDEA, Visual Studio Code,
                    Eclipse, and <Link href="https://www.postman.com/">Postman</Link>.
                  </ListItem>
                  <ListItem>
                    I use <Link href="https://git-scm.com/">Git</Link> and GitHub for
                    version control, with Docker and Azure DevOps for development and
                    delivery workflows.
                  </ListItem>
                  <ListItem>
                    I also work with Jira for project tracking, and deploy web projects
                    using <Link href="https://vercel.com/">Vercel</Link>.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>System</ProjectSectionHeading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeadCell>Desktop</TableHeadCell>
                    <TableCell>HP ProDesk 600 G6 Desktop Mini PC</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Operating system</TableHeadCell>
                    <TableCell>Ubuntu 26.04.1 LTS (64-bit)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>This portfolio</ProjectSectionHeading>
              <ProjectSectionText>
                This site is built with <Link href="https://react.dev/">React</Link>,
                <Link href="https://remix.run/"> Remix</Link>,
                <Link href="https://threejs.org/"> Three.js</Link>, and
                <Link href="https://www.framer.com/motion/"> Framer Motion</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
