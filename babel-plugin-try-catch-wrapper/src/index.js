'use strict'

const namedFunction = require('babel-helper-function-name')
const t = require('babel-types')
const template = require('babel-template')

/*
stack format:
${error.name}: ${error.message}
  at ${functionName} (${fileNameOrUrl}:line:column)
  at ${functionName} (${fileNameOrUrl}:line:column)
  .
  .
  .
*/

const wrapProgram = template(`
  try {
    BODY
  } catch(ERROR_VARIABLE_NAME) {
    REPORT_ERROR(ERROR_VARIABLE_NAME, FILENAME, FUNCTION_NAME, LINE_START, LINE_END)
  }
`)

const wrapFunction = template(`{
  try {
    BODY
  } catch(ERROR_VARIABLE_NAME) {
    REPORT_ERROR(ERROR_VARIABLE_NAME, FILENAME, FUNCTION_NAME, LINE_START, LINE_END)
    throw ERROR_VARIABLE_NAME
  }
}`)

const markErrorResolved = template(`
  ERROR._r = true
`)

const markErrorUnresolved = template(`
  delete ERROR._r
`)

const shouldSkip = (() => {
  const records = new Map

  return (path, state) => {
    if (state.end) {
      return true
    }

    // ignore generated code
    if (!path.node.loc) {
      return true
    }

    // ignore processed nodes
    const nodeType = path.node.type
    if (!records.has(nodeType)) {
      records.set(nodeType, new Set)
    }
    const recordsOfThisType = records.get(nodeType)
    const sourceLocation = `${filename}:${path.node.start}-${path.node.end}`
    const hasRecord = recordsOfThisType.has(sourceLocation)
    recordsOfThisType.add(sourceLocation)
    return hasRecord
  }
})()

// filename of which is being processed
let filename

module.exports = {
  pre(file) {
    if (!this.opts.reportError) {
      throw new Error('babel-ie-catch: You must pass in the function name reporting error')
    }

    filename = this.opts.filename || file.opts.filenameRelative
    if (!filename || filename.toLowerCase() === 'unknown') {
      throw new Error('babel-plugin-try-catch-wrapper: If babel cannot grab filename, you must pass it in')
    }
  },
  visitor: {
    Program: {
      exit(path, state) {
        if (state.end) {
          return
        }
        state.end = true

        const body = path.node.body
        if (body.length === 0) {
          return
        }

        const loc = path.node.loc
        const errorVariableName = path.scope.generateUidIdentifier('e')

        const programBody = wrapProgram({
          BODY: body,
          FILENAME: t.StringLiteral(filename),
          FUNCTION_NAME: t.StringLiteral('top-level code'),
          LINE_START: t.NumericLiteral(loc.start.line),
          LINE_END: t.NumericLiteral(loc.end.line),
          REPORT_ERROR: t.identifier(state.opts.reportError),
          ERROR_VARIABLE_NAME: errorVariableName,
        })
        path.replaceWith(t.Program([programBody]))
      }
    },
    Function: {
      exit(path, state) {
        if (shouldSkip(path, state)) {
          return
        }

        // ignore empty function body
        const body = path.node.body.body
        if (body.length === 0) {
          return
        }

        let functionName = 'anonymous function'
        if (path.node.type === 'FunctionDeclaration') {
          functionName = path.node.id.name
        } else {
          let newFunction = namedFunction(path)
          if (newFunction) {
            functionName = newFunction.id.name
          }
        }

        const loc = path.node.loc
        const errorVariableName = path.scope.generateUidIdentifier('e')

        path.get('body').replaceWith(wrapFunction({
          BODY: body,
          FILENAME: t.StringLiteral(filename),
          FUNCTION_NAME: t.StringLiteral(functionName),
          LINE_START: t.NumericLiteral(loc.start.line),
          LINE_END: t.NumericLiteral(loc.end.line),
          REPORT_ERROR: t.identifier(state.opts.reportError),
          ERROR_VARIABLE_NAME: errorVariableName,
        }))
      }
    },
    CatchClause: {
      enter(path, state) {
        if (shouldSkip(path, state)) {
          return
        }

        // variable name of error caught
        var errorVariableName = path.node.param.name

        path.node.body.body.unshift(
          markErrorResolved({
            ERROR: t.Identifier(errorVariableName)
          })
        )
      }
    },
    ThrowStatement: {
      enter(path, state) {
        if (shouldSkip(path, state)) {
          return
        }

        var error = path.node.argument
        if (error.type === 'Identifier') {
          path.insertBefore(
            markErrorUnresolved({
              ERROR: t.Identifier(error.name)
            })
          )
        }
      }
    },
  }
}

