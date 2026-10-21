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
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';
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

export const MAX_EMAIL_LENGTH = 512;
export const MAX_MESSAGE_LENGTH = 4096;

export const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const initDelay = tokens.base.durationS;

  useEffect(() => {
    if (actionData?.success) {
      setEmail('');
      setMessage('');
    }
  }, [actionData]);

  return (
    <Section className={styles.contact}>
      <div className={styles.content}>
        <Transition in timeout={1600}>
          {({ status, nodeRef }) => (
            <Form
              className={styles.form}
              method="post"
              ref={nodeRef}
            >
              <div className={styles.honeypot} aria-hidden="true">
                <label>
                  Leave this field empty
                  <input
                    autoComplete="off"
                    name="company"
                    tabIndex={-1}
                    type="text"
                  />
                </label>
              </div>
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
                value={email}
                onChange={event => setEmail(event.target.value)}
                error={actionData?.fieldErrors?.email}
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
                value={message}
                onChange={event => setMessage(event.target.value)}
                error={actionData?.fieldErrors?.message}
              />
              <Button
                className={styles.button}
                data-status={status}
                disabled={isSubmitting}
                loading={isSubmitting}
                loadingText="Sending"
                style={getDelay(tokens.base.durationM, initDelay)}
                icon="send"
                type="submit"
              >
                Send message
              </Button>
              {actionData && (actionData.error || actionData.success) && (
                <Text
                  className={styles.formNotice}
                  data-error={Boolean(actionData.error)}
                  role={actionData.success ? 'status' : 'alert'}
                  size="s"
                  as="p"
                >
                  {actionData.success
                    ? 'Thanks for reaching out. Your message has been sent.'
                    : actionData.error}
                </Text>
              )}
            </Form>
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
