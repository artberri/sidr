module.exports = (ctx) => ({
  plugins: {
    stylelint: ctx.env !== 'minify' ? {} : false,
    'postcss-import': ctx.env !== 'minify' ? {
      root: 'src/css'
    } : false,
    'postcss-cssnext': ctx.env !== 'minify' ? {
      browsers: ['last 2 versions', 'iOS >= 8']
    } : false,
    'cssnano': ctx.env === 'minify' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }]
    } : false
  }
})
