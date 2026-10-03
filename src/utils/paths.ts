export const basePath = import.meta.env.BASE_URL

export const withBase = (path = '') => `${basePath}${path.replace(/^\/+/, '')}`
