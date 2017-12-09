/*! sidr - v3.0.0 - 2017-12-09
  http://www.berriart.com/sidr/
  * Copyright (c) 2013-2017 Alberto Varela; Licensed MIT */
(function () {
'use strict';

var defaultOptions = {
  name: 'sidr', // Name for the 'sidr'
  speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
  side: 'left', // Accepts 'left' or 'right'
  source: null, // Override the source of the content.
  renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
  body: 'body', // Page container selector,
  displace: true, // Displace the body content or not
  timing: 'ease', // Timing function for CSS transitions
  method: 'toggle', // The method to call when element is clicked
  bind: 'click', // The event to trigger the menu
  onOpen: function onOpen() {},
  // Callback when sidr start opening
  onClose: function onClose() {},
  // Callback when sidr start closing
  onOpenEnd: function onOpenEnd() {},
  // Callback when sidr end opening
  onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

};

var store = {};

var store$1 = {
  add: function add(key, value) {
    store[key] = value;
  },
  get: function get(key) {
    return store[key];
  }
};

var utils = {
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
  extend: function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },
  fetch: function fetch(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.responseText);
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }
};

function addPrefix(item, attribute) {
  var toReplace = item.getAttribute(attribute);

  if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
    item.setAttribute(attribute, toReplace.replace(/([A-Za-z0-9_.-]+)/g, 'sidr-' + attribute + '-$1'));
  }
}

var dom = {
  id: function id(elementId) {
    return document.getElementById(elementId);
  },
  qs: function qs(selector) {
    return document.querySelector(selector);
  },
  qsa: function qsa(selectors) {
    return document.querySelectorAll(selectors);
  },
  bind: function bind(element, event, callback) {
    element.addEventListener(event, callback, false);
  },
  unbind: function unbind(element, event, callback) {
    element.removeEventListener(event, callback, false);
  },
  createMenu: function createMenu(elementId) {
    var elem = document.createElement('div');
    elem.id = elementId;
    document.body.appendChild(elem);

    return elem;
  },
  replaceHTML: function replaceHTML(element, content) {
    element.innerHTML = content;

    return element;
  },
  getHTMLContent: function getHTMLContent(selectors) {
    var htmlContent = '';
    var items = this.qsa(selectors);

    for (var i = 0; i < items.length; i++) {
      htmlContent += '<div class="sidr-inner">' + items[i].innerHTML + '</div>';
    }

    return htmlContent;
  },
  addPrefixes: function addPrefixes(htmlContent) {
    var elem = document.createElement('div');
    elem.innerHTML = htmlContent;

    var items = elem.querySelectorAll('*');
    for (var i = 0; i < items.length; i++) {
      addPrefix(items[i], 'id');
      addPrefix(items[i], 'class');
      items[i].removeAttribute('style');
    }

    return elem.innerHTML;
  },


  transitions: function () {
    var body = document.body || document.documentElement;
    var style = body.style;
    var supported = false;
    var property = 'transition';
    var cssProperty = 'transition';
    var event = 'transitionend';

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
      cssProperty = supported ? prefix + property : null;
      property = supported ? '-' + prefix + '-' + property.toLowerCase() : null;
      if (prefix === 'webkit') {
        event = 'webkitTransitionEnd';
      } else if (prefix === '0') {
        event = 'oTransitionEnd';
      }
    }

    return {
      cssProperty: cssProperty,
      supported: supported,
      property: property,
      event: event
    };
  }()
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var bodyAnimationClass = 'sidr-animating';
var openAction = 'open';

var Body = function () {
  function Body(settings, menuWidth) {
    classCallCheck(this, Body);

    this.name = settings.name;
    this.item = dom.qs(settings.body);
    this.side = settings.side;
    this.speed = settings.speed;
    this.timing = settings.timing;
    this.displace = settings.displace;
    this.menuWidth = menuWidth;
  }

  createClass(Body, [{
    key: 'prepare',
    value: function prepare(action) {
      var prop = action === openAction ? 'hidden' : '';

      // Prepare page if container is body
      if (this.item.tagName === 'BODY') {
        var html = dom.qs('html');
        var scrollTop = html.scrollTop;

        html.style.overflowX = prop;
        html.scrollTop = scrollTop;
      }
    }
  }, {
    key: 'unprepare',
    value: function unprepare() {
      if (this.item.tagName === 'BODY') {
        var html = dom.qs('html');
        html.style.overflowX = '';
      }
    }
  }, {
    key: 'move',
    value: function move(action) {
      this.item.classList.add(bodyAnimationClass);
      if (action === openAction) {
        this.open();
      } else {
        this.close();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      if (this.displace) {
        var transitions = dom.transitions;
        var item = this.item;

        item.style[transitions.cssProperty] = this.side + ' ' + this.speed / 1000 + 's ' + this.timing;
        item.style[this.side] = 0;
        item.style.width = item.offsetWidth + 'px';
        item.style.position = 'absolute';
        item.style[this.side] = this.menuWidth + 'px';
      }
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      var transitions = dom.transitions;
      var item = this.item;

      item.style[transitions.cssProperty] = '';
      item.style.right = '';
      item.style.left = '';
      item.style.width = '';
      item.style.position = '';

      dom.unbind(item, transitions.event, this.temporalCallback);
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.displace) {
        var transitions = dom.transitions;
        var item = this.item;

        item.style[this.side] = 0;
        var self = this;
        this.temporalCallback = function () {
          self.onClose();
        };
        dom.bind(item, transitions.event, this.temporalCallback);
      }
    }
  }, {
    key: 'removeAnimationClass',
    value: function removeAnimationClass() {
      this.item.classList.remove(bodyAnimationClass);
    }
  }, {
    key: 'removeOpenClass',
    value: function removeOpenClass() {
      this.item.classList.remove('sidr-open');
      if (this.name !== 'sidr') {
        this.item.classList.remove(this.name + '-open');
      }
    }
  }, {
    key: 'addOpenClass',
    value: function addOpenClass() {
      this.item.classList.add('sidr-open');
      if (this.name !== 'sidr') {
        this.item.classList.add(this.name + '-open');
      }
    }
  }]);
  return Body;
}();

var sidrStatus = {
  moving: false,
  opened: false
};

var Menu = function () {
  function Menu(settings) {
    classCallCheck(this, Menu);

    this.name = settings.name;
    this.speed = settings.speed;
    this.side = settings.side;
    this.displace = settings.displace;
    this.source = settings.source;
    this.timing = settings.timing;
    this.method = settings.method;
    this.renaming = settings.renaming;
    this.onOpenCallback = settings.onOpen;
    this.onCloseCallback = settings.onClose;
    this.onOpenEndCallback = settings.onOpenEnd;
    this.onCloseEndCallback = settings.onCloseEnd;

    this.init(settings);
  }

  createClass(Menu, [{
    key: 'init',
    value: function init(settings) {
      var name = this.name;
      var sideMenu = dom.id(name);

      // If the side menu do not exist create it
      if (!sideMenu) {
        sideMenu = dom.createMenu(name);
      }

      // Add transition to menu
      sideMenu.style[dom.transitions.cssProperty] = this.side + ' ' + this.speed / 1000 + 's ' + this.timing;
      // Add required classes
      sideMenu.classList.add('sidr');
      sideMenu.classList.add('sidr-' + this.side);

      this.item = sideMenu;
      this.fillWithContent();
      this.body = new Body(settings, this.item.offsetWidth);
    }
  }, {
    key: 'fillWithContent',
    value: function fillWithContent() {
      var _this = this;

      if (typeof this.source === 'function') {
        var newContent = this.source(name);
        dom.replaceHTML(this.item, newContent);
      } else if (typeof this.source === 'string' && utils.isUrl(this.source)) {
        utils.fetch(this.source, function (newContent) {
          dom.replaceHTML(_this.item, newContent);
        });
      } else if (typeof this.source === 'string') {
        var htmlContent = dom.getHTMLContent(this.source);

        if (this.renaming) {
          htmlContent = dom.addPrefixes(htmlContent);
        }

        dom.replaceHTML(this.item, htmlContent);
      } else if (this.source !== null) {
        console.error('Invalid Sidr Source');
      }
    }
  }, {
    key: 'move',
    value: function move(action, callback) {
      // Lock sidr
      sidrStatus.moving = true;

      this.body.prepare(action);
      this.body.move(action);
      this.moveMenu(action, callback);
    }
  }, {
    key: 'open',
    value: function open(callback) {
      var _this2 = this;

      // Check if is already opened or moving
      if (sidrStatus.opened === this.name || sidrStatus.moving) {
        return;
      }

      // If another menu opened close first
      if (sidrStatus.opened !== false) {
        var alreadyOpenedMenu = store$1.get(sidrStatus.opened);

        alreadyOpenedMenu.close(function () {
          _this2.open(callback);
        });

        return;
      }

      this.move('open', callback);

      // onOpen callback
      this.onOpenCallback();
    }
  }, {
    key: 'close',
    value: function close(callback) {
      // Check if is already closed or moving
      if (sidrStatus.opened !== this.name || sidrStatus.moving) {
        return;
      }

      this.move('close', callback);

      // onClose callback
      this.onCloseCallback();
    }
  }, {
    key: 'toggle',
    value: function toggle(callback) {
      if (sidrStatus.opened === this.name) {
        this.close(callback);
      } else {
        this.open(callback);
      }
    }
  }, {
    key: 'onOpenMenu',
    value: function onOpenMenu(callback) {
      var name = this.name;

      sidrStatus.moving = false;
      sidrStatus.opened = name;

      dom.unbind(this.item, dom.transitions.event, this.temporalOpenMenuCallback);

      this.body.removeAnimationClass();
      this.body.addOpenClass();

      this.onOpenEndCallback();

      if (typeof callback === 'function') {
        callback(name);
      }
    }
  }, {
    key: 'openMenu',
    value: function openMenu(callback) {
      var item = this.item;

      item.style[this.side] = 0;
      var self = this;
      this.temporalOpenMenuCallback = function () {
        self.onOpenMenu(callback);
      };
      dom.bind(item, dom.transitions.event, this.temporalOpenMenuCallback);
    }
  }, {
    key: 'onCloseMenu',
    value: function onCloseMenu(callback) {
      var item = this.item;

      dom.unbind(item, dom.transitions.event, this.temporalCloseMenuCallback);
      item.style.left = '';
      item.style.right = '';
      this.body.unprepare();

      sidrStatus.moving = false;
      sidrStatus.opened = false;

      this.body.removeAnimationClass();
      this.body.removeOpenClass();

      this.onCloseEndCallback();

      // Callback
      if (typeof callback === 'function') {
        callback(name);
      }
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu(callback) {
      var item = this.item;

      item.style[this.side] = '';

      var self = this;
      this.temporalCloseMenuCallback = function () {
        self.onCloseMenu(callback);
      };
      dom.bind(item, dom.transitions.event, this.temporalCloseMenuCallback);
    }
  }, {
    key: 'moveMenu',
    value: function moveMenu(action, callback) {
      if (action === 'open') {
        this.openMenu(callback);
      } else {
        this.closeMenu(callback);
      }
    }
  }]);
  return Menu;
}();

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

var methods = {};
var publicMethods = ['open', 'close', 'toggle'];
for (var i = 0; i < publicMethods.length; i++) {
  var methodName = publicMethods[i];
  methods[methodName] = getMethod(methodName);
}

function runner(method) {
  if (method === 'status') {
    return sidrStatus;
  } else if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments);
  } else {
    console.error('Method ' + method + ' does not exist on sidr');
  }
}

var events = {
  init: function init(selector, settings) {
    var buttons = dom.qsa(selector);
    for (var i = 0; i < buttons.length; i++) {
      this.addEvent(buttons[i], settings);
    }
  },
  addEvent: function addEvent(button, settings) {
    var data = button.getAttribute('data-sidr');

    // If the plugin hasn't been initialized yet
    if (!data) {
      var name = settings.name;
      var bind = settings.bind;
      var method = settings.method;

      button.setAttribute('data-sidr', name);
      dom.bind(button, bind, function (event) {
        event.preventDefault();

        runner(method, name);
      });
    }
  }
};

var sidr = {
  new: function _new(selector, options) {
    var settings = utils.extend(defaultOptions, options);
    store$1.add(settings.name, new Menu(settings));
    events.init(selector, settings);
  },
  status: function status() {
    return runner.apply(undefined, ['status'].concat(Array.prototype.slice.call(arguments)));
  },
  close: function close() {
    return runner.apply(undefined, ['close'].concat(Array.prototype.slice.call(arguments)));
  },
  open: function open() {
    return runner.apply(undefined, ['open'].concat(Array.prototype.slice.call(arguments)));
  },
  toggle: function toggle() {
    return runner.apply(undefined, ['toggle'].concat(Array.prototype.slice.call(arguments)));
  }
};

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2017 Alberto Varela
 * Licensed under the MIT license.
 */

window.sidr = sidr;

}());
