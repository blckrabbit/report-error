try {
  function g() {
    try {
      try {
        undefined();
      } catch (e) {
        e._r = true;

        console.log(e);
        (function () {
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
            reportError(_e, "wrapper/rethrow-in-nested-block/expected.js", "anonymous function", 6, 5);
            throw _e;
          }
        })();
        delete e._r;
        throw e;
      }
    } catch (_e2) {
      reportError(_e2, "wrapper/rethrow-in-nested-block/expected.js", "g", 1, 0);
      throw _e2;
    }
  }
} catch (_e3) {
  reportError(_e3, "wrapper/rethrow-in-nested-block/expected.js", "top-level code", 1, 0);
}
