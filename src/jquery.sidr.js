/*
 * sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013 Alberto Varela
 * Licensed under the MIT license.
 */

(function($) {

  // Opening variable
  $.fn.sidr.moving = false;

  // Default settings
  $.fn.sidr.defaults = {
      speed : 200,    // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side  : 'left', // Accepts 'left' or 'right'
      source: null    // Override the source of the content. Optional in most cases.
  };

  // Static method
  $.sidr = function() {

    return {
      open: function (name, options) {
        var settings = $.extend($.fn.sidemenu.defaults, options),
            $sideMenu = $(sidemenuname);

        // If the side menu do not exist create it
        if( $sideMenu.length === 0 ) {
          $sideMenu = $('<div />').attr('id', sidemenuname);
        }
      }
    };

  };

  // Collection method.
  $.fn.sidr = function(settings) {
    this.click( function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $this = $(this),
          settings = $.extend($.fn.sidemenu.defaults, settings);
    });
  };

}(jQuery));
