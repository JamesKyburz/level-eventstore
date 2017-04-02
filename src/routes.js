const db = require('./db')
const logs = require('./logs')(db)
const streams = require('./streams')(db)
const batch = require('level-create-batch')
const validateEvent = require('./validate-event')
const uuid = require('uuid')

module.exports = routes

function routes (sequences, router, context) {
  router.set('/append', {
    * post (req, res) {
      const event = yield req.json()
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
