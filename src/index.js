import Parser from 'jsonparse'
import through from 'through2'

const modes = {
  [0x81]: 'object',
  [0x82]: 'array'
}
export default function () {
  const parser = new Parser()
  const stream = through((chunk, _, cb) => {
    if (typeof chunk === 'string') chunk = new Buffer(chunk)
    parser.write(chunk)
    cb()
  })

  parser.onValue = function () {
    const actualPath = this.stack.slice(1).map((e) => e.key).concat([ this.key ])
    stream.emit('data', {
      path: actualPath,
      mode: modes[this.mode] || 'value'
    })
    for (let k in this.stack) {
      if (!Object.isFrozen(this.stack[k])) {
        this.stack[k].value = null
      }
    }
  }

  parser.onError = function (err) {
    if(err.message.indexOf('at position') > -1)
      err.message = `Invalid JSON (${ err.message })`
    stream.emit('error', err)
  }

  return stream
}
