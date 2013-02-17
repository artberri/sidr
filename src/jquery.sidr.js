/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013 Alberto Varela
 * Licensed under the MIT license.
 */

;(function( $ ){

  var sidrMoving = false,
      sidrOpened = false;

  // Private methods
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
      $menu.find('.sidr-inner').html(content);
    },
    // Add sidr prefixes
    addPrefix: function($element) {
      var elementId = $element.attr('id'),
          elementClass = $element.attr('class');

      if(typeof elementId === 'string' && '' !== elementId) {
        $element.attr('id', elementId.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-r-$1'));
      }
      if(typeof elementClass === 'string' && '' !== elementClass) {
        $element.attr('class', elementClass.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-r-$1'));
      }
    }
  };

  // Sidr public methods
  var methods = {
    init : function( options ) {

      var settings = $.extend( {
        name    : 'sidr', // Name for the 'sidr'
        speed   : 200,    // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
        side    : 'left', // Accepts 'left' or 'right'
        source  : null,    // Override the source of the content.
        renaming: true    // The ids and classes will be prepended with a prefix when loading existent content
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

      // Add inner container
      $('<div />')
        .attr('class', 'sidr-inner')
        .appendTo($sideMenu);

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
        // Renaming ids and classes
        if(settings.renaming) {
          var $htmlContent = $('<div />').html(htmlContent);
          $htmlContent.find('*').each(function(index, element) {
            var $element = $(element);
            privateMethods.addPrefix($element);
          });
          htmlContent = $htmlContent.html();
        }
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
    open: function(name, callback) {
      if(typeof name === 'function') {
        callback = name;
        name = 'sidr';
      }
      else if(!name) {
        name = 'sidr';
      }

      var $menu = $('#' + name),
          $body = $('body'),
          menuWidth = $menu.outerWidth(true),
          duration = $menu.data('duration'),
          side = $menu.data('side'),
          bodyAnimation,
          menuAnimation;

      // Check if we can open it
      if( $menu.is(':visible') || sidrMoving ) {
        return;
      }

      // If another menu opened close first
      if(sidrOpened !== false) {
        methods.close(sidrOpened, function() {
          methods.open(name);
        });

        return;
      }

      // Lock sidr
      sidrMoving = true;

      // Left or right?
      if(side === 'left') {
        bodyAnimation = {left: menuWidth + 'px'};
        menuAnimation = {left: '0px'};
      }
      else {
        bodyAnimation = {right: menuWidth + 'px'};
        menuAnimation = {right: '0px'};
      }

      // Prepare page
      $('html').css('overflow-x', 'hidden');
      $body.css({
        width: $body.width(),
        position: 'absolute'
      });

      // Open menu
      $body.animate(bodyAnimation, duration);
      $menu.css('display', 'block').animate(menuAnimation, duration, function() {
        sidrMoving = false;
        sidrOpened = name;
        // Callback
        if(typeof callback === 'function') {
          callback(name);
        }
      });
    },
    close: function(name, callback) {
      if(typeof name === 'function') {
        callback = name;
        name = 'sidr';
      }
      else if(!name) {
        name = 'sidr';
      }

      var $menu = $('#' + name),
          $body = $('body'),
          menuWidth = $menu.outerWidth(true),
          duration = $menu.data('duration'),
          side = $menu.data('side'),
          bodyAnimation,
          menuAnimation;

      // Check if we can open it
      if( !$menu.is(':visible') || sidrMoving ) {
        return;
      }

      // Lock sidr
      sidrMoving = true;

      // Right or left menu?
      if(side === 'left') {
        bodyAnimation = {left: 0};
        menuAnimation = {left: '-' + menuWidth + 'px'};
      }
      else {
        bodyAnimation = {right: 0};
        menuAnimation = {right: '-' + menuWidth + 'px'};
      }

      // Close menu
      $body.animate(bodyAnimation, duration);
      $menu.animate(menuAnimation, duration, function() {
        $menu.removeAttr('style');
        $body.removeAttr('style');
        $('html').removeAttr('style');
        sidrMoving = false;
        sidrOpened = false;
        // Callback
        if(typeof callback === 'function') {
          callback(name);
        }
      });
    },
    toogle: function(name, callback) {
      if(typeof name === 'function') {
        callback = name;
        name = 'sidr';
      }
      else if(!name) {
        name = 'sidr';
      }
      var $menu = $('#' + name);

      // Open or close sidr
      if($menu.is(':visible')) {
        methods.close(name, callback);
      }
      else {
        methods.open(name, callback);
      }
    }
  };

  $.fn.sidr = function( method ) {

    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.sidr' );
    }

  };

})( jQuery );
