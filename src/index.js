if (!module.parent) {
  require('./server')
} else {
  const client = require('./client')
  const eventHandler = require('./event-handler')
  module.exports = { client, eventHandler }
}
