try {
  var f = function f() {
    try {
      console.log(arguments);
    } catch (_e) {
      reportError(_e, "wrapper/exp/expected.js", "anonymous function", 1, 8);
      throw _e;
    }
  };

  var g = function () {};
} catch (_e2) {
  reportError(_e2, "wrapper/exp/expected.js", "top-level code", 1, 0);
}
