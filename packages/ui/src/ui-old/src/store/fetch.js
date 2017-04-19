import fetchz from 'isomorphic-fetch'

const checkStatus = (res) => {
  return res.status === 200
  ? Promise.resolve(res)
  : res.text().then((text) => Promise.reject(text))
}

export default (url, options) => {
  options = Object.assign({
    credentials: 'same-origin',
    redirect: 'manual'
  }, options)
  return fetchz(url, options)
  .then(checkStatus)
}
