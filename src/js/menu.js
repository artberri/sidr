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

  getBodyAnimation(type) {
    var bodyAnimation = {};

    if (type === 'open') {
      if (this.side === 'left') {
        bodyAnimation.left = this.menuWidth + 'px';
      } else {
        bodyAnimation.right = this.menuWidth + 'px';
      }
    } else {
      if (this.side === 'left') {
        bodyAnimation.left = 0;
      } else {
        bodyAnimation.right = 0;
      }
    }

    return bodyAnimation;
  }

  getMenuAnimation(type) {
    var menuAnimation = {};

    if (type === 'open') {
      if (this.side === 'left') {
        menuAnimation.left = 0;
      } else {
        menuAnimation.right = 0;
      }
    } else {
      if (this.side === 'left') {
        menuAnimation.left = '-' + this.menuWidth + 'px';
      } else {
        menuAnimation.right = '-' + this.menuWidth + 'px';
      }
    }

    return menuAnimation;
  }

  open(callback) {
    var bodyAnimation,
        menuAnimation,
        scrollTop,
        $html;

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
    if (this.body.is('body')){
      $html = $('html');
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', 'hidden').scrollTop(scrollTop);
    }

    bodyAnimation = this.getBodyAnimation('open');
    menuAnimation = this.getMenuAnimation('open');

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
        menuAnimation,
        scrollTop,
        $html;

    // Check if we can close it
    if ( !this.item.is(':visible') || status.moving ) {
      return;
    }

    // Lock sidr
    status.moving = true;

    // Prepare page if container is body
    if (this.body.is('body')){
      $html = $('html');
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', '').scrollTop(scrollTop);
    }

    bodyAnimation = this.getBodyAnimation('close');
    menuAnimation = this.getMenuAnimation('close');

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
