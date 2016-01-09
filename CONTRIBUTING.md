# Contributing

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

### Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code

Ensure that you have [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed. The best way to do it is through [NVM](https://github.com/creationix/nvm).

Ensure that you have [Ruby](https://www.ruby-lang.org/) and [RubyGems](https://rubygems.org/) installed. The best way to do it is through [RVM](https://rvm.io/).

1. Fork and clone the repo.
1. Run `gem install bundler` to install [Bundler](http://bundler.io/).
1. Run `bundle install --path=vendor/bundle` to install compass.
1. Run `npm install -g grunt-cli` to install grunt command line globally.
1. Run `npm install` to install all dependencies (including grunt).
1. Run `grunt` to grunt this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Fix stuff.
1. Add examples if you are adding a new feature.
1. Run `grunt` to see if there are warnings/errors.
1. Push to your fork and submit a pull request.
