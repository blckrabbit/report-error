try {
  var obj = {
    f: function f() {
      try {
        console.log(arguments);
      } catch (e) {
        reportError(e, "wrapper/method/expected.js", "f", 2, 4);
        throw e;
      }
    },
    g: function () {
      //empty method
    }
  };
} catch (e) {
  reportError(e, "wrapper/method/expected.js", "top-level code", 1, 8);
}
