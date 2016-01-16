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

  getAnimation(action, element) {
    var animation = {},
        prop = this.side;

    if (action === 'open' && element === 'body') {
      animation[prop] = this.menuWidth + 'px';
    } else if (action === 'close' && element === 'menu') {
      animation[prop] = '-' + this.menuWidth + 'px';
    } else {
      animation[prop] = 0;
    }

    return animation;
  }

  prepareBody(action) {
    var prop = (action === 'open') ? 'hidden' : '';

    // Prepare page if container is body
    if (this.body.is('body')) {
      let $html = $('html'),
          scrollTop = $html.scrollTop();

      $html.css('overflow-x', prop).scrollTop(scrollTop);
    }
  }

  moveBody(action) {
    var bodyAnimationClass = 'sidr-animating',
        bodyAnimation = this.getAnimation(action, 'body');

    if (action === 'open') {
      if (this.displace){
        this.body.addClass(bodyAnimationClass).css({
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
        setTimeout(() => {
          this.body.addClass(this.openClass);
        }, this.speed);
      }
    } else {
      this.body.addClass(bodyAnimationClass).animate(bodyAnimation, {
        queue: false,
        duration: this.speed
      }).removeClass(this.openClass);
    }
  }

  moveMenu(action, callback) {
    var menuAnimation = this.getAnimation(action, 'menu');

    if (action === 'open') {
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
    } else {
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
    }
  }

  move(action, callback) {
    // Lock sidr
    status.moving = true;

    this.prepareBody(action);
    this.moveBody(action);
    this.moveMenu(action, callback);
  }

  open(callback) {
    // Check if is already opened or moving
    if (this.item.is(':visible') || status.moving) {
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

    this.move('open', callback);

    // onOpen callback
    this.onOpen();
  }

  close(callback) {
    // Check if is already closed or moving
    if (!this.item.is(':visible') || status.moving) {
      return;
    }

    this.move('close', callback);

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
