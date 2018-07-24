'use strict';

exports.__esModule = true;

exports.default = function () {
  let pathsUsed = {};
  const parser = new _jsonparse2.default();
  const stream = (0, _through2.default)((chunk, _, cb) => {
    if (typeof chunk === 'string') chunk = new Buffer(chunk);
    parser.write(chunk);
    cb();
  });

  (0, _endOfStream2.default)(stream, () => pathsUsed = null); // free cache memory

  parser.onValue = function (value) {
    const fullPath = this.stack.slice(1).map(e => e.key).concat([this.key]);
    const isIterable = typeof value === 'object';
    let path = fullPath.map(i => typeof i === 'number' ? '*' : i).join('.') || '*';

    if (path.indexOf('*') === -1) {
      if (!isIterable) return; // not iterable, end of the line!
      path += '.*';
    }

    if (!pathsUsed[path]) {
      pathsUsed[path] = true;
      stream.emit('data', path);
    }
    for (let k in this.stack) {
      if (!Object.isFrozen(this.stack[k])) {
        this.stack[k].value = null;
      }
    }
  };

  parser.onError = function (err) {
    if (err.message.indexOf('at position') > -1) err.message = `Invalid JSON (${err.message})`;
    stream.emit('error', err);
  };

  return stream;
};

var _jsonparse = require('jsonparse');

var _jsonparse2 = _interopRequireDefault(_jsonparse);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _endOfStream = require('end-of-stream');

var _endOfStream2 = _interopRequireDefault(_endOfStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];