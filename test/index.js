/*eslint no-console: 0*/

import should from 'should'
import get from '../src'
import collect from 'get-stream'
import streamify from 'into-stream'

const geoSample = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Downtown',
        operators: [
          'Jersey City Department of Innovation'
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -74.05208945274353,
              40.72912064182603
            ],
            [
              -74.05428886413574,
              40.72293316385307
            ]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'The Heights',
        operators: [
          'Jersey City Department of Innovation'
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -74.04601693153381,
              40.750743837352594
            ],
            [
              -74.05118823051453,
              40.743300479884844
            ]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Stae Field (Brooklyn)',
        operators: [
          'Stae'
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -73.9552965760231,
              40.72180496443893
            ],
            [
              -73.95569890737534,
              40.72141872961497
            ]
          ]
        ]
      }
    }
  ]
}

describe('stream', () => {
  it('should work on array of numbers', async () => {
    const sample = [ 1, 2, 3 ]
    const stream = streamify(JSON.stringify(sample)).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([ '*' ])
  })
  it('should work on array of objects', async () => {
    const sample = [ { b: 1 }, { b: 2 }, { b: 3 } ]
    const stream = streamify(JSON.stringify(sample)).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([ '*.b', '*' ])
  })
  it('should work on nested array of numbers', async () => {
    const sample = {
      a: {
        b: [ 1, 2, 3 ],
        c: [ 1, 2, 3 ]
      }
    }
    const stream = streamify(JSON.stringify(sample)).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([ 'a.b.*', 'a.c.*', 'a.*', '*' ])
  })
  it('should work on nested array of objects', async () => {
    const sample = {
      a: [
        { b: 1 }, { b: 2 }, { b: 3 }
      ],
      c: [
        { b: 1 }, { b: 2 }, { b: 3 }
      ]
    }
    const stream = streamify(JSON.stringify(sample)).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([ 'a.*.b', 'a.*', 'c.*.b', 'c.*', '*' ])
  })
  it('should work on geojson', async () => {
    const stream = streamify(JSON.stringify(geoSample)).pipe(get())
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([
      'features.*.type',
      'features.*.properties.name',
      'features.*.properties.operators.*',
      'features.*.properties.operators',
      'features.*.properties',
      'features.*.geometry.type',
      'features.*.geometry.coordinates.*.*.*',
      'features.*.geometry.coordinates.*.*',
      'features.*.geometry.coordinates.*',
      'features.*.geometry.coordinates',
      'features.*.geometry',
      'features.*',
      '*'
    ])
  })
  it('should work on geojson with filter', async () => {
    const filter = (path, value, isIterable) => isIterable
    const stream = streamify(JSON.stringify(geoSample)).pipe(get({ filter }))
    const res = await collect.array(stream)
    should.exist(res)
    res.should.eql([
      'features.*.properties.operators',
      'features.*.properties',
      'features.*.geometry.coordinates.*.*',
      'features.*.geometry.coordinates.*',
      'features.*.geometry.coordinates',
      'features.*.geometry',
      'features.*',
      '*'
    ])
  })
})
