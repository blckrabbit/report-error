try {
  console.log('play babel');

  function print() {
    try {
      consol.log(arguments);
    } catch (e) {
      reportError(e, 'wrapper/plain-script/expected.js', 'print', 3, 5);
      throw e;
    }
  }

  print('play babel');
  prin('play babel');
} catch (e) {
  reportError(e, 'wrapper/plain-script/expected.js', 'top-level code', 1, 8);
}
