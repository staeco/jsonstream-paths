"use strict";

exports.__esModule = true;
exports.default = _default;

var _jsonparse = _interopRequireDefault(require("jsonparse"));

var _through = _interopRequireDefault(require("through2"));

var _isPlainObj = _interopRequireDefault(require("is-plain-obj"));

var _readableStream = require("readable-stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default({
  filter
} = {}) {
  let pathsUsed = {};
  const parser = new _jsonparse.default();

  const stream = _through.default.obj((chunk, _, cb) => {
    if ((0, _isPlainObj.default)(chunk) || Array.isArray(chunk)) chunk = JSON.stringify(chunk);
    if (typeof chunk === 'string') chunk = Buffer.from(chunk);
    parser.write(chunk);
    cb();
  });

  (0, _readableStream.finished)(stream, () => pathsUsed = null); // free cache memory

  parser.onValue = function (value) {
    const fullPath = this.stack.slice(1).map(e => e.key).concat([this.key]); // null is an object

    const isIterable = Array.isArray(value) || (0, _isPlainObj.default)(value) || value == null;
    let path = fullPath.map(i => typeof i === 'number' ? '*' : i).join('.') || '*';

    if (path.indexOf('*') === -1) {
      if (!isIterable) return; // not iterable, end of the line!

      path += '.*';
    }

    const passedFilter = !filter || filter(path, value, isIterable);

    if (passedFilter && !pathsUsed[path]) {
      pathsUsed[path] = true;
      stream.push(path);
    } // free memory


    Object.values(this.stack, v => {
      if (!Object.isFrozen(v)) {
        v.value = null;
      }
    });
  };

  parser.onError = function (err) {
    if (err.message.indexOf('at position') > -1) {
      err.message = `Invalid JSON (${err.message})`;
    }

    stream.emit('error', err);
  };

  return stream;
}

module.exports = exports.default;