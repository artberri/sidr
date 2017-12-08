module.exports = (ctx) => ({
  plugins: {
    stylelint: ctx.env !== 'minify' ? {} : false,
    'postcss-import': ctx.env !== 'minify' ? {
      root: 'src/css'
    } : false,
    'postcss-cssnext': ctx.env !== 'minify' ? {
      browsers: ['last 2 versions', 'IE >= 10', 'Safari >= 6', 'iOS >= 5', '> 1%', 'Android >= 3']
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
