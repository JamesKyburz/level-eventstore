import fetch from './fetch'
import baseUrl from '../base-url'

export default () => {
  const get = (url) => fetch(baseUrl + url, {
    method: 'GET',
    headers: { 'accept': 'application/json' }
  })

  return {
    logList () {
      return get('/api/logList')
    },
    logStream (log, since) {
      return get(`/api/logStream/${log}/${since}`)
    },
    streamById (log, id, since) {
      return get(`/api/streamById/${log}/${id}/${since}`)
    }
  }
}
