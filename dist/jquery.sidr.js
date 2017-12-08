/*! sidr - v3.0.0 - 2017-12-08
  http://www.berriart.com/sidr/
  * Copyright (c) 2013-2017 Alberto Varela; Licensed MIT */
(function () {
'use strict';

var store = {};

var store$1 = {
  add: function add(key, value) {
    store[key] = value;
  },
  get: function get(key) {
    return store[key];
  }
};

function execute(action, name, callback) {
  var menu = store$1.get(name);

  switch (action) {
    case 'open':
      menu.open(callback);
      break;
    case 'close':
      menu.close(callback);
      break;
    case 'toggle':
      menu.toggle(callback);
      break;
    default:
      console.error('Method ' + action + ' does not exist on sidr');
      break;
  }
}

var sidrStatus = {
  moving: false,
  opened: false
};

var i = void 0;
var $ = jQuery;
var publicMethods = ['open', 'close', 'toggle'];
var methodName = void 0;
var methods = {};
var getMethod = function getMethod(methodName) {
  return function (name, callback) {
    // Check arguments
    if (typeof name === 'function') {
      callback = name;
      name = 'sidr';
    } else if (!name) {
      name = 'sidr';
    }

    execute(methodName, name, callback);
  };
};

for (i = 0; i < publicMethods.length; i++) {
  methodName = publicMethods[i];
  methods[methodName] = getMethod(methodName);
}

function sidr(method) {
  if (method === 'status') {
    return sidrStatus;
  } else if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments);
  } else {
    $.error('Method ' + method + ' does not exist on jQuery.sidr');
  }
}

var helper = {
  // Check for valids urls
  // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
  isUrl: function isUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (pattern.test(str)) {
      return true;
    } else {
      return false;
    }
  },


  // Add sidr prefixes
  addPrefixes: function addPrefixes($element) {
    this.addPrefix($element, 'id');
    this.addPrefix($element, 'class');
    $element.removeAttr('style');
  },
  addPrefix: function addPrefix($element, attribute) {
    var toReplace = $element.attr(attribute);

    if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
      $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.-]+)/g, 'sidr-' + attribute + '-$1'));
    }
  },


  // Check if transitions is supported
  transitions: function () {
    var body = document.body || document.documentElement;
    var style = body.style;
    var supported = false;
    var property = 'transition';

    if (property in style) {
      supported = true;
    } else {
      var prefixes = ['moz', 'webkit', 'o', 'ms'];
      var prefix = void 0;
      var i = void 0;

      property = property.charAt(0).toUpperCase() + property.substr(1);
      supported = function () {
        for (i = 0; i < prefixes.length; i++) {
          prefix = prefixes[i];
          if (prefix + property in style) {
            return true;
          }
        }

        return false;
      }();
      property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
    }

    return {
      supported: supported,
      property: property
    };
  }()
};

var $$1 = jQuery;

function fillContent($sideMenu, settings) {
  // The menu content
  if (typeof settings.source === 'function') {
    var newContent = settings.source(name);

    $sideMenu.html(newContent);
  } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
    $$1.get(settings.source, function (data) {
      $sideMenu.html(data);
    });
  } else if (typeof settings.source === 'string') {
    var htmlContent = '';
    var selectors = settings.source.split(',');

    $$1.each(selectors, function (index, element) {
      htmlContent += '<div class="sidr-inner">' + $$1(element).html() + '</div>';
    });

    // Renaming ids and classes
    if (settings.renaming) {
      var $htmlContent = $$1('<div />').html(htmlContent);

      $htmlContent.find('*').each(function (index, element) {
        var $element = $$1(element);

        helper.addPrefixes($element);
      });
      htmlContent = $htmlContent.html();
    }

    $sideMenu.html(htmlContent);
  } else if (settings.source !== null) {
    $$1.error('Invalid Sidr Source');
  }

  return $sideMenu;
}

function fnSidr(options) {
  var transitions = helper.transitions;
  var settings = $$1.extend({
    name: 'sidr', // Name for the 'sidr'
    speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
    side: 'left', // Accepts 'left' or 'right'
    source: null, // Override the source of the content.
    renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
    body: 'body', // Page container selector,
    displace: true, // Displace the body content or not
    timing: 'ease', // Timing function for CSS transitions
    method: 'toggle', // The method to call when element is clicked
    bind: 'touchstart click', // The event(s) to trigger the menu
    onOpen: function onOpen() {},
    // Callback when sidr start opening
    onClose: function onClose() {},
    // Callback when sidr start closing
    onOpenEnd: function onOpenEnd() {},
    // Callback when sidr end opening
    onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

  }, options);
  var name = settings.name;
  var $sideMenu = $$1('#' + name);

  // If the side menu do not exist create it
  if ($sideMenu.length === 0) {
    $sideMenu = $$1('<div />').attr('id', name).appendTo($$1('body'));
  }

  // Add transition to menu
  $sideMenu.css(transitions.property, settings.side + ' ' + settings.speed / 1000 + 's ' + settings.timing);

  // Adding styles and options
  $sideMenu.addClass('sidr').addClass('sidr-' + settings.side).data({
    speed: settings.speed,
    side: settings.side,
    body: settings.body,
    displace: settings.displace,
    timing: settings.timing,
    method: settings.method,
    onOpen: settings.onOpen,
    onClose: settings.onClose,
    onOpenEnd: settings.onOpenEnd,
    onCloseEnd: settings.onCloseEnd
  });

  $sideMenu = fillContent($sideMenu, settings);

  return this.each(function () {
    var $this = $$1(this);
    var data = $this.data('sidr');
    var flag = false;

    // If the plugin hasn't been initialized yet
    if (!data) {
      sidrStatus.moving = false;
      sidrStatus.opened = false;

      $this.data('sidr', name);

      $this.bind(settings.bind, function (event) {
        event.preventDefault();

        if (!flag) {
          flag = true;
          sidr(settings.method, name);

          setTimeout(function () {
            flag = false;
          }, 100);
        }
      });
    }
  });
}

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2017 Alberto Varela
 * Licensed under the MIT license.
 */

jQuery.sidr = sidr;
jQuery.fn.sidr = fnSidr;

}());
