module.exports = (event) => {
  const notSpecifiedError = (type) => new TypeError(`${type} must be specified`)
  if (!event) return notSpecifiedError('event')
  if (!event.log) return notSpecifiedError('event log')
  if (!event.type) return notSpecifiedError('event type')
  if (!event.payload) return notSpecifiedError('event payload')
  if (typeof event.payload !== 'object') return new TypeError('payload type incorrect, must be an object')
}
