import { json, redirect } from '@remix-run/node';
import { randomBytes } from 'node:crypto';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from '@remix-run/react';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import {
  getAdminAuthConfig,
  getAdminSession,
  hashAdminPassword,
  verifyAdminPassword,
} from '~/utils/admin-auth.server';
import { getServerEnv } from '~/utils/env';
import { setPortfolioSetting } from '~/utils/portfolio-settings.server';
import { setGlobalSiteDesign } from '~/utils/site-design.server';
import styles from '../admin.module.css';

const allowedDesigns = new Set(['classic', 'murim', 'nano']);
const passwordHashSetting = 'admin-password-hash';
const sessionSecretSetting = 'admin-session-secret';
const maxPasswordLength = 1024;
const minPasswordLength = 12;

function checkRequestOrigin(request) {
  const origin = request.headers.get('Origin');

  if (origin && origin !== new URL(request.url).origin) {
    throw new Response('Forbidden', { status: 403 });
  }
}

export async function loader({ request }) {
  let authConfig = null;
  let authError = null;
  let authenticated = false;

  try {
    authConfig = await getAdminAuthConfig();
    authenticated = authConfig
      ? (await getAdminSession(request, authConfig.sessionSecret)).isAuthenticated
      : false;
  } catch (error) {
    console.error(
      'Failed to load admin authentication settings.',
      error instanceof Error ? error.name : 'Unknown error'
    );
    authError = 'Admin authentication settings could not be loaded. Check DATABASE_URL and the server logs.';
  }

  return json(
    { configured: Boolean(authConfig), authenticated, authError },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function action({ request }) {
  checkRequestOrigin(request);

  const formData = await request.formData();
  const intent = formData.get('intent');
  let authConfig;

  try {
    authConfig = await getAdminAuthConfig();
  } catch (error) {
    console.error(
      'Failed to load admin authentication settings.',
      error instanceof Error ? error.name : 'Unknown error'
    );
    return json(
      { error: 'Admin authentication settings could not be loaded. Check the server logs.' },
      { status: 503 }
    );
  }

  if (intent === 'login') {
    if (!authConfig) {
      return json(
        { error: 'Admin access is not initialized. Set ADMIN_PASSWORD and reload this page.' },
        { status: 503 }
      );
    }

    if (!(await verifyAdminPassword(formData.get('password'), authConfig.passwordHash))) {
      return json(
        { intent: 'login', error: 'The password is incorrect.' },
        { status: 401 }
      );
    }

    const { storage } = await getAdminSession(request, authConfig.sessionSecret);
    const session = await storage.getSession();
    session.set('adminAuthenticated', true);

    return redirect('/admin', {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': await storage.commitSession(session),
      },
    });
  }

  if (!authConfig) {
    return json(
      { error: 'Admin access is not initialized. Set ADMIN_PASSWORD and reload this page.' },
      { status: 503 }
    );
  }

  const { session, storage, isAuthenticated } = await getAdminSession(
    request,
    authConfig.sessionSecret
  );

  if (intent === 'logout') {
    return redirect('/admin', {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': await storage.destroySession(session),
      },
    });
  }

  if (!isAuthenticated) {
    return json({ error: 'Authentication is required.' }, { status: 401 });
  }

  if (intent === 'change-password') {
    const currentPassword = formData.get('current-password');
    const newPassword = formData.get('new-password');
    const confirmPassword = formData.get('confirm-password');

    if (
      typeof currentPassword !== 'string' ||
      currentPassword.length > maxPasswordLength ||
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      return json(
        { intent: 'change-password', error: 'Enter valid password values.' },
        { status: 400 }
      );
    }

    if (newPassword.length < minPasswordLength) {
      return json(
        {
          intent: 'change-password',
          error: `Your new password must be at least ${minPasswordLength} characters.`,
        },
        { status: 400 }
      );
    }

    if (newPassword.length > maxPasswordLength) {
      return json(
        { intent: 'change-password', error: 'Your new password is too long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return json(
        { intent: 'change-password', error: 'The new passwords do not match.' },
        { status: 400 }
      );
    }

    if (!(await verifyAdminPassword(currentPassword, authConfig.passwordHash))) {
      return json(
        { intent: 'change-password', error: 'The current password is incorrect.' },
        { status: 401 }
      );
    }

    const { DATABASE_URL } = getServerEnv();

    if (!DATABASE_URL) {
      return json(
        { intent: 'change-password', error: 'DATABASE_URL is not configured.' },
        { status: 503 }
      );
    }

    try {
      const newSessionSecret = randomBytes(48).toString('base64url');
      await setPortfolioSetting(DATABASE_URL, sessionSecretSetting, newSessionSecret);
      await setPortfolioSetting(
        DATABASE_URL,
        passwordHashSetting,
        await hashAdminPassword(newPassword)
      );
    } catch (error) {
      console.error(
        'Failed to change the admin password.',
        error instanceof Error ? error.name : 'Unknown error'
      );
      return json(
        {
          intent: 'change-password',
          error: 'The password could not be changed. Check the server logs and try again.',
        },
        { status: 503 }
      );
    }

    return redirect('/admin', {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': await storage.destroySession(session),
      },
    });
  }

  if (intent !== 'set-design') {
    return json({ error: 'Unsupported admin action.' }, { status: 400 });
  }

  const design = formData.get('design');

  if (typeof design !== 'string' || !allowedDesigns.has(design)) {
    return json(
      { intent: 'set-design', error: 'Choose a valid site design.' },
      { status: 400 }
    );
  }

  const { DATABASE_URL } = getServerEnv();

  if (!DATABASE_URL) {
    return json(
      { intent: 'set-design', error: 'DATABASE_URL is not configured.' },
      { status: 503 }
    );
  }

  try {
    await setGlobalSiteDesign(DATABASE_URL, design);
  } catch (error) {
    console.error(
      'Failed to update the global site design.',
      error instanceof Error ? error.name : 'Unknown error'
    );
    return json(
      {
        intent: 'set-design',
        error: 'The global design could not be saved. Check the server logs and try again.',
      },
      { status: 503 }
    );
  }

  return redirect('/admin', {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export default function Admin() {
  const { configured, authenticated, authError } = useLoaderData();
  const rootData = useRouteLoaderData('root');
  const navigation = useNavigation();
  const design = rootData?.design ?? 'murim';
  const databaseError = rootData?.designError
    ? 'The global design could not be loaded from the database.'
    : null;
  const isSubmitting = navigation.state !== 'idle';
  const isLoggingIn = isSubmitting && navigation.formData?.get('intent') === 'login';
  const isSavingDesign =
    isSubmitting && navigation.formData?.get('intent') === 'set-design';
  const isChangingPassword =
    isSubmitting && navigation.formData?.get('intent') === 'change-password';
  const actionData = useActionData();

  return (
    <main className={styles.admin}>
      <section
        className={`${styles.panel} ${authenticated ? styles.settingsPanel : styles.loginPanel}`}
        aria-labelledby="admin-heading"
      >
        {authenticated ? (
          <>
            <p className={styles.eyebrow}>Site administration</p>
            <Heading level={1} id="admin-heading">
              Portfolio theme
            </Heading>
            <Text className={styles.description} as="p">
              Choose the design visitors see across the site.
            </Text>
          </>
        ) : (
          <Heading level={1} id="admin-heading">
            Admin sign in
          </Heading>
        )}
        {authError ? (
          <p className={styles.error} role="alert">
            {authError}
          </p>
        ) : !configured ? (
          <p className={styles.error} role="alert">
            Admin access is not initialized. Set ADMIN_PASSWORD on the server and
            reload this page to store the password hash and session secret in the
            database.
          </p>
        ) : !authenticated ? (
          <Form method="post" className={styles.loginForm}>
            <input type="hidden" name="intent" value="login" />
            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </label>
            {actionData?.intent === 'login' && actionData.error && (
              <p className={styles.error} role="alert">
                {actionData.error}
              </p>
            )}
            <button className={styles.submit} type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </Form>
        ) : (
          <>
            <p className={databaseError ? styles.error : styles.notice} role="status">
              {databaseError
                ? databaseError
                : `Current selection: ${
                    design === 'murim'
                      ? 'Murim'
                      : design === 'nano'
                        ? 'Nano Machine'
                        : 'Original'
                  }`}
            </p>
            <Form method="post" className={styles.settingsForm}>
              <input type="hidden" name="intent" value="set-design" />
              <label className={styles.label} htmlFor="site-design">
                Site-wide design
                <span className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    id="site-design"
                    name="design"
                    defaultValue={design}
                    disabled={Boolean(databaseError)}
                  >
                    <option value="murim">Murim</option>
                    <option value="nano">Nano Machine</option>
                    <option value="classic">Original (Master)</option>
                  </select>
                  <span className={styles.selectArrow} aria-hidden="true" />
                </span>
              </label>
              {actionData?.intent === 'set-design' && actionData.error && (
                <p className={styles.error} role="alert">
                  {actionData.error}
                </p>
              )}
              <button
                className={styles.submit}
                type="submit"
                disabled={Boolean(databaseError) || isSavingDesign}
              >
                {isSavingDesign ? 'Saving…' : 'Save design'}
              </button>
            </Form>
            <Form method="post" className={styles.passwordForm}>
              <input type="hidden" name="intent" value="change-password" />
              <Heading level={2}>Change admin password</Heading>
              <label className={styles.label}>
                Current password
                <input
                  className={styles.input}
                  type="password"
                  name="current-password"
                  autoComplete="current-password"
                  required
                  maxLength={maxPasswordLength}
                />
              </label>
              <label className={styles.label}>
                New password
                <input
                  className={styles.input}
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  minLength={minPasswordLength}
                  maxLength={maxPasswordLength}
                  required
                />
              </label>
              <label className={styles.label}>
                Confirm new password
                <input
                  className={styles.input}
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  minLength={minPasswordLength}
                  maxLength={maxPasswordLength}
                  required
                />
              </label>
              {actionData?.intent === 'change-password' && actionData.error && (
                <p className={styles.error} role="alert">
                  {actionData.error}
                </p>
              )}
              <Text as="p" secondary>
                Use at least {minPasswordLength} characters. Saving signs out all
                current admin and homelab sessions.
              </Text>
              <button
                className={styles.submit}
                type="submit"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Changing password…' : 'Change password'}
              </button>
            </Form>
            <Form method="post" className={styles.logoutForm}>
              <input type="hidden" name="intent" value="logout" />
              <button className={styles.logout} type="submit">
                Sign out
              </button>
            </Form>
          </>
        )}
      </section>
    </main>
  );
}
