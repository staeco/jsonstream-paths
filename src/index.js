import Parser from 'jsonparse'
import through2 from 'through2'
import isObject from 'is-plain-obj'
import { finished } from 'readable-stream'

export default function ({ filter }={}) {
  let pathsUsed = {}
  const parser = new Parser()
  const stream = through2.obj((chunk, _, cb) => {
    if (isObject(chunk) || Array.isArray(chunk)) chunk = JSON.stringify(chunk)
    if (typeof chunk === 'string') chunk = Buffer.from(chunk)
    parser.write(chunk)
    cb()
  })
  finished(stream, () => pathsUsed = null) // free cache memory

  parser.onValue = function (value) {
    const fullPath = this.stack.slice(1).map((e) => e.key).concat([ this.key ])
    // null is an object
    const isIterable = Array.isArray(value) || isObject(value) || value == null
    let path = fullPath.map((i) =>
      typeof i === 'number' ? '*' : i
    ).join('.') || '*'

    if (path.indexOf('*') === -1) {
      if (!isIterable) return // not iterable, end of the line!
      path += '.*'
    }

    const passedFilter = !filter || filter(path, value, isIterable)
    if (passedFilter && !pathsUsed[path]) {
      pathsUsed[path] = true
      stream.push(path)
    }

    // free memory
    Object.values(this.stack, (v) => {
      if (!Object.isFrozen(v)) {
        v.value = null
      }
    })
  }

  parser.onError = function (err) {
    if (err.message.indexOf('at position') > -1) {
      err.message = `Invalid JSON (${err.message})`
    }
    stream.emit('error', err)
  }

  return stream
}
