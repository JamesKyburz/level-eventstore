const db = require('./db')
const logs = require('./logs')(db)
const streams = require('./streams')(db)
const batch = require('level-create-batch')
const validateEvent = require('./validate-event')
const uuid = require('uuid')

module.exports = routes

function routes ({ sequences, credentials }, router, context) {
  context.use((req, res, next) => {
    if (req.headers.authorization) {
      const auth = new Buffer(req.headers.authorization.slice(6), 'base64').toString()
      if (auth === credentials) return next()
    }
    res.writeHead(401, { 'WWW-Authenticate': 'Basic' })
    res.end('Access denied')
  })
  router.set('/append', {
    * put (req, res) {
      const event = yield req.json({ log: false })
      const error = validateEvent(event)
      if (error) return res.error(error)
      if (!event.payload.id) event.payload.id = uuid.v4()
      const log = event.log
      const id = event.payload.id
      delete event.log
      event.createdat = Date.now()
      const currentStreamVersion = yield (cb) => streams.head(id, cb)
      const streamKey = streams.key(id, currentStreamVersion + 1)
      sequences[log] = sequences[log] || 0
      const logKey = logs.key(log, ++sequences[log])
      const rows = [
        { key: streamKey, value: sequences[log] },
        { key: logKey, value: event }
      ]
      yield (cb) => batch(db, rows, cb)
      res.json({ id })
    }
  })
}
