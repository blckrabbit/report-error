'use strict';

var _ = require('lodash');
var babel = require('babel-core');
var path = require('path');
var through = require('through2');
var wrapper = require('babel-plugin-try-catch-wrapper');

module.exports = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$reportError = _ref.reportError;
  var reportError = _ref$reportError === undefined ? 'reportError' : _ref$reportError;

  var bufferContents = function bufferContents(file, enc, cb) {
    var result = babel.transform(file.contents.toString(enc), {
      compact: true,
      plugins: [[wrapper, {
        reportError: reportError,
        filename: path.relative(file.cwd || file.base, _.last(file.history))
      }]]
    });

    file.contents = new Buffer(result.code);
    cb(null, file);
  };

  return through.obj(bufferContents);
};