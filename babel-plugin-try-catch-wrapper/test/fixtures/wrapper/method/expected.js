try {
  var obj = {
    f: function f() {
      try {
        console.log(arguments);
      } catch (_e) {
        reportError(_e, "wrapper/method/expected.js", "f", 2, 5);
        throw _e;
      }
    },
    g: function () {
      //empty method
    }
  };
} catch (_e2) {
  reportError(_e2, "wrapper/method/expected.js", "top-level code", 1, 0);
}
