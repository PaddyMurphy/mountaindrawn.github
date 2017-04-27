// test for clip-path support
// from http://codepen.io/anon/pen/YXyyMJ
// in this thread http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
export default {
  areClipPathShapesSupported: function () {
    var base = 'clipPath';
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];
    var properties = [ base ];
    var testElement = document.createElement('testelement');
    var attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)';

    // Push the prefixed properties into the array of properties.
    for (var i = 0, l = prefixes.length; i < l; i++) {
      var prefixedProperty = prefixes[i] + base.charAt(0).toUpperCase() + base.slice(1); // remember to capitalize!
      properties.push(prefixedProperty);
    }
    // Interate over the properties and see if they pass two tests.
    for (var i = 0, l = properties.length; i < l; i++) { // eslint-disable-line
      var property = properties[i];

      // First, they need to even support clip-path (IE <= 11 does not)...
      if (testElement.style[property] === '') {
        // Second, we need to see what happens when we try to create a CSS shape...
        testElement.style[property] = attribute;
        if (testElement.style[property] !== '') {
          return true;
        }
      }
    }

    return false;
  }
}
