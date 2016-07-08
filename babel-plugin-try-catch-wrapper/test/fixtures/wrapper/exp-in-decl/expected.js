try {
  function f() {
    try {
      console.log(arguments);
      var g = function g() {
        try {
          console.log(arguments);
        } catch (_e) {
          reportError(_e, "wrapper/exp-in-decl/expected.js", "anonymous function", 3, 10);
          throw _e;
        }
      };
      g();
    } catch (_e2) {
      reportError(_e2, "wrapper/exp-in-decl/expected.js", "f", 1, 0);
      throw _e2;
    }
  }

  f();
} catch (_e3) {
  reportError(_e3, "wrapper/exp-in-decl/expected.js", "top-level code", 1, 0);
}
