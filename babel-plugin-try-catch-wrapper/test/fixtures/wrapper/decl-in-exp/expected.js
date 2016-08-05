try {
  var f = function f() {
    try {
      console.log(arguments);
      function g() {
        try {
          console.log(arguments);
        } catch (_e) {
          reportError(_e, "wrapper/decl-in-exp/expected.js", "g", 3, 2);
          throw _e;
        }
      }
      g();
    } catch (_e2) {
      reportError(_e2, "wrapper/decl-in-exp/expected.js", "anonymous function", 1, 8);
      throw _e2;
    }
  };

  f();
} catch (_e3) {
  reportError(_e3, "wrapper/decl-in-exp/expected.js", "top-level code", 1, 0);
}
