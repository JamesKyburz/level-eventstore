const createSchema = require('graphql-create-schema')
const Moment = require('moment')

const httpUrl =
  process.env.EVENTSTORE_HTTP_URL || 'http://guest:guest@localhost:5000'
const wsUrl = process.env.EVENTSTORE_WS_URL || 'ws://guest:guest@localhost:5000'

const client = require('level-eventstore-client')({ httpUrl, wsUrl })

module.exports = createSchema({
  typeDefs: {
    query: `
    # List all logs.
    logList: [Log]!
    # List all events by id for a given log.
    streamById(log: String!, id: String!, reverse: Boolean, limit: Float, skip: Float): [StreamEvent]!
    # List all events for a given log.
    logStream(log: String!, reverse: Boolean, limit: Float, skip: Float): [LogEvent]!
    `,
    mutation: `
    # Append new event to log
    append(log: String!, type: String!, id: String, jsonBody: String!): Boolean!
    `,
    types: `
    # Log.
    type Log {
      name: String!
      lastSequence: Float!
    }
    # Stream event.
    type StreamEvent {
      id: String!
      type: String!
      createdAt: String!
      payload: String!
      sequence: Float!
    }
    # Log event.
    type LogEvent {
      id: String!
      type: String!
      createdAt: String!
      payload: String!
      sequence: Float!
    }
    `
  },
  resolvers: {
    Query: {
      logList,
      streamById,
      logStream
    },
    Mutation: {
      append
    }
  }
})

function logList (root, args, context, ast) {
  return new Promise((resolve, reject) => {
    client.logList((err, logs) => {
      if (err) return reject(err)
      Promise.all(logs.map(x => ({ name: x, lastSequence: lastSequence(x) })))
        .catch(reject)
        .then(resolve)
    })
  })
}

function append (root, { log, type, id, jsonBody: body }, ast) {
  const payload = JSON.parse(body)
  if (id) payload.id = id
  return client.append({ type, log, payload }).then(() => true)
}

function lastSequence (log) {
  return new Promise((resolve, reject) => {
    client
      .logStream(log, { reverse: true, limit: 1 }, err => {
        if (err) reject(err)
      })
      .on('data', ({ seq }) => resolve(seq))
  })
}

function streamById (
  root,
  { log, id, reverse, limit, skip },
  context,
  ast
) {
  const events = []
  let count = 0
  return new Promise((resolve, reject) => {
    client
      .streamById(log, id, { limit: limit + (skip || 0) || -1, reverse: !!reverse }, err => {
        if (err) return reject(err)
        resolve(events)
      })
      .on('data', item => {
        count++
        if (count <= skip && skip) return
        events.push(event(item))
      })
  })
}

function logStream (root, { log, reverse, limit, skip }, context, ast) {
  const events = []
  let count = 0
  return new Promise((resolve, reject) => {
    client
      .logStream(log, { limit: limit + (skip || 0) || -1, reverse: !!reverse }, err => {
        if (err) return reject(err)
        resolve(events)
      })
      .on('data', item => {
        count++
        if (count <= skip && skip) return
        events.push(event(item))
      })
  })
}

function event ({ seq: sequence, value }) {
  return {
    type: value.type,
    sequence,
    createdAt: new Moment(value.createdAt).fromNow(),
    id: value.payload.id,
    payload: JSON.stringify(value.payload)
  }
}
