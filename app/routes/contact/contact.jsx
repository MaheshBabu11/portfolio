import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useState } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Send me a message if you’re interested in discussing a project or if you just want to say hi',
  });
};

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const CONTACT_EMAIL = 'mahesh.b.pec@gmail.com';

export const Contact = () => {
  const email = useFormInput('');
  const message = useFormInput('');
  const [draftNotice, setDraftNotice] = useState(false);
  const initDelay = tokens.base.durationS;

  const handleSubmit = event => {
    event.preventDefault();

    const params = new URLSearchParams({
      subject: `Portfolio message from ${email.value}`,
      body: `From: ${email.value}\n\n${message.value}`,
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;
    setDraftNotice(true);
  };

  return (
    <Section className={styles.contact}>
      <div className={styles.content}>
        <Transition in timeout={1600}>
          {({ status, nodeRef }) => (
            <form
              className={styles.form}
              onSubmit={handleSubmit}
              ref={nodeRef}
            >
              <Heading
                className={styles.title}
                data-status={status}
                level={3}
                as="h1"
                style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
              >
                <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
              </Heading>
              <Divider
                className={styles.divider}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
              />
              <Input
                required
                className={styles.input}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay)}
                autoComplete="email"
                label="Your email"
                type="email"
                name="email"
                maxLength={MAX_EMAIL_LENGTH}
                {...email}
              />
              <Input
                required
                multiline
                className={styles.input}
                data-status={status}
                style={getDelay(tokens.base.durationS, initDelay)}
                autoComplete="off"
                label="Message"
                name="message"
                maxLength={MAX_MESSAGE_LENGTH}
                {...message}
              />
              <Button
                className={styles.button}
                data-status={status}
                style={getDelay(tokens.base.durationM, initDelay)}
                icon="send"
                type="submit"
              >
                Open email app
              </Button>
              {draftNotice && (
                <Text className={styles.mailtoNotice} role="status" size="s" as="p">
                  Your email app should open with a draft. Review it and send it to
                  complete delivery.
                </Text>
              )}
            </form>
          )}
        </Transition>

        <aside className={styles.businessCard} aria-labelledby="business-card-title">
          <div className={styles.cardCopy}>
            <h2 id="business-card-title" className={styles.cardTitle}>
              Save my contact
            </h2>
            <p className={styles.cardDescription}>
              Scan the QR code to open this page on your phone, or save my contact
              details.
            </p>
            <Button
              className={styles.cardButton}
              href="/contact.vcf"
              download="Mahesh-Babu.vcf"
              icon="download"
              secondary
            >
              Save contact
            </Button>
          </div>
          <img
            className={styles.qrCode}
            src="/contact-qr.svg"
            alt="QR code linking to Mahesh Babu's contact page"
            width="160"
            height="160"
          />
        </aside>
      </div>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
