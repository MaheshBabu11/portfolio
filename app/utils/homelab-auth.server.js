import { createCookieSessionStorage } from '@remix-run/node';
import { getAdminAuthConfig } from './admin-auth.server';

function createHomelabSessionStorage(sessionSecret) {
  return createCookieSessionStorage({
    cookie: {
      name: '__portfolio_homelab',
      httpOnly: true,
      maxAge: 3_600,
      path: '/',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

export async function getHomelabSession(request) {
  const authConfig = await getAdminAuthConfig();

  if (!authConfig) return null;

  const storage = createHomelabSessionStorage(authConfig.sessionSecret);
  const session = await storage.getSession(request.headers.get('Cookie'));

  return {
    authConfig,
    session,
    storage,
    isAuthenticated: session.get('homelabAuthenticated') === true,
  };
}
