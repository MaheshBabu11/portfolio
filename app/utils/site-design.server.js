import { getServerEnv } from './env';
import {
  getPortfolioSetting,
  setPortfolioSetting,
  setPortfolioSettingIfAbsent,
} from './portfolio-settings.server';

const designs = new Set(['classic', 'murim']);
const settingName = 'site-design';

export function getDefaultSiteDesign() {
  const design = getServerEnv().DEFAULT_DESIGN || 'murim';

  if (!designs.has(design)) {
    throw new Error('DEFAULT_DESIGN must be either "classic" or "murim".');
  }

  return design;
}

function validateStoredDesign(value) {
  if (typeof value !== 'string' || !designs.has(value)) {
    throw new Error('The stored global design setting is invalid.');
  }

  return value;
}

export async function getGlobalSiteDesign(databaseUrl, defaultDesign) {
  const value = await getPortfolioSetting(databaseUrl, settingName);
  const design =
    value ?? (await setPortfolioSettingIfAbsent(databaseUrl, settingName, defaultDesign));
  return validateStoredDesign(design);
}

export async function setGlobalSiteDesign(databaseUrl, design) {
  const validDesign = validateStoredDesign(design);
  return validateStoredDesign(await setPortfolioSetting(databaseUrl, settingName, validDesign));
}
