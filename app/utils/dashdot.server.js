import { getServerEnv } from './env';

const defaultDashdotUrl = 'https://dashdot.maheshbabu11.dev';

const toNumber = value =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const fetchJson = async (baseUrl, endpoint) => {
  const response = await fetch(new URL(endpoint, baseUrl), {
    headers: { Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Dashdot returned ${response.status} for ${endpoint}.`);
  }

  return response.json();
};

export const getDashdotData = async () => {
  const baseUrl = new URL(getServerEnv().DASHDOT_URL || defaultDashdotUrl);

  if (
    !['http:', 'https:'].includes(baseUrl.protocol) ||
    baseUrl.username ||
    baseUrl.password
  ) {
    throw new Error('DASHDOT_URL must be an HTTP(S) URL without credentials.');
  }

  const [info, cpuLoad, ramLoad, storageLoad, networkLoad] = await Promise.all([
    fetchJson(baseUrl, '/info'),
    fetchJson(baseUrl, '/load/cpu'),
    fetchJson(baseUrl, '/load/ram'),
    fetchJson(baseUrl, '/load/storage'),
    fetchJson(baseUrl, '/load/network'),
  ]);

  if (
    !info?.os ||
    !info?.cpu ||
    !info?.ram ||
    !Array.isArray(info.storage) ||
    !Array.isArray(cpuLoad) ||
    !Array.isArray(storageLoad) ||
    !ramLoad ||
    typeof ramLoad !== 'object' ||
    !networkLoad ||
    typeof networkLoad !== 'object'
  ) {
    throw new Error('Dashdot returned data in an unexpected format.');
  }

  const cpuLoads = cpuLoad
    .filter(core => core && typeof core === 'object')
    .map(({ load, temp, core }) => ({
      load: toNumber(load),
      temperature: toNumber(temp),
      core: toNumber(core),
    }))
    .filter(core => core.load !== null);

  const averageCpuLoad = cpuLoads.length
    ? cpuLoads.reduce((total, core) => total + core.load, 0) / cpuLoads.length
    : null;
  const temperatures = cpuLoads
    .map(core => core.temperature)
    .filter(temperature => temperature !== null);

  return {
    checkedAt: new Date().toISOString(),
    os: {
      distro: typeof info.os.distro === 'string' ? info.os.distro : 'Unknown',
      release: typeof info.os.release === 'string' ? info.os.release : '',
      uptimeSeconds: toNumber(info.os.uptime),
      dashdotVersion:
        typeof info.os.dash_version === 'string' ? info.os.dash_version : 'Unknown',
    },
    cpu: {
      brand: typeof info.cpu.brand === 'string' ? info.cpu.brand : '',
      model: typeof info.cpu.model === 'string' ? info.cpu.model : 'CPU',
      cores: toNumber(info.cpu.cores),
      threads: toNumber(info.cpu.threads),
      frequencyGHz: toNumber(info.cpu.frequency),
      averageLoad: averageCpuLoad,
      maximumTemperature: temperatures.length ? Math.max(...temperatures) : null,
      loads: cpuLoads,
    },
    ram: {
      totalBytes: toNumber(info.ram.size),
      usedBytes: toNumber(ramLoad.load),
    },
    storage: info.storage.map((disk, index) => ({
      name:
        disk?.disks
          ?.map(item => [item.brand, item.device].filter(Boolean).join(' · '))
          .filter(Boolean)
          .join(', ') || `Storage ${index + 1}`,
      type: disk?.disks?.map(item => item.type).filter(Boolean).join(', ') || '',
      totalBytes: toNumber(disk?.size),
      usedBytes: toNumber(storageLoad[index]),
    })),
    network: {
      type: typeof info.network?.type === 'string' ? info.network.type : '',
      interfaceSpeedMbps: toNumber(info.network?.interfaceSpeed),
      uploadBytesPerSecond: toNumber(networkLoad.up),
      downloadBytesPerSecond: toNumber(networkLoad.down),
    },
  };
};
