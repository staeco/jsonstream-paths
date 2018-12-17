# jsonstream-paths [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]


## Install

```
npm install jsonstream-paths --save
```

## Example

```js
const sample = {
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
const stream = get()
stream.write(JSON.stringify(sample))
stream.on('data', (path) => {
  // each data event is a string path
})
/*
  Results:
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
*/
```

[downloads-image]: http://img.shields.io/npm/dm/jsonstream-paths.svg
[npm-url]: https://npmjs.org/package/jsonstream-paths
[npm-image]: http://img.shields.io/npm/v/jsonstream-paths.svg

[travis-url]: https://travis-ci.org/staeco/jsonstream-paths
[travis-image]: https://travis-ci.org/staeco/jsonstream-paths.png?branch=master
