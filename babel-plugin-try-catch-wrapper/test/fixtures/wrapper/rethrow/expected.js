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
  reportError(e, "wrapper/rethrow/expected.js", "top-level code", 1, 6);
}
