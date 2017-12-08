import store from './menu.store'

function execute (action, name, callback) {
  let menu = store.get(name)

  switch (action) {
    case 'open':
      menu.open(callback)
      break
    case 'close':
      menu.close(callback)
      break
    case 'toggle':
      menu.toggle(callback)
      break
    default:
      console.error('Method ' + action + ' does not exist on sidr')
      break
  }
}

export default execute
