import { neon } from '@neondatabase/serverless';
import { json } from '@remix-run/node';
import { getServerEnv } from '~/utils/env';

const counterName = 'homepage-views';
let tableSetup;

async function incrementHomepageViews(databaseUrl) {
  const sql = neon(databaseUrl);

  tableSetup ??= sql`
    CREATE TABLE IF NOT EXISTS portfolio_counters (
      name TEXT PRIMARY KEY,
      value BIGINT NOT NULL DEFAULT 0 CHECK (value >= 0)
    )
  `.catch(error => {
    tableSetup = undefined;
    throw error;
  });

  await tableSetup;

  const [row] = await sql`
    INSERT INTO portfolio_counters (name, value)
    VALUES (${counterName}, 1)
    ON CONFLICT (name)
    DO UPDATE SET value = portfolio_counters.value + 1
    RETURNING value::text AS value
  `;
  const value = Number(row?.value);

  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('Neon returned an invalid homepage view count.');
  }

  return value;
}

export async function loader() {
  const { DATABASE_URL } = getServerEnv();
  let visitorCount = null;

  if (!DATABASE_URL) {
    console.error('Homepage visitor counter is not configured. Set DATABASE_URL.');
  } else {
    try {
      visitorCount = await incrementHomepageViews(DATABASE_URL);
    } catch (error) {
      console.error(
        'Failed to increment the Neon homepage view counter.',
        error instanceof Error ? error.name : 'Unknown error',
      );
    }
  }

  return json(
    { visitorCount },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
