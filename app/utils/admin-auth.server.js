import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { createCookieSessionStorage } from '@remix-run/node';
import { getServerEnv } from './env';
import {
  getPortfolioSettings,
  setPortfolioSettingIfAbsent,
} from './portfolio-settings.server';

const adminSessionCookie = '__portfolio_admin';
const passwordHashSetting = 'admin-password-hash';
const sessionSecretSetting = 'admin-session-secret';
const scrypt = promisify(scryptCallback);

export async function getAdminAuthConfig() {
  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET, DATABASE_URL } = getServerEnv();
  const settings = await getPortfolioSettings(DATABASE_URL);
  let passwordHash = settings[passwordHashSetting];

  if (!passwordHash) {
    if (!ADMIN_PASSWORD) {
      return null;
    }

    passwordHash = await hashAdminPassword(ADMIN_PASSWORD);
    passwordHash = await setPortfolioSettingIfAbsent(
      DATABASE_URL,
      passwordHashSetting,
      passwordHash
    );
  }

  let sessionSecret = settings[sessionSecretSetting];

  if (!sessionSecret) {
    sessionSecret =
      ADMIN_SESSION_SECRET || randomBytes(48).toString('base64url');

    if (sessionSecret.length < 32) {
      throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.');
    }

    sessionSecret = await setPortfolioSettingIfAbsent(
      DATABASE_URL,
      sessionSecretSetting,
      sessionSecret
    );
  }

  if (typeof sessionSecret !== 'string' || sessionSecret.length < 32) {
    throw new Error('The stored admin session secret is invalid.');
  }

  return { passwordHash, sessionSecret };
}

function createAdminSessionStorage(sessionSecret) {
  return createCookieSessionStorage({
    cookie: {
      name: adminSessionCookie,
      httpOnly: true,
      maxAge: 3_600,
      path: '/admin',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

export async function hashAdminPassword(password) {
  const salt = randomBytes(16);
  const passwordKey = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${passwordKey.toString('hex')}`;
}

export async function verifyAdminPassword(candidate, storedHash) {
  if (typeof candidate !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const [algorithm, saltHex, keyHex] = storedHash.split('$');

  if (
    algorithm !== 'scrypt' ||
    !/^[a-f0-9]{32}$/i.test(saltHex ?? '') ||
    !/^[a-f0-9]{128}$/i.test(keyHex ?? '')
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expectedKey = Buffer.from(keyHex, 'hex');
  const candidateKey = await scrypt(candidate, salt, expectedKey.length);
  return timingSafeEqual(candidateKey, expectedKey);
}

export async function getAdminSession(request, sessionSecret) {
  const storage = createAdminSessionStorage(sessionSecret);
  const session = await storage.getSession(request.headers.get('Cookie'));

  return {
    session,
    storage,
    isAuthenticated: session.get('adminAuthenticated') === true,
  };
}
