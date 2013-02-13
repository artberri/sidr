/*
 * sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013 Alberto Varela
 * Licensed under the MIT license.
 */

(function($) {

  // Opening variable
  $.sidr.moving = false;

  // Default settings
  $.sidr.defaults = {
      speed : 200,    // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side  : 'left', // Accepts 'left' or 'right'
      source: null    // Override the source of the content.
  };

  $.sidr.settings = [];

  var exceptions = {
    source: {
        name:        "Invalid Sidr Source",
        level:       "Error",
        message:     "Error detected. You provided an invalid source."
    }
  };

  var sidr = {
    ensureName: function(name) {
      if(typeof name !== 'string') {
        name = 'sidr';
      }

      return name;
    },
    // Check for valids urls
    // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
    isUrl: function (str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    // Loads the content into the menu bar
    loadContent: function($menu, content) {
      $menu.html(content);
    },
    open: function(name) {
      name = sidr.ensureName(name);
      var $menu = $(name),
          settings = $.sidr.settings[name],
          menuWidth = $menu.outerWidth(true);

      // Check if we can open it
      if( $menu.is(':visible') || $.sidr.moving )
        return;

      // Lock sidr
      $.sidr.moving = true;

      if(settings.side === 'left') {

      }
      else {

      }
    },
    close: function(name) {

    },
    toogle: function(name) {
      name = sidr.ensureName(name);
      var $menu = $(name);

      // If the slide is open or opening, just ignore the call
      if($menu.is(':visible')) {
        sidr.close(name);
      }
      else {
        sidr.open(name);
      }
    },
    // Main method
    init: function(name, options) {
      // Check input variables
      if(typeof name === 'object' && typeof options === 'undefined') {
        options = name;
        name = 'sidr';
      }
      else if(typeof name === 'undefined') {
        name = 'sidr';
      }

      // Override defaults
      $.sidr.settings[name] = $.extend($.sidr.defaults, options);
      // Variables
      var settings = $.sidr.settings[name],
          $sideMenu = $('#' + name);

      // If the side menu do not exist create it
      if( $sideMenu.length === 0 ) {
        $sideMenu = $('<div />')
          .attr('id', name)
          .appendTo($('body'));
      }

      // Añadir estilos a la sidebar
      $sideMenu
        .addClass('sidr')
        .addClass(settings.side);

      if(typeof settings.source === 'function') {
        var newContent = settings.source(name);
        sidr.loadContent($sideMenu, newContent);
      }
      else if(typeof settings.source === 'string' && sidr.isUrl(settings.source)) {
        $.get(settings.source, function(data) {
          sidr.loadContent($sideMenu, data);
        });
      }
      else if(typeof settings.source === 'string') {
        var htmlContent = '';
        $existingContents = $(settings.source);
        $existingContents.each(function() {
          htmlContent += $(this).html();
        });
        sidr.loadContent($sideMenu, htmlContent);
      }
      else if(typeof settings.source !== null) {
        throw exceptions.source;
      }

      // Mostramos sidebar
      // @TODO Hay que decidir que elementos disparan abrir y cerrar
    }
  };

  // Static method
  $.sidr = sidr.init;

}(jQuery));
