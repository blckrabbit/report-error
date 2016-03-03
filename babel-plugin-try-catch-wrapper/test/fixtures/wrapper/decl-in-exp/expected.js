try {
  var f = function f() {
    try {
      console.log(arguments);
      function g() {
        try {
          console.log(arguments);
        } catch (e) {
          reportError(e, "wrapper/decl-in-exp/expected.js", "g", 3, 5);
          throw e;
        }
      }
      g();
    } catch (e) {
      reportError(e, "wrapper/decl-in-exp/expected.js", "anonymous function", 1, 7);
      throw e;
    }
  };

  f();
} catch (e) {
  reportError(e, "wrapper/decl-in-exp/expected.js", "top-level code", 1, 9);
}
