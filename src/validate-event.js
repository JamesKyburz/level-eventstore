module.exports = (event) => {
  const notSpecifiedError = (type) => new Error(`${type} must be specified`)
  if (!event) return notSpecifiedError('event')
  if (!event.log) return notSpecifiedError('event log')
  if (!event.type) return notSpecifiedError('event type')
  if (!event.payload) return notSpecifiedError('event payload')
}
