import { createAction, handleActions } from 'redux-actions'

export const setSince = createAction('event set since')
export const setEvents = createAction('event set log stream events')
export const setLogList = createAction('event set log list')
export const setStreams = createAction('event set streams')
export const clearStreams = createAction('event clear streams')
export const clearEvents = createAction('event clear events')
export const setLogType = createAction('event set log type')
export const setError = createAction('set event error')

const initialState = { logList: [], events: [], streams: [], since: '', logType: '' }

export default handleActions({
  [setSince]: (state, action) => {
    return Object.assign({}, state, { since: action.payload, events: [] })
  },
  [setError]: (state, action) => {
    return Object.assign({}, state, { error: action.payload })
  },
  [clearStreams]: (state, action) => {
    return Object.assign({}, state, { streams: [] })
  },
  [setStreams]: (state, action) => {
    const seq = (state.streams.slice(-1)[0] || {}).seq || 0
    const append = action.payload.filter((x) => x.seq > seq)
    const streams = state.streams.concat(append)
    return Object.assign({}, state, { streams })
  },
  [setLogList]: (state, action) => {
    return Object.assign({}, state, { logList: action.payload })
  },
  [setLogType]: (state, action) => {
    return Object.assign({}, state, { logType: action.payload, events: [], streams: [] })
  },
  [clearEvents]: (state, action) => {
    return Object.assign({}, state, { events: [] })
  },
  [setEvents]: (state, action) => {
    const seq = Math.max((state.events[0] || {}).seq || 0, state.since)
    const append = action.payload.filter((x) => x.seq > seq)
    const events = append.concat(state.events).slice(-100)
    if (state.since !== '') {
      events.sort((a, b) => b.seq - a.seq)
    }

    return Object.assign({}, state, { events, stream: [] })
  }
}, initialState)

export const logStream = (log, since) => {
  return (dispatch, getState, api) => {
    log = log || getState().events.logType
    since = since || getState().events.since || -1
    return api.logStream(log, since)
    .then((res) => res.json())
    .then((json) => dispatch(setEvents(json)))
    .catch((err) => dispatch(setError(err)))
  }
}

export const logList = () => {
  return (dispatch, getState, api) => {
    return api.logList()
    .then((res) => res.json())
    .then((json) => dispatch(setLogList(json)))
    .catch((err) => dispatch(setError(err)))
  }
}

export const updateSince = (since) => {
  return (dispatch, getState, api) => {
    dispatch(setSince(since))
    return dispatch(logStream())
    .catch((err) => dispatch(setError(err)))
  }
}

export const updateLogType = (type) => {
  return (dispatch, getState, api) => {
    dispatch(setLogType(type))
    return dispatch(logStream())
    .catch((err) => dispatch(setError(err)))
  }
}

export const streamById = (log, id, since) => {
  return (dispatch, getState, api) => {
    return api.streamById(log, id, since)
    .then((res) => res.json())
    .then((json) => dispatch(setStreams(json)))
    .catch((err) => dispatch(setError(err)))
  }
}
