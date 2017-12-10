/*! sidr - v3.0.0 - 2017-12-10
  http://www.berriart.com/sidr/
  * Copyright (c) 2013-2017 Alberto Varela; Licensed MIT */
(function () {
'use strict';

var sidrStatus = {
  moving: false,
  opened: false
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

var getMethod = function getMethod(methodName) {
  return function (name, callback) {
    // Check arguments
    if (typeof name === 'function') {
      callback = name;
      name = 'sidr';
    } else if (!name) {
      name = 'sidr';
    }

    var menu = store$1.get(name);
    menu[methodName](callback);
  };
};

var methods = {};
var publicMethods = ['open', 'close', 'toggle', 'reload'];
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

function getTransitionPrefix(property, style) {
  var prefix = void 0;
  var prefixes = ['moz', 'webkit', 'o', 'ms'];
  for (var i = 0; i < prefixes.length; i++) {
    prefix = prefixes[i];
    if (prefix + property in style) {
      return prefix;
    }
  }

  return false;
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
  createElement: function createElement(elementId) {
    var elem = document.createElement('div');
    elem.id = elementId;
    document.body.appendChild(elem);

    return elem;
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
      property = property.charAt(0).toUpperCase() + property.substr(1);
      var prefix = getTransitionPrefix(property, style);
      supported = !!prefix;
      cssProperty = supported ? prefix + property : null;
      property = supported ? '-' + prefix + '-' + property.toLowerCase() : null;
      if (prefix === 'webkit') {
        event = 'webkitTransitionEnd';
      } else if (prefix === '0') {
        event = 'oTransitionEnd';
      }
    }

    return { cssProperty: cssProperty, supported: supported, property: property, event: event };
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









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function changeClasses(element, action, classes) {
  var classesArray = classes.split(' ');
  for (var i = 0; i < classesArray.length; i++) {
    var newClass = classesArray[i].trim();
    element.classList[action](newClass);
  }
}

function setProperty(element, prop, value) {
  element[prop] = value;
}

function getProperty(element, prop, value) {
  return element[prop];
}

var BaseElement = function () {
  function BaseElement(element) {
    classCallCheck(this, BaseElement);

    this.element = element;
  }

  createClass(BaseElement, [{
    key: 'bind',
    value: function bind(event, callback) {
      this.element.addEventListener(event, callback, false);
    }
  }, {
    key: 'unbind',
    value: function unbind(event, callback) {
      this.element.removeEventListener(event, callback, false);
    }
  }, {
    key: 'style',
    value: function style(property, value) {
      if (typeof property === 'string') {
        this.element.style[property] = value;
      } else {
        for (var key in property) {
          if (property.hasOwnProperty(key)) {
            this.element.style[key] = property[key];
          }
        }
      }
    }
  }, {
    key: 'addClass',
    value: function addClass(classes) {
      changeClasses(this.element, 'add', classes);
    }
  }, {
    key: 'removeClass',
    value: function removeClass(classes) {
      changeClasses(this.element, 'remove', classes);
    }
  }, {
    key: 'html',
    value: function html(value) {
      if (value) {
        setProperty(this.element, 'innerHTML', value);
      } else {
        return getProperty(this.element, 'innerHTML');
      }
    }
  }, {
    key: 'scrollTop',
    value: function scrollTop(value) {
      if (value) {
        setProperty(this.element, 'scrollTop', value);
      } else {
        return getProperty(this.element, 'scrollTop');
      }
    }
  }, {
    key: 'offsetWidth',
    value: function offsetWidth() {
      return this.element.offsetWidth;
    }
  }]);
  return BaseElement;
}();

var bodyAnimationClass = 'sidr-animating';
var openAction = 'open';

function isBody(element) {
  return element.tagName === 'BODY';
}

function openClasses(name) {
  var classes = 'sidr-open';

  if (name !== 'sidr') {
    classes += ' ' + name + '-open';
  }

  return classes;
}

var Body = function (_BaseElement) {
  inherits(Body, _BaseElement);

  function Body(settings, menuWidth) {
    classCallCheck(this, Body);

    var _this = possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, dom.qs(settings.body)));

    _this.name = settings.name;
    _this.side = settings.side;
    _this.speed = settings.speed;
    _this.timing = settings.timing;
    _this.displace = settings.displace;
    _this.menuWidth = menuWidth;
    return _this;
  }

  createClass(Body, [{
    key: 'prepare',
    value: function prepare(action) {
      var prop = action === openAction ? 'hidden' : '';

      // Prepare page if container is body
      if (isBody(this.element)) {
        var html = new BaseElement(dom.qs('html'));
        var scrollTop = html.scrollTop();
        html.style('overflowX', prop);
        html.scrollTop(scrollTop);
      }
    }
  }, {
    key: 'unprepare',
    value: function unprepare() {
      if (isBody(this.element)) {
        var html = new BaseElement(dom.qs('html'));
        html.style('overflowX', '');
      }
    }
  }, {
    key: 'move',
    value: function move(action) {
      this.addClass(bodyAnimationClass);
      if (action === openAction) {
        this.open();
      } else {
        this.close();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      var _this2 = this;

      if (this.displace) {
        var transitions = dom.transitions;
        var styles = {
          width: this.offsetWidth() + 'px',
          position: 'absolute'
        };
        this.style(this.side, '0');
        this.style(transitions.cssProperty, this.side + ' ' + this.speed / 1000 + 's ' + this.timing);
        this.style(styles);
        setTimeout(function () {
          return _this2.style(_this2.side, _this2.menuWidth + 'px');
        }, 1);
      }
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      var transitions = dom.transitions;
      var styles = {
        width: '',
        position: '',
        right: '',
        left: ''
      };

      styles[transitions.cssProperty] = '';
      this.style(styles);
      this.unbind(transitions.event, this.temporalCallback);
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.displace) {
        var transitions = dom.transitions;

        this.style(this.side, 0);
        var self = this;
        this.temporalCallback = function () {
          self.onClose();
        };
        this.bind(transitions.event, this.temporalCallback);
      }
    }
  }, {
    key: 'removeAnimationClass',
    value: function removeAnimationClass() {
      this.removeClass(bodyAnimationClass);
    }
  }, {
    key: 'removeOpenClass',
    value: function removeOpenClass() {
      this.removeClass(openClasses(this.name));
    }
  }, {
    key: 'addOpenClass',
    value: function addOpenClass() {
      this.addClass(openClasses(this.name));
    }
  }]);
  return Body;
}(BaseElement);

var Menu = function (_BaseElement) {
  inherits(Menu, _BaseElement);

  function Menu(settings) {
    classCallCheck(this, Menu);

    var _this = possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, dom.id(settings.name)));

    _this.name = settings.name;
    _this.speed = settings.speed;
    _this.side = settings.side;
    _this.displace = settings.displace;
    _this.source = settings.source;
    _this.timing = settings.timing;
    _this.method = settings.method;
    _this.renaming = settings.renaming;
    _this.onOpenCallback = settings.onOpen;
    _this.onCloseCallback = settings.onClose;
    _this.onOpenEndCallback = settings.onOpenEnd;
    _this.onCloseEndCallback = settings.onCloseEnd;

    _this.init(settings);
    return _this;
  }

  createClass(Menu, [{
    key: 'init',
    value: function init(settings) {
      // If the side menu do not exist create it
      if (!this.element) {
        this.element = dom.createElement(this.name);
      }

      this.style(dom.transitions.cssProperty, this.side + ' ' + this.speed / 1000 + 's ' + this.timing);
      this.addClass('sidr sidr-' + this.side);
      this.body = new Body(settings, this.offsetWidth());

      this.reload();
    }
  }, {
    key: 'reload',
    value: function reload() {
      var _this2 = this;

      if (typeof this.source === 'function') {
        var newContent = this.source(name);
        this.html(newContent);
      } else if (typeof this.source === 'string' && utils.isUrl(this.source)) {
        utils.fetch(this.source, function (newContent) {
          _this2.html(newContent);
        });
      } else if (typeof this.source === 'string') {
        var htmlContent = dom.getHTMLContent(this.source);

        if (this.renaming) {
          htmlContent = dom.addPrefixes(htmlContent);
        }

        this.html(htmlContent);
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
      var _this3 = this;

      // Check if is already opened or moving
      if (sidrStatus.opened === this.name || sidrStatus.moving) {
        return;
      }

      // If another menu opened close first
      if (sidrStatus.opened !== false) {
        var alreadyOpenedMenu = store$1.get(sidrStatus.opened);

        alreadyOpenedMenu.close(function () {
          _this3.open(callback);
        });

        return;
      }

      this.move('open', callback);
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

      this.unbind(dom.transitions.event, this.temporalOpenMenuCallback);
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
      var self = this;

      this.style(this.side, 0);
      this.temporalOpenMenuCallback = function () {
        self.onOpenMenu(callback);
      };
      this.bind(dom.transitions.event, this.temporalOpenMenuCallback);
    }
  }, {
    key: 'onCloseMenu',
    value: function onCloseMenu(callback) {
      this.unbind(dom.transitions.event, this.temporalCloseMenuCallback);
      this.style({
        left: '',
        right: ''
      });
      this.body.unprepare();

      sidrStatus.moving = false;
      sidrStatus.opened = false;

      this.body.removeAnimationClass();
      this.body.removeOpenClass();
      this.onCloseEndCallback();
      if (typeof callback === 'function') {
        callback(name);
      }
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu(callback) {
      var self = this;

      this.style(this.side, '');
      this.temporalCloseMenuCallback = function () {
        self.onCloseMenu(callback);
      };
      this.bind(dom.transitions.event, this.temporalCloseMenuCallback);
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
}(BaseElement);

var Button = function (_BaseElement) {
  inherits(Button, _BaseElement);

  function Button(element, settings) {
    classCallCheck(this, Button);

    var _this = possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, element));

    _this.init(settings);
    return _this;
  }

  createClass(Button, [{
    key: 'init',
    value: function init(settings) {
      var data = this.element.getAttribute('data-sidr');

      // If the plugin hasn't been initialized yet
      if (!data) {
        var name = settings.name;
        var method = settings.method;
        var bind = settings.bind;

        this.element.setAttribute('data-sidr', name);
        this.bind(bind, function (event) {
          event.preventDefault();

          runner(method, name);
        });
      }
    }
  }]);
  return Button;
}(BaseElement);

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

function fnSidr(options) {
  var settings = utils.extend(defaultOptions, options);
  store$1.add(settings.name, new Menu(settings));

  return this.each(function () {
    new Button(this, settings);
  });
}

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2017 Alberto Varela
 * Licensed under the MIT license.
 */

jQuery.sidr = runner;
jQuery.fn.sidr = fnSidr;

}());
