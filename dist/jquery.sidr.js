(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _helper = require('./js/helper');

var _helper2 = _interopRequireDefault(_helper);

var _view = require('./js/view');

var _view2 = _interopRequireDefault(_view);

var _status = require('./js/status');

var _status2 = _interopRequireDefault(_status);

var _sidr = require('./js/sidr');

var sidr = _interopRequireWildcard(_sidr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2016 Alberto Varela
 * Licensed under the MIT license.
 */

(function ($) {

  $.sidr = sidr.combined;

  $.fn.sidr = function (options) {

    var settings = $.extend({
      name: 'sidr', // Name for the 'sidr'
      speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side: 'left', // Accepts 'left' or 'right'
      source: null, // Override the source of the content.
      renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
      body: 'body', // Page container selector,
      displace: true, // Displace the body content or not
      onOpen: function onOpen() {}, // Callback when sidr opened
      onClose: function onClose() {} // Callback when sidr closed
    }, options),
        name = settings.name,
        $sideMenu = $('#' + name);

    // If the side menu do not exist create it
    if ($sideMenu.length === 0) {
      $sideMenu = $('<div />').attr('id', name).appendTo($('body'));
    }

    // Adding styles and options
    $sideMenu.addClass('sidr').addClass(settings.side).data({
      speed: settings.speed,
      side: settings.side,
      body: settings.body,
      displace: settings.displace,
      onOpen: settings.onOpen,
      onClose: settings.onClose
    });

    // The menu content
    if (typeof settings.source === 'function') {
      var newContent = settings.source(name);

      _view2.default.loadContent($sideMenu, newContent);
    } else if (typeof settings.source === 'string' && _helper2.default.isUrl(settings.source)) {
      $.get(settings.source, function (data) {
        _view2.default.loadContent($sideMenu, data);
      });
    } else if (typeof settings.source === 'string') {
      var htmlContent = '',
          selectors = settings.source.split(',');

      $.each(selectors, function (index, element) {
        htmlContent += '<div class="sidr-inner">' + $(element).html() + '</div>';
      });

      // Renaming ids and classes
      if (settings.renaming) {
        var $htmlContent = $('<div />').html(htmlContent);

        $htmlContent.find('*').each(function (index, element) {
          var $element = $(element);

          _helper2.default.addPrefix($element);
        });
        htmlContent = $htmlContent.html();
      }
      _view2.default.loadContent($sideMenu, htmlContent);
    } else if (settings.source !== null) {
      $.error('Invalid Sidr Source');
    }

    return this.each(function () {
      var $this = $(this),
          data = $this.data('sidr'),
          flag = false;

      // If the plugin hasn't been initialized yet
      if (!data) {
        _status2.default.moving = false;
        _status2.default.opened = false;

        $this.data('sidr', name);

        $this.bind('touchstart click', function (event) {
          event.preventDefault();

          if (!flag) {
            flag = true;
            sidr.methods.toggle(name);
            setTimeout(function () {
              flag = false;
            }, 100);
          }
        });
      }
    });
  };
})(jQuery);

},{"./js/helper":3,"./js/sidr":4,"./js/status":5,"./js/view":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = jQuery; /* eslint vars-on-top:0 */

function execute(action, name, callback) {
  // Check arguments
  if (typeof name === 'function') {
    callback = name;
    name = 'sidr';
  } else if (!name) {
    name = 'sidr';
  }

  // Declaring
  var $menu = $('#' + name),
      $body = $($menu.data('body')),
      $html = $('html'),
      menuWidth = $menu.outerWidth(true),
      speed = $menu.data('speed'),
      side = $menu.data('side'),
      displace = $menu.data('displace'),
      onOpen = $menu.data('onOpen'),
      onClose = $menu.data('onClose'),
      bodyAnimation,
      menuAnimation,
      scrollTop,
      bodyClass = name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open';

  // Open Sidr
  if ('open' === action || 'toggle' === action && !$menu.is(':visible')) {
    // Check if we can open it
    if ($menu.is(':visible') || _status2.default.moving) {
      return;
    }

    // If another menu opened close first
    if (_status2.default.opened !== false) {
      execute('close', _status2.default.opened, function () {
        execute('open', name);
      });

      return;
    }

    // Lock sidr
    _status2.default.moving = true;

    // Left or right?
    if (side === 'left') {
      bodyAnimation = { left: menuWidth + 'px' };
      menuAnimation = { left: '0px' };
    } else {
      bodyAnimation = { right: menuWidth + 'px' };
      menuAnimation = { right: '0px' };
    }

    // Prepare page if container is body
    if ($body.is('body')) {
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', 'hidden').scrollTop(scrollTop);
    }

    // Open menu
    if (displace) {
      $body.addClass('sidr-animating').css({
        width: $body.width(),
        position: 'absolute'
      }).animate(bodyAnimation, {
        queue: false,
        duration: speed,
        complete: function complete() {
          $(this).addClass(bodyClass);
        }
      });
    } else {
      setTimeout(function () {
        $body.addClass(bodyClass);
      }, speed);
    }
    $menu.css('display', 'block').animate(menuAnimation, {
      queue: false,
      duration: speed,
      complete: function complete() {
        _status2.default.moving = false;
        _status2.default.opened = name;
        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
        $body.removeClass('sidr-animating');
      }
    });

    // onOpen callback
    onOpen();

    // When closing sidr
  } else {
      // Check if we can close it
      if (!$menu.is(':visible') || _status2.default.moving) {
        return;
      }

      // Lock sidr
      _status2.default.moving = true;

      // Right or left menu?
      if (side === 'left') {
        bodyAnimation = { left: 0 };
        menuAnimation = { left: '-' + menuWidth + 'px' };
      } else {
        bodyAnimation = { right: 0 };
        menuAnimation = { right: '-' + menuWidth + 'px' };
      }

      // Close menu
      if ($body.is('body')) {
        scrollTop = $html.scrollTop();
        $html.css('overflow-x', '').scrollTop(scrollTop);
      }
      $body.addClass('sidr-animating').animate(bodyAnimation, {
        queue: false,
        duration: speed
      }).removeClass(bodyClass);
      $menu.animate(menuAnimation, {
        queue: false,
        duration: speed,
        complete: function complete() {
          $menu.removeAttr('style').hide();
          $body.css({
            width: '',
            position: '',
            right: '',
            left: ''
          });
          $('html').css('overflow-x', '');
          _status2.default.moving = false;
          _status2.default.opened = false;
          // Callback
          if (typeof callback === 'function') {
            callback(name);
          }
          $body.removeClass('sidr-animating');
        }
      });

      // onClose callback
      onClose();
    }
}

exports.default = execute;

},{"./status":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var helper = {
  // Check for valids urls
  // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url

  isUrl: function isUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  },

  // Add sidr prefixes
  addPrefix: function addPrefix($element) {
    var elementId = $element.attr('id'),
        elementClass = $element.attr('class');

    if (typeof elementId === 'string' && '' !== elementId) {
      $element.attr('id', elementId.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-id-$1'));
    }

    if (typeof elementClass === 'string' && '' !== elementClass && 'sidr-inner' !== elementClass) {
      $element.attr('class', elementClass.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-class-$1'));
    }

    $element.removeAttr('style');
  }
};

exports.default = helper;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combined = exports.methods = undefined;

var _execute = require('./execute');

var _execute2 = _interopRequireDefault(_execute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i,
    $ = jQuery,
    publicMethods = ['open', 'close', 'toggle'],
    methodName,
    methods = {},
    getMethod = function getMethod(methodName) {
  return function (name, callback) {
    (0, _execute2.default)(methodName, name, callback);
  };
};

for (i = 0; i <= publicMethods.length; i++) {
  methodName = publicMethods[i];
  methods[methodName] = getMethod(methodName);
}

function combined(method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments);
  } else {
    $.error('Method ' + method + ' does not exist on jQuery.sidr');
  }
}

exports.methods = methods;
exports.combined = combined;

},{"./execute":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sidrStatus = {
    moving: false,
    opened: false
};

exports.default = sidrStatus;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var view = {
    // Loads the content into the menu bar

    loadContent: function loadContent($menu, content) {
        $menu.html(content);
    }
};

exports.default = view;

},{}]},{},[1]);
