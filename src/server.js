const http = require('http')
const server = http.createServer(notFound).listen(5000)
const leveldb = require('leveldb-mount')

const replCredentials = process.env.CREDENTIALS || 'guest:guest'

leveldb.server(server, './eventstore', { replCredentials })

function notFound (req, res) {
  res.writeHead(404)
  res.end()
}
