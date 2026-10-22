import { json, redirect } from '@remix-run/node';
import { verifyAdminPassword } from '~/utils/admin-auth.server';
import { getDashdotData } from '~/utils/dashdot.server';
import { getHomelabSession } from '~/utils/homelab-auth.server';
import { getServiceStatuses } from '~/utils/service-status.server';

const checkRequestOrigin = request => {
  const origin = request.headers.get('Origin');

  if (origin && origin !== new URL(request.url).origin) {
    throw new Response('Forbidden', { status: 403 });
  }
};

export const loader = async ({ request }) => {
  let auth;

  try {
    auth = await getHomelabSession(request);
  } catch (error) {
    console.error(
      'Failed to load homelab authentication settings.',
      error instanceof Error ? error.name : 'Unknown error'
    );
    return json(
      {
        configured: false,
        authenticated: false,
        error: 'Homelab password settings could not be loaded. Check the server configuration.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!auth) {
    return json(
      {
        configured: false,
        authenticated: false,
        error: 'Set ADMIN_PASSWORD on the server to enable the homelab password screen.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!auth.isAuthenticated) {
    return json(
      { configured: true, authenticated: false },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const [metrics, services] = await Promise.all([
    getDashdotData()
      .then(data => ({ status: 'connected', data }))
      .catch(error => {
        console.error('Failed to load Dashdot data:', error);
        return {
          status: 'error',
          message:
            'Dashdot is temporarily unavailable. Live system data could not be loaded.',
        };
      }),
    getServiceStatuses(),
  ]);

  return json({ configured: true, authenticated: true, metrics, services }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
};

export const action = async ({ request }) => {
  checkRequestOrigin(request);

  const formData = await request.formData();
  let auth;

  try {
    auth = await getHomelabSession(request);
  } catch (error) {
    console.error(
      'Failed to load homelab authentication settings.',
      error instanceof Error ? error.name : 'Unknown error'
    );
    return json(
      { error: 'Homelab password settings could not be loaded. Check the server configuration.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!auth) {
    return json(
      { error: 'Set ADMIN_PASSWORD on the server to enable homelab access.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (auth.isAuthenticated) {
    return redirect('/homelab/dashboard', {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || password.length > 1024) {
    return json(
      { error: 'Enter a valid password.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!(await verifyAdminPassword(password, auth.authConfig.passwordHash))) {
    return json(
      { error: 'The password is incorrect.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  auth.session.set('homelabAuthenticated', true);

  return redirect('/homelab/dashboard', {
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': await auth.storage.commitSession(auth.session),
    },
  });
};
