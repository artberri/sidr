var helper = {
  // Check for valids urls
  // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
  isUrl(str) {
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
  addPrefixes($element) {
    this.addPrefix($element, 'id');
    this.addPrefix($element, 'class');
    $element.removeAttr('style');
  },

  addPrefix($element, attribute) {
    var toReplace = $element.attr(attribute);

    if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
      $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-' + attribute + '-$1'));
    }
  },

  // Check if transitions is supported
  transitions: (function () {
    var body = document.body || document.documentElement,
      style = body.style,
      supported = false,
      property = 'transition';

    if (property in style) {
      supported = true;
    } else {
      let prefixes = ['moz', 'webkit', 'o', 'ms'],
        prefix,
        i;

      property = property.charAt(0).toUpperCase() + property.substr(1);
      supported = (function () {
        for (i = 0; i < prefixes.length; i++) {
          prefix = prefixes[i];
          if ((prefix + property) in style) {
            return true;
          }
        }

        return false;
      } ());
      property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
    }

    return {
      supported: supported,
      property: property
    };
  } ())
};

export default helper;
