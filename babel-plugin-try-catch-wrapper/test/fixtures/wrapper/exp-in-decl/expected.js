try {
  function f() {
    try {
      console.log(arguments);
      var g = function g() {
        try {
          console.log(arguments);
        } catch (e) {
          reportError(e, "wrapper/exp-in-decl/expected.js", "anonymous function", 3, 5);
          throw e;
        }
      };
      g();
    } catch (e) {
      reportError(e, "wrapper/exp-in-decl/expected.js", "f", 1, 7);
      throw e;
    }
  }

  f();
} catch (e) {
  reportError(e, "wrapper/exp-in-decl/expected.js", "top-level code", 1, 9);
}
