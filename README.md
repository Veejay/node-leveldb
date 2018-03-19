# LevelDB NodeJS musings

## Interest in LevelDB

* Dead simple to setup
* Efficient disk usage (database compresses well)
* Fast enough for most use cases
* Stream-based for reading ranges


## Transform streams

All operations on the data can be implemented as a transform stream

For example, to retrieve a collection of users meeting some criteria, one could do something like:

```js
  const userFilter = (chunk, encoding, callback) => {
    if (somePredicate(chunk)) {
      transform(chunk)
    }
    callback()
  }
  db.createReadStream().pipe(through2.obj(userFilter)).on('data', data => {...}).on('error', error => {}).on('end', _ => {})
```

### First impressions

* API is extremely simple
* API is usable through the main NodeJS paradigms (callbacks, promises, streams, async/await)
* Patterns have emerged to make for the rather low-level handling of contiguous data (sublevels, \xfff, etc)
* Healthy ecosystem
* Strong/small core in C/C++, NodeJS shell around it