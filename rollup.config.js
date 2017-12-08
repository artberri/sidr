import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

let today = new Date()
let month = (today.getMonth() + 1).toString().padStart(2, '0')
let day = today.getDate().toString().padStart(2, '0')
let year = today.getFullYear()
let banner = `/*! ${pkg.title || pkg.name} - v${pkg.version} - ${year}-${month}-${day}
  ${pkg.homepage}
  * Copyright (c) 2013-${year} ${pkg.author.name}; Licensed ${pkg.license} */`

export default [{
  banner,
  input: 'src/jquery.sidr.js',
  globals: {
    jquery: 'jQuery'
  },
  output: {
    format: 'iife',
    file: './dist/jquery.sidr.js'
  },
  plugins: [
    babel(babelrc())
  ]
}, {
  banner,
  input: 'src/jquery.sidr.js',
  globals: {
    jquery: 'jQuery'
  },
  output: {
    format: 'iife',
    file: './dist/jquery.sidr.min.js'
  },
  plugins: [
    babel(babelrc()),
    uglify({
      output: {
        comments: /^!/
      }
    })
  ]
}, {
  banner,
  input: 'src/sidr.js',
  output: {
    format: 'iife',
    file: './dist/sidr.js'
  },
  plugins: [
    babel(babelrc())
  ]
}, {
  banner,
  input: 'src/sidr.js',
  output: {
    format: 'iife',
    file: './dist/sidr.min.js'
  },
  plugins: [
    babel(babelrc()),
    uglify({
      output: {
        comments: /^!/
      }
    })
  ]
}]
