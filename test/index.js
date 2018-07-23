/*eslint no-console: 0*/

import should from 'should'
import get from '../src'
import collect from 'get-stream'
import streamify from 'into-stream'

describe('stream', () => {
  it('should return on complete primitive data', async () => {
    const sample = '{ "a": { "b": [ 1, 2, 3 ] } }'
    const stream = streamify(sample).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    console.log('out', res)
  })
  it('should return on complete object data', async () => {
    const sample = '{ "a": [ { "b": 1 }, { "b": 2 }, { "b": 3 } ] }'
    const stream = streamify(sample).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    console.log('out', res)
  })
})
