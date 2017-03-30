const Client = require('leveldb-mount/client')
const uuid = require('uuid')
const Logs = require('level-logs')
const async = require('async')
const queues = {}

module.exports = ({ url, retry }) => {
  const client = Client({ url, retry })
  const logs = Logs(client.db)
  return { append, stream }

  function append (event, cb) {
    if (!event.log) throw new Error('event log must be specified')
    if (!event.type) throw new Error('event type must be specified')
    if (!event.id) event.id = uuid.v4()
    const log = event.log
    delete event.log
    event.createdAt = Date.now()
    if (!queues[log]) {
      queues[log] = async.queue(({ log, event }, cb) => {
        logs.append(log, event, cb)
      }, 1)
    }
    const queue = queues[log]
    queue.push({ log, event }, cb)
  }

  function stream (log, since) {
    return logs.createReadStream(log, { since })
  }
}
