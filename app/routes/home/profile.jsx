import profileImgLarge from '~/assets/profile-large.png';
import profileImgPlaceholder from '~/assets/profile-placeholder.png';
import profileImg from '~/assets/profile.png';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { useTheme } from '~/components/theme-provider';
import { Fragment, useState } from 'react';
import { media } from '~/utils/style';
import katakana from './katakana.svg';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId, design }) => (<Fragment>
  <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
    <DecoderText
      text={
        design === 'murim'
          ? 'The person behind the code'
          : design === 'nano'
            ? 'Operator profile'
            : 'Hi there'
      }
      start={visible}
      delay={500}
    />
  </Heading>
  <Text className={styles.description} data-visible={visible} size="l" as="p">
    I’m Mahesh, currently I live in Kerala working as a senior software engineer at{' '}
    <Link href="">Acmatek Inc</Link>. I have 5+ years of experience building web applications.
    My projects include backend APIs, web apps, and data processing libraries. I have a strong interest in building
    scalable and efficient software solutions. Being comfortable with code allows me to rapidly
    prototype and validate experiences. If you’re interested in the tools and software I
    use check out my <Link href="/uses">uses page</Link>.
  </Text>
  <Text className={styles.description} data-visible={visible} size="l" as="p">
    Outside work, I build open-source projects like HTTP Client Plus, NTFY Java, and
    Excel2DataMap, and I write about software engineering on my blog,
    Code-Coffee-Repeat. So feel free to drop me a line.
  </Text>
</Fragment>);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const { design } = useTheme();
  const titleId = `${id}-title`;

  return (<Section
    className={styles.profile}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    as="section"
    id={id}
    ref={sectionRef}
    aria-labelledby={titleId}
    tabIndex={-1}
  >
    <Transition in={visible || focused} timeout={0}>
      {({ visible, nodeRef }) => (<div className={styles.content} ref={nodeRef}>
        <div className={styles.column}>
          <ProfileText visible={visible} titleId={titleId} design={design} />
          <Button
            secondary
            className={styles.button}
            data-visible={visible}
            href="/contact"
            icon="send"
          >
            Send me a message
          </Button>
        </div>
        <div className={styles.column}>
          <div className={styles.tag} aria-hidden>
            <Divider
              notchWidth="64px"
              notchHeight="8px"
              collapsed={!visible}
              collapseDelay={1000}
            />
            <div className={styles.tagText} data-visible={visible}>
              {design === 'murim'
                ? 'Character profile'
                : design === 'nano'
                  ? 'System profile'
                  : 'About me'}
            </div>
          </div>
          <div className={styles.image}>
            <Image
              reveal
              delay={100}
              placeholder={profileImgPlaceholder}
              srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
              width={960}
              height={1280}
              sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
              alt="Me casually chilling behing home"
            />
            <svg className={styles.svg} data-visible={visible} viewBox="0 0 136 766">
              <use href={`${katakana}#katakana-profile`} />
            </svg>
          </div>
        </div>
      </div>)}
    </Transition>
  </Section>);
};
