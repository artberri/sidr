export default {
  name: 'sidr', // Name for the 'sidr'
  speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
  side: 'left', // Accepts 'left' or 'right'
  source: null, // Override the source of the content.
  renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
  body: 'body', // Page container selector,
  displace: true, // Displace the body content or not
  timing: 'ease', // Timing function for CSS transitions
  method: 'toggle', // The method to call when element is clicked
  bind: 'click', // The event to trigger the menu
  onOpen () { }, // Callback when sidr start opening
  onClose () { }, // Callback when sidr start closing
  onOpenEnd () { }, // Callback when sidr end opening
  onCloseEnd () { } // Callback when sidr end closing
}
