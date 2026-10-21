import { json } from '@remix-run/node';
import { getDashdotData } from '~/utils/dashdot.server';
import { getHomelabSession } from '~/utils/homelab-auth.server';

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
      { error: 'Homelab authentication is unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!auth?.isAuthenticated) {
    return json(
      { error: 'Authentication required.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    return json(
      { status: 'connected', data: await getDashdotData() },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (error) {
    console.error('Failed to refresh Dashdot data:', error);

    return json(
      {
        status: 'error',
        message: 'Dashdot is temporarily unavailable. Showing the last successful snapshot.',
      },
      { status: 502, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
};
