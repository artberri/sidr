import status from './status';

var $ = jQuery;

function execute(action, name, callback) {
  // Check arguments
  if (typeof name === 'function') {
    callback = name;
    name = 'sidr';
  } else if (!name) {
    name = 'sidr';
  }

  // Declaring
  var $menu = $('#' + name),
      $body = $($menu.data('body')),
      $html = $('html'),
      menuWidth = $menu.outerWidth(true),
      speed = $menu.data('speed'),
      side = $menu.data('side'),
      displace = $menu.data('displace'),
      onOpen = $menu.data('onOpen'),
      onClose = $menu.data('onClose'),
      bodyAnimation,
      menuAnimation,
      scrollTop,
      bodyClass = (name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open');

  // Open Sidr
  if ('open' === action || ('toggle' === action && !$menu.is(':visible'))) {
    // Check if we can open it
    if ( $menu.is(':visible') || status.moving ) {
      return;
    }

    // If another menu opened close first
    if (status.opened !== false) {
      execute('close', status.opened, function() {
        execute('open', name);
      });

      return;
    }

    // Lock sidr
    status.moving = true;

    // Left or right?
    if (side === 'left') {
      bodyAnimation = {left: menuWidth + 'px'};
      menuAnimation = {left: '0px'};
    } else {
      bodyAnimation = {right: menuWidth + 'px'};
      menuAnimation = {right: '0px'};
    }

    // Prepare page if container is body
    if ($body.is('body')){
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', 'hidden').scrollTop(scrollTop);
    }

    // Open menu
    if (displace){
      $body.addClass('sidr-animating').css({
        width: $body.width(),
        position: 'absolute'
      }).animate(bodyAnimation, {
        queue: false,
        duration: speed,
        complete: function() {
          $(this).addClass(bodyClass);
        }
      });
    } else {
      setTimeout(function() {
        $body.addClass(bodyClass);
      }, speed);
    }
    $menu.css('display', 'block').animate(menuAnimation, {
      queue: false,
      duration: speed,
      complete: function() {
        status.moving = false;
        status.opened = name;
        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
        $body.removeClass('sidr-animating');
      }
    });

    // onOpen callback
    onOpen();
  }
  // Close Sidr
  else {
    // Check if we can close it
    if ( !$menu.is(':visible') || status.moving ) {
      return;
    }

    // Lock sidr
    status.moving = true;

    // Right or left menu?
    if (side === 'left') {
      bodyAnimation = {left: 0};
      menuAnimation = {left: '-' + menuWidth + 'px'};
    } else {
      bodyAnimation = {right: 0};
      menuAnimation = {right: '-' + menuWidth + 'px'};
    }

    // Close menu
    if ($body.is('body')){
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', '').scrollTop(scrollTop);
    }
    $body.addClass('sidr-animating').animate(bodyAnimation, {
      queue: false,
      duration: speed
    }).removeClass(bodyClass);
    $menu.animate(menuAnimation, {
      queue: false,
      duration: speed,
      complete: function() {
        $menu.removeAttr('style').hide();
        $body.css({
          width: '',
          position: '',
          right: '',
          left: ''
        });
        $('html').css('overflow-x', '');
        status.moving = false;
        status.opened = false;
        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
        $body.removeClass('sidr-animating');
      }
    });

    // onClose callback
    onClose();
  }
}

export default execute;
