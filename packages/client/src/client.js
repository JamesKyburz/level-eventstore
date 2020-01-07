const websocket = require('websocket-stream')
const multileveldown = require('multileveldown')
const isLambda = require('is-lambda')
const dbs = {}

module.exports = client

function client (opt = {}) {
  const defaults = {
    keyEncoding: 'utf8',
    valueEncoding: 'json',
    retryTimeout: 3000
  }

  const { keyEncoding, valueEncoding, retryTimeout, url } = Object.assign(
    {},
    defaults,
    opt
  )

  if (!url) throw new Error('url must be specified')

  const cacheKey = keyEncoding + valueEncoding + url
  let db = !isLambda && dbs[cacheKey]
  let closed = false
  let ws
  const close = cb => {
    delete dbs[cacheKey]
    closed = true
    if (ws) {
      ws.on('close', () => {
        ws = null
        if (cb) cb()
      })
      ws.destroy()
    } else {
      if (cb) cb()
    }
  }

  if (!db) {
    db = dbs[cacheKey] = multileveldown.client({
      keyEncoding,
      valueEncoding,
      retry: true
    })
    const connect = () => {
      if (closed) return
      ws = websocket(url)
      const remote = db.connect()
      session(remote, ws)
      ws.on('close', () => setTimeout(connect, retryTimeout))
    }
    connect()
  }

  return { db, close }
}

function session (dbStream, wsStream) {
  wsStream.on('error', () => wsStream.destroy())
  wsStream.on('close', () => {
    dbStream.destroy()
  })
  wsStream.on('data', data => {
    dbStream.write(data)
  })
  dbStream.on('data', data => {
    wsStream.write(data)
  })
}
