const { graphql } = require('graphql')
const fs = require('fs')
const path = require('path')
const schema = require('./schema')
const log = require('server-base').log('level-eventstore/core-graphql')

const editHtml = fs.readFileSync(path.join(__dirname, 'index.html'))

module.exports = { html, query }

function html (req, res) {
  res.setHeader('content-type', 'text/html')
  res.end(editHtml)
}

function * query (req, res) {
  res.setNextErrorCode(400)
  const { query, variables, operationName } = yield req.json({ log: false })
  const result = yield graphql(
    schema,
    query,
    {},
    {},
    variables || {},
    operationName
  )
  const { errors } = result
  if (errors) {
    log.error({ query, variables })
    return res.error(JSON.stringify({ errors }))
  } else {
    res.json(result)
  }
}
