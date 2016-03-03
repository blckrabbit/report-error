function f() {
  console.log(arguments)
  var g = function() {
    console.log(arguments)
  }
  g()
}

f()
