const services = [
  {
    name: 'Paperless-ngx',
    icon: 'paperless-ngx',
    url: 'https://paperless.maheshbabu11.dev',
    endpoint: '/api/',
  },
  {
    name: 'Portainer',
    icon: 'portainer',
    url: 'https://portainer.maheshbabu11.dev',
    endpoint: '/api/status',
  },
  {
    name: 'Immich Server',
    icon: 'immich',
    url: 'https://immich.maheshbabu11.dev',
    endpoint: '/api/server/ping',
  },
  {
    name: 'Vaultwarden',
    icon: 'vaultwarden',
    url: 'https://vw.maheshbabu11.dev',
    endpoint: '/alive',
  },
  {
    name: 'Homarr',
    icon: 'homarr',
    url: 'https://homarr.maheshbabu11.dev',
    endpoint: '/',
  },
];

const signInResponses = new Set([301, 302, 303, 307, 308, 401, 403]);

const checkService = async service => {
  try {
    const response = await fetch(new URL(service.endpoint, service.url), {
      headers: { Accept: 'application/json, text/plain, */*' },
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });
    const state = response.ok || signInResponses.has(response.status)
      ? 'online'
      : response.status >= 500
        ? 'degraded'
        : 'offline';

    return {
      name: service.name,
      icon: service.icon,
      url: service.url,
      state,
    };
  } catch {
    return {
      name: service.name,
      icon: service.icon,
      url: service.url,
      state: 'offline',
    };
  }
};

export const getServiceStatuses = () => Promise.all(services.map(checkService));
