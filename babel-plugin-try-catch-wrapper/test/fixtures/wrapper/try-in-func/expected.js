try {
  function f() {
    try {
      try {
        undefined();
      } catch (e) {
        e._r = true;

        console.log(e);
        delete e._r;
        throw e;
      }
    } catch (e) {
      reportError(e, "wrapper/try-in-func/expected.js", "f", 1, 8);
      throw e;
    }
  }
} catch (e) {
  reportError(e, "wrapper/try-in-func/expected.js", "top-level code", 1, 8);
}
