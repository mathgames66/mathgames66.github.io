!function() {
  if (window.UnityLoader) {
    if (window.UnityLoader.compatibilityCheck) {
      window.UnityLoader.compatibilityCheck = function(element, callback, errCallback) {
        callback();
      }
    }
  }
}();
