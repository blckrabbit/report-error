function g() {
  try {
    undefined()
  } catch(e) {
    console.log(e);
    (function() {
      try {
        undefined()
      } catch(e) {
        console.log(e)
        throw e
      }
    })()
    throw e
  }
}
