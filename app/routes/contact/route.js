import { json } from '@remix-run/node';
import { ContactEmailConfigurationError, sendContactEmail } from './emailjs.server';
import { MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH } from './contact';

export { Contact as default, meta } from './contact';

export async function action({ request }) {
  const origin = request.headers.get('Origin');

  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'Unable to send your message. Please try again.' }, { status: 403 });
  }

  const formData = await request.formData();
  const emailValue = formData.get('email');
  const messageValue = formData.get('message');
  const honeypot = formData.get('company');
  const email = typeof emailValue === 'string' ? emailValue.trim() : '';
  const message = typeof messageValue === 'string' ? messageValue.trim() : '';
  const fieldErrors = {};

  if (typeof honeypot === 'string' && honeypot.trim()) {
    return json({ error: 'Unable to send your message. Please try again.' }, { status: 400 });
  }

  if (!email || email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Enter a valid email address.';
  }

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = 'Enter a message of up to 4096 characters.';
  }

  if (Object.keys(fieldErrors).length) {
    return json(
      { fieldErrors, error: 'Please correct the fields below and try again.' },
      { status: 400 }
    );
  }

  try {
    await sendContactEmail({ email, message });
  } catch (error) {
    if (error instanceof ContactEmailConfigurationError) {
      console.error('Contact form is not configured.', error.message);
      return json(
        { error: 'The contact form is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    console.error('EmailJS failed to send a contact message.', {
      name: error instanceof Error ? error.name : 'Unknown error',
      status: error?.status,
      response: typeof error?.text === 'string' ? error.text.slice(0, 300) : undefined,
    });
    return json(
      { error: 'Your message could not be sent. Please try again later.' },
      { status: 502 }
    );
  }

  return json({ success: true });
}
