const db = require('./db')
const logs = require('./logs')(db)
const streams = require('./streams')(db)
const batch = require('level-create-batch')
const validateEvent = require('./validate-event')
const uuid = require('uuid')

module.exports = append

function append (sequences) {
  return function * (req, res) {
    const event = yield req.json({ log: false })
    const error = validateEvent(event)
    if (error) return res.error(error)
    if (!event.payload.id) event.payload.id = uuid.v4()
    const log = event.log
    const id = event.payload.id
    delete event.log
    event.createdAt = Date.now()
    const currentStreamVersion = yield cb => streams.head(log + id, cb)
    const streamKey = streams.key(log + id, currentStreamVersion + 1)
    sequences[log] = sequences[log] || 0
    const logKey = logs.key(log, ++sequences[log])
    const rows = [
      { key: streamKey, value: sequences[log] },
      { key: logKey, value: event }
    ]
    res.setNextErrorMessage('key is write-locked')
    yield cb => batch(db, rows, cb)
    res.json({ id })
  }
}
