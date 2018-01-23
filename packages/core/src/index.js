if (!module.parent) {
  require('./server')
} else {
  const client = require('level-eventstore-client')
  module.exports = { client }
}
