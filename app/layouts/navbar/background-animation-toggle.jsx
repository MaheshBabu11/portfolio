import { Button } from '~/components/button';
import { useBackgroundAnimation } from '~/components/background-animation/background-animation-provider';
import styles from './background-animation-toggle.module.css';

const labels = {
  sphere: 'Sphere',
  aurora: 'Aurora',
  galaxy: 'Galaxy',
  meteors: 'Meteors',
};

export const BackgroundAnimationToggle = ({ isMobile, ...rest }) => {
  const { mode, nextMode, cycleMode } = useBackgroundAnimation();

  return (
    <Button
      iconOnly
      className={styles.toggle}
      data-mobile={isMobile}
      aria-label={`Switch background to ${labels[nextMode]}`}
      title={`Background: ${labels[mode]}`}
      onClick={cycleMode}
      {...rest}
    >
      <svg aria-hidden className={styles.icon} width="38" height="38" viewBox="0 0 38 38">
        <circle cx="19" cy="19" r="2.5" fill="currentColor" />
        <ellipse cx="19" cy="19" rx="8" ry="14" transform="rotate(55 19 19)" />
        <ellipse cx="19" cy="19" rx="8" ry="14" transform="rotate(-55 19 19)" />
      </svg>
    </Button>
  );
};
