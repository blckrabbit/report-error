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
3. provide reportError function before wrapper js

  ```javascript
  // this is the function which name is passed into the wrapper plugin
  window.reportError = (function() {
    var records = {}
    return function(e, filename, functionName, lineStart, lineEnd) {
      if (!e._t) {
        // add timestamp for identifing
        e._t = new Date().getTime()
        records[e._t] = e
        e._stack = (e.name + ': ' + e.message)

        setTimeout(function() {
          // ignore resolved error
          if (e._r) {
            return
          }

          //!!! IMPORTANT add your own code reporting unresolved errors here below
          console.log(e._t, e._stack)
          //!!! IMPORTANT add your own code reporting unresolved errors here above

          delete records[e._t]
        }, 10)
      }
      if (filename) {
        //format stack
        e._stack += '\n\t@ ' + functionName + ' (' + filename + ':' + lineStart + '-' + lineEnd + ')'
      }
    }
  })()
  ```


