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

      alreadyOpenedMenu.close(function() {
        this.open(callback);
      });

      return;
    }

    // Lock sidr
    status.moving = true;

    // Left or right?
    if (this.side === 'left') {
      bodyAnimation = {left: this.menuWidth + 'px'};
      menuAnimation = {left: '0px'};
    } else {
      bodyAnimation = {right: this.menuWidth + 'px'};
      menuAnimation = {right: '0px'};
    }

    // Prepare page if container is body
    if (this.body.is('body')){
      $html = $('html');
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', 'hidden').scrollTop(scrollTop);
    }

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

    // Right or left menu?
    if (this.side === 'left') {
      bodyAnimation = {left: 0};
      menuAnimation = {left: '-' + this.menuWidth + 'px'};
    } else {
      bodyAnimation = {right: 0};
      menuAnimation = {right: '-' + this.menuWidth + 'px'};
    }

    // Prepare page if container is body
    if (this.body.is('body')){
      $html = $('html');
      scrollTop = $html.scrollTop();
      $html.css('overflow-x', '').scrollTop(scrollTop);
    }

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
