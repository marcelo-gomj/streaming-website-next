module.exports = {
  reactStrictMode: true,
  swcMinify: true,

  // allow images of themoviedb
  images : {
    domains: ['image.tmdb.org'],
  },
  
  webpack( config, { dev, isServer }) {
    // allow nextjs to load svg files
    config.module.rules.push({
      test: /.svg$/,
      use: ['@svgr/webpack']
    })

    // // add Preact in production build
    // if (!dev && !isServer) {
    //   config.resolve.alias = {
    //     ...config.resolve.alias,
    //     "react/jsx-runtime.js": "preact/compat/jsx-runtime",
    //     react: "preact/compat",
    //     "react-dom/test-utils": "preact/test-utils",
    //     "react-dom": "preact/compat",
    //   }
    // }

    return config
  } 
}
