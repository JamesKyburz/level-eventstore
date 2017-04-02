const base = require('server-base')
const leveldb = require('leveldb-mount')
const routes = require('./routes')
const sequences = require('./sequences')

const replCredentials = process.env.CREDENTIALS || 'guest:guest'

sequences((err, sequences) => {
  if (err) throw err
  const server = base('level-eventstore', routes.bind(null, sequences)).start(5000)
  leveldb.server(server, './eventstore', { replCredentials })
})
