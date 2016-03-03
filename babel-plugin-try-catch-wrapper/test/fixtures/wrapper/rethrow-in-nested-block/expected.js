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
          } catch (e) {
            reportError(e, "wrapper/rethrow-in-nested-block/expected.js", "anonymous function", 6, 13);
            throw e;
          }
        })();
        delete e._r;
        throw e;
      }
    } catch (e) {
      reportError(e, "wrapper/rethrow-in-nested-block/expected.js", "g", 1, 16);
      throw e;
    }
  }
} catch (e) {
  reportError(e, "wrapper/rethrow-in-nested-block/expected.js", "top-level code", 1, 16);
}
