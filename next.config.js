module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images : {
    domains: ['image.tmdb.org'],
  },
  
  webpack( config, { dev, isServer }) {
    config.module.rules.push({
      test: /.svg$/,
      use: ['@svgr/webpack']
    })

    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      }
    }

    return config
  } 
}
