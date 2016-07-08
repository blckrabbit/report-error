try {
  function f() {
    try {
      console.log(arguments);
    } catch (_e) {
      reportError(_e, "wrapper/decl/expected.js", "f", 1, 0);
      throw _e;
    }
  }
  f();

  function g() {
    //empty
  }
  g();
} catch (_e2) {
  reportError(_e2, "wrapper/decl/expected.js", "top-level code", 1, 0);
}
