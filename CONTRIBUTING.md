# Contributing

## Important notes

Please don't edit files in the `dist` subdirectory as they are generated via npm-scripts. You'll find source code in the `src` subdirectory!

### Code style

Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code

Ensure that you have [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed. The best way to do it is through [NVM](https://github.com/creationix/nvm).

1. Fork and clone the repo.
1. Run `npm install` to install all dependencies (including grunt).
1. Run `npm run serve` to develop while watching changes
1. Run `npm run dist` to ensure files are linted/tested and that the project builds properly

Assuming that you don't see any red, you're ready to go.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Fix stuff.
1. Add examples if you are adding a new feature.
1. Run `npm run dist` to see if there are warnings/errors.
1. Push to your fork and submit a pull request.
