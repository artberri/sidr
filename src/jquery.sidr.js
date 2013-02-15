/*
 * sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013 Alberto Varela
 * Licensed under the MIT license.
 */

;(function( $ ){

  var sidrMoving = false;

  var privateMethods = {
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
    }
  };

  var methods = {
    init : function( options ) {

      var settings = $.extend( {
        name  : 'sidr',
        speed : 200,    // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
        side  : 'left', // Accepts 'left' or 'right'
        source: null    // Override the source of the content.
      }, options);

      var name = settings.name,
          $sideMenu = $('#' + name);

      // If the side menu do not exist create it
      if( $sideMenu.length === 0 ) {
        $sideMenu = $('<div />')
          .attr('id', name)
          .appendTo($('body'));
      }

      // Adding styles
      $sideMenu
        .addClass('sidr')
        .addClass(settings.side)
        .data({
          duration : settings.duration,
          side : settings.side
        });

      // The menu content
      if(typeof settings.source === 'function') {
        var newContent = settings.source(name);
        privateMethods.loadContent($sideMenu, newContent);
      }
      else if(typeof settings.source === 'string' && privateMethods.isUrl(settings.source)) {
        $.get(settings.source, function(data) {
          privateMethods.loadContent($sideMenu, data);
        });
      }
      else if(typeof settings.source === 'string') {
        var htmlContent = '',
            $existingContents = $(settings.source);
        $existingContents.each(function() {
          htmlContent += $(this).html();
        });
        privateMethods.loadContent($sideMenu, htmlContent);
      }
      else if(settings.source !== null) {
        $.error('Invalid Sidr Source');
      }

      return this.each(function(){

        var $this = $(this),
            data = $this.data('sidr');

        // If the plugin hasn't been initialized yet
        if ( ! data ) {
          $this.data('sidr', name);
          $this.click(function(e) {
            e.preventDefault();
            methods.toogle(name);
          });
        }
      });
    },
    open: function(name) {
      if(!name)
        name = 'sidr';

      var $menu = $('#' + name),
          $body = $('body'),
          menuWidth = $menu.outerWidth(true),
          duration = $menu.data('duration'),
          side = $menu.data('side');

      // Check if we can open it
      if( $menu.is(':visible') || sidrMoving ) {
        return;
      }

      // Lock sidr
      sidrMoving = true;

      // Open menu
      if(side === 'left') {
        $body.animate({marginLeft: menuWidth + 'px'}, duration);
        $menu.css('display', 'block').animate({left: '0px'}, duration, function() {
          sidrMoving = false;
        });
      }
      else {
        $body.animate({marginRight: menuWidth + 'px'}, duration);
        $menu.css('display', 'block').animate({right: '0px'}, duration, function() {
          sidrMoving = false;
        });
      }
    },
    close: function(name) {
      if(!name)
        name = 'sidr';

      var $menu = $('#' + name),
          $body = $('body'),
          menuWidth = $menu.outerWidth(true),
          duration = $menu.data('duration'),
          side = $menu.data('side');

      // Check if we can open it
      if( !$menu.is(':visible') || sidrMoving ) {
        return;
      }

      // Lock sidr
      sidrMoving = true;

      // Open menu
      if(side === 'left') {
        $body.animate({marginLeft: 0}, duration);
        $menu.animate({left: '-' + menuWidth + 'px'}, duration, function() {
          $menu.removeAttr('style');
          sidrMoving = false;
        });
      }
      else {
        $body.animate({marginRight: 0}, duration);
        $menu.animate({right: '-' + menuWidth + 'px'}, duration, function() {
          $menu.removeAttr('style');
          sidrMoving = false;
        });
      }
    },
    toogle: function(name) {
      if(!name)
        name = 'sidr';
      var $menu = $('#' + name);

      // If the slide is open or opening, just ignore the call
      if($menu.is(':visible')) {
        methods.close(name);
      }
      else {
        methods.open(name);
      }
    }
  };

  $.fn.sidr = function( method ) {

    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }

  };

})( jQuery );
