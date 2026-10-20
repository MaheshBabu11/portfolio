import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config.json';
import { useTheme } from '~/components/theme-provider';
import styles from './footer.module.css';

export const Footer = ({ className }) => {
  const { design } = useTheme();

  return (
    <footer className={classes(styles.footer, className)}>
      {design === 'murim' && (
        <span className={styles.epilogue}>
          End of this arc · the next begins with a hello
        </span>
      )}
      <Text size="s" align="center">
        <span className={styles.date}>
          {`© ${new Date().getFullYear()} ${config.name}.`}
        </span>
        <Link secondary className={styles.link} href="/humans.txt" target="_self">
          Crafted by yours truly
        </Link>
      </Text>
    </footer>
  );
};
