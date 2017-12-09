# Changelog

## 3.0.0 XXXX-XX-XX (Unreleased)

New features:

- jQuery is not needed anymore, now, Sidr is just a JS library which is available also as a jQuery Plugin
- `left`/`right` transforms replaced with CSS3 2D Transforms (translateX) (TODO)
- New `reload` method to make easier to handle dynamic data, eliminating the need of destroying it and reinstantiate the slider. Thanks to @liladani: <https://github.com/artberri/sidr/pull/176> (TODO)
- New displace format resizing body. Thanks to @p0lar-bear: <https://github.com/artberri/sidr/pull/150> (TODO)
- Allow to keep menus opened. Thanks to @wtfred: https://github.com/artberri/sidr/pull/181 (TODO)

Breaking changes:

- Option 'bind' (event that triggers the menu) allows only a single event
- Default value for 'bind' (event that triggers the menu) is now `click` (it was `touchstart click`, both)
- Drop support for browsers not supporting animations
- Classes added to the menus change from `left` and `right` to `sidr-left` and `sidr-right` to avoid collisions
- Supports only browsers that natively support the following features:
  - <https://caniuse.com/#search=querySelectorAll>
  - <https://caniuse.com/#feat=classlist>
  - <https://caniuse.com/#search=transitions>
  - <https://caniuse.com/#search=CSS3%202D%20Transforms>

Internals:

- Update dev dependencies
- Switch from Grunt to NPM Scripts
- Switch from SASS + COMPASS to PostCSS
- Switch from PhantomJS to Headless Chrome for testing

## 2.2.1 2016-02-17

Bug fixes:

- Removed the preinstall script that was generating problems when installing from npm

## 2.2.0 2016-02-16

New features:

- Added `bind` option that can be used to change the button event that will trigger the menu toggle
- Added the `status` method to get the Sidr status object

From this version the bundling is done with rollup instead of browserify.

## 2.1.0 2016-01-20

New features:

- Now it works with CSS3 transitions by default and fallbacks to jQuery.animate when not supported
- Added `timing` option that can be used to indicate the transition timing function for the CSS3 transitions
- Added `method` option to change the default behaviour of the button (that is currently the toggle method)
- Added `onOpenEnd` option to add a callback that will be fired when the menu ends opening
- Added `onCloseEnd` option to add a callback that will be fired when the menu ends closing

Bug fixes:

- Launch callback when a menu open is delayed until another one is closed
- Fixes bug introduced in 2.0.0 that added a method called 'undefined' in addition to the methods close, open, toggle

This version has a complete code refactor for code quality improvements:

- ES2015 syntax supported
- jquery.sidr.js file split
- Start Unit testing

## 2.0.0 2016-01-10

**Breaking changes** that require major version incrementation:

- Removing position:absolute fallback that added support for very old mobile browsers
- Removing toogle method that was a typo, use toggle instead

Bug fixes:

- Fixing tap event on touchscreen devices
- Removing unnecessary compass mixins
- Fixes reinitalization
- Adding example
- Fixing bower structure
- Adding continous integration
- Fixing adding body classes when no displacing
- Removing only the needed styles from html and body tag

## 1.2.1 2013-11-06

- Fixing tap event on touch devices

## 1.2.0 2013-11-05

- Adding bind to tap event if exists instead of click    (faster)
- Fixed reopening menu bug in some browsers and jQuery versions
- Add a body class when the sidr menu is open and when animating
- Fixing the toogle/toggle typo
- Adds an option to allow choosing between displace or not the content (displace)
- Added callbacks for onOpen and onClose

## 1.1.1 2013-03-13

- Fix bug when closing sidr programatically

## 1.1.0 - 2013-03-11

- Added the `body` option

## 1.0.0 - 2013-02-20

- First public version
