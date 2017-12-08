export default {
  // Check for valids urls
  // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
  isUrl (str) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

    if (pattern.test(str)) {
      return true
    } else {
      return false
    }
  },

  extend (a, b) {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key]
      }
    }

    return a
  },

  fetch (url, callback) {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.responseText)
      }
    }
    xmlhttp.open('GET', url, true)
    xmlhttp.send()
  }
}
