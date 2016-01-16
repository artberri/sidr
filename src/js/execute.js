import Menu from './menu';

var $ = jQuery;

function execute(action, name, callback) {
  var sidr = new Menu(name);

  switch (action) {
    case 'open':
      sidr.open(callback);
      break;
    case 'close':
      sidr.close(callback);
      break;
    case 'toggle':
      sidr.toggle(callback);
      break;
    default:
      $.error('Method ' + action + ' does not exist on jQuery.sidr');
      break;
  }
}

export default execute;
