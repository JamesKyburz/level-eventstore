const wsUrl = 'ws://guest:guest@localhost:5000'
const httpUrl = 'http://guest:guest@localhost:5000'
const client = require('./').client({ wsUrl, httpUrl })

client.append({
  log: 'users',
  type: 'signup',
  payload: {
    email: 'foo@bar'
  }
}, (err) => {
  if (err) console.error(err)
})

client.append({
  log: 'users',
  type: 'verifyAccount',
  payload: {
    email: 'baz@car',
    id: '38390783-cd60-4190-8b94-a3d4ac24d653'
  }
}, (err) => {
  if (err) console.error(err)
})

client.handleEvents({ wsUrl, log: 'users', since: 0 })({
  signup (payload) {
    console.log('insert', payload)
  },
  verifyAccount (payload) {
    console.log('verify', payload)
  }
})
