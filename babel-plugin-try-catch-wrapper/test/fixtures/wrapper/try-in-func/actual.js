function f() {
  try {
    undefined()
  } catch(e) {
    console.log(e)
    throw e
  }
}
