const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  output: 'export',
  experimental: {
    appDir: false,
  },
  images: {
    unoptimized: true,
  }
})
