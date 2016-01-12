import execute from './execute';

var $ = jQuery;

// Sidr public methods
var publicMethods = ['open', 'close', 'toggle'],
    methodName,
    methods = {},
    getMethod = function (methodName) {
      return function(name, callback) {
        execute(methodName, name, callback);
      };
    };

for (methodName of publicMethods) {
  methods[methodName] = getMethod(methodName);
}

function combined(method) {
  if (methods[method]) {
    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
  } else if (typeof method === 'function' || typeof method === 'string' || ! method) {
    return methods.toggle.apply(this, arguments);
  } else {
    $.error( 'Method ' + method + ' does not exist on jQuery.sidr' );
  }
}

export { methods };

export { combined };
