let store = {}

export default {
  add (key, value) {
    store[key] = value
  },

  get (key) {
    return store[key]
  }
}
