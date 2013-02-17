# Contributing

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

### Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that grunt is installed globally by running `grunt --version` at the command-line.  If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._

_Note that in Windows, you may have to run `grunt.cmd` instead of `grunt`._

1. Fork and clone the repo.
1. Run `npm install` to install all dependencies (including grunt).
1. Run `grunt` to grunt this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Fix stuff.
1. Add examples if you are adding a new feature.
1. Run `grunt` to see if there are warnings/errors.
1. Push to your fork and submit a pull request.
