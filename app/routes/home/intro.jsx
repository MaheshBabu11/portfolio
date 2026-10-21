import { useBackgroundAnimation } from '~/components/background-animation/background-animation-provider';
import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { useTheme } from '~/components/theme-provider';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { Weather } from '~/components/weather';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Link as RouterLink } from '@remix-run/react';
import { useInterval, usePrevious, useScrollToHash } from '~/hooks';
import { useHydrated } from '~/hooks/useHydrated';
import { Suspense, lazy, useEffect, useState } from 'react';
import { cssProps } from '~/utils/style';
import config from '~/config.json';
import styles from './intro.module.css';

const BackgroundAnimation = lazy(() =>
  import('./background-animation').then(module => ({ default: module.BackgroundAnimation }))
);

export function Intro({
  id,
  sectionRef,
  scrollIndicatorHidden,
  visitorCount,
  ...rest
}) {
  const { theme, design } = useTheme();
  const { mode: backgroundMode } = useBackgroundAnimation();
  const { disciplines } = config;
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const prevTheme = usePrevious(theme);
  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
    ', and '
  );
  const currentDiscipline = disciplines.find((item, index) => index === disciplineIndex);
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const isHydrated = useHydrated();

  useInterval(
    () => {
      const index = (disciplineIndex + 1) % disciplines.length;
      setDisciplineIndex(index);
    },
    5000,
    theme
  );

  useEffect(() => {
    if (prevTheme && prevTheme !== theme) {
      setDisciplineIndex(0);
    }
  }, [theme, prevTheme]);

  const handleScrollClick = event => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {design === 'classic' && isHydrated && (
              <Suspense>
                <BackgroundAnimation variant={backgroundMode} />
              </Suspense>
            )}
            <header className={styles.text}>
              <div className={styles.headerMeta}>
                <Weather />
                {design === 'classic' &&
                  Number.isSafeInteger(visitorCount) &&
                  visitorCount >= 0 && (
                    <span
                      className={styles.visitorCounter}
                      role="group"
                      aria-label={`Home page views: ${visitorCount.toLocaleString('en')}`}
                    >
                      <span aria-hidden="true">
                        {visitorCount.toLocaleString('en')}
                      </span>
                      <span className={styles.visitorLabel} aria-hidden="true">
                        views
                      </span>
                      <span className={styles.visitorDecoration} aria-hidden="true" />
                    </span>
                  )}
              </div>
              <p className={styles.eyebrow}>
                {design === 'murim'
                  ? 'MURIM ARCHIVE / TECHNIQUE RECORD'
                  : design === 'nano'
                    ? 'NANO SYSTEM / ENGINEER RECORD'
                  : 'SOFTWARE ENGINEER / PORTFOLIO'}
              </p>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text={config.name} delay={500} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`${config.role} + ${introLabel}`}
                </VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-role
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    {config.role}
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
                <div className={styles.row}>
                  {disciplines.map(item => (
                    <Transition
                      unmount
                      in={item === currentDiscipline}
                      timeout={{ enter: 3000, exit: 2000 }}
                      key={item}
                    >
                      {({ status, nodeRef }) => (
                        <span
                          aria-hidden
                          ref={nodeRef}
                          className={styles.word}
                          data-plus={true}
                          data-status={status}
                          style={cssProps({ delay: tokens.base.durationL })}
                        >
                          {item}
                        </span>
                      )}
                    </Transition>
                  ))}
                </div>
              </Heading>
              <p className={styles.tagline}>
                {design === 'nano'
                  ? 'A system-assisted path through the world of software engineering.'
                  : 'Rewriting the future, one thoughtful build at a time.'}
              </p>
              <a className={styles.chapterLink} href="#project-1">
                <span>
                  {design === 'murim'
                    ? 'Enter the archive'
                    : design === 'nano'
                      ? 'Open the system'
                      : 'View projects'}
                </span>
                <span aria-hidden="true">↘</span>
              </a>
              {design === 'murim' &&
                Number.isSafeInteger(visitorCount) &&
                visitorCount >= 0 && (
                  <div
                    className={styles.visitorCounter}
                    role="group"
                    aria-label={`Home page views: ${visitorCount.toLocaleString('en')}`}
                  >
                    <span aria-hidden="true">{visitorCount.toLocaleString('en')}</span>
                    <span className={styles.visitorLabel} aria-hidden="true">
                      archive views
                    </span>
                  </div>
                )}
              {design === 'nano' &&
                Number.isSafeInteger(visitorCount) &&
                visitorCount >= 0 && (
                  <div
                    className={`${styles.visitorCounter} ${styles.nanoVisitorCounter}`}
                    role="group"
                    aria-label={`Home page views: ${visitorCount.toLocaleString('en')}`}
                  >
                    <span aria-hidden="true">{visitorCount.toLocaleString('en')}</span>
                    <span className={styles.visitorLabel} aria-hidden="true">
                      system access records
                    </span>
                  </div>
                )}
            </header>
            {design === 'murim' && (
              <div className={styles.illustration} aria-hidden="true">
                <div className={styles.illustrationFrame}>
                  <span className={styles.frameTop}>
                    SCROLL 01&nbsp; / &nbsp;BLOOD-MOON ASCENT
                  </span>
                  <span className={styles.moon} />
                  <span className={styles.mountain} />
                  <span className={styles.mountainBack} />
                  <span className={styles.sword} />
                  <span className={styles.illustrationSeal}>魔</span>
                  <span className={styles.frameSide}>
                    MURIM&nbsp; · &nbsp;JAVA&nbsp; · &nbsp;SYSTEMS
                  </span>
                  <span className={styles.frameBottom}>ASCEND THROUGH THE ARCHIVE</span>
                </div>
              </div>
            )}
            {design === 'nano' && (
              <div className={styles.nanoIllustration} aria-hidden="true">
                <div className={styles.nanoFrame}>
                  <span className={styles.nanoHeader}>NANO SYSTEM // ONLINE</span>
                  <span className={styles.nanoStatus}>
                    USER STATUS&nbsp; · &nbsp;ACTIVE
                    <br />
                    SYNC RATE&nbsp; · &nbsp;99.8%
                  </span>
                  <span className={styles.nanoCore}>
                    <span className={styles.nanoOrbit} />
                    <span className={styles.nanoPulse} />
                  </span>
                  <span className={`${styles.nanoChip} ${styles.nanoChipLeft}`}>
                    <span>NEURAL LINK</span>
                    <strong>ESTABLISHED</strong>
                  </span>
                  <span className={`${styles.nanoChip} ${styles.nanoChipRight}`}>
                    <span>TECHNIQUE SYNC</span>
                    <strong>READY</strong>
                  </span>
                  <span className={styles.nanoReadout}>
                    <span>NEURAL LINK</span>
                    <span className={styles.nanoMeter} />
                    <span>TECHNIQUE ANALYSIS</span>
                    <span className={styles.nanoMeter} />
                  </span>
                  <span className={styles.nanoScanline} />
                  <span className={styles.nanoFooter}>
                    MARTIAL ARTS&nbsp; // &nbsp;EVOLUTION
                  </span>
                </div>
              </div>
            )}
            <RouterLink
              to="/#project-1"
              className={styles.scrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
            </RouterLink>
            <RouterLink
              to="/#project-1"
              className={styles.mobileScrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
              <svg
                aria-hidden
                stroke="currentColor"
                width="43"
                height="15"
                viewBox="0 0 43 15"
              >
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </RouterLink>
          </>
        )}
      </Transition>
    </Section>
  );
}
