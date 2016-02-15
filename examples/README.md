# Sidr Examples

You can see here some dummy examples with different common situations.

## Running the examples locally

Ensure that you have [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed. The best way to do it is through [NVM](https://github.com/creationix/nvm).

Ensure that you have [Ruby](https://www.ruby-lang.org/) and [RubyGems](https://rubygems.org/) installed. The best way to do it is through [RVM](https://rvm.io/).

1. Fork and clone the repo.
1. Run `gem install bundler` to install [Bundler](http://bundler.io/).
1. Run `bundle install --path=vendor/bundle` to install compass.
1. Run `npm install -g grunt-cli` to install grunt command line globally.
1. Run `npm install` to install all dependencies (including grunt).
1. Run `grunt serve` to create a local server

The browser should open automatically with the sample index.

## Example list

- [Simple Menu that closes the menu on window resize](simple-menu.html)
- [No displaced menu that closes when tapping anywhere on the screen or in a menu item](nodisplaced-menu-with-close-options.html)
- [Multiple menus on both sides with different sources](multiple-menus.html)
- [Full Width menu](full-width.html)
- [Menu with anchors instead of links](anchor-menu.html)
- [Menu with multiple callbacks](menu-with-callbacks.html)
- [Menu with fastclick disabled](only-click.html)

