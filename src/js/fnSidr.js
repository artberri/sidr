import helper from './helper';
import status from './status';
import sidr from './sidr';

var $ = jQuery;

function fillContent($sideMenu, settings) {
  // The menu content
  if (typeof settings.source === 'function') {
    let newContent = settings.source(name);

    $sideMenu.html(newContent);
  } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
    $.get(settings.source, function (data) {
      $sideMenu.html(data);
    });
  } else if (typeof settings.source === 'string') {
    let htmlContent = '',
      selectors = settings.source.split(',');

    $.each(selectors, function (index, element) {
      htmlContent += '<div class="sidr-inner">' + $(element).html() + '</div>';
    });

    // Renaming ids and classes
    if (settings.renaming) {
      let $htmlContent = $('<div />').html(htmlContent);

      $htmlContent.find('*').each(function (index, element) {
        let $element = $(element);

        helper.addPrefixes($element);
      });
      htmlContent = $htmlContent.html();
    }

    $sideMenu.html(htmlContent);
  } else if (settings.source !== null) {
    $.error('Invalid Sidr Source');
  }

  return $sideMenu;
}

function fnSidr(options) {
  var transitions = helper.transitions,
    settings = $.extend({
      name: 'sidr',             // Name for the 'sidr'
      speed: 200,               // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side: 'left',             // Accepts 'left' or 'right'
      source: null,             // Override the source of the content.
      renaming: true,           // The ids and classes will be prepended with a prefix when loading existent content
      body: 'body',             // Page container selector,
      displace: true,           // Displace the body content or not
      timing: 'ease',           // Timing function for CSS transitions
      method: 'toggle',         // The method to call when element is clicked
      bind: 'touchstart click', // The event(s) to trigger the menu
      onOpen() { },             // Callback when sidr start opening
      onClose() { },            // Callback when sidr start closing
      onOpenEnd() { },          // Callback when sidr end opening
      onCloseEnd() { }          // Callback when sidr end closing
    }, options),
    name = settings.name,
    $sideMenu = $('#' + name);

  // If the side menu do not exist create it
  if ($sideMenu.length === 0) {
    $sideMenu = $('<div />')
      .attr('id', name)
      .appendTo($('body'));
  }

  // Add transition to menu if are supported
  if (transitions.supported) {
    $sideMenu.css(transitions.property, settings.side + ' ' + (settings.speed / 1000) + 's ' + settings.timing);
  }

  // Adding styles and options
  $sideMenu
    .addClass('sidr')
    .addClass(settings.side)
    .data({
      speed: settings.speed,
      side: settings.side,
      body: settings.body,
      displace: settings.displace,
      timing: settings.timing,
      method: settings.method,
      onOpen: settings.onOpen,
      onClose: settings.onClose,
      onOpenEnd: settings.onOpenEnd,
      onCloseEnd: settings.onCloseEnd
    });

  $sideMenu = fillContent($sideMenu, settings);

  return this.each(function () {
    var $this = $(this),
      data = $this.data('sidr'),
      flag = false;

    // If the plugin hasn't been initialized yet
    if (!data) {
      status.moving = false;
      status.opened = false;

      $this.data('sidr', name);

      $this.bind(settings.bind, function (event) {
        event.preventDefault();

        if (!flag) {
          flag = true;
          sidr(settings.method, name);

          setTimeout(function () {
            flag = false;
          }, 100);
        }
      });
    }
  });
}

export default fnSidr;
