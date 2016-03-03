try {
  function f() {
    try {
      console.log(arguments);
    } catch (e) {
      reportError(e, "wrapper/decl/expected.js", "f", 1, 3);
      throw e;
    }
  }
  f();

  function g() {
    //empty
  }
  g();
} catch (e) {
  reportError(e, "wrapper/decl/expected.js", "top-level code", 1, 9);
}
