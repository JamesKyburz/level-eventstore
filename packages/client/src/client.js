const websocket = require('websocket-stream')
const multileveldown = require('multileveldown')
const isLambda = require('is-lambda')
const dbs = {}

module.exports = client

function client (opt = {}) {
  const {
    url,
    keyEncoding = 'utf-8',
    valueEncoding = 'json',
    retry = true,
    retryTimeout = 3000
  } = opt

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
      retry
    })
    const connect = () => {
      if (closed) return
      ws = websocket(url)
      const remote = db.connect()
      session(remote, ws)
      ws.on('close', () => {
        ws = null
        if (retry) {
          setTimeout(connect, retryTimeout)
        }
      })
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
