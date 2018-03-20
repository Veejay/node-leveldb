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

## Streaming response to the browser

It's something that I've been willing to do for a long time now.
Streaming the data directly from the database to the DOM through websockets and a good streaming database API.

It's exactly what Node, modern browsers and LevelDB provide, making it easy to have everything click.
I find the HTML part to be extremely jittery, see if building fragments wouldn't be more efficient.

## Notes

The rendering of the HTML is minimal. There's nothing exciting about rendering a HTML template anyway past the usual rendering
engines and I wanted to have an example running.

## First impressions

* API is extremely simple
* API is usable through the main NodeJS paradigms (callbacks, promises, streams, async/await)
* Patterns have emerged to make for the rather low-level handling of contiguous data (sublevels, \xfff, etc)
* Healthy ecosystem
* Strong/small core in C/C++, NodeJS shell around it