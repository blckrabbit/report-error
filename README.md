# report-error
report js runtime error

1. ```npm install babel-plugin-try-catch-wrapper```
2. wrap js

  ```javascript
  var babel = require('babel-core')
  babel.transform(code, {
    plugins: [
      ['babel-plugin-try-catch-wrapper', {
        // MUST name of the function reporting errors
        reportError: 'reportError',
        // OPTIONAL if you use babel-cli, you can ignore filename since it can be grabbed by babel
        filename: 'dir/filename-of-this-js-file'
      }]
    ]
  })
  ```
3. provide reportError function before wrapped js

  ```javascript
  // this is the function which name is passed into the transformer plugin
  window.reportError = (function() {
    var errors = {}
    return function(e, filename, fnName, line, col) {
      if (!e._t) {
        // add timestamp for identifing
        e._t = +new Date()
        
        var error = new Error
        errors[e._t] = error
        
        error.columnNumber = col
        error.fileName = filename
        error.lineNumber = line
        error.message = e.message || e.description
        error.name = e.name
        error.stack = e.stack || (error.name + ': ' + error.message)

        setTimeout(function() {
          delete errors[e._t]
          // ignore resolved error
          if (e._r) {
            return
          }
          // report error here, take raven.js as an example
          window.Raven && Raven.captureException(error)
        }, 10)
      }
      
      var error = errors[e._t]
      if (!e.stack) {
        // format Error stack for IE <= 9 and similar browsers
        error.stack += '\n\tat ' + fnName + ' (http://your-assets-server-domain-and-path/' + filename + ':' + line + ':' + col + ')'
      }
    }
  })()
  ```


