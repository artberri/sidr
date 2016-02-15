import execute from './execute';
import status from './status';

var i,
  $ = jQuery,
  publicMethods = ['open', 'close', 'toggle'],
  methodName,
  methods = {},
  getMethod = function (methodName) {
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
    return status;
  } else if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments);
  } else {
    $.error('Method ' + method + ' does not exist on jQuery.sidr');
  }
}

export default sidr;
