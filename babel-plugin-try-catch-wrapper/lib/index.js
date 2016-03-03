'use strict';

var namedFunction = require('babel-helper-function-name');
var t = require('babel-types');
var template = require('babel-template');

/*
stack format:
${error.name}: ${error.message}
  at ${functionName} (${fileNameOrUrl}:line:column)
  at ${functionName} (${fileNameOrUrl}:line:column)
  .
  .
  .
*/

var wrapProgram = template('\n  try {\n    BODY\n  } catch(e) {\n    REPORT_ERROR(e, FILENAME, FUNCTION_NAME, LINE_START, LINE_END)\n  }\n');

var wrapFunction = template('{\n  try {\n    BODY\n  } catch(e) {\n    REPORT_ERROR(e, FILENAME, FUNCTION_NAME, LINE_START, LINE_END)\n    throw e\n  }\n}');

var markErrorResolved = template('\n  ERROR._r = true\n');

var markErrorUnresolved = template('\n  delete ERROR._r\n');

var shouldSkip = function () {
  var records = new Map();

  return function (path, state) {
    if (state.end) {
      return true;
    }

    // ignore generated code
    if (!path.node.loc) {
      return true;
    }

    // ignore processed nodes
    var nodeType = path.node.type;
    if (!records.has(nodeType)) {
      records.set(nodeType, new Set());
    }
    var recordsOfThisType = records.get(nodeType);
    var sourceLocation = state.file.opts.filenameRelative + ':' + path.node.start + '-' + path.node.end;
    var hasRecord = recordsOfThisType.has(sourceLocation);
    recordsOfThisType.add(sourceLocation);
    return hasRecord;
  };
}();

module.exports = {
  pre: function pre() {
    if (!this.opts.reportError) {
      throw new Error('babel-ie-catch: You must pass in the function name reporting error');
    }
  },

  visitor: {
    Program: {
      exit: function exit(path, state) {
        if (state.end) {
          return;
        }
        state.end = true;

        var body = path.node.body;
        if (body.length === 0) {
          return;
        }

        var programBody = wrapProgram({
          BODY: body,
          FILENAME: t.StringLiteral(state.file.opts.filenameRelative),
          FUNCTION_NAME: t.StringLiteral('top-level code'),
          LINE_START: t.NumericLiteral(path.node.loc.start.line),
          LINE_END: t.NumericLiteral(path.node.loc.end.line),
          REPORT_ERROR: t.identifier(state.opts.reportError)
        });
        path.replaceWith(t.Program([programBody]));
      }
    },
    Function: {
      exit: function exit(path, state) {
        if (shouldSkip(path, state)) {
          return;
        }

        // ignore empty function body
        var body = path.node.body.body;
        if (body.length === 0) {
          return;
        }

        var functionName = 'anonymous function';
        if (path.node.type === 'FunctionDeclaration') {
          functionName = path.node.id.name;
        } else {
          var newFunction = namedFunction(path);
          if (newFunction) {
            functionName = newFunction.id.name;
          }
        }

        var loc = path.node.loc;

        path.get('body').replaceWith(wrapFunction({
          BODY: body,
          FILENAME: t.StringLiteral(state.file.opts.filenameRelative),
          FUNCTION_NAME: t.StringLiteral(functionName),
          LINE_START: t.NumericLiteral(loc.start.line),
          LINE_END: t.NumericLiteral(loc.end.line),
          REPORT_ERROR: t.identifier(state.opts.reportError)
        }));
      }
    },
    CatchClause: {
      enter: function enter(path, state) {
        if (shouldSkip(path, state)) {
          return;
        }

        // variable name of error caught
        var errorVariableName = path.node.param.name;

        path.node.body.body.unshift(markErrorResolved({
          ERROR: t.Identifier(errorVariableName)
        }));
      }
    },
    ThrowStatement: {
      enter: function enter(path, state) {
        if (shouldSkip(path, state)) {
          return;
        }

        var error = path.node.argument;
        if (error.type === 'Identifier') {
          path.insertBefore(markErrorUnresolved({
            ERROR: t.Identifier(error.name)
          }));
        }
      }
    }
  }
};