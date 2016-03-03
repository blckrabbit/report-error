try {
  undefined()
} catch(e) {
  console.log(e)
  if (Math.random() < .5) {
    throw e
  }
  try {
    undefined()
  } catch(e) {
    console.log(e)
  }
}
