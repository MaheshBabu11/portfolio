export const getServerEnv = context =>
  context.cloudflare?.env ?? (typeof process === 'undefined' ? {} : process.env);
