import Parser from 'jsonparse'
import through2 from 'through2'
import eos from 'end-of-stream'

export default function () {
  let pathsUsed = {}
  const parser = new Parser()
  const stream = through2.obj((chunk, _, cb) => {
    if (typeof chunk === 'string') chunk = Buffer.from(chunk)
    parser.write(chunk)
    cb()
  })
  eos(stream, () => pathsUsed = null) // free cache memory

  parser.onValue = function (value) {
    const fullPath = this.stack.slice(1).map((e) => e.key).concat([ this.key ])
    const isIterable = typeof value === 'object'
    let path = fullPath.map((i) =>
      typeof i === 'number' ? '*' : i
    ).join('.') || '*'

    if (path.indexOf('*') === -1) {
      if (!isIterable) return // not iterable, end of the line!
      path += '.*'
    }

    if (!pathsUsed[path]) {
      pathsUsed[path] = true
      stream.push(path)
    }
    for (let k in this.stack) {
      if (!Object.isFrozen(this.stack[k])) {
        this.stack[k].value = null
      }
    }
  }

  parser.onError = function (err) {
    if (err.message.indexOf('at position') > -1)
      err.message = `Invalid JSON (${err.message})`
    stream.emit('error', err)
  }

  return stream
}
