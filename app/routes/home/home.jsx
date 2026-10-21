import codeCoffeeScreenshot from '~/assets/code-coffee-repeat.png';
import excel2DataMapScreenshot from '~/assets/excel2datamap.png';
import httpClientScreenshot from '~/assets/http-client-plus.png';
import httpClientScreenshotLarge from '~/assets/http-client-plus-large.png';
import httpClientScreenshotPlaceholder from '~/assets/http-client-plus-placeholder.png';
import ntfyScreenshot from '~/assets/ntfy-java.png';
import ntfyScreenshotLarge from '~/assets/ntfy-java-large.png';
import ntfyScreenshotPlaceholder from '~/assets/ntfy-java-placeholder.png';
import asciiArtScreenshot from '~/assets/ascii-art-generator.png';
import asciiArtScreenshotLarge from '~/assets/ascii-art-generator-large.png';
import asciiArtScreenshotPlaceholder from '~/assets/ascii-art-generator-placeholder.png';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { Recommendations } from './recommendations';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/button';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Software Developer',
    description: `Designer and developer of web and desktop applications, with a focus on user experience, performance, and accessibility. ${config.disciplines.join(', ')}`,
  });
};

export const Home = () => {
  const { visitorCount } = useLoaderData();
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const projectFour = useRef();
  const projectFive = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [
      intro,
      projectOne,
      projectTwo,
      projectThree,
      projectFour,
      projectFive,
      details,
    ];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' },
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  useEffect(() => {
    const updateScrollToTopVisibility = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', updateScrollToTopVisibility, { passive: true });
    updateScrollToTopVisibility();

    return () => window.removeEventListener('scroll', updateScrollToTopVisibility);
  }, []);

  const handleScrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    window.scrollTo({ top: 0, behavior });
  };

  return (
    <>
      <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
        visitorCount={visitorCount}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="HTTP Client Plus"
        description="An IntelliJ IDEA plugin for composing and executing HTTP requests, with support for request configuration, .http file persistence, and JavaScript scripting."
        buttonText="Download plugin"
        buttonLink="https://plugins.jetbrains.com/plugin/28340-http-client-plus"
        caseStudySlug="http-client-plus"
        model={{
          type: 'laptop',
          alt: 'HTTP Client Plus plugin for IntelliJ IDEA',
          textures: [
            {
              srcSet: `${httpClientScreenshot} 800w, ${httpClientScreenshotLarge} 1920w`,
              placeholder: httpClientScreenshotPlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="ASCII Art Generator"
        description="A web app that converts images into ASCII art, with support for custom character sets and file downloads."
        buttonText="View website"
        buttonLink="https://ascii-art-generator.maheshbabu11.dev/"
        caseStudySlug="ascii-art-generator"
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: `${asciiArtScreenshot} 375w, ${asciiArtScreenshotLarge} 750w`,
              placeholder: asciiArtScreenshotPlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="NTFY Java"
        description="A lightweight Java library for publishing notifications to ntfy servers and receiving messages in real time over a WebSocket-like stream."
        buttonText="View on GitHub"
        buttonLink="https://github.com/MaheshBabu11/ntfy-java/packages/1957376"
        caseStudySlug="ntfy-java"
        model={{
          type: 'laptop',
          alt: 'NTFY Java library for publishing notifications to ntfy servers',
          textures: [
            {
              srcSet: `${ntfyScreenshot} 800w, ${ntfyScreenshotLarge} 1920w`,
              placeholder: ntfyScreenshotPlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-4"
        alternate
        sectionRef={projectFour}
        visible={visibleSections.includes(projectFour.current)}
        index={4}
        title="Code Coffee Repeat"
        description="A blog about Java, Spring Boot, programming, and web development, built with Next.js, Tailwind CSS, React Server Components, and Contentlayer."
        buttonText="Read the blog"
        buttonLink="https://blog.maheshbabu11.dev/"
        caseStudySlug="code-coffee-repeat"
        model={{
          type: 'laptop',
          alt: 'Code Coffee Repeat software engineering blog',
          textures: [
            {
              srcSet: `${codeCoffeeScreenshot} 1306w`,
              placeholder: codeCoffeeScreenshot,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-5"
        sectionRef={projectFive}
        visible={visibleSections.includes(projectFive.current)}
        index={5}
        title="Excel2DataMap"
        description="A Java library that reads Excel and CSV files and converts their contents into data maps for database workflows, with file-type detection and conversion utilities."
        buttonText="View on GitHub"
        buttonLink="https://github.com/MaheshBabu11/Excel2DataMap"
        caseStudySlug="excel2datamap"
        model={{
          type: 'laptop',
          alt: 'Excel2DataMap Java library project',
          textures: [
            {
              srcSet: `${excel2DataMapScreenshot} 1311w`,
              placeholder: excel2DataMapScreenshot,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Recommendations />
      <Footer />
      </div>
      {showScrollToTop && (
        <Button
          className={styles.scrollToTop}
          icon="arrow-left"
          iconOnly
          aria-label="Scroll to top"
          onClick={handleScrollToTop}
          type="button"
        />
      )}
    </>
  );
};
