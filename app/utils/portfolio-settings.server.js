import { neon } from '@neondatabase/serverless';

let settingsTableSetup;

function getSql(databaseUrl) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to access portfolio settings.');
  }

  return neon(databaseUrl);
}

async function ensureSettingsTable(sql) {
  settingsTableSetup ??= sql`
    CREATE TABLE IF NOT EXISTS portfolio_settings (
      name TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.catch(error => {
    settingsTableSetup = undefined;
    throw error;
  });

  await settingsTableSetup;
}

export async function getPortfolioSetting(databaseUrl, name) {
  const sql = getSql(databaseUrl);
  await ensureSettingsTable(sql);

  const [row] = await sql`
    SELECT value
    FROM portfolio_settings
    WHERE name = ${name}
    LIMIT 1
  `;

  return row?.value ?? null;
}

export async function getPortfolioSettings(databaseUrl) {
  const sql = getSql(databaseUrl);
  await ensureSettingsTable(sql);

  const rows = await sql`
    SELECT name, value
    FROM portfolio_settings
  `;

  return Object.fromEntries(rows.map(({ name, value }) => [name, value]));
}

export async function setPortfolioSettingIfAbsent(databaseUrl, name, value) {
  const sql = getSql(databaseUrl);
  await ensureSettingsTable(sql);

  const [inserted] = await sql`
    INSERT INTO portfolio_settings (name, value)
    VALUES (${name}, ${value})
    ON CONFLICT (name) DO NOTHING
    RETURNING value
  `;

  return inserted?.value ?? getPortfolioSetting(databaseUrl, name);
}

export async function setPortfolioSetting(databaseUrl, name, value) {
  const sql = getSql(databaseUrl);
  await ensureSettingsTable(sql);

  const [row] = await sql`
    INSERT INTO portfolio_settings (name, value)
    VALUES (${name}, ${value})
    ON CONFLICT (name)
    DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    RETURNING value
  `;

  return row?.value ?? null;
}
