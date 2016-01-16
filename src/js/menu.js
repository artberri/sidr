/*eslint callback-return: 0*/

import status from './status';

var $ = jQuery;

class Menu {
  constructor(name) {
    this.name = name;
    this.item = $('#' + name);
    this.openClass = (name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open');
    this.menuWidth = this.item.outerWidth(true);
    this.speed = this.item.data('speed');
    this.side = this.item.data('side');
    this.displace = this.item.data('displace');
    this.onOpen = this.item.data('onOpen');
    this.onClose = this.item.data('onClose');
    this.body = $(this.item.data('body'));
  }

  getAnimation(type, element) {
    var animation = {},
        prop = this.side;

    if (type === 'open' && element === 'body') {
      animation[prop] = this.menuWidth + 'px';
    } else if (type === 'close' && element === 'menu') {
      animation[prop] = '-' + this.menuWidth + 'px';
    } else {
      animation[prop] = 0;
    }

    return animation;
  }

  prepareBody(type) {
    var prop = (type === 'open') ? 'hidden' : '';

    // Prepare page if container is body
    if (this.body.is('body')) {
      let $html = $('html'),
          scrollTop = $html.scrollTop();

      $html.css('overflow-x', prop).scrollTop(scrollTop);
    }
  }

  open(callback) {
    var bodyAnimation,
        menuAnimation;

    // Check if we can open it
    if ( this.item.is(':visible') || status.moving ) {
      return;
    }

    // If another menu opened close first
    if (status.opened !== false) {
      let alreadyOpenedMenu = new Menu(status.opened);

      alreadyOpenedMenu.close(() => {
        this.open(callback);
      });

      return;
    }

    // Lock sidr
    status.moving = true;

    // Prepare page if container is body
    this.prepareBody('open');

    bodyAnimation = this.getAnimation('open', 'body');
    menuAnimation = this.getAnimation('open', 'menu');

    // Move body if needed
    if (this.displace){
      this.body.addClass('sidr-animating').css({
        width: this.body.width(),
        position: 'absolute'
      }).animate(bodyAnimation, {
        queue: false,
        duration: this.speed,
        complete: () => {
          this.body.addClass(this.openClass);
        }
      });
    } else {
      setTimeout(function() {
        this.body.addClass(this.openClass);
      }, this.speed);
    }

    // Move menu
    this.item.css('display', 'block').animate(menuAnimation, {
      queue: false,
      duration: this.speed,
      complete: () => {
        status.moving = false;
        status.opened = name;

        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }

        this.body.removeClass('sidr-animating');
      }
    });

    // onOpen callback
    this.onOpen();
  }

  close(callback) {
    var bodyAnimation,
        menuAnimation;

    // Check if we can close it
    if ( !this.item.is(':visible') || status.moving ) {
      return;
    }

    // Lock sidr
    status.moving = true;

    // Prepare page if container is body
    this.prepareBody('close');

    bodyAnimation = this.getAnimation('close', 'body');
    menuAnimation = this.getAnimation('close', 'menu');

    // Move body
    this.body.addClass('sidr-animating').animate(bodyAnimation, {
      queue: false,
      duration: this.speed
    }).removeClass(this.openClass);

    // Move menu
    this.item.animate(menuAnimation, {
      queue: false,
      duration: this.speed,
      complete: () => {
        this.item.removeAttr('style').hide();
        this.body.css({
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

        this.body.removeClass('sidr-animating');
      }
    });

    // onClose callback
    this.onClose();
  }

  toggle(callback) {
    if (this.item.is(':visible')) {
      this.close(callback);
    } else {
      this.open(callback);
    }
  }
}

export default Menu;
