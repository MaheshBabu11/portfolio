import maheshImage from '~/assets/mahesh.jpeg';
import acmatekLogo from '~/assets/acmatek.png';
import capgeminiLogo from '~/assets/capgemini.png';
import codingSchoolLogo from '~/assets/coding-school-logo.png';
import courseraLogo from '~/assets/coursera.svg';
import ieltsLogo from '~/assets/ielts-logo.png';
import technicalSkillIcons from '~/assets/technical-skill-icons.svg';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { List, ListItem } from '~/components/list';
import { Text } from '~/components/text';
import {
  ProjectContainer,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import { media } from '~/utils/style';
import styles from './about.module.css';

const experience = [
  {
    company: 'Acmatek Inc',
    logo: acmatekLogo,
    role: 'Software Engineer',
    timeframe: 'Sep 2023 – Present',
    achievements: [
      'Developed new features across multiple Spring Boot projects.',
      'Improved API response times through code optimization and native query tuning.',
      'Built a Hibernate Search and OpenSearch indexing system to improve search performance.',
      'Contributed to code reviews and collaborative engineering improvements.',
    ],
  },
  {
    company: 'Capgemini',
    logo: capgeminiLogo,
    role: 'Software Engineer',
    timeframe: 'Aug 2021 – Sep 2023',
    achievements: [
      'Built web applications with Java, J2EE, and Spring Boot in cross-functional teams.',
      'Contributed throughout the software development lifecycle, from requirements and design to testing and deployment.',
      'Implemented REST APIs and wrote scalable, maintainable application code.',
      'Reviewed code, resolved defects, and improved application performance.',
    ],
  },
];

const education = [
  {
    institution: 'Hamburg University of Technology',
    degree: 'MSc, Data Science',
    timeframe: '2024 – Present',
  },
  {
    institution: 'APJ Abdul Kalam Technological University',
    degree: 'BTech, Computer Science and Engineering',
    timeframe: '2017 – 2021',
  },
];

const skillIconIds = {
  Java: 'javaIcon',
  Python: 'pythonIcon',
  'C/C++': 'cIcon',
  JavaScript: 'javaScriptIcon',
  TypeScript: 'typeScriptIcon',
  'Spring Boot': 'springBootIcon',
  Hibernate: 'hibernateIcon',
  Maven: 'mavenIcon',
  Vaadin: 'vaadinIcon',
  MySQL: 'mysqlIcon',
  PostgreSQL: 'postgresIcon',
  'Microsoft SQL Server': 'sqlServerIcon',
  Flask: 'flaskIcon',
  TensorFlow: 'tensorflowIcon',
  Git: 'gitIcon',
  Docker: 'dockerIcon',
  'Azure DevOps': 'azureIcon',
  'IntelliJ IDEA': 'intellijIcon',
  Postman: 'postmanIcon',
  GitHub: 'github',
  'Visual Studio Code': 'vscodeIcon',
  Eclipse: 'eclipseIcon',
  Jira: 'jiraIcon',
  OpenAI: 'openaiIcon',
  Vercel: 'vercelIcon',
};

const skills = [
  {
    category: 'Programming languages',
    items: ['Java', 'Python', 'C/C++', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Technologies',
    items: [
      'Spring Boot',
      'Hibernate',
      'Maven',
      'Vaadin',
      'MySQL',
      'PostgreSQL',
      'Microsoft SQL Server',
      'Flask',
      'TensorFlow',
      'Git',
      'Docker',
      'Azure DevOps',
    ],
  },
  {
    category: 'Software and tools',
    items: [
      'IntelliJ IDEA',
      'Postman',
      'GitHub',
      'Visual Studio Code',
      'Eclipse',
      'Jira',
      'OpenAI',
      'Vercel',
    ],
  },
];

const certifications = [
  {
    name: 'IELTS (Band 8)',
    issuer: 'IELTS Official',
    date: 'Dec 2023',
    logo: ieltsLogo,
  },
  {
    name: 'Introduction to Quantum Computing',
    issuer: 'The Coding School',
    date: 'Oct 2021',
    logo: codingSchoolLogo,
  },
  {
    name: 'DeepLearning.AI TensorFlow Developer Specialization',
    issuer: 'Coursera',
    date: 'Oct 2020',
    logo: courseraLogo,
  },
  {
    name: 'Architecting with Google Compute Engine Specialization',
    issuer: 'Coursera',
    date: 'Oct 2020',
    logo: courseraLogo,
  },
];

const AboutSectionTitle = ({ label, children }) => (
  <div className={styles.sectionTitle}>
    <div className={styles.sectionMeta}>
      <Divider className={styles.neonDivider} notchWidth="64px" notchHeight="8px" />
      <Text className={styles.kicker} secondary size="s">
        {label}
      </Text>
    </div>
    <ProjectSectionHeading>{children}</ProjectSectionHeading>
  </div>
);

export const meta = () =>
  baseMeta({
    title: 'About',
    description:
      'Meet Mahesh Babu, a software engineer focused on Java, Spring Boot, and data science.',
  });

export const About = () => (
  <>
    <ProjectContainer className={styles.about}>
      <ProjectSection padding="top" className={styles.headerSection}>
        <ProjectSectionContent className={styles.profileHeader}>
          <Image
            className={styles.portrait}
            reveal
            placeholder={maheshImage}
            src={maheshImage}
            width={460}
            height={460}
            sizes={`(max-width: ${media.mobile}px) 240px, 280px`}
            alt="Mahesh Babu"
          />
          <div className={styles.profileContent}>
            <div className={styles.profileMeta}>
              <Divider
                className={styles.neonDivider}
                notchWidth="64px"
                notchHeight="8px"
              />
              <Text className={styles.kicker} secondary size="s">
                About me
              </Text>
            </div>
            <Heading className={styles.name} level={2} as="h1">
              <DecoderText text="Mahesh Babu" delay={200} />
            </Heading>
            <Text secondary size="l" as="p">
              Software Engineer
            </Text>
            <ProjectSectionText>
              I’m a software engineer with 5+ years of experience building web
              applications. I work primarily with Java and Spring Boot, and enjoy
              creating scalable, efficient software—from backend APIs to data-driven
              systems.
            </ProjectSectionText>
            <div className={styles.actions}>
              <Button
                secondary
                icon="download"
                href="https://drive.google.com/file/d/14irMx950--x5lixuP-Z_wbnJTYMbdRRG/view?usp=sharing"
              >
                Download résumé
              </Button>
              <Button secondary icon="phone" href="https://cal.com/maheshbabu11">
                Schedule a call
              </Button>
              <Button
                secondary
                icon="coffee"
                href="https://www.buymeacoffee.com/maheshbabu11"
              >
                Buy me a coffee
              </Button>
            </div>
          </div>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection padding="none" className={styles.section}>
        <ProjectSectionContent>
          <ProjectTextRow stretch width="l">
            <AboutSectionTitle label="01 / Career">Work experience</AboutSectionTitle>
            <div className={styles.timeline}>
              {experience.map(({ company, logo, role, timeframe, achievements }) => (
                <article className={styles.entry} key={company}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryInfo}>
                      <img
                        className={styles.entryLogo}
                        src={logo}
                        alt=""
                        aria-hidden="true"
                      />
                      <div>
                        <Text as="h3" size="l">
                          {company}
                        </Text>
                        <Text secondary>{role}</Text>
                      </div>
                    </div>
                    <Text secondary className={styles.timeframe}>
                      {timeframe}
                    </Text>
                  </div>
                  <List>
                    {achievements.map(achievement => (
                      <ListItem key={achievement}>{achievement}</ListItem>
                    ))}
                  </List>
                </article>
              ))}
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection padding="none" className={styles.section}>
        <ProjectSectionContent>
          <ProjectTextRow stretch width="l">
            <AboutSectionTitle label="02 / Education">Education</AboutSectionTitle>
            <div className={styles.timeline}>
              {education.map(({ institution, degree, timeframe }) => (
                <article className={styles.entry} key={institution}>
                  <div className={styles.entryHeader}>
                    <div>
                      <Text as="h3" size="l">
                        {institution}
                      </Text>
                      <Text secondary>{degree}</Text>
                    </div>
                    <Text secondary className={styles.timeframe}>
                      {timeframe}
                    </Text>
                  </div>
                </article>
              ))}
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection padding="none" className={styles.section}>
        <ProjectSectionContent>
          <ProjectTextRow stretch width="l">
            <AboutSectionTitle label="03 / Toolkit">Technical skills</AboutSectionTitle>
            <div className={styles.skills}>
              {skills.map(({ category, items }) => (
                <section className={styles.skillGroup} key={category}>
                  <Text as="h3" size="l">
                    {category}
                  </Text>
                  <ul className={styles.skillList}>
                    {items.map(item => (
                      <li className={styles.skill} key={item}>
                        <svg className={styles.skillIcon} aria-hidden="true">
                          <use href={`${technicalSkillIcons}#${skillIconIds[item]}`} />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection padding="none" className={styles.section}>
        <ProjectSectionContent>
          <ProjectTextRow stretch width="l">
            <AboutSectionTitle label="04 / Learning">Certifications</AboutSectionTitle>
            <div className={styles.certificationList}>
              {certifications.map(({ name, issuer, date, logo }) => (
                <article className={styles.certification} key={name}>
                  <div className={styles.certificationInfo}>
                    <img
                      className={styles.certificationLogo}
                      src={logo}
                      alt=""
                      aria-hidden="true"
                    />
                    <div>
                      <Text as="h3" size="l">
                        {name}
                      </Text>
                      <Text secondary>{issuer}</Text>
                    </div>
                  </div>
                  <Text secondary className={styles.timeframe}>
                    {date}
                  </Text>
                </article>
              ))}
            </div>
            <div className={styles.certificationLink}>
              <Button
                secondary
                href="https://www.linkedin.com/in/maheshbabu11/details/certifications/"
              >
                View more certifications
              </Button>
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </>
);
