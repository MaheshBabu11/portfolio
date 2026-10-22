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
import { useCallback, useEffect, useRef, useState } from 'react';
import bigDataFoundationsBadge from '~/assets/badges/big-data-foundations-level-1.webp';
import dataAnalysisBadge from '~/assets/badges/data-analysis-with-python.webp';
import dataFoundationsBadge from '~/assets/badges/data-science-foundations-specialist.webp';
import dataMethodologyBadge from '~/assets/badges/data-science-methodology.webp';
import dataOrientationBadge from '~/assets/badges/data-science-orientation.webp';
import dataVisualizationBadge from '~/assets/badges/data-visualization-with-python.webp';
import databasesBadge from '~/assets/badges/databases-and-sql-for-data-science.webp';
import pythonBadge from '~/assets/badges/python-for-data-science.webp';
import pythonAiBadge from '~/assets/badges/python-for-data-science-and-ai.webp';
import toolsBadge from '~/assets/badges/tools-for-data-science.webp';
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
  {
    name: 'Machine Learning for Business Professionals',
    issuer: 'Google Cloud / Coursera',
    date: 'Apr 2020',
    logo: courseraLogo,
  },
  {
    name: 'Data Science Math Skills',
    issuer: 'Duke University / Coursera',
    date: 'Apr 2020',
    logo: courseraLogo,
  },
];

const badges = [
  {
    name: 'Big Data Foundations - Level 1',
    image: bigDataFoundationsBadge,
    shape: 'square',
  },
  {
    name: 'Data Analysis with Python',
    image: dataAnalysisBadge,
  },
  {
    name: 'Data Science Foundations Specialist',
    image: dataFoundationsBadge,
    shape: 'ribbon',
  },
  {
    name: 'Data Science Methodology',
    image: dataMethodologyBadge,
  },
  {
    name: 'Data Science Orientation',
    image: dataOrientationBadge,
  },
  {
    name: 'Data Visualization with Python',
    image: dataVisualizationBadge,
  },
  {
    name: 'Databases and SQL for Data Science',
    image: databasesBadge,
  },
  {
    name: 'Python for Data Science',
    image: pythonBadge,
    shape: 'square',
  },
  {
    name: 'Python for Data Science and AI',
    image: pythonAiBadge,
  },
  {
    name: 'Tools for Data Science',
    image: toolsBadge,
  },
];

const carouselSlides = [
  ...badges.map((badge, index) => ({ badge, index, isClone: true })),
  ...badges.map((badge, index) => ({ badge, index, isClone: false })),
  ...badges.map((badge, index) => ({ badge, index, isClone: true })),
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

const BadgeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);
  const scrollEndTimer = useRef();
  const activeIndexRef = useRef(0);
  const activePositionRef = useRef(badges.length);
  const dragRef = useRef(null);
  const isPaused = isHovered || hasFocus || isDragging;

  const scrollToSlide = useCallback((position, behavior = 'smooth') => {
    const viewport = carouselRef.current;
    const slide = viewport?.querySelector(
      `[data-slide-position="${position}"]`
    );

    if (!viewport || !slide) return;

    activePositionRef.current = position;
    const viewportRect = viewport.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const left =
      viewport.scrollLeft +
      slideRect.left -
      viewportRect.left -
      (viewport.clientWidth - slideRect.width) / 2;

    viewport.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : behavior,
    });
  }, []);

  useEffect(() => {
    scrollToSlide(badges.length, 'auto');
  }, [scrollToSlide]);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (document.hidden) return;

      let nextPosition = activePositionRef.current + 1;
      if (nextPosition >= badges.length * 3) {
        nextPosition = badges.length * 2;
      }
      const nextIndex = nextPosition % badges.length;

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollToSlide(nextPosition);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused, scrollToSlide]);

  useEffect(
    () => () => {
      window.clearTimeout(scrollEndTimer.current);
    },
    []
  );

  const syncActiveSlide = () => {
    const viewport = carouselRef.current;

    if (!viewport) return;

    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearestSlide;
    let nearestDistance = Infinity;

    viewport.querySelectorAll('[data-slide-index]').forEach(slide => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);

      if (distance < nearestDistance) {
        nearestSlide = slide;
        nearestDistance = distance;
      }
    });

    if (!nearestSlide) return;

    const nearestIndex = Number(nearestSlide.dataset.slideIndex);
    const nearestPosition = Number(nearestSlide.dataset.slidePosition);
    const isClone = nearestSlide.dataset.clone === 'true';
    const realPosition =
      nearestPosition < badges.length
        ? nearestPosition + badges.length
        : nearestPosition >= badges.length * 2
          ? nearestPosition - badges.length
          : null;

    if (isClone && realPosition !== null) {
      scrollToSlide(realPosition, 'auto');
    } else {
      activePositionRef.current = nearestPosition;
    }

    activeIndexRef.current = nearestIndex;
    setActiveIndex(nearestIndex);
  };

  const handleScroll = () => {
    window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(syncActiveSlide, 250);
  };

  const handlePointerDown = event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const viewport = carouselRef.current;

    if (!viewport) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: viewport.scrollLeft,
    };
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = event => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    event.preventDefault();
    setIsDragging(true);
    carouselRef.current.scrollLeft =
      dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };

  const handlePointerUp = event => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    if (carouselRef.current?.hasPointerCapture(event.pointerId)) {
      carouselRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const navigateToIndex = index => {
    const currentIndex = activeIndexRef.current;
    const position =
      currentIndex === badges.length - 1 && index === 0
        ? badges.length * 2
        : currentIndex === 0 && index === badges.length - 1
          ? badges.length - 1
          : badges.length + index;

    activeIndexRef.current = index;
    setActiveIndex(index);
    scrollToSlide(position);
  };

  const handleWheel = event => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    let nextPosition = activePositionRef.current + direction;

    if (nextPosition < 0) {
      nextPosition = badges.length - 1;
    } else if (nextPosition >= badges.length * 3) {
      nextPosition = badges.length * 2;
    }

    const nextIndex = nextPosition % badges.length;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    scrollToSlide(nextPosition);
  };

  return (
    <div
      className={styles.badgeCarousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Coursera badges"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasFocus(false);
        }
      }}
    >
      <div
        className={styles.badgeViewport}
        data-dragging={isDragging}
        ref={carouselRef}
        onWheel={handleWheel}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.badgeTrack}>
          {carouselSlides.map(({ badge, index, isClone }, position) => {
            const { name, image, shape = 'circle' } = badge;

            return (
              <div
                className={styles.badgeSlide}
                data-active={index === activeIndex}
                data-clone={isClone}
                data-slide-index={index}
                data-slide-position={position}
                key={`${name}-${position}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${badges.length}: ${name}`}
                aria-hidden={isClone}
              >
                <img
                  className={styles.badgeImage}
                  src={image}
                  alt={isClone ? '' : name}
                  data-shape={shape}
                  loading="eager"
                  decoding="async"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.badgePagination} role="group" aria-label="Choose a badge">
        {badges.map(({ name }, index) => (
          <button
            className={styles.badgeDot}
            data-active={index === activeIndex}
            key={name}
            type="button"
            aria-label={`Show ${name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => navigateToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

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

      <ProjectSection padding="none" className={styles.section}>
        <ProjectSectionContent width="xl">
          <ProjectTextRow stretch width="xl">
            <AboutSectionTitle label="05 / Skill badges">
             Badges
            </AboutSectionTitle>
            <BadgeCarousel />
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </>
);
