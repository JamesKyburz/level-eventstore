const Logs = require('level-logs')

module.exports = (db) => Logs(db, { prefix: 'logs' })
