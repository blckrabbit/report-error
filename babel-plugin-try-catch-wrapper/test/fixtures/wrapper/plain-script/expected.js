try {
  console.log('play babel');

  function print() {
    try {
      consol.log(arguments);
    } catch (_e) {
      reportError(_e, 'wrapper/plain-script/expected.js', 'print', 3, 0);
      throw _e;
    }
  }

  print('play babel');
  prin('play babel');
} catch (_e2) {
  reportError(_e2, 'wrapper/plain-script/expected.js', 'top-level code', 1, 0);
}
