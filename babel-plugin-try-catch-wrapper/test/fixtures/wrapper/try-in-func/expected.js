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
    } catch (_e) {
      reportError(_e, "wrapper/try-in-func/expected.js", "f", 1, 0);
      throw _e;
    }
  }
} catch (_e2) {
  reportError(_e2, "wrapper/try-in-func/expected.js", "top-level code", 1, 0);
}
