/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2016 Alberto Varela
 * Licensed under the MIT license.
 */

import helper from './js/helper';
import status from './js/status';
import * as sidr from './js/sidr';

;(function( $ ){

  $.sidr = sidr.combined;

  $.fn.sidr = function( options ) {

    var settings = $.extend( {
      name          : 'sidr',         // Name for the 'sidr'
      speed         : 200,            // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side          : 'left',         // Accepts 'left' or 'right'
      source        : null,           // Override the source of the content.
      renaming      : true,           // The ids and classes will be prepended with a prefix when loading existent content
      body          : 'body',         // Page container selector,
      displace      : true,           // Displace the body content or not
      onOpen        : function() {},  // Callback when sidr opened
      onClose       : function() {}   // Callback when sidr closed
    }, options);

    var name = settings.name,
        $sideMenu = $('#' + name);

    // If the side menu do not exist create it
    if ($sideMenu.length === 0) {
      $sideMenu = $('<div />')
        .attr('id', name)
        .appendTo($('body'));
    }

    // Adding styles and options
    $sideMenu
      .addClass('sidr')
      .addClass(settings.side)
      .data({
        speed          : settings.speed,
        side           : settings.side,
        body           : settings.body,
        displace      : settings.displace,
        onOpen         : settings.onOpen,
        onClose        : settings.onClose
      });

    // The menu content
    if (typeof settings.source === 'function') {
      var newContent = settings.source(name);
      helper.loadContent($sideMenu, newContent);
    } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
      $.get(settings.source, function(data) {
        helper.loadContent($sideMenu, data);
      });
    } else if (typeof settings.source === 'string') {
      var htmlContent = '',
          selectors = settings.source.split(',');

      $.each(selectors, function(index, element) {
        htmlContent += '<div class="sidr-inner">' + $(element).html() + '</div>';
      });

      // Renaming ids and classes
      if (settings.renaming) {
        var $htmlContent = $('<div />').html(htmlContent);
        $htmlContent.find('*').each(function(index, element) {
          var $element = $(element);
          helper.addPrefix($element);
        });
        htmlContent = $htmlContent.html();
      }
      helper.loadContent($sideMenu, htmlContent);
    } else if (settings.source !== null) {
      $.error('Invalid Sidr Source');
    }

    return this.each(function () {
      var $this = $(this),
          data = $this.data('sidr'),
          flag = false;

      // If the plugin hasn't been initialized yet
      if (!data) {
        status.moving = false;
        status.opened = false;

        $this.data('sidr', name);

        $this.bind('touchstart click', function(event) {
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

})( jQuery );
