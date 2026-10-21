import emailjs from '@emailjs/nodejs';
import { getServerEnv } from '~/utils/env';

export class ContactEmailConfigurationError extends Error {
  constructor() {
    super(
      'Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, and CONTACT_TO_EMAIL.'
    );
    this.name = 'ContactEmailConfigurationError';
  }
}

export async function sendContactEmail({ email, message }) {
  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
    CONTACT_TO_EMAIL,
  } = getServerEnv();

  if (
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY ||
    !EMAILJS_PRIVATE_KEY ||
    !CONTACT_TO_EMAIL
  ) {
    throw new ContactEmailConfigurationError();
  }

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email: CONTACT_TO_EMAIL,
      from_email: email,
      reply_to: email,
      subject: 'Portfolio contact form message',
      message,
    },
    {
      publicKey: EMAILJS_PUBLIC_KEY,
      privateKey: EMAILJS_PRIVATE_KEY,
    }
  );
}
