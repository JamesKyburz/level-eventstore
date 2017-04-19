const leveldb = require('leveldb-mount')
const db = leveldb.db('./eventstore')

module.exports = db
