var f = function() {
  console.log(arguments)
  function g() {
    console.log(arguments)
  }
  g()
}

f()
