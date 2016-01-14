import helper from './helper';
import view from './view';
import status from './status';
import { methods as sidr } from './sidr';

var $ = jQuery;

function fn(options) {
  var settings = $.extend({
        name: 'sidr',   // Name for the 'sidr'
        speed: 200,     // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
        side: 'left',   // Accepts 'left' or 'right'
        source: null,   // Override the source of the content.
        renamin: true,  // The ids and classes will be prepended with a prefix when loading existent content
        body: 'body',   // Page container selector,
        displace: true, // Displace the body content or not
        onOpen() {},    // Callback when sidr opened
        onClose() {}    // Callback when sidr closed
      }, options),
      name = settings.name,
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
    let newContent = settings.source(name);

    view.loadContent($sideMenu, newContent);
  } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
    $.get(settings.source, function(data) {
      view.loadContent($sideMenu, data);
    });
  } else if (typeof settings.source === 'string') {
    let htmlContent = '',
        selectors = settings.source.split(',');

    $.each(selectors, function(index, element) {
      htmlContent += '<div class="sidr-inner">' + $(element).html() + '</div>';
    });

    // Renaming ids and classes
    if (settings.renaming) {
      let $htmlContent = $('<div />').html(htmlContent);

      $htmlContent.find('*').each(function(index, element) {
        let $element = $(element);

        helper.addPrefix($element);
      });
      htmlContent = $htmlContent.html();
    }
    view.loadContent($sideMenu, htmlContent);
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
          sidr.toggle(name);
          setTimeout(function () {
            flag = false;
          }, 100);
        }
      });
    }
  });
}

export default fn;
