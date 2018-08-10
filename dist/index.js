'use strict';

exports.__esModule = true;

exports.default = function ({ filter } = {}) {
  let pathsUsed = {};
  const parser = new _jsonparse2.default();
  const stream = _through2.default.obj((chunk, _, cb) => {
    if (typeof chunk === 'string') chunk = Buffer.from(chunk);
    parser.write(chunk);
    cb();
  });
  (0, _endOfStream2.default)(stream, () => pathsUsed = null); // free cache memory

  parser.onValue = function (value) {
    const fullPath = this.stack.slice(1).map(e => e.key).concat([this.key]);
    // null is an object
    const isIterable = Array.isArray(value) || (0, _isPlainObject2.default)(value) || value == null;
    let path = fullPath.map(i => typeof i === 'number' ? '*' : i).join('.') || '*';

    if (path.indexOf('*') === -1) {
      if (!isIterable) return; // not iterable, end of the line!
      path += '.*';
    }

    const passedFilter = !filter || filter(path, value, isIterable);
    if (passedFilter && !pathsUsed[path]) {
      pathsUsed[path] = true;
      stream.push(path);
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

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];