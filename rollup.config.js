import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

let today = new Date()
let month = (today.getMonth() + 1).toString().padStart(2, '0')
let day = today.getDate().toString().padStart(2, '0')
let year = today.getFullYear()

let baseConfig = {
  banner: `/*! ${pkg.title || pkg.name} - v${pkg.version} - ${year}-${month}-${day}
    ${pkg.homepage}
    * Copyright (c) 2013-${year} ${pkg.author.name}; Licensed ${pkg.license} */`,
  input: 'src/jquery.sidr.js',
  globals: {
    jquery: 'jQuery'
  }
}

let unminifiedConfig = Object.assign({}, baseConfig)
unminifiedConfig.output = {
  format: 'iife',
  file: './dist/jquery.sidr.js'
}
unminifiedConfig.plugins = [
  babel(babelrc())
]

let minifiedConfig = Object.assign({}, baseConfig)
minifiedConfig.output = {
  format: 'iife',
  file: './dist/jquery.sidr.min.js'
}
minifiedConfig.plugins = [
  babel(babelrc()),
  uglify({
    output: {
      comments: /^!/
    }
  })
]
minifiedConfig.plugins.push()

export default [unminifiedConfig, minifiedConfig]
