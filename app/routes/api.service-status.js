import { json } from '@remix-run/node';
import { getHomelabSession } from '~/utils/homelab-auth.server';
import { getServiceStatuses } from '~/utils/service-status.server';

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

  return json(
    { services: await getServiceStatuses() },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
};
