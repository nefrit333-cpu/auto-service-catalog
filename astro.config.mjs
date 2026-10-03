import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://nefrit333-cpu.github.io',
  base: '/auto-service-catalog/',
  output: 'static',
  build: {
    format: 'directory',
  },
})
